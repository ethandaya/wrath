import { z } from "zod";

const BaseModel = z.object({
  id: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  deletedAt: z.date().optional(),
});

export const UserModel = BaseModel.extend({
  name: z.string(),
  screenName: z.string(),
  url: z.string(),
  description: z.string(),
  verified: z.boolean(),
  favouritesCount: z.number(),
  statusesCount: z.number(),
  profileBannerUrl: z.string(),
  profileImageUrl: z.string(),
  defaultProfile: z.boolean(),
});

export type User = z.infer<typeof UserModel>;

export const BaseTweetModel = BaseModel.extend({
  text: z.string(),
  source: z.string(),
  inReplyToStatusId: z.string().nullable(),
  inReplyToUserId: z.string().nullable(),
  inReplyToScreenName: z.string().nullable(),
  user: z.lazy(() => UserModel),
  quotedStatusId: z.string().nullable(),
  isQuoteStatus: z.boolean(),
  quoteCount: z.number(),
  replyCount: z.number(),
  retweetCount: z.number(),
  favoriteCount: z.number(),
  favorited: z.boolean(),
  retweeted: z.boolean(),
});

type TweetModelType = z.infer<typeof BaseTweetModel> & {
  quotedStatus: TweetModelType | null;
  retweetedStatus: TweetModelType | null;
};

export const TweetModel: z.ZodType<TweetModelType> = BaseTweetModel.extend({
  quotedStatus: z.lazy(() => TweetModel).nullable(),
  retweetedStatus: z.lazy(() => TweetModel).nullable(),
});

export type Tweet = z.infer<typeof TweetModel>;
