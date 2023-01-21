import { methods as tweetMethods } from "./procedures/tweet.procedures";
import { trpcRouter } from "./base";

export const appRouter = trpcRouter({
  ...tweetMethods,
});

export type AppRouter = typeof appRouter;
