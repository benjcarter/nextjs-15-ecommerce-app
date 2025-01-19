import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";

import { type Product } from "@/types";

const app = new Hono()
  .get("/", async (c) => {
    const res = await fetch("https://fakestoreapi.com/products", {
      cache: "force-cache"
    });
    const data: Product[] = await res.json();

    return c.json({ products: data });
  })
  .get(
    "/:id",
    zValidator("param", z.object({ id: z.string().optional() })),
    async (c) => {
      const { id } = c.req.valid("param");
      if (!id) return c.json({ error: "Missing id" }, 400);

      const res = await fetch(`https://fakestoreapi.com/products/${id}`, {
        cache: "force-cache"
      });
      const data: Product = await res.json();

      if (!data) return c.json({ error: "Product not found" }, 404);

      return c.json({ product: data });
    }
  );

export default app;
