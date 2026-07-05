type DeliveryTab = "active" | "completed" | "route" | "profile";

type Props = {
  activeTab: DeliveryTab;
  setActiveTab: (tab: DeliveryTab) => void;
};

export default function DeliverySidebar({
  activeTab,
  setActiveTab,
}: Props): React.JSX.Element {
  return (
    <div className="rounded-xl border border-slate-700 bg-slate-800/50 p-3 lg:sticky lg:top-20 lg:p-6">
      <nav className="flex gap-2 overflow-x-auto lg:block lg:space-y-2 lg:overflow-visible">
        <button
          onClick={() => setActiveTab("active")}
          className={`flex shrink-0 items-center gap-3 rounded-lg px-4 py-3 transition lg:w-full ${
            activeTab === "active"
              ? "border border-pink-500/50 bg-pink-500/20 text-pink-400"
              : "text-slate-400 hover:bg-slate-700/50 hover:text-white"
          }`}
        >
          Active Deliveries
        </button>
        <button
          onClick={() => setActiveTab("completed")}
          className={`flex shrink-0 items-center gap-3 rounded-lg px-4 py-3 transition lg:w-full ${
            activeTab === "completed"
              ? "border border-pink-500/50 bg-pink-500/20 text-pink-400"
              : "text-slate-400 hover:bg-slate-700/50 hover:text-white"
          }`}
        >
          Completed
        </button>
        <button
          onClick={() => setActiveTab("route")}
          className={`flex shrink-0 items-center gap-3 rounded-lg px-4 py-3 transition lg:w-full ${
            activeTab === "route"
              ? "border border-pink-500/50 bg-pink-500/20 text-pink-400"
              : "text-slate-400 hover:bg-slate-700/50 hover:text-white"
          }`}
        >
          Route Map
        </button>
        <button
          onClick={() => setActiveTab("profile")}
          className={`flex shrink-0 items-center gap-3 rounded-lg px-4 py-3 transition lg:w-full ${
            activeTab === "profile"
              ? "border border-pink-500/50 bg-pink-500/20 text-pink-400"
              : "text-slate-400 hover:bg-slate-700/50 hover:text-white"
          }`}
        >
          Profile
        </button>
      </nav>
    </div>
  );
}
