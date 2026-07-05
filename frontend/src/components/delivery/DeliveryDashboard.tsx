import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getDeliveryOrders,
  updateOrderStatus,
  getDeliveryAgentProfile,
} from "../../services/api";
import DeliveryHeader from "./DeliveryHeader";
import DeliverySidebar from "./DeliverySidebar";
import DeliveryStats from "./DeliveryStats";
import DeliveryActiveTab from "./DeliveryActiveTab";
import DeliveryCompletedTab from "./DeliveryCompletedTab";

export type DeliveryOrder = {
  order_id: number;
  customer: string;
  customer_phone: string;
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
  commission_percentage: number;
  commission_amount: number;
};

type DeliveryAgentProfile = {
  id: number;
  username: string;
  email: string;
  phone: string;
  first_name: string;
  last_name: string;
};

export default function DeliveryDashboard(): React.JSX.Element {
  const [activeTab, setActiveTab] = useState<
    "active" | "completed" | "route" | "profile"
  >("active");
  const [orders, setOrders] = useState<DeliveryOrder[]>([]);
  const [agentProfile, setAgentProfile] = useState<DeliveryAgentProfile | null>(
    null,
  );
  const [expandedOrder, setExpandedOrder] = useState<number | null>(null);
  const [selectedOrderForRoute, setSelectedOrderForRoute] = useState<
    number | null
  >(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const userId = Number(localStorage.getItem("userId"));

  const handleLogout = () => {
    localStorage.removeItem("userType");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userId");
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleDeliveryStatus = async (orderId: number, status: string) => {
    try {
      await updateOrderStatus(orderId, status);
      await fetchOrdersData();
    } catch (error) {
      console.error("Failed to update delivery status:", error);
    }
  };

  const fetchOrdersData = async () => {
    if (!userId) {
      return;
    }

    try {
      const data = await getDeliveryOrders(userId);
      setOrders(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to load delivery orders:", error);
      setOrders([]);
    }
  };

  useEffect(() => {
    const fetchAgentProfileData = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        const profileData = await getDeliveryAgentProfile(userId);
        setAgentProfile(profileData);
      } catch (error) {
        console.error("Failed to load delivery agent profile:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchOrdersImmediate = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        const data = await getDeliveryOrders(userId);
        setOrders(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to load delivery orders:", error);
        setOrders([]);
      }
    };

    const fetchData = async () => {
      await Promise.all([fetchOrdersImmediate(), fetchAgentProfileData()]);
    };

    fetchData();
  }, [userId]);

  const activeOrders = orders.filter(
    (order) => order.status !== "delivered" && order.status !== "cancelled",
  );
  const completedOrders = orders.filter((order) => order.status === "delivered");
  const pendingCount = activeOrders.filter((order) => order.status === "pending").length;
  const activeCount = activeOrders.length;
  const completedCount = completedOrders.length;
  const totalEarnings = orders.reduce((sum, order) => sum + (order.seller_items_total || 0), 0);

  const stats = [
    {
      label: "Active Deliveries",
      value: String(activeCount),
      color: "from-blue-500 to-blue-600",
    },
    {
      label: "Completed",
      value: String(completedCount),
      color: "from-green-500 to-emerald-600",
    },
    {
      label: "Pending",
      value: String(pendingCount),
      color: "from-yellow-500 to-yellow-600",
    },
    {
      label: "Earnings",
      value: `₹${totalEarnings}`,
      color: "from-pink-500 to-pink-600",
    },
  ];

  return (
    <div className="min-h-screen bg-linear-to-r from-violet-950 via-purple-950 to-indigo-950">
      <DeliveryHeader onLogout={handleLogout} email={agentProfile?.email ?? ""} />

      <div className="container mx-auto px-3 py-4 sm:px-6 sm:py-8">
        <DeliveryStats stats={stats} />

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-4 lg:gap-8">
          <div className="lg:col-span-1">
            <DeliverySidebar activeTab={activeTab} setActiveTab={setActiveTab} />
          </div>

          <div className="lg:col-span-3">
            {activeTab === "active" && (
              <DeliveryActiveTab
                activeOrders={activeOrders}
                loading={loading}
                expandedOrder={expandedOrder}
                handleDeliveryStatus={handleDeliveryStatus}
                setExpandedOrder={setExpandedOrder}
              />
              )}

              {activeTab === "completed" && (
                <DeliveryCompletedTab completedOrders={completedOrders} loading={loading} />
              )}

              {activeTab === "route" && (
                <div className="rounded-xl border border-slate-700 bg-slate-800/50 p-6">
                  <h2 className="mb-6 text-2xl font-bold text-white">Delivery Route Map</h2>

                  {activeOrders.length === 0 ? (
                    <div className="flex h-96 items-center justify-center rounded-lg border border-slate-600 bg-slate-700/30 text-slate-400">
                      No active deliveries to display on map
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="mb-6 rounded-lg border border-slate-600 bg-slate-700/30 p-6">
                        <h3 className="mb-4 text-lg font-semibold text-white">Active Delivery Locations</h3>
                        <div className="space-y-3">
                          {activeOrders.map((order) => (
                            <div
                              key={order.order_id}
                              className={`cursor-pointer rounded-lg border-2 p-4 transition ${
                                selectedOrderForRoute === order.order_id
                                  ? "border-pink-500 bg-pink-500/10"
                                  : "border-slate-600 bg-slate-700/20 hover:bg-slate-700/40"
                              }`}
                              onClick={() => setSelectedOrderForRoute(selectedOrderForRoute === order.order_id ? null : order.order_id)}
                            >
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="font-semibold text-white">Order #{order.order_id}</p>
                                  <p className="text-sm text-slate-400">{order.customer}</p>
                                </div>
                                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${order.status === "shipped" ? "bg-blue-500/20 text-blue-400" : "bg-slate-600 text-slate-300"}`}>
                                  {order.status.toUpperCase()}
                                </span>
                              </div>

                              {selectedOrderForRoute === order.order_id && (
                                <div className="mt-4 space-y-2 border-t border-slate-600 pt-4">
                                  <div>
                                    <p className="text-xs text-slate-400">Address</p>
                                    <p className="text-sm text-slate-200">{order.address}</p>
                                  </div>
                                  <div>
                                    <p className="text-xs text-slate-400">Phone</p>
                                    <p className="text-sm text-slate-200">{order.customer_phone || "Not provided"}</p>
                                  </div>
                                  <div>
                                    <p className="text-xs text-slate-400">Total Amount</p>
                                    <p className="text-sm font-semibold text-white">₹{order.order_total}</p>
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="rounded-lg border border-slate-600 bg-slate-700/30 p-6">
                        <h3 className="mb-4 text-lg font-semibold text-white">Route Map</h3>
                        <div className="flex h-96 items-center justify-center rounded-lg border border-slate-600 bg-slate-700/20">
                          <p className="text-center text-slate-400">
                            Select an order from the list to see detailed delivery information.
                            <br />
                            <span className="text-xs">(Map integration with GPS coordinates coming soon)</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "profile" && (
                <div className="rounded-xl border border-slate-700 bg-slate-800/50 p-6">
                  <h2 className="mb-6 text-2xl font-bold text-white">Delivery Agent Profile</h2>

                  {loading ? (
                    <p className="text-slate-400">Loading profile...</p>
                  ) : agentProfile ? (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div>
                          <label className="mb-2 block text-sm text-slate-400">Full Name</label>
                          <input
                            type="text"
                            disabled
                            defaultValue={`${agentProfile.first_name} ${agentProfile.last_name}`.trim() || agentProfile.username}
                            className="w-full rounded-lg border border-slate-600 bg-slate-700/50 px-4 py-2 text-white opacity-75"
                          />
                        </div>
                        <div>
                          <label className="mb-2 block text-sm text-slate-400">Username</label>
                          <input type="text" disabled defaultValue={agentProfile.username} className="w-full rounded-lg border border-slate-600 bg-slate-700/50 px-4 py-2 text-white opacity-75" />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div>
                          <label className="mb-2 block text-sm text-slate-400">Email</label>
                          <input type="email" disabled defaultValue={agentProfile.email} className="w-full rounded-lg border border-slate-600 bg-slate-700/50 px-4 py-2 text-white opacity-75" />
                        </div>
                        <div>
                          <label className="mb-2 block text-sm text-slate-400">Phone Number</label>
                          <input type="tel" disabled defaultValue={agentProfile.phone || "Not provided"} className="w-full rounded-lg border border-slate-600 bg-slate-700/50 px-4 py-2 text-white opacity-75" />
                        </div>
                      </div>
                      <div className="rounded-lg bg-slate-700/30 p-4">
                        <p className="text-sm text-slate-400">Commission Rate: <span className="font-semibold text-white">5%</span></p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-slate-400">Profile information not available</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
    </div>
  );
}
