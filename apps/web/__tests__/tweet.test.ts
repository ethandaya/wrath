import { appRouter } from "../lib/api/server";
import { beforeAll, describe, expect, it, jest } from "@jest/globals";
import {
  TinyBirdEventData,
  tweetService,
} from "../lib/api/services/tweet.service";

describe("tweet", () => {
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
      userId: "2",
    });
    expect(retweet).toEqual({
      id: expect.any(String),
      text: "Hello world",
      type: "retweet",
      userId: "2",
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
      text: "This is a tweet saying hello",
      userId: "2",
    });
    expect(quoteTweet).toEqual({
      id: expect.any(String),
      text: "This is a tweet saying hello",
      type: "quote",
      userId: "2",
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

  it("should be able to retweet a quote tweet", async () => {
    const tweet = await caller.addTweet({
      type: "tweet",
      text: "Hello world",
      userId: "1",
    });
    const quoteTweet = await caller.addTweet({
      type: "quote",
      quotedStatusId: tweet.id,
      text: "This tweet says hello",
      userId: "2",
    });
    const retweet = await caller.addTweet({
      type: "retweet",
      retweetedStatusId: quoteTweet.id,
      text: quoteTweet.text,
      userId: "3",
    });
    expect(retweet).toEqual({
      id: expect.any(String),
      text: "This tweet says hello",
      type: "retweet",
      userId: "3",
      retweetedStatusId: quoteTweet.id,
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    });
  });

  it("should be able to retweet a reply tweet", async () => {
    const tweet = await caller.addTweet({
      type: "tweet",
      text: "Hello world",
      userId: "1",
    });
    const replyTweet = await caller.addTweet({
      type: "reply",
      inReplyToStatusId: tweet.id,
      inReplyToUserId: tweet.userId,
      text: "This tweet is a reply to hello",
      userId: "2",
    });
    const retweet = await caller.addTweet({
      type: "retweet",
      retweetedStatusId: replyTweet.id,
      text: replyTweet.text,
      userId: "3",
    });
    expect(retweet).toEqual({
      id: expect.any(String),
      text: "This tweet is a reply to hello",
      type: "retweet",
      userId: "3",
      retweetedStatusId: replyTweet.id,
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    });
  });

  it("should be able to quote a reply tweet", async () => {
    const tweet = await caller.addTweet({
      type: "tweet",
      text: "Hello world",
      userId: "1",
    });
    const replyTweet = await caller.addTweet({
      type: "reply",
      inReplyToStatusId: tweet.id,
      inReplyToUserId: tweet.userId,
      text: "This tweet is a reply to hello",
      userId: "2",
    });
    const quoteTweet = await caller.addTweet({
      type: "quote",
      quotedStatusId: replyTweet.id,
      text: replyTweet.text,
      userId: "3",
    });
    expect(quoteTweet).toEqual({
      id: expect.any(String),
      text: "This tweet is a reply to hello",
      type: "quote",
      userId: "3",
      quotedStatusId: replyTweet.id,
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    });
  });

  it("should be able to reply to a quote tweet", async () => {
    const tweet = await caller.addTweet({
      type: "tweet",
      text: "Hello world",
      userId: "1",
    });
    const quoteTweet = await caller.addTweet({
      type: "quote",
      quotedStatusId: tweet.id,
      text: "this tweet says hello",
      userId: "2",
    });
    const replyTweet = await caller.addTweet({
      type: "reply",
      inReplyToStatusId: quoteTweet.id,
      inReplyToUserId: quoteTweet.userId,
      text: "This tweet is a reply to a quote tweet about hello",
      userId: "3",
    });
    expect(replyTweet).toEqual({
      id: expect.any(String),
      text: "This tweet is a reply to a quote tweet about hello",
      type: "reply",
      userId: "3",
      inReplyToStatusId: quoteTweet.id,
      inReplyToUserId: quoteTweet.userId,
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    });
  });
});
