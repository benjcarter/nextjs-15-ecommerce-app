import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";

import { db } from "@/lib/db";
import { type Order } from "@/types";

const app = new Hono().get(
  "/",
  zValidator("query", z.object({ userId: z.string().optional() })),
  async (c) => {
    const { userId } = c.req.valid("query");
    if (!userId) return c.json({ error: "userId is required" }, 400);

    const orders: Order[] = await db.order.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" }
    });

    return c.json({ orders });
  }
);

export default app;
