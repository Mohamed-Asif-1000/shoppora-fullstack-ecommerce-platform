import { LogOut } from "lucide-react";

type Props = {
  onLogout: () => void;
  email: string;
};

export default function DeliveryHeader({
  onLogout,
  email,
}: Props): React.JSX.Element {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-700 bg-slate-800/50">
      <div className="container mx-auto flex h-16 items-center justify-between gap-3 px-3 sm:px-6">
        <div className="min-w-0">
          <h1 className="truncate text-xl font-bold text-pink-400 sm:text-2xl">
            Shoppora Delivery
          </h1>
          <p className="truncate text-sm text-slate-400">
            {email || "Loading..."}
          </p>
        </div>
        <button
          onClick={onLogout}
          className="flex shrink-0 items-center gap-2 rounded-lg bg-red-500/20 px-3 py-2 text-red-400 transition hover:bg-red-500/30 sm:px-4"
        >
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
}
