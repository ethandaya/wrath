import { z } from "zod";
import { Tweet, User } from "../models";
import { publicProcedure } from "../base";
import { tweetService } from "../services/tweet.service";

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
      return tweetService.createTweet({
        text: req.input.text,
      });
    }),
};
