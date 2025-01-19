"use client";

import { useTransition } from "react";

import { useUser } from "@clerk/nextjs";
import { loadStripe } from "@stripe/stripe-js";
import { toast } from "sonner";

import { CartProduct } from "@/components/cart-product";
import MaxWidthWrapper from "@/components/max-width-wrapper";
import { Button } from "@/components/ui/button";
import { client } from "@/lib/hono";
import { formatCurrency } from "@/lib/utils";
import { selectItems, selectTotal } from "@/state/cart/cartSlice";
import { useAppSelector } from "@/state/hooks";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

const CartPage = () => {
  const total = useAppSelector(selectTotal);
  const items = useAppSelector(selectItems);
  const { user } = useUser();
  const [isLoading, startTransition] = useTransition();

  const handleCheckout = () => {
    if (!user || !items.length) return;

    startTransition(async () => {
      const stripe = await stripePromise;

      const response = await client.api.checkout.$post({
        json: items.map((item) => ({
          title: item.title,
          price: item.price,
          quantity: item.quantity,
          description: item.description,
          image: item.image
        }))
      });

      if (!response.ok) {
        toast.error("Something went wrong. Please try again later.");
        return;
      }

      const { sessionId } = await response.json();

      stripe?.redirectToCheckout({ sessionId });
    });
  };

  return (
    <div>
      <MaxWidthWrapper heading="Your Shopping Cart">
        <div className="mt-5 flex flex-1 flex-col gap-5 lg:flex-row">
          <div className="lg:w-4/5">
            {!items.length ? (
              <div className="flex h-full flex-col items-center justify-center">
                <p>Your cart is empty!</p>
                <p>Go add some items and come back!</p>
              </div>
            ) : (
              <div className="flex flex-col gap-5">
                {items.map((item, i) => (
                  <CartProduct key={i} product={item} />
                ))}
              </div>
            )}
          </div>

          <div className="-order-1 rounded-xl bg-white p-5 shadow-md lg:order-1 lg:w-1/5">
            <h4 className="mb-2 font-bold tracking-tight">
              Subtotal: {formatCurrency(total)}
            </h4>
            <Button
              disabled={!user || !items.length || isLoading}
              onClick={handleCheckout}
              className="lg:w-full"
            >
              {isLoading
                ? "Processing..."
                : user
                  ? "Proceed to Checkout"
                  : "Sign in to Checkout"}
            </Button>
          </div>
        </div>
      </MaxWidthWrapper>
    </div>
  );
};

export default CartPage;
