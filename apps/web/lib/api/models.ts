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
  retweetedStatusId: z.string(),
});

export const CreateQuoteTweetSchema = CreateTweetSchema.extend({
  type: z.literal("quote"),
  quotedStatusId: z.string(),
});

export const CreateReplyTweetSchema = CreateTweetSchema.extend({
  type: z.literal("reply"),
  inReplyToStatusId: z.string(),
});

export const CreateAnyTweetSchema = z.discriminatedUnion("type", [
  CreateReplyTweetSchema,
  CreateQuoteTweetSchema,
  CreateRetweetSchema,
  CreateTweetSchema,
]);

export const CreateAnyTweetParamSchema = z.discriminatedUnion("type", [
  CreateRetweetSchema.omit({
    id: true,
    createdAt: true,
    updatedAt: true,
  }),
  CreateTweetSchema.omit({
    id: true,
    createdAt: true,
    updatedAt: true,
  }),
  CreateQuoteTweetSchema.omit({
    id: true,
    createdAt: true,
    updatedAt: true,
  }),
  CreateReplyTweetSchema.omit({
    id: true,
    createdAt: true,
    updatedAt: true,
  }),
]);

export type CreateAnyTweetDto = z.infer<typeof CreateAnyTweetSchema>;
