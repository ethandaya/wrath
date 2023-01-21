import { describe, expect, it } from "vitest";
import { appRouter } from "./server";

describe("trpc client", async () => {
  const caller = appRouter.createCaller({});

  it("should be able to create a tweet", async () => {
    const res = await caller.addTweet({
      text: "Hello world",
    });
    expect(res).toEqual({
      id: "1",
      text: "Hello world",
      authorId: "1",
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    });
  });

  it("should be able to fetch a tweet", async () => {
    const res = await caller.tweetById("1");
    expect(res).toEqual({
      id: "1",
      text: "Hello world",
      authorId: "1",
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    });
  });
});
