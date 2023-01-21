import { z } from "zod";
import { Tweet, TweetModel } from "../models";
import { publicProcedure } from "../base";

export const methods = {
  tweetById: publicProcedure.input(z.string()).query((req) => {
    const tweet: Tweet = {
      id: req.input,
      text: "Hello world",
      authorId: "1",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    return tweet;
  }),
  addTweet: publicProcedure
    .input(
      TweetModel.pick({
        text: true,
      })
    )
    .mutation((req) => {
      const tweet: Tweet = {
        id: "1",
        text: req.input.text,
        authorId: "1",
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      return tweet;
    }),
};
