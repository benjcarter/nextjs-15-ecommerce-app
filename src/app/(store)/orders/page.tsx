import { redirect } from "next/navigation";

import { currentUser } from "@clerk/nextjs/server";

import MaxWidthWrapper from "@/components/max-width-wrapper";
import { Order } from "@/components/order";
import { client } from "@/lib/hono";

const getOrders = async (userId: string) => {
  const res = await client.api.orders.$get({ query: { userId } });
  if (!res.ok) {
    throw new Error(res.status.toString());
  }

  const { orders } = await res.json();
  return orders;
};

const OrdersPage = async () => {
  const user = await currentUser();
  if (!user) redirect("/sign-in");

  const orders = await getOrders(user.id);

  return (
    <div>
      <MaxWidthWrapper heading="Your Orders">
        <div className="mt-5 flex flex-col gap-5">
          {!orders.length && (
            <div>
              <p>No orders yet! Get to shopping!</p>
            </div>
          )}

          {orders.map((order) => (
            <Order
              key={order.id}
              order={{
                ...order,
                createdAt: new Date(order.createdAt)
              }}
            />
          ))}
        </div>
      </MaxWidthWrapper>
    </div>
  );
};

export default OrdersPage;
