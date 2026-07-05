import type { DeliveryOrder } from "./DeliveryDashboard";

type Props = {
  completedOrders: DeliveryOrder[];
  loading: boolean;
};

export default function DeliveryCompletedTab({
  completedOrders,
  loading,
}: Props): React.JSX.Element {
  return (
    <div className="rounded-xl border border-slate-700 bg-slate-800/50 p-6">
      <h2 className="mb-6 text-2xl font-bold text-white">
        Completed Deliveries
      </h2>
      {loading ? (
        <p className="text-slate-400">Loading completed deliveries...</p>
      ) : completedOrders.length === 0 ? (
        <p className="text-slate-400">No completed deliveries yet.</p>
      ) : (
        <div className="space-y-4">
          {completedOrders.map((order) => (
            <div
              key={order.order_id}
              className="rounded-xl border border-slate-700 bg-slate-900/40 p-5"
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    Order #{order.order_id}
                  </h3>
                  <p className="text-sm text-slate-400">
                    Delivered to: {order.customer}
                  </p>
                  <p className="text-sm text-slate-400">{order.address}</p>
                  <p className="text-sm text-slate-400">
                    Delivered on:{" "}
                    {new Date(order.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-slate-400">Order Total</p>
                  <p className="text-xl font-semibold text-white">
                    ₹{order.order_total}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
