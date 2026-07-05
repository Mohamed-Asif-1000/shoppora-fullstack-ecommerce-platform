import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { LogOut, Heart, User, MapPin, Settings, Package } from "lucide-react";
import {
  getOrders,
  getWishlist,
  addCart,
  getProfile,
  updateProfile,
  getAddresses,
  addAddress,
  removeAddress,
} from "../../services/api";
import type { Order, Wishlist, Address } from "../../types";

export default function CustomerDashboard(): React.JSX.Element {
  const [searchParams] = useSearchParams();

  const initialTab =
    (searchParams.get("tab") as
      | "orders"
      | "wishlist"
      | "profile"
      | "addresses") || "orders";

  const [activeTab, setActiveTab] = useState<
    "orders" | "wishlist" | "profile" | "addresses"
  >(initialTab);
  const navigate = useNavigate();

  const userEmail = localStorage.getItem("userEmail") || "user@example.com";

  const [orders, setOrders] = useState<Order[]>([]);

  const [wishlist, setWishlist] = useState<Wishlist[]>([]);

  const [profile, setProfile] = useState({
    username: "",
    email: "",
    phone: "",
  });
  const [addresses, setAddresses] = useState<Address[]>([]);

  const [newAddress, setNewAddress] = useState("");

  const [addressType, setAddressType] = useState("Home");

  const handleLogout = () => {
    localStorage.removeItem("userType");

    localStorage.removeItem("userEmail");

    localStorage.removeItem("userId");

    navigate("/login");
  };

  const loadOrders = async () => {
    const userId = localStorage.getItem("userId");

    if (!userId) return;

    try {
      const data = await getOrders(Number(userId));

      setOrders(data || []);
    } catch (err) {
      console.log(err);
    }
  };

  const loadWishlist = async () => {
    const userId = localStorage.getItem("userId");

    if (!userId) return;

    try {
      const data = await getWishlist(Number(userId));

      setWishlist(data || []);
    } catch (err) {
      console.log(err);
    }
  };

  const loadProfile = async () => {
    const userId = localStorage.getItem("userId");

    if (!userId) return;

    try {
      const profileData = await getProfile(Number(userId));

      setProfile({
        username: profileData.username || "",

        email: profileData.email || "",

        phone: profileData.phone || "",
      });
    } catch (err) {
      console.log(err);
    }
  };

  const moveToCart = async (productId: number) => {
    const userId = localStorage.getItem("userId");

    if (!userId) return;

    try {
      await addCart(Number(userId), productId);

      window.dispatchEvent(new Event("cartUpdated"));

      navigate("/cart");
    } catch (err) {
      console.log(err);

      alert("Failed to add to cart");
    }
  };

  const saveProfile = async () => {
    const userId = localStorage.getItem("userId");

    if (!userId) return;

    try {
      await updateProfile({
        user: Number(userId),

        username: profile.username,

        email: profile.email,

        phone: profile.phone,
      });

      localStorage.setItem("userEmail", profile.email);

      alert("Profile updated");
    } catch (err) {
      console.log(err);

      alert("Failed to update profile");
    }
  };

  const loadAddresses = async () => {
    const userId = localStorage.getItem("userId");

    if (!userId) return;

    try {
      const data = await getAddresses(Number(userId));

      setAddresses(data);
    } catch (err) {
      console.log(err);
    }
  };
  const saveAddress = async () => {
    if (!newAddress.trim()) {
      alert("Enter address");

      return;
    }

    const userId = localStorage.getItem("userId");

    if (!userId) return;

    try {
      await addAddress({
        user: Number(userId),

        type: addressType,

        address: newAddress,

        default: false,
      });

      setNewAddress("");

      await loadAddresses();

      alert("Address added");
    } catch (err) {
      console.log(err);

      alert("Failed to save address");
    }
  };

  const deleteUserAddress = async (id: number) => {
    try {
      await removeAddress(id);

      await loadAddresses();
    } catch (err) {
      console.log(err);

      alert("Failed to remove");
    }
  };
  useEffect(() => {
    const loadData = async () => {
      await loadOrders();

      await loadWishlist();

      await loadProfile();

      await loadAddresses();
    };

    loadData();
  }, []);

  return (
    <div className="min-h-screen bg-linear-to-r from-violet-950 via-purple-950 to-indigo-950">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-slate-700 bg-slate-800/50">
        <div className="container mx-auto flex h-16 items-center justify-between gap-3 px-3 sm:px-6">
          <div className="min-w-0 truncate text-xl font-bold text-pink-400 sm:text-2xl">
            Shoppora
          </div>
          <button
            onClick={handleLogout}
            className="flex shrink-0 items-center gap-2 rounded-lg bg-red-500/20 px-3 py-2 text-red-400 transition hover:bg-red-500/30 sm:px-4"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      <div className="container mx-auto px-3 py-4 sm:px-6 sm:py-8">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-4 lg:gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="rounded-xl border border-slate-700 bg-slate-800/50 p-3 lg:sticky lg:top-20 lg:p-6">
              <div className="mb-6 hidden text-center lg:block">
                <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-linear-to-br from-pink-500 to-pink-600">
                  <User className="h-8 w-8 text-white" />
                </div>
                <p className="font-semibold text-white">Customer Account</p>
                <p className="text-sm text-slate-400">{userEmail}</p>
              </div>

              <nav className="flex gap-2 overflow-x-auto lg:block lg:space-y-2 lg:overflow-visible">
                <button
                  onClick={() => setActiveTab("orders")}
                  className={`flex shrink-0 items-center gap-3 rounded-lg px-4 py-3 transition lg:w-full ${
                    activeTab === "orders"
                      ? "border border-pink-500/50 bg-pink-500/20 text-pink-400"
                      : "text-slate-400 hover:bg-slate-700/50 hover:text-white"
                  }`}
                >
                  <Package className="h-5 w-5" />
                  My Orders
                </button>
                <button
                  onClick={() => setActiveTab("wishlist")}
                  className={`flex shrink-0 items-center gap-3 rounded-lg px-4 py-3 transition lg:w-full ${
                    activeTab === "wishlist"
                      ? "border border-pink-500/50 bg-pink-500/20 text-pink-400"
                      : "text-slate-400 hover:bg-slate-700/50 hover:text-white"
                  }`}
                >
                  <Heart className="h-5 w-5" />
                  Wishlist
                </button>
                <button
                  onClick={() => setActiveTab("addresses")}
                  className={`flex shrink-0 items-center gap-3 rounded-lg px-4 py-3 transition lg:w-full ${
                    activeTab === "addresses"
                      ? "border border-pink-500/50 bg-pink-500/20 text-pink-400"
                      : "text-slate-400 hover:bg-slate-700/50 hover:text-white"
                  }`}
                >
                  <MapPin className="h-5 w-5" />
                  Addresses
                </button>
                <button
                  onClick={() => setActiveTab("profile")}
                  className={`flex shrink-0 items-center gap-3 rounded-lg px-4 py-3 transition lg:w-full ${
                    activeTab === "profile"
                      ? "border border-pink-500/50 bg-pink-500/20 text-pink-400"
                      : "text-slate-400 hover:bg-slate-700/50 hover:text-white"
                  }`}
                >
                  <Settings className="h-5 w-5" />
                  Profile Settings
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === "orders" && (
              <div className="rounded-xl border border-slate-700 bg-slate-800/50 p-6">
                <h2 className="mb-6 text-2xl font-bold text-white">
                  My Orders
                </h2>

                {orders.length === 0 ? (
                  <p className="text-slate-400">No orders yet</p>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order: Order) => (
                      <div
                        key={order.id}
                        className="rounded-lg border border-slate-600 bg-slate-700/30 p-4"
                      >
                        <div className="mb-5 flex justify-between">
                          <div>
                            <p className="font-semibold text-white">
                              Order #{order.id}
                            </p>

                            <p className="text-slate-400">
                              Total ₹ {order.total}
                            </p>
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
                          {order.items?.map(
                            (
                              item: {
                                image: string;
                                title: string;
                                quantity: number;
                                price: number;
                              },
                              index: number,
                            ) => (
                              <div
                                key={index}
                                className="flex items-center gap-4"
                              >
                                <img
                                  src={`${import.meta.env.VITE_API_URL}${item.image}`}
                                  className="h-20 w-20 rounded object-cover"
                                />

                                <div>
                                  <p className="font-semibold text-white">
                                    {item.title}
                                  </p>

                                  <p className="text-slate-400">
                                    Qty: {item.quantity}
                                  </p>

                                  <p className="text-pink-400">
                                    ₹ {item.price}
                                  </p>
                                </div>
                              </div>
                            ),
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "wishlist" && (
              <div className="rounded-xl border border-slate-700 bg-slate-800/50 p-6">
                <h2 className="mb-6 text-2xl font-bold text-white">
                  My Wishlist
                </h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {wishlist.length === 0 ? (
                    <p className="text-slate-400">No wishlist items</p>
                  ) : (
                    wishlist.map((item: Wishlist) => (
                      <div
                        key={item.id}
                        className="overflow-hidden rounded-lg border border-slate-600 bg-slate-700/30"
                      >
                        <img
                          src={`${import.meta.env.VITE_API_URL}${item.product.image}`}
                          className="h-40 w-full object-cover"
                        />

                        <div className="p-4">
                          <p className="font-semibold text-white">
                            {item.product.title}
                          </p>

                          <p className="mt-2 font-bold text-pink-400">
                            ₹ {item.product.price}
                          </p>

                          <button
                            onClick={() => moveToCart(item.product.id)}
                            className="mt-3 w-full rounded-lg bg-pink-500 py-2 text-white hover:bg-pink-600"
                          >
                            Add To Cart
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {activeTab === "addresses" && (
              <div className="rounded-xl border border-slate-700 bg-slate-800/50 p-6">
                <h2 className="mb-6 text-2xl font-bold text-white">
                  Saved Addresses
                </h2>

                <div className="mb-6 space-y-4">
                  {addresses.length === 0 ? (
                    <p className="text-slate-400">No addresses added</p>
                  ) : (
                    addresses.map((addr: Address) => (
                      <div
                        key={addr.id}
                        className="rounded-lg border border-slate-600 bg-slate-700/30 p-4"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-semibold text-white">
                                {addr.type}
                              </p>

                              {addr.default && (
                                <span className="rounded bg-pink-500 px-2 py-1 text-xs">
                                  Default
                                </span>
                              )}
                            </div>

                            <p className="mt-2 text-slate-400">
                              {addr.address}
                            </p>
                          </div>

                          <button
                            onClick={() => deleteUserAddress(addr.id)}
                            className="rounded bg-red-500 px-3 py-1 text-sm text-white hover:bg-red-600"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                <select
                  value={addressType}
                  onChange={(e) => setAddressType(e.target.value)}
                  className="mb-4 w-full rounded-lg bg-slate-700 px-4 py-2 text-white"
                >
                  <option value="Home">Home</option>

                  <option value="Work">Work</option>

                  <option value="Office">Office</option>

                  <option value="Other">Other</option>
                </select>
                <input
                  type="text"
                  value={newAddress}
                  onChange={(e) => setNewAddress(e.target.value)}
                  placeholder="Enter address"
                  className="mb-4 w-full rounded-lg bg-slate-700 px-4 py-2 text-white"
                />

                <button
                  onClick={saveAddress}
                  className="w-full rounded-lg bg-pink-500 py-2 text-white hover:bg-pink-600"
                >
                  + Add Address
                </button>
              </div>
            )}
            {activeTab === "profile" && (
              <div className="rounded-xl border border-slate-700 bg-slate-800/50 p-6">
                <h2 className="mb-6 text-2xl font-bold text-white">
                  Profile Settings
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="mb-2 block text-sm text-slate-400">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={profile.username}
                      onChange={(e) =>
                        setProfile({ ...profile, username: e.target.value })
                      }
                      className="w-full rounded-lg border border-slate-600 bg-slate-700/50 px-4 py-2 text-white focus:ring-2 focus:ring-pink-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm text-slate-400">
                      Email
                    </label>
                    <input
                      type="email"
                      value={profile.email}
                      onChange={(e) =>
                        setProfile({ ...profile, email: e.target.value })
                      }
                      className="w-full rounded-lg border border-slate-600 bg-slate-700/50 px-4 py-2 text-white focus:ring-2 focus:ring-pink-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm text-slate-400">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={profile.phone}
                      onChange={(e) =>
                        setProfile({ ...profile, phone: e.target.value })
                      }
                      className="w-full rounded-lg border border-slate-600 bg-slate-700/50 px-4 py-2 text-white focus:ring-2 focus:ring-pink-500 focus:outline-none"
                    />
                  </div>
                  <button
                    onClick={saveProfile}
                    className="w-full rounded-lg bg-pink-500 py-2 font-semibold text-white transition hover:bg-pink-600"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
