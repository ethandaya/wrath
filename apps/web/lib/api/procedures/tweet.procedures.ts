import { z } from "zod";
import { publicProcedure } from "../base";
import {
  CreateAnyTweetParamSchema,
  tweetService,
} from "../services/tweet.service";

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
