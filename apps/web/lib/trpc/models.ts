import { z } from "zod";

export const TweetModel = z.object({
  id: z.string(),
  text: z.string(),
  authorId: z.string(),

  createdAt: z.date(),
  updatedAt: z.date(),
  deletedAt: z.date().optional(),
});

export type Tweet = z.infer<typeof TweetModel>;
