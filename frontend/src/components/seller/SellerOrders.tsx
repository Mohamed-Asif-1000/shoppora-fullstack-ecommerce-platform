import { useEffect, useState } from "react";
import {
  getSellerOrders,
  updateOrderStatus,
  assignDeliveryAgent,
  getDeliveryAgents,
} from "../../services/api";

interface GroupedOrder {
  order_id: number;
  customer: string;
  address: string;
  status: string;
  payment_method: string;
  created_at: string;
  items: {
    product_title: string;
    product_image: string;
    quantity: number;
    price: number;
    item_total: number;
  }[];
  items_count: number;
  seller_items_total: number;
  order_total: number;
  delivery_agent_name?: string | null;
}

export default function SellerOrders() {
  const [orders, setOrders] = useState<GroupedOrder[]>([]);
  const [deliveryAgents, setDeliveryAgents] = useState<
    { id: number; username: string }[]
  >([]);
  const [selectedAgent, setSelectedAgent] = useState<Record<number, number>>(
    {},
  );
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState<number | null>(null);
  const getSellerEarnings = (order: GroupedOrder) => {
    return order.status === "cancelled" ? 0 : order.seller_items_total;
  };
  const handleStatusUpdate = async (orderId: number, status: string) => {
    try {
      await updateOrderStatus(orderId, status);

      const sellerId = Number(localStorage.getItem("userId"));

      const data = await getSellerOrders(sellerId);

      setOrders(data);

      // Notify other components of order update
      window.dispatchEvent(new Event("ordersUpdated"));
    } catch (error) {
      console.log(error);
    }
  };

  const handleAssignAndShip = async (orderId: number) => {
    const deliveryAgentId = selectedAgent[orderId];

    if (!deliveryAgentId) {
      alert("Select a delivery agent before shipping.");
      return;
    }

    try {
      await assignDeliveryAgent(orderId, deliveryAgentId);

      const sellerId = Number(localStorage.getItem("userId"));
      const data = await getSellerOrders(sellerId);

      setOrders(data);

      // Notify other components of order update
      window.dispatchEvent(new Event("ordersUpdated"));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const sellerId = Number(localStorage.getItem("userId"));

        const [ordersData, agentsData] = await Promise.all([
          getSellerOrders(sellerId),
          getDeliveryAgents(),
        ]);

        console.log("Grouped orders:", ordersData);

        setOrders(ordersData);
        setDeliveryAgents(Array.isArray(agentsData) ? agentsData : []);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Listen for product updates that might affect orders
    const handleProductsUpdated = () => {
      fetchData();
    };

    window.addEventListener("productsUpdated", handleProductsUpdated);
    window.addEventListener("ordersUpdated", handleProductsUpdated);

    return () => {
      window.removeEventListener("productsUpdated", handleProductsUpdated);
      window.removeEventListener("ordersUpdated", handleProductsUpdated);
    };
  }, []);

  if (loading) {
    return (
      <div className="rounded-xl border border-slate-700 bg-slate-800/50 p-6">
        <h2 className="text-2xl font-bold text-white">Seller Orders</h2>

        <p className="mt-4 text-slate-400">Loading orders...</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-slate-700 bg-slate-800/50 p-6">
      <h2 className="mb-6 text-2xl font-bold text-white">Seller Orders</h2>

      {orders.length === 0 ? (
        <div className="rounded-lg border border-slate-700 bg-slate-900/40 p-8 text-center text-slate-400">
          No Orders Found
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.order_id}
              className="rounded-xl border border-slate-700 bg-slate-900/40 p-5"
            >
              {/* ORDER HEADER */}
              <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
                <div className="flex-1">
                  {/* CUSTOMER INFO */}
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-white">
                      Order #{order.order_id}
                    </h3>

                    <div className="mt-3 space-y-1 text-sm text-slate-300">
                      <p>
                        <span className="font-medium text-white">
                          Customer:
                        </span>{" "}
                        {order.customer}
                      </p>

                      <p>
                        <span className="font-medium text-white">Address:</span>{" "}
                        {order.address}
                      </p>

                      <p>
                        <span className="font-medium text-white">
                          Ordered On:
                        </span>{" "}
                        {new Date(order.created_at).toLocaleDateString()}
                      </p>

                      <p>
                        <span className="font-medium text-white">Payment:</span>{" "}
                        {order.payment_method}
                      </p>
                    </div>
                  </div>

                  {/* STATUS BADGE AND TOTAL */}
                  <div className="flex flex-wrap items-center gap-4">
                    <span
                      className={`rounded-full px-3 py-1 text-sm font-medium ${
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
                      <p className="text-xs text-slate-400">
                        Your earnings from this order
                      </p>
                      <p className="text-lg font-bold text-green-400">
                        ₹₹{getSellerEarnings(order)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* EXPAND BUTTON */}
                <button
                  onClick={() =>
                    setExpandedOrder(
                      expandedOrder === order.order_id ? null : order.order_id,
                    )
                  }
                  className="rounded-lg bg-slate-700 px-4 py-2 text-white transition hover:bg-slate-600"
                >
                  {expandedOrder === order.order_id
                    ? "Hide Items"
                    : "Show Items"}
                </button>
              </div>

              {/* EXPANDED ITEMS SECTION */}
              {expandedOrder === order.order_id && (
                <div className="mt-6 border-t border-slate-700 pt-6">
                  <h4 className="mb-4 font-semibold text-white">
                    Items in this order ({order.items_count})
                  </h4>

                  <div className="space-y-4">
                    {order.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex gap-4 rounded-lg border border-slate-700 bg-slate-800/50 p-4"
                      >
                        {/* PRODUCT IMAGE */}
                        <img
                          src={`${import.meta.env.VITE_API_URL}${item.product_image}`}
                          alt={item.product_title}
                          className="h-20 w-20 rounded-lg object-cover"
                        />

                        {/* PRODUCT DETAILS */}
                        <div className="flex-1">
                          <h5 className="font-semibold text-white">
                            {item.product_title}
                          </h5>

                          <div className="mt-2 space-y-1 text-sm text-slate-400">
                            <p>
                              <span className="font-medium text-slate-300">
                                Quantity:
                              </span>{" "}
                              {item.quantity}
                            </p>

                            <p>
                              <span className="font-medium text-slate-300">
                                Price per unit:
                              </span>{" "}
                              ₹{item.price}
                            </p>

                            <p>
                              <span className="font-medium text-slate-300">
                                Item Total:
                              </span>{" "}
                              ₹{item.item_total}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* SUMMARY */}
                  <div className="mt-4 rounded-lg bg-slate-800 p-4">
                    <div className="flex justify-between text-sm text-slate-300">
                      <span>Order Total:</span>
                      <span className="font-semibold text-white">
                        ₹{order.order_total}
                      </span>
                    </div>

                    <div className="mt-2 flex justify-between text-sm text-slate-300">
                      <span>Your earnings:</span>
                      <span className="font-semibold text-green-400">
                        ₹{getSellerEarnings(order)}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-4 text-sm text-slate-300">
                <p>
                  <span className="font-medium text-white">
                    Delivery Agent:
                  </span>{" "}
                  {order.delivery_agent_name || "Not assigned yet"}
                </p>
              </div>

              <div className="mt-6 flex flex-col gap-3 border-t border-slate-700 pt-6 sm:flex-row sm:items-center">
                {order.status === "pending" && (
                  <>
                    <button
                      onClick={() =>
                        handleStatusUpdate(order.order_id, "accepted")
                      }
                      className="rounded-lg bg-green-500 px-4 py-2 font-medium text-white transition hover:bg-green-600"
                    >
                      Accept Order
                    </button>

                    <button
                      onClick={() =>
                        handleStatusUpdate(order.order_id, "cancelled")
                      }
                      className="rounded-lg bg-red-500 px-4 py-2 font-medium text-white transition hover:bg-red-600"
                    >
                      Reject
                    </button>
                  </>
                )}

                {order.status === "accepted" && (
                  <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0 flex-1">
                      <label className="mb-2 block text-sm font-medium text-slate-300">
                        Assign Delivery Agent before shipping
                      </label>
                      <select
                        value={selectedAgent[order.order_id] || ""}
                        onChange={(e) =>
                          setSelectedAgent({
                            ...selectedAgent,
                            [order.order_id]: Number(e.target.value),
                          })
                        }
                        className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white transition outline-none focus:border-blue-500"
                      >
                        <option value="">Select delivery agent</option>
                        {deliveryAgents.map((agent) => (
                          <option key={agent.id} value={agent.id}>
                            {agent.username}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <button
                        onClick={() => handleAssignAndShip(order.order_id)}
                        className="rounded-lg bg-blue-500 px-4 py-2 font-medium text-white transition hover:bg-blue-600"
                      >
                        Assign & Ship
                      </button>

                      <button
                        onClick={() =>
                          handleStatusUpdate(order.order_id, "cancelled")
                        }
                        className="rounded-lg bg-red-500 px-4 py-2 font-medium text-white transition hover:bg-red-600"
                      >
                        Cancel Order
                      </button>
                    </div>
                  </div>
                )}

                {order.status === "shipped" && (
                  <button
                    onClick={() =>
                      handleStatusUpdate(order.order_id, "delivered")
                    }
                    className="rounded-lg bg-purple-500 px-4 py-2 font-medium text-white transition hover:bg-purple-600"
                  >
                    Mark as Delivered
                  </button>
                )}

                {order.status === "delivered" && (
                  <span className="rounded-lg bg-purple-500/20 px-4 py-2 font-medium text-purple-400">
                    ✓ Delivered
                  </span>
                )}

                {order.status === "cancelled" && (
                  <span className="rounded-lg bg-red-500/20 px-4 py-2 font-medium text-red-400">
                    ✗ Cancelled
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
