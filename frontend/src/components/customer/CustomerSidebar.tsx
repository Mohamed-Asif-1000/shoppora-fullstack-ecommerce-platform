type CustomerTab = "orders" | "wishlist" | "addresses" | "profile";

type Props = {
  activeTab: CustomerTab;
  setActiveTab: (tab: CustomerTab) => void;
  userEmail: string;
};

export default function CustomerSidebar({
  activeTab,
  setActiveTab,
  userEmail,
}: Props): React.JSX.Element {
  return (
    <div className="sticky top-20 rounded-xl border border-slate-700 bg-slate-800/50 p-6">
      <div className="mb-6 text-center">
        <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-linear-to-br from-pink-500 to-pink-600">
          <span className="text-2xl font-bold text-white">C</span>
        </div>
        <p className="font-semibold text-white">Customer Account</p>
        <p className="text-sm text-slate-400">{userEmail}</p>
      </div>

      <nav className="space-y-2">
        <button
          onClick={() => setActiveTab("orders")}
          className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 transition ${
            activeTab === "orders"
              ? "border border-pink-500/50 bg-pink-500/20 text-pink-400"
              : "text-slate-400 hover:bg-slate-700/50 hover:text-white"
          }`}
        >
          My Orders
        </button>
        <button
          onClick={() => setActiveTab("wishlist")}
          className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 transition ${
            activeTab === "wishlist"
              ? "border border-pink-500/50 bg-pink-500/20 text-pink-400"
              : "text-slate-400 hover:bg-slate-700/50 hover:text-white"
          }`}
        >
          Wishlist
        </button>
        <button
          onClick={() => setActiveTab("addresses")}
          className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 transition ${
            activeTab === "addresses"
              ? "border border-pink-500/50 bg-pink-500/20 text-pink-400"
              : "text-slate-400 hover:bg-slate-700/50 hover:text-white"
          }`}
        >
          Addresses
        </button>
        <button
          onClick={() => setActiveTab("profile")}
          className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 transition ${
            activeTab === "profile"
              ? "border border-pink-500/50 bg-pink-500/20 text-pink-400"
              : "text-slate-400 hover:bg-slate-700/50 hover:text-white"
          }`}
        >
          Profile Settings
        </button>
      </nav>
    </div>
  );
}
