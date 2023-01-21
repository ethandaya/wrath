import { z } from "zod";
import { Tweet, User } from "../models";
import { publicProcedure } from "../base";

export const methods = {
  tweetById: publicProcedure.input(z.string()).query((req) => {
    const tweet = {
      id: req.input,
      text: "Hello world",
      user: { id: "1" } as User,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as Tweet;
    return tweet;
  }),
  addTweet: publicProcedure
    .input(
      z.object({
        text: z.string(),
      })
    )
    .mutation((req) => {
      const tweet = {
        id: "1",
        text: req.input.text,
        user: {
          id: "1",
        } as User,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as Tweet;
      return tweet;
    }),
};
