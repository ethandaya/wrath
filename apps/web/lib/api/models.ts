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

export const CreateTweetSchema = BaseModel.extend({
  type: z.literal("tweet"),
  text: z.string().optional(),
});

export const CreateRetweetSchema = CreateTweetSchema.extend({
  type: z.literal("retweet"),
  isRetweet: z.boolean(),
  retweetedStatusId: z.string(),
});

export const CreateAnyTweetSchema = z.discriminatedUnion("type", [
  CreateRetweetSchema,
  CreateTweetSchema,
]);

export type CreateAnyTweetDto = z.infer<typeof CreateAnyTweetSchema>;
