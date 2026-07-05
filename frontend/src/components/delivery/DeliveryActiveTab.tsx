import type { DeliveryOrder } from "./DeliveryDashboard";

type Props = {
  activeOrders: DeliveryOrder[];
  loading: boolean;
  expandedOrder: number | null;
  handleDeliveryStatus: (orderId: number, status: string) => Promise<void>;
  setExpandedOrder: (orderId: number | null) => void;
};

export default function DeliveryActiveTab({
  activeOrders,
  loading,
  expandedOrder,
  handleDeliveryStatus,
  setExpandedOrder,
}: Props): React.JSX.Element {
  return (
    <div className="rounded-xl border border-slate-700 bg-slate-800/50 p-6">
      <h2 className="mb-6 text-2xl font-bold text-white">Active Deliveries</h2>
      {loading ? (
        <p className="text-slate-400">Loading delivery tasks...</p>
      ) : activeOrders.length === 0 ? (
        <p className="text-slate-400">No active deliveries at the moment.</p>
      ) : (
        <div className="space-y-4">
          {activeOrders.map((order) => (
            <div
              key={order.order_id}
              className="rounded-xl border border-slate-700 bg-slate-900/40 p-5"
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div className="space-y-3">
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      Order #{order.order_id}
                    </h3>
                    <p className="text-sm text-slate-400">
                      Customer: {order.customer}
                    </p>
                  </div>
                  <div className="grid gap-2 sm:grid-cols-2">
                    <p className="text-slate-300">Address: {order.address}</p>
                    <p className="text-slate-300">
                      Payment: {order.payment_method}
                    </p>
                    <p className="text-slate-300">
                      Total: ₹{order.order_total}
                    </p>
                    <p className="text-slate-300">
                      Created: {new Date(order.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>

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
                  {order.status.toUpperCase()}
                </span>

                <div className="text-right">
                  <p className="text-sm text-slate-400">Order Total</p>
                  <p className="text-xl font-semibold text-white">
                    ₹{order.order_total}
                  </p>
                  <p className="mt-2 text-xs text-yellow-400">
                    {order.commission_percentage}% Commission: ₹
                    {order.commission_amount}
                  </p>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {order.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="rounded-xl border border-slate-700 bg-slate-800/50 p-4"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={`${import.meta.env.VITE_API_URL}${item.product_image}`}
                          alt={item.product_title}
                          className="h-20 w-20 rounded-lg object-cover"
                        />
                        <div>
                          <p className="font-semibold text-white">
                            {item.product_title}
                          </p>
                          <p className="text-sm text-slate-400">
                            Qty: {item.quantity}
                          </p>
                        </div>
                      </div>
                      <div className="mt-3 text-sm text-slate-300">
                        <p>Unit: ₹{item.price}</p>
                        <p>Total: ₹{item.item_total}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-3 border-t border-slate-700 pt-4">
                {order.status === "accepted" && (
                  <button
                    onClick={() =>
                      handleDeliveryStatus(order.order_id, "shipped")
                    }
                    className="rounded-lg bg-blue-500 px-4 py-2 text-white transition hover:bg-blue-600"
                  >
                    Mark Shipped
                  </button>
                )}
                {order.status === "shipped" && (
                  <button
                    onClick={() =>
                      handleDeliveryStatus(order.order_id, "delivered")
                    }
                    className="rounded-lg bg-green-500 px-4 py-2 text-white transition hover:bg-green-600"
                  >
                    Mark Delivered
                  </button>
                )}
                <button
                  onClick={() =>
                    setExpandedOrder(
                      expandedOrder === order.order_id ? null : order.order_id,
                    )
                  }
                  className="rounded-lg bg-slate-700 px-4 py-2 text-white transition hover:bg-slate-600"
                >
                  {expandedOrder === order.order_id
                    ? "Hide Details"
                    : "View Items"}
                </button>
              </div>

              {expandedOrder === order.order_id && (
                <div className="mt-6 rounded-xl border border-slate-700 bg-slate-800/50 p-4">
                  <h4 className="mb-3 font-semibold text-white">
                    Delivery Items ({order.items_count})
                  </h4>
                  <div className="space-y-3">
                    {order.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex flex-wrap items-center gap-3 rounded-lg border border-slate-700 bg-slate-900/40 p-3"
                      >
                        <img
                          src={`${import.meta.env.VITE_API_URL}${item.product_image}`}
                          alt={item.product_title}
                          className="h-16 w-16 rounded-lg object-cover"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold text-white">
                            {item.product_title}
                          </p>
                          <p className="text-sm text-slate-400">
                            Quantity: {item.quantity}
                          </p>
                        </div>
                        <p className="text-sm text-slate-300">
                          ₹{item.item_total}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
