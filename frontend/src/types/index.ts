export type User = {
  id: number;
  username: string;
  email: string;
  role: string;
  phone: string;
  joined: string;
  status: string;
  approval_status?: string;
};

export type Order = {
  id: number;
  total: number;
  payment_method: string;
  status: string;
  created_at?: string;
  customer?: string;
  customer_email?: string;
  items: {
    image: string;
    title: string;
    quantity: number;
    price: number;
  }[];
};

export type Wishlist = {
  id: number;
  product: {
    id: number;
    image: string;
    title: string;
    price: number;
  };
};

export type Address = {
  id: number;
  type: string;
  address: string;
  default: boolean;
};

export type SellerProduct = {
  id: number;

  title: string;

  image: string;

  price: number;

  oldprice?: string;

  badge: string;

  badgeColor: string;

  rating: number;

  buyers: number;

  category: string;

  stock: number;

  description: string;

  seller: number;

  created_at: string;
};

export type SellerOrder = {
  order_id: number;
  customer: string;
  address: string;
  status: string;
  payment_method: string;
  created_at: string;
  product_title: string;
  product_image: string;
  quantity: number;
  price: number;
  total: number;
};

export type OrderItem = {
  image: string;
  title: string;
  quantity: number;
  price: number;
};

export type CustomerOrder = {
  id: number;
  total: number;
  payment_method: string;
  status: string;
  items: OrderItem[];
};
