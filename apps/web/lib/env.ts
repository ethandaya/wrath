import { z } from "zod";

const envVariables = z.object({
  TINYBIRD_BASE_URL: z.string(),
  TINYBIRD_API_KEY: z.string(),
  TINYBIRD_TWEET_TABLE_VERSION: z.string(),
});

envVariables.parse(process.env);

declare global {
  namespace NodeJS {
    interface ProcessEnv extends z.infer<typeof envVariables> {}
  }
}
