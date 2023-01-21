import { Tweet, TweetModel, User, UserModel } from "../models";
import { z } from "zod";
import { v4 as uuid } from "uuid";
import querystring from "node:querystring";

const CreateUserDtoModel = UserModel.pick({
  name: true,
});

type CreateUserDto = z.infer<typeof CreateUserDtoModel>;

const CreateTweetDtoModel = TweetModel.pick({
  text: true,
});

type CreateTweetDto = z.infer<typeof CreateTweetDtoModel>;

const TinyBirdEventDataModel = z.discriminatedUnion("source", [
  z.object({ source: z.literal("tweet"), data: TweetModel }),
  z.object({ source: z.literal("user"), data: UserModel }),
]);

export type TinyBirdEventData = z.infer<typeof TinyBirdEventDataModel>;

export interface TweetService {
  createTweet: (dto: CreateTweetDto) => Promise<Tweet>;
  createUser: (dto: CreateUserDto) => Promise<User>;
}

export class TinyBirdTwitterService implements TweetService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.TINYBIRD_BASE_URL;
  }

  async sendEvent(eventData: TinyBirdEventData) {
    console.log("Sending event to TinyBird", eventData);
    await fetch(
      this.baseUrl +
        "/events?" +
        querystring.stringify({
          name: eventData.source,
        }),
      {
        method: "POST",
        body: JSON.stringify(eventData),
      }
    );
    return eventData;
  }

  async createTweet(dto: CreateTweetDto) {
    const tweet: Tweet = {
      id: uuid(),
      text: dto.text,
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
