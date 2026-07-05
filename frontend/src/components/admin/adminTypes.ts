import type { User as BaseUser, Order } from "../../types";

export type User = BaseUser;

export type ProductType = {
  id: number;
  title: string;
  image: string;
  price: number;
  category: string;
  stock: number;
  seller: number;
};

export type DeliveryAgent = {
  id: number;
  username: string;
  email: string;
  phone: string;
};

export type UserFormData = {
  username: string;
  email: string;
  role: "customer" | "seller" | "delivery" | "admin";
  phone: string;
  password: string;
  approval_status: "pending" | "approved" | "disabled";
};

export type DeliveryAgentFormData = {
  username: string;
  email: string;
  phone: string;
  password: string;
};

export type AdminOrder = Order & {
  customer: string;
  customer_email?: string;
  delivery_agent_id?: number | null;
  delivery_agent_name?: string | null;
};

export type AdminTab =
  | "dashboard"
  | "users"
  | "sellers"
  | "orders"
  | "delivery"
  | "products"
  | "settings";

export const orderStatuses = [
  "pending",
  "accepted",
  "shipped",
  "delivered",
  "cancelled",
] as const;

export type OrderStatus = (typeof orderStatuses)[number];
