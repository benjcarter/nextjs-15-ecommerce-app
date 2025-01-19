import { Hono } from "hono";
import { handle } from "hono/vercel";

import checkout from "@/app/api/[[...route]]/checkout";
import orders from "@/app/api/[[...route]]/orders";
import products from "@/app/api/[[...route]]/products";

const app = new Hono().basePath("/api");

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const routes = app
  .route("/products", products)
  .route("/checkout", checkout)
  .route("/orders", orders);

export const GET = handle(app);
export const POST = handle(app);

export type AppType = typeof routes;
