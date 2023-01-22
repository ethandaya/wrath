import { appRouter } from "../lib/api/server";
import { beforeAll, describe, expect, it, jest } from "@jest/globals";
import {
  TinyBirdEventData,
  tweetService,
} from "../lib/api/services/tweet.service";

describe("api", () => {
  let caller = appRouter.createCaller({});

  beforeAll(() => {
    jest
      .spyOn(tweetService, "sendEvent")
      .mockImplementation((event: TinyBirdEventData) => {
        return Promise.resolve(event);
      });
  });

  it("should be able to create a tweet", async () => {
    const res = await caller.addTweet({
      type: "tweet",
      text: "Hello world",
    });
    expect(res).toEqual({
      id: expect.any(String),
      text: "Hello world",
      type: "tweet",
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    });
  });

  it("should be able to create a retweet", async () => {
    const tweet = await caller.addTweet({
      type: "tweet",
      text: "Hello world",
    });
    const retweet = await caller.addTweet({
      type: "retweet",
      retweetedStatusId: tweet.id,
      text: tweet.text,
    });
    expect(retweet).toEqual({
      id: expect.any(String),
      text: "Hello world",
      type: "retweet",
      retweetedStatusId: tweet.id,
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    });
  });
});
