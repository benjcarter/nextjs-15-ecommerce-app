import Image from "next/image";
import { notFound } from "next/navigation";

import MaxWidthWrapper from "@/components/max-width-wrapper";
import { ProductDetails } from "@/components/product-details";
import { client } from "@/lib/hono";

const getProduct = async (id: string) => {
  const res = await client.api.products[":id"].$get({ param: { id } });
  if (!res.ok) return undefined;

  const { product } = await res.json();

  return product;
};

const ProductPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    notFound();
  }

  return (
    <div>
      <MaxWidthWrapper>
        <div className="flex flex-1 flex-col gap-5 md:flex-row">
          <div className="flex flex-1 items-center justify-center rounded-2xl bg-white shadow-lg">
            <div className="relative h-56 w-full md:h-96">
              <Image
                src={product.image}
                alt={product.title}
                fill
                className="object-contain"
              />
            </div>
          </div>
          <div className="flex-1">
            <ProductDetails product={product} />
          </div>
        </div>
      </MaxWidthWrapper>
    </div>
  );
};

export default ProductPage;
