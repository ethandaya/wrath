import {
  CreateAnyTweetDto,
  CreateRetweetSchema,
  CreateTweetSchema,
  UserModel,
} from "../models";
import { z } from "zod";
import { v4 as uuid } from "uuid";
import querystring from "node:querystring";

const CreateUserDtoModel = UserModel.pick({
  name: true,
});

export const CreateAnyTweetParamSchema = z.discriminatedUnion("type", [
  CreateRetweetSchema.omit({
    id: true,
    createdAt: true,
    updatedAt: true,
  }),
  CreateTweetSchema.omit({
    id: true,
    createdAt: true,
    updatedAt: true,
  }),
]);

type CreateUserDto = z.infer<typeof CreateUserDtoModel>;
type CreateAnyTweetParam = z.infer<typeof CreateAnyTweetParamSchema>;

const TinyBirdEventDataModel = z.discriminatedUnion("source", [
  z.object({ source: z.literal("tweet"), data: CreateTweetSchema }),
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

  async getTweet(id: string) {
    const URL =
      this.baseUrl +
      "/pipes/tweets_by_id.json?" +
      querystring.stringify({
        token: process.env.TINYBIRD_API_KEY,
        id,
      });
    const response = await fetch(URL);
    if (!response.ok) {
      throw new Error(
        `Failed to get tweet from TinyBird: ${response.status} ${response.statusText}`
      );
    }
    const resp = await response.json();
    return resp.data[0];
  }

  async createTweet(dto: CreateAnyTweetParam) {
    const tweet: CreateAnyTweetDto = {
      id: uuid(),
      ...dto,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    await this.sendEvent({
      source: "tweet",
      data: tweet,
    });
    return tweet;
  }

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
