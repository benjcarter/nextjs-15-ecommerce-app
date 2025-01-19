import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import Stripe from "stripe";
import { z } from "zod";

import { db } from "@/lib/db";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-12-18.acacia"
});

const app = new Hono()
  .post(
    "/",
    clerkMiddleware(),
    zValidator(
      "json",
      z.array(
        z.object({
          price: z.number(),
          quantity: z.number(),
          title: z.string(),
          description: z.string(),
          image: z.string()
        })
      )
    ),
    async (c) => {
      const auth = getAuth(c);
      if (!auth) return c.json({ error: "Unauthorized" }, 401);

      const items = c.req.valid("json");
      if (!items) return c.json({ error: "Invalid request" }, 400);

      try {
        const session = await stripe.checkout.sessions.create({
          line_items: items.map((item) => ({
            price_data: {
              product_data: {
                name: item.title,
                description: item.description,
                images: [item.image]
              },
              unit_amount: item.price * 100,
              currency: "cad"
            },
            quantity: item.quantity
          })),
          shipping_options: [{ shipping_rate: "shr_1QikczGGecUTcVUmALiLN7FY" }],
          mode: "payment",
          success_url: `${process.env.NEXT_PUBLIC_APP_URL}/orders`,
          cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/cart`,
          metadata: {
            images: JSON.stringify(items.map((item) => item.image)),
            userId: auth.userId
          }
        });

        return c.json({ sessionId: session.id });

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        return c.json({ error: err.message }, 500);
      }
    }
  )
  .post("/webhook", async (c) => {
    const sig = c.req.header("Stripe-Signature") as string;
    const body = await c.req.text();

    let event: Stripe.Event;

    try {
      event = await stripe.webhooks.constructEventAsync(
        body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET!
      );
    } catch {
      return c.json({ error: "Invalid signature" }, { status: 400 });
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;

      const userId = session.metadata?.userId;
      if (!userId) return c.json({ error: "Invalid session" }, { status: 400 });

      const images = session.metadata?.images;
      if (!images) return c.json({ error: "Invalid session" }, { status: 400 });

      await db.order.create({
        data: {
          total: session.amount_total! / 100,
          userId,
          items: JSON.parse(images)
        }
      });

      return c.json({ received: true });
    }
  });

export default app;
