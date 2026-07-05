import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getUsers,
  getAllOrders,
  getProducts,
  getDeliveryAgents,
  assignDeliveryAgent,
  updateOrderStatus,
  addUser,
  updateUser,
  deleteUser,
  addDeliveryAgent,
  updateDeliveryAgent,
  deleteDeliveryAgent,
} from "../services/api";
import type { User } from "../types";
import type {
  AdminOrder,
  AdminTab,
  DeliveryAgent,
  DeliveryAgentFormData,
  ProductType,
  UserFormData,
} from "../components/admin/adminTypes";
import AdminHeader from "../components/admin/AdminHeader";
import DashboardTab from "../components/admin/DashboardTab";
import UsersTab from "../components/admin/UsersTab";
import SellersTab from "../components/admin/SellersTab";
import OrdersTab from "../components/admin/OrdersTab";
import DeliveryTab from "../components/admin/DeliveryTab";
import ProductsTab from "../components/admin/ProductsTab";
import AdminSettings from "../components/admin/AdminSettings";

export default function AdminDashboard(): React.JSX.Element {
  const [activeTab, setActiveTab] = useState<AdminTab>("dashboard");
  const [users, setUsers] = useState<User[]>([]);
  const [products, setProducts] = useState<ProductType[]>([]);
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [deliveryAgents, setDeliveryAgents] = useState<DeliveryAgent[]>([]);
  const [userRoleFilter, setUserRoleFilter] = useState<
    "all" | "customer" | "seller" | "delivery"
  >("all");
  const [showUserForm, setShowUserForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [userForm, setUserForm] = useState<UserFormData>({
    username: "",
    email: "",
    role: "customer",
    phone: "",
    password: "",
    approval_status: "approved",
  });
  const [selectedAgent, setSelectedAgent] = useState<Record<number, number>>(
    {},
  );
  const [showAgentForm, setShowAgentForm] = useState(false);
  const [editingAgent, setEditingAgent] = useState<DeliveryAgent | null>(null);
  const [agentForm, setAgentForm] = useState<DeliveryAgentFormData>({
    username: "",
    email: "",
    phone: "",
    password: "",
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("userType");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userId");
    localStorage.removeItem("token");
    localStorage.removeItem("refresh");
    navigate("/login");
  };

  const loadUsers = async () => {
    try {
      const data = await getUsers();
      setUsers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to load users:", error);
    }
  };

  const loadProducts = async () => {
    try {
      const data = await getProducts();
      setProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to load products:", error);
    }
  };

  const loadOrders = async () => {
    try {
      const data = await getAllOrders();
      setOrders(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to load orders:", error);
    }
  };

  const loadDeliveryAgents = async () => {
    try {
      const data = await getDeliveryAgents();
      setDeliveryAgents(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to load delivery agents:", error);
    }
  };

  const handleOpenUserForm = (user?: User) => {
    if (user) {
      setEditingUser(user);
      const roleValue = ["customer", "seller", "delivery", "admin"].includes(
        user.role,
      )
        ? (user.role as UserFormData["role"])
        : "customer";
      setUserForm({
        username: user.username,
        email: user.email,
        role: roleValue,
        phone: user.phone || "",
        password: "",
        approval_status:
          (user.approval_status as UserFormData["approval_status"]) ||
          "approved",
      });
    } else {
      setEditingUser(null);
      setUserForm({
        username: "",
        email: "",
        role: "customer",
        phone: "",
        password: "",
        approval_status: "approved",
      });
    }
    setShowUserForm(true);
  };

  const handleSaveUser = async () => {
    try {
      if (editingUser) {
        await updateUser(editingUser.id, userForm);
        alert("User updated");
      } else {
        await addUser(userForm);
        alert("User created");
      }
      setShowUserForm(false);
      await loadUsers();
    } catch (err) {
      console.error(err);
      alert("Failed to save user");
    }
  };

  const handleDeleteUser = async (id?: number) => {
    if (!id) return;
    if (!confirm("Delete this user?")) return;
    try {
      await deleteUser(id);
      await loadUsers();
      alert("User deleted");
    } catch (err) {
      console.error(err);
      alert("Failed to delete user");
    }
  };

  const handleOpenAgentForm = (agent?: DeliveryAgent) => {
    if (agent) {
      setEditingAgent(agent);
      setAgentForm({
        username: agent.username,
        email: agent.email,
        phone: agent.phone || "",
        password: "",
      });
    } else {
      setEditingAgent(null);
      setAgentForm({ username: "", email: "", phone: "", password: "" });
    }
    setShowAgentForm(true);
  };

  const handleSaveAgent = async () => {
    try {
      if (editingAgent) {
        await updateDeliveryAgent(editingAgent.id, agentForm);
        alert("Agent updated");
      } else {
        await addDeliveryAgent(agentForm);
        alert("Agent created");
      }
      setShowAgentForm(false);
      await loadDeliveryAgents();
      await loadUsers();
    } catch (err) {
      console.error(err);
      alert("Failed to save agent");
    }
  };

  const handleDeleteAgent = async (id?: number) => {
    if (!id) return;
    if (!confirm("Delete this delivery agent?")) return;
    try {
      await deleteDeliveryAgent(id);
      await loadDeliveryAgents();
      await loadUsers();
      alert("Agent deleted");
    } catch (err) {
      console.error(err);
      alert("Failed to delete agent");
    }
  };

  const handleCancelUserForm = () => {
    setShowUserForm(false);
    setEditingUser(null);
    setUserForm({
      username: "",
      email: "",
      role: "customer",
      phone: "",
      password: "",
      approval_status: "approved",
    });
  };

  const handleCancelAgentForm = () => {
    setShowAgentForm(false);
    setEditingAgent(null);
    setAgentForm({ username: "", email: "", phone: "", password: "" });
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([
        loadUsers(),
        loadProducts(),
        loadOrders(),
        loadDeliveryAgents(),
      ]);
      setLoading(false);
    };
    loadData();
  }, []);

  const filteredUsers =
    userRoleFilter === "all"
      ? users
      : users.filter((user) => user.role === userRoleFilter);

  const sellers = users.filter((user) => user.role === "seller");
  const orderAgentCounts = orders.reduce<Record<number, number>>(
    (acc, order) => {
      if (order.delivery_agent_id) {
        acc[order.delivery_agent_id] = (acc[order.delivery_agent_id] || 0) + 1;
      }
      return acc;
    },
    {},
  );

  const handleAssignAgent = async (orderId: number) => {
    const agentId = selectedAgent[orderId];
    if (!agentId) {
      alert("Select a delivery agent first");
      return;
    }

    try {
      await assignDeliveryAgent(orderId, agentId);
      await loadOrders();
      alert("Delivery agent assigned successfully");
    } catch (error) {
      console.error(error);
      alert("Failed to assign delivery agent");
    }
  };

  const handleStatusUpdate = async (orderId: number, status: string) => {
    try {
      await updateOrderStatus(orderId, status);
      await loadOrders();
      alert("Order status updated");
    } catch (error) {
      console.error(error);
      alert("Failed to update order status");
    }
  };

  const formatCurrency = (value: number) => `₹${value.toFixed(2)}`;

  return (
    <div className="min-h-screen bg-linear-to-r from-violet-950 via-purple-950 to-indigo-950 text-slate-100">
      <AdminHeader
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={handleLogout}
      />

      <div className="p-3 sm:p-6">
        {loading ? (
          <div className="rounded-xl border border-slate-700 bg-slate-800/50 p-8 text-center text-slate-400">
            Loading admin data…
          </div>
        ) : (
          <>
            {activeTab === "dashboard" && (
              <DashboardTab
                orders={orders}
                products={products}
                users={users}
                deliveryAgentsCount={deliveryAgents.length}
              />
            )}

            {activeTab === "users" && (
              <UsersTab
                filteredUsers={filteredUsers}
                userRoleFilter={userRoleFilter}
                userForm={userForm}
                showUserForm={showUserForm}
                onChangeUserForm={setUserForm}
                onOpenUserForm={handleOpenUserForm}
                onCancelUserForm={handleCancelUserForm}
                onSaveUser={handleSaveUser}
                onDeleteUser={handleDeleteUser}
                setUserRoleFilter={setUserRoleFilter}
              />
            )}

            {activeTab === "sellers" && (
              <SellersTab sellers={sellers} products={products} />
            )}

            {activeTab === "orders" && (
              <OrdersTab
                orders={orders}
                deliveryAgents={deliveryAgents}
                selectedAgent={selectedAgent}
                setSelectedAgent={setSelectedAgent}
                onAssignAgent={handleAssignAgent}
                onStatusUpdate={handleStatusUpdate}
                formatCurrency={formatCurrency}
              />
            )}

            {activeTab === "delivery" && (
              <DeliveryTab
                deliveryAgents={deliveryAgents}
                orderAgentCounts={orderAgentCounts}
                showAgentForm={showAgentForm}
                agentForm={agentForm}
                onOpenAgentForm={handleOpenAgentForm}
                onCancelAgentForm={handleCancelAgentForm}
                onChangeAgentForm={setAgentForm}
                onSaveAgent={handleSaveAgent}
                onDeleteAgent={handleDeleteAgent}
              />
            )}

            {activeTab === "products" && (
              <ProductsTab
                products={products}
                formatCurrency={formatCurrency}
              />
            )}

            {activeTab === "settings" && <AdminSettings />}
          </>
        )}
      </div>
    </div>
  );
}
