import { z } from "zod";
import { publicProcedure } from "../base";
import { tweetService } from "../services/tweet.service";
import { CreateAnyTweetParamSchema } from "../models";

export const methods = {
  tweetById: publicProcedure.input(z.string()).query((req) => {
    return tweetService.getTweet(req.input);
  }),
  addTweet: publicProcedure
    .input(CreateAnyTweetParamSchema)
    .mutation(async (req) => {
      return tweetService.createTweet(req.input);
    }),
};
