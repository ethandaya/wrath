import { publicProcedure } from "../base";
import { tweetService } from "../services/tweet.service";
import { CreateAnyTweetParamSchema } from "../models";

export const methods = {
  addTweet: publicProcedure
    .input(CreateAnyTweetParamSchema)
    .mutation(async (req) => {
      return tweetService.createTweet(req.input);
    }),
};
