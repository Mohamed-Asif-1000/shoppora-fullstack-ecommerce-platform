import { LogOut } from "lucide-react";

type Props = {
  onLogout: () => void;
};

export default function CustomerHeader({ onLogout }: Props): React.JSX.Element {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-700 bg-slate-800/50">
      <div className="container mx-auto flex h-16 items-center justify-between px-6">
        <div className="text-2xl font-bold text-pink-400">Shoppora</div>
        <button
          onClick={onLogout}
          className="flex items-center gap-2 rounded-lg bg-red-500/20 px-4 py-2 text-red-400 transition hover:bg-red-500/30"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </header>
  );
}
