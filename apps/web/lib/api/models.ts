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
  userId: z.string(),
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
  inReplyToUserId: z.string(),
});

export const CreateAnyTweetSchema = z.discriminatedUnion("type", [
  CreateReplyTweetSchema,
  CreateQuoteTweetSchema,
  CreateRetweetSchema,
  CreateTweetSchema,
]);

type CrudKeys = "id" | "createdAt" | "updatedAt" | "deletedAt";
const CrudFields: {
  [key in CrudKeys]: true;
} = {
  id: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
};

export const CreateAnyTweetParamSchema = z.discriminatedUnion("type", [
  CreateRetweetSchema.omit(CrudFields),
  CreateTweetSchema.omit(CrudFields),
  CreateQuoteTweetSchema.omit(CrudFields),
  CreateReplyTweetSchema.omit(CrudFields),
]);

export type CreateAnyTweetDto = z.infer<typeof CreateAnyTweetSchema>;

type TweetSchema = Omit<z.infer<typeof CreateTweetSchema>, "userId"> & {
  type: "tweet";
  user: Omit<User, "createdAt" | "updatedAt">;
};

export type RetweetSchema = Omit<
  z.infer<typeof CreateRetweetSchema>,
  "userId"
> & {
  type: "retweet";
  retweetedStatus: TweetSchema | ReplyTweetSchema | QuoteTweetSchema;
  user: Omit<User, "createdAt" | "updatedAt">;
};

export type ReplyTweetSchema = Omit<
  z.infer<typeof CreateReplyTweetSchema>,
  "userId"
> & {
  type: "reply";
  inReplyToStatus: TweetSchema | ReplyTweetSchema | QuoteTweetSchema;
  user: Omit<User, "createdAt" | "updatedAt">;
};

export type QuoteTweetSchema = Omit<
  z.infer<typeof CreateQuoteTweetSchema>,
  "userId"
> & {
  type: "quote";
  quotedStatus: TweetSchema | ReplyTweetSchema | QuoteTweetSchema;
  user: Omit<User, "createdAt" | "updatedAt">;
};

export type Tweet =
  | TweetSchema
  | RetweetSchema
  | ReplyTweetSchema
  | QuoteTweetSchema;
