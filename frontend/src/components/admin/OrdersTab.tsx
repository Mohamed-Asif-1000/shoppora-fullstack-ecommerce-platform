import type { Dispatch, SetStateAction } from "react";
import type { AdminOrder, DeliveryAgent, OrderStatus } from "./adminTypes";

type Props = {
  orders: AdminOrder[];
  deliveryAgents: DeliveryAgent[];
  selectedAgent: Record<number, number>;
  setSelectedAgent: Dispatch<SetStateAction<Record<number, number>>>;
  onAssignAgent: (orderId: number) => Promise<void>;
  onStatusUpdate: (orderId: number, status: string) => Promise<void>;
  formatCurrency: (value: number) => string;
};

export default function OrdersTab({
  orders,
  deliveryAgents,
  selectedAgent,
  setSelectedAgent,
  onAssignAgent,
  onStatusUpdate,
  formatCurrency,
}: Props): React.JSX.Element {
  const orderStatuses: OrderStatus[] = [
    "pending",
    "accepted",
    "shipped",
    "delivered",
    "cancelled",
  ];

  return (
    <div className="rounded-xl border border-slate-700 bg-slate-800/50 p-4 sm:p-6">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Order Management</h2>
          <p className="text-slate-400">
            View, assign delivery agents, and update order status.
          </p>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b border-slate-600 text-slate-400">
            <tr>
              <th className="px-4 py-3 text-left font-semibold">Order</th>
              <th className="px-4 py-3 text-left font-semibold">Customer</th>
              <th className="px-4 py-3 text-left font-semibold">Status</th>
              <th className="px-4 py-3 text-left font-semibold">Total</th>
              <th className="px-4 py-3 text-left font-semibold">
                Delivery Agent
              </th>
              <th className="px-4 py-3 text-left font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr
                key={order.id}
                className="border-b border-slate-700 hover:bg-slate-700/30"
              >
                <td className="px-4 py-3 text-slate-300">
                  #{String(order.id).padStart(4, "0")}
                </td>
                <td className="px-4 py-3 text-white">{order.customer}</td>
                <td className="px-4 py-3 text-slate-300">
                  <span className="rounded-full bg-slate-700 px-3 py-1 text-xs text-slate-200">
                    {order.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-300">
                  {formatCurrency(Number(order.total || 0))}
                </td>
                <td className="px-4 py-3 text-slate-300">
                  {order.delivery_agent_name || "Unassigned"}
                </td>
                <td className="space-y-2 px-4 py-3">
                  <div className="flex flex-col gap-2">
                    <select
                      value={selectedAgent[order.id] ?? ""}
                      onChange={(e) =>
                        setSelectedAgent((prev) => ({
                          ...prev,
                          [order.id]: Number(e.target.value),
                        }))
                      }
                      className="w-full rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-slate-200"
                    >
                      <option value="">Assign agent</option>
                      {deliveryAgents.map((agent) => (
                        <option key={agent.id} value={agent.id}>
                          {agent.username}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={() => onAssignAgent(order.id)}
                      className="rounded-lg bg-pink-500 px-3 py-2 text-xs font-semibold text-white transition hover:bg-pink-600"
                    >
                      Assign
                    </button>
                    <select
                      value={order.status}
                      onChange={(e) => onStatusUpdate(order.id, e.target.value)}
                      className="w-full rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-slate-200"
                    >
                      {orderStatuses.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {orders.length === 0 && (
        <p className="mt-6 text-center text-slate-400">No orders found.</p>
      )}
    </div>
  );
}
