import { z } from "zod";

const BaseModel = z.object({
  id: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  deletedAt: z.date().optional(),
});

export const UserModel = BaseModel.extend({
  name: z.string(),
});

export type User = z.infer<typeof UserModel>;

export const TweetModel = BaseModel.extend({
  text: z.string(),
});

export type Tweet = z.infer<typeof TweetModel>;
