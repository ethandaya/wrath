import {
  CreateAnyTweetDto,
  CreateAnyTweetParamSchema,
  CreateAnyTweetSchema,
  UserModel,
} from "../models";
import { z } from "zod";
import { v4 as uuid } from "uuid";
import querystring from "node:querystring";

const TWEET_TABLE_NAME =
  "raw_tweet__" + process.env.TINYBIRD_TWEET_TABLE_VERSION;

const CreateUserDtoModel = UserModel.pick({
  name: true,
});

type CreateUserDto = z.infer<typeof CreateUserDtoModel>;

const CreateTweetParams = CreateAnyTweetParamSchema;
type CreateTweetParams = z.infer<typeof CreateTweetParams>;

const TinyBirdEventDataModel = z.discriminatedUnion("source", [
  z.object({ source: z.literal(TWEET_TABLE_NAME), data: CreateAnyTweetSchema }),
  z.object({ source: z.literal("user"), data: UserModel }),
]);

export type TinyBirdEventData = z.infer<typeof TinyBirdEventDataModel>;

export class TinyBirdTwitterService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.TINYBIRD_BASE_URL;
  }

  async sendEvent(eventData: TinyBirdEventData) {
    const URL =
      this.baseUrl +
      "/events?" +
      querystring.stringify({
        name: eventData.source,
      });
    const response = await fetch(URL, {
      method: "POST",
      body: JSON.stringify(eventData.data),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.TINYBIRD_API_KEY}`,
      },
    });
    if (!response.ok) {
      throw new Error(
        `Failed to send event to TinyBird: ${response.status} ${response.statusText}`
      );
    }
    return eventData;
  }

  async createTweet(dto: CreateTweetParams) {
    const tweet: CreateAnyTweetDto = {
      id: uuid(),
      ...dto,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    await this.sendEvent({
      source: TWEET_TABLE_NAME,
      data: tweet,
    });
    return tweet;
  }

  // async getTweet(id: string) {
  //   const URL =
  //     this.baseUrl +
  //     "/pipes/tweets_by_id.json?" +
  //     querystring.stringify({
  //       token: process.env.TINYBIRD_API_KEY,
  //       id,
  //     });
  //   const response = await fetch(URL);
  //   if (!response.ok) {
  //     throw new Error(
  //       `Failed to get tweet from TinyBird: ${response.status} ${response.statusText}`
  //     );
  //   }
  //   const resp = await response.json();
  //   return resp.data[0];
  // }

  async createUser(dto: CreateUserDto) {
    const user = {
      id: uuid(),
      name: dto.name,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    await this.sendEvent({
      source: "user",
      data: user,
    });
    return user;
  }
}

export const tweetService = new TinyBirdTwitterService();
