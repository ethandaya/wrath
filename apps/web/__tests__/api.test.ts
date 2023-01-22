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
      userId: "1",
    });
    expect(res).toEqual({
      id: expect.any(String),
      text: "Hello world",
      type: "tweet",
      userId: "1",
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    });
  });

  it("should be able to create a retweet", async () => {
    const tweet = await caller.addTweet({
      type: "tweet",
      text: "Hello world",
      userId: "1",
    });
    const retweet = await caller.addTweet({
      type: "retweet",
      retweetedStatusId: tweet.id,
      text: tweet.text,
      userId: tweet.userId,
    });
    expect(retweet).toEqual({
      id: expect.any(String),
      text: "Hello world",
      type: "retweet",
      userId: "1",
      retweetedStatusId: tweet.id,
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    });
  });

  it("should be able to create a quote tweet", async () => {
    const tweet = await caller.addTweet({
      type: "tweet",
      text: "Hello world",
      userId: "1",
    });
    const quoteTweet = await caller.addTweet({
      type: "quote",
      quotedStatusId: tweet.id,
      text: tweet.text,
      userId: tweet.userId,
    });
    expect(quoteTweet).toEqual({
      id: expect.any(String),
      text: "Hello world",
      type: "quote",
      userId: "1",
      quotedStatusId: tweet.id,
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    });
  });

  it("should be able to create a reply tweet", async () => {
    const tweet = await caller.addTweet({
      type: "tweet",
      text: "Hello world",
      userId: "1",
    });
    const replyTweet = await caller.addTweet({
      type: "reply",
      inReplyToStatusId: tweet.id,
      inReplyToUserId: tweet.userId,
      text: tweet.text,
      userId: "2",
    });
    expect(replyTweet).toEqual({
      id: expect.any(String),
      text: "Hello world",
      type: "reply",
      userId: "2",
      inReplyToStatusId: tweet.id,
      inReplyToUserId: tweet.userId,
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    });
  });
});
