import { unstable_cache } from "next/cache";

import MaxWidthWrapper from "@/components/max-width-wrapper";
import { Product } from "@/components/product";
// import { client } from "@/lib/hono";
import { type Product as ProductType } from "@/types";

const getProducts = unstable_cache(async () => {
  const res = await fetch("https://fakestoreapi.com/products");
  const products = await res.json();

  return products;
});

const Home = async () => {
  const products: ProductType[] = await getProducts();

  return (
    <div>
      <MaxWidthWrapper heading="All Products">
        <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {products.map((product: ProductType) => (
            <Product key={product.id} product={product} />
          ))}
        </div>
      </MaxWidthWrapper>
    </div>
  );
};

export default Home;
