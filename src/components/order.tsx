import Image from "next/image";

import { format } from "date-fns";

import { formatCurrency } from "@/lib/utils";
import { type Order as OrderType } from "@/types";

interface OrderProps {
  order: OrderType;
}

export const Order = ({ order }: OrderProps) => {
  return (
    <div className="rounded-xl border border-gray-200 shadow-sm">
      <div className="flex items-center gap-10 border-b border-gray-100 p-5 text-sm">
        <div className="max-w-28 md:max-w-none">
          <p className="font-medium">Order number</p>
          <p className="truncate text-gray-600">{order.id}</p>
        </div>
        <div className="hidden md:inline">
          <p className="font-medium">Date placed</p>
          <p className="truncate text-gray-600">
            {format(order.createdAt, "MMM dd, yyyy")}
          </p>
        </div>
        <div>
          <p className="font-medium">Total amount</p>
          <p className="truncate">{formatCurrency(order.total)}</p>
        </div>
      </div>

      <div className="flex items-center gap-10 overflow-x-scroll p-5">
        {order.items.map((item, i) => (
          <Image
            key={i}
            src={item}
            alt={`Product ${i + 1}`}
            height={100}
            width={100}
            className="object-contain"
          />
        ))}
      </div>
    </div>
  );
};
