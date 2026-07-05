import { LogOut } from "lucide-react";
import type { AdminTab } from "./adminTypes";

type Props = {
  activeTab: AdminTab;
  setActiveTab: (tab: AdminTab) => void;
  onLogout: () => void;
};

const tabs: AdminTab[] = [
  "dashboard",
  "users",
  "sellers",
  "orders",
  "delivery",
  "products",
  "settings",
];

export default function AdminHeader({
  activeTab,
  setActiveTab,
  onLogout,
}: Props): React.JSX.Element {
  return (
    <div className="border-b border-slate-700 bg-slate-800/50">
      <div className="flex flex-col gap-4 px-3 py-4 sm:px-6 md:flex-row md:items-center md:justify-between">
        <div className="min-w-0">
          <h1 className="text-xl font-bold text-white sm:text-2xl">
            Admin Dashboard
          </h1>
          <p className="text-sm text-slate-400 md:max-w-none">
            Manage customers, sellers, orders, delivery and products from one
            place.
          </p>
        </div>
        <button
          onClick={onLogout}
          className="inline-flex items-center gap-2 rounded-lg bg-red-500/20 px-4 py-2 text-sm font-semibold text-red-400 transition hover:bg-red-500/30"
        >
          <LogOut className="h-4 w-4" /> Logout
        </button>
      </div>

      <div className="flex gap-1 overflow-x-auto border-t border-slate-700 px-3 sm:px-6">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`shrink-0 px-4 py-3 text-sm font-semibold transition ${
              activeTab === tab
                ? "border-b-2 border-pink-500 text-pink-400"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>
    </div>
  );
}
