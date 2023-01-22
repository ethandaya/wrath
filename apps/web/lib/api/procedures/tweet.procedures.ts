import { z } from "zod";
import { publicProcedure } from "../base";
import { tweetService } from "../services/tweet.service";

const AddTweetDto = z.object({
  text: z.string(),
});

export const methods = {
  tweetById: publicProcedure.input(z.string()).query((req) => {
    return tweetService.getTweet(req.input);
  }),
  addTweet: publicProcedure.input(AddTweetDto).mutation(async (req) => {
    return tweetService.createTweet({
      text: req.input.text,
    });
  }),
  retweetTweet: publicProcedure.input(z.string()).mutation(async (req) => {
    return tweetService.retweetTweet(req.input);
  }),
};
