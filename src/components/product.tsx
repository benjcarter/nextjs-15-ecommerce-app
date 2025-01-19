import Image from "next/image";
import Link from "next/link";

import { Star } from "lucide-react";

import { formatCurrency } from "@/lib/utils";
import { type Product as ProductType } from "@/types";

export const Product = ({ product }: { product: ProductType }) => {
  return (
    <Link href={`/product/${product.id}`}>
      <div className="group h-full cursor-pointer bg-white p-5 shadow-md transition-transform duration-300 sm:hover:scale-105">
        <div className="relative h-56 w-full group-hover:opacity-80">
          <Image
            src={product.image}
            alt={product.title}
            fill
            className="object-contain"
          />
        </div>

        <div className="mt-4">
          <h4>{product.title}</h4>

          <p className="mt-2 text-lg font-bold">
            {formatCurrency(product.price)}
          </p>

          <div className="mt-2 flex">
            {[...Array(Math.round(product.rating.rate))].map((_, i) => (
              <span key={i}>
                <Star className="size-5 fill-current text-yellow-400" />
              </span>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
};
