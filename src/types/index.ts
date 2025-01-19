export type CartProduct = Product & {
  quantity: number;
};

export type Product = {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
};

export type Order = {
  id: string;
  createdAt: Date;
  total: number;
  items: string[];
  userId: string;
};
