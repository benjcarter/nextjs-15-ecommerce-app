"use client";

import { useState } from "react";

import { Star } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatCurrency } from "@/lib/utils";
import { addToCart } from "@/state/cart/cartSlice";
import { useAppDispatch } from "@/state/hooks";
import { type Product } from "@/types";

interface ProductDetailsProps {
  product: Product;
}

export const ProductDetails = ({ product }: ProductDetailsProps) => {
  const dispatch = useAppDispatch();
  const [quantity, setQuantity] = useState<number>(1);

  const addItemToCart = () => {
    dispatch(
      addToCart({
        ...product,
        quantity
      })
    );
  };

  return (
    <div className="flex h-full flex-col md:py-10">
      <h2 className="text-2xl font-bold tracking-tight">{product.title}</h2>

      <div className="mt-2 flex">
        {[...Array(Math.round(product.rating.rate))].map((_, i) => (
          <span key={i}>
            <Star className="size-5 fill-current text-yellow-400" />
          </span>
        ))}
      </div>

      <p className="mt-2 text-lg font-bold">{formatCurrency(product.price)}</p>

      <p className="my-4">{product.description}</p>

      <Label className="font-semibold">Quantity:</Label>
      <Input
        type="number"
        className="mt-2 w-20"
        value={quantity}
        min={1}
        onChange={(e) => setQuantity(parseInt(e.target.value))}
      />

      <div className="mt-5 flex justify-center md:mt-auto">
        <Button onClick={addItemToCart} className="w-1/2">
          Add To Cart
        </Button>
      </div>
    </div>
  );
};
