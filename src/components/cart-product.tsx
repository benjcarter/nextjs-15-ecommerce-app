import Image from "next/image";

import { Star } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatCurrency } from "@/lib/utils";
import { removeFromCart, updateQuantity } from "@/state/cart/cartSlice";
import { useAppDispatch } from "@/state/hooks";
import { type CartProduct as CartProductType } from "@/types";

import { Button } from "./ui/button";

interface CartProductProps {
  product: CartProductType;
}

export const CartProduct = ({ product }: CartProductProps) => {
  const dispatch = useAppDispatch();

  return (
    <div className="flex flex-col items-center gap-5 rounded-xl bg-white p-5 shadow-md md:flex-row">
      <div className="relative h-40 w-40">
        <Image
          src={product.image}
          alt={product.title}
          fill
          className="object-contain"
        />
      </div>

      <div className="flex-1">
        <h4 className="text-lg font-semibold">{product.title}</h4>

        <div className="my-2 flex">
          {[...Array(Math.round(product.rating.rate))].map((_, i) => (
            <span key={i}>
              <Star className="size-5 fill-current text-yellow-400" />
            </span>
          ))}
        </div>

        <p className="text-xl font-semibold">
          {formatCurrency(product.price * product.quantity)}
        </p>

        <p className="my-2 line-clamp-1 text-xs">{product.description}</p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-x-2">
            <Label className="font-semibold">Quantity:</Label>
            <Input
              type="number"
              className="mt-2 w-16"
              value={product.quantity}
              onChange={(e) =>
                dispatch(
                  updateQuantity({
                    id: product.id,
                    quantity: parseInt(e.target.value)
                  })
                )
              }
              min={1}
            />
          </div>

          <Button onClick={() => dispatch(removeFromCart({ id: product.id }))}>
            Remove
          </Button>
        </div>
      </div>
    </div>
  );
};
