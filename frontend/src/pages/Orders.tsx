import { useEffect, useState } from "react";
import { Package } from "lucide-react";
import { getOrders } from "../services/api";
import type { CustomerOrder, OrderItem } from "../types";

export default function Orders() {
  const [orders, setOrders] = useState<CustomerOrder[]>([]);

  useEffect(() => {
    const loadOrders = async () => {
      const userId = localStorage.getItem("userId");

      if (!userId) return;

      const data = await getOrders(Number(userId));

      setOrders(data);
    };

    loadOrders();
  }, []);

  return (
    <div className="min-h-screen bg-linear-to-r from-violet-950 via-purple-950 to-indigo-950 p-6">
      <div className="mx-auto max-w-5xl">
        <h1 className="mb-8 flex items-center gap-3 text-3xl font-bold text-white">
          <Package />
          My Orders
        </h1>

        {orders.length === 0 ? (
          <p className="text-slate-400">No orders yet</p>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order.id}
                className="rounded-2xl border border-slate-700 bg-slate-900 p-6"
              >
                <div className="mb-4 flex justify-between">
                  <div>
                    <p className="font-bold text-white">Order #{order.id}</p>

                    <p className="mt-1 text-slate-400">
                      Total: ₹ {order.total}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-slate-300">{order.payment_method}</p>

                    <p
                      className={`font-semibold ${
                        order.status === "pending"
                          ? "text-yellow-400"
                          : order.status === "accepted"
                            ? "text-green-400"
                            : order.status === "shipped"
                              ? "text-blue-400"
                              : order.status === "delivered"
                                ? "text-purple-400"
                                : "text-red-400"
                      }`}
                    >
                      {order.status.toUpperCase()}
                    </p>
                  </div>
                </div>
                <div className="mt-4 mb-6">
                  <div className="flex items-center justify-between text-sm">
                    <div
                      className={
                        order.status === "pending"
                          ? "text-yellow-400"
                          : "text-green-400"
                      }
                    >
                      Pending
                    </div>

                    <div
                      className={
                        ["accepted", "shipped", "delivered"].includes(
                          order.status,
                        )
                          ? "text-green-400"
                          : "text-slate-500"
                      }
                    >
                      Accepted
                    </div>

                    <div
                      className={
                        ["shipped", "delivered"].includes(order.status)
                          ? "text-green-400"
                          : "text-slate-500"
                      }
                    >
                      Shipped
                    </div>

                    <div
                      className={
                        order.status === "delivered"
                          ? "text-green-400"
                          : "text-slate-500"
                      }
                    >
                      Delivered
                    </div>
                  </div>

                  <div className="mt-2 h-2 rounded-full bg-slate-700">
                    <div
                      className={`h-2 rounded-full bg-green-500 ${
                        order.status === "pending"
                          ? "w-1/4"
                          : order.status === "accepted"
                            ? "w-2/4"
                            : order.status === "shipped"
                              ? "w-3/4"
                              : order.status === "delivered"
                                ? "w-full"
                                : "w-0"
                      }`}
                    />
                  </div>
                  {order.status === "cancelled" && (
                    <p className="mt-3 text-center font-semibold text-red-400">
                      ❌ Order Cancelled
                    </p>
                  )}
                </div>

                <div className="space-y-4">
                  {order.items?.map((product: OrderItem, index: number) => (
                    <div
                      key={index}
                      className="flex gap-4 rounded-xl bg-slate-800 p-4"
                    >
                      <img
                        src={`${import.meta.env.VITE_API_URL}${product.image}`}
                        alt={product.title}
                        className="h-24 w-24 rounded-lg object-cover"
                      />

                      <div>
                        <h3 className="font-semibold text-white">
                          {product.title}
                        </h3>

                        <p className="text-slate-400">
                          Quantity: {product.quantity}
                        </p>

                        <p className="text-pink-400">₹ {product.price}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
