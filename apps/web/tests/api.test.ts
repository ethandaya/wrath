import { describe, expect, it } from "vitest";
import { appRouter } from "../lib/api/server";

describe("api", async () => {
  const caller = appRouter.createCaller({});

  it("should be able to create a tweet", async () => {
    const res = await caller.addTweet({
      text: "Hello world",
    });
    expect(res).toEqual({
      id: expect.any(String),
      text: "Hello world",
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    });
  });
});
