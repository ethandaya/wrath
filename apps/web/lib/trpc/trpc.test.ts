import { describe, expect, it } from "vitest";
import { appRouter } from "./server";

describe("trpc client", async () => {
  const caller = appRouter.createCaller({});

  it("should be able to fetch a user", async () => {
    const res = await caller.userById("1");
    expect(res).toEqual({
      id: "1",
      name: "KATT",
    });
  });

  it("should be able to create a user", async () => {
    const res = await caller.userCreate({ name: "KATT" });
    expect(res).toEqual({
      id: expect.any(String),
      name: "KATT",
    });
  });
});
