import type { Order } from "../../types";

type Props = {
  orders: Order[];
};

export default function CustomerOrders({ orders }: Props): React.JSX.Element {
  return (
    <div className="rounded-xl border border-slate-700 bg-slate-800/50 p-6">
      <h2 className="mb-6 text-2xl font-bold text-white">My Orders</h2>

      {orders.length === 0 ? (
        <p className="text-slate-400">No orders yet</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="rounded-lg border border-slate-600 bg-slate-700/30 p-4"
            >
              <div className="mb-5 flex justify-between">
                <div>
                  <p className="font-semibold text-white">Order #{order.id}</p>
                  <p className="text-slate-400">Total ₹ {order.total}</p>
                </div>
                <div className="text-right">
                  <p className="text-white">{order.payment_method}</p>
                  <span
                    className={`rounded-full px-3 py-1 text-sm font-semibold ${
                      order.status === "pending"
                        ? "bg-yellow-500/20 text-yellow-400"
                        : order.status === "accepted"
                          ? "bg-green-500/20 text-green-400"
                          : order.status === "shipped"
                            ? "bg-blue-500/20 text-blue-400"
                            : order.status === "delivered"
                              ? "bg-purple-500/20 text-purple-400"
                              : "bg-red-500/20 text-red-400"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
              </div>

              <div className="mb-6">
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
                {order.items?.map((item, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <img
                      src={`${import.meta.env.VITE_API_URL}${item.image}`}
                      className="h-20 w-20 rounded object-cover"
                    />
                    <div>
                      <p className="font-semibold text-white">{item.title}</p>
                      <p className="text-slate-400">Qty: {item.quantity}</p>
                      <p className="text-pink-400">₹ {item.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
