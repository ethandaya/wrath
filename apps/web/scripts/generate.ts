import { v4 as uuid } from "uuid";
import { randFullName, randQuote } from "@ngneat/falso";
import * as fs from "fs";
import {
  CreateAnyTweetDto,
  CreateQuoteTweetSchema,
  CreateReplyTweetSchema,
  CreateRetweetSchema,
  CreateTweetSchema,
} from "../lib/api/models";
import { z } from "zod";

function generateTestUsers() {
  const users = [];
  for (let i = 0; i < 100; i++) {
    users.push({
      id: uuid(),
      name: randFullName(),
    });
  }
  return users;
}

function generate(): CreateAnyTweetDto[] {
  const users = generateTestUsers();
  const tweets: z.infer<typeof CreateTweetSchema>[] = [];
  for (let i = 0; i < 2024; i++) {
    tweets.push({
      type: "tweet",
      id: uuid(),
      text: randQuote(),
      userId: users[Math.floor(Math.random() * users.length)].id,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }
  const retweets: z.infer<typeof CreateRetweetSchema>[] = [];
  for (let i = 0; i < 344; i++) {
    const tweet = tweets[Math.floor(Math.random() * tweets.length)];
    retweets.push({
      type: "retweet",
      id: uuid(),
      text: tweet.text,
      userId: users[Math.floor(Math.random() * users.length)].id,
      retweetedStatusId: tweet.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }
  const replies: z.infer<typeof CreateReplyTweetSchema>[] = [];
  for (let i = 0; i < 402; i++) {
    const tweet = tweets[Math.floor(Math.random() * tweets.length)];
    replies.push({
      type: "reply",
      id: uuid(),
      text: randQuote(),
      userId: users[Math.floor(Math.random() * users.length)].id,
      inReplyToStatusId: tweet.id,
      inReplyToUserId: tweet.userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }
  const quotes: z.infer<typeof CreateQuoteTweetSchema>[] = [];
  for (let i = 0; i < 324; i++) {
    const tweet = tweets[Math.floor(Math.random() * tweets.length)];
    quotes.push({
      type: "quote",
      id: uuid(),
      text: randQuote(),
      userId: users[Math.floor(Math.random() * users.length)].id,
      quotedStatusId: tweet.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }
  return [...tweets, ...retweets, ...replies, ...quotes];
}

function main() {
  const data = generate();
  fs.mkdirSync("./fixtures", { recursive: true });
  fs.writeFileSync(
    "./fixtures/tweets.json",
    data
      .map((d) => JSON.stringify(d))
      .join("\n")
      .toString()
  );
}

main();
