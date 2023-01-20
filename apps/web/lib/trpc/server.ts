// @filename: server.ts
import { initTRPC } from "@trpc/server";
import { z } from "zod";

const t = initTRPC.create();

const router = t.router;
const publicProcedure = t.procedure;

const UserDto = z.object({
  id: z.string(),
  name: z.string(),
});

type User = z.infer<typeof UserDto>;

const userList: User[] = [
  {
    id: "1",
    name: "KATT",
  },
];

export const appRouter = router({
  userById: publicProcedure
    .input((val: unknown) => {
      if (typeof val === "string") return val;
      throw new Error(`Invalid input: ${typeof val}`);
    })
    .query((req) => {
      const input = req.input;
      return userList.find((it) => it.id === input);
    }),
  userCreate: publicProcedure
    .input(UserDto.pick({ name: true }))
    .mutation((req) => {
      const id = `${Math.random()}`;

      const user: User = {
        id,
        name: req.input.name,
      };

      userList.push(user);

      return user;
    }),
});

export type AppRouter = typeof appRouter;
