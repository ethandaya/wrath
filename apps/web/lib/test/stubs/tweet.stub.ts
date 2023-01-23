import { Tweet } from "../../api/models";

const tweet: Tweet = {
  id: "tweet",
  type: "tweet",
  text: "Hello world",
  user: {
    id: "1",
    name: "John Doe",
  },
  createdAt: new Date(),
  updatedAt: new Date(),
};

const retweet: Tweet = {
  id: "retweet",
  type: "retweet",
  text: tweet.text,
  user: {
    id: "1",
    name: "John Doe",
  },
  retweetedStatus: tweet,
  retweetedStatusId: tweet.id,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const reply: Tweet = {
  id: "reply",
  type: "reply",
  text: "reply to hello world",
  user: {
    id: "1",
    name: "John Doe",
  },
  inReplyToStatus: tweet,
  inReplyToStatusId: tweet.id,
  inReplyToUserId: tweet.user.id,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const quote: Tweet = {
  id: "quote",
  type: "quote",
  text: "quote hello world",
  user: {
    id: "1",
    name: "John Doe",
  },
  quotedStatus: tweet,
  quotedStatusId: tweet.id,
  createdAt: new Date(),
  updatedAt: new Date(),
};

function getTweet(id: string): Tweet | null {
  switch (id) {
    case "tweet":
      return tweet;
    case "retweet":
      return retweet;
    case "reply":
      return reply;
    case "quote":
      return quote;
    default:
      return null;
  }
}
