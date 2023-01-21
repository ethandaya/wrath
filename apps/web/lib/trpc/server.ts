import { methods as tweetMethods } from "./procedures/tweet";
import { trpcRouter } from "./base";

export const appRouter = trpcRouter({
  ...tweetMethods,
});

export type AppRouter = typeof appRouter;
