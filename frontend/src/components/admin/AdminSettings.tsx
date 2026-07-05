export default function AdminSettings(): React.JSX.Element {
  return (
    <div className="rounded-xl border border-slate-700 bg-slate-800/50 p-4 sm:p-6">
      <h2 className="mb-6 text-2xl font-bold text-white">Admin Settings</h2>
      <div className="space-y-6">
        <div>
          <label className="mb-2 block text-sm text-slate-400">
            Platform Name
          </label>
          <input
            type="text"
            defaultValue="Shoppora"
            className="w-full rounded-lg border border-slate-600 bg-slate-700/50 px-4 py-2 text-white focus:ring-2 focus:ring-pink-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm text-slate-400">
            Commission Rate (%)
          </label>
          <input
            type="number"
            defaultValue="5"
            className="w-full rounded-lg border border-slate-600 bg-slate-700/50 px-4 py-2 text-white focus:ring-2 focus:ring-pink-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="flex cursor-pointer items-center gap-3">
            <input type="checkbox" defaultChecked className="h-4 w-4" />
            <span className="text-slate-400">Maintenance Mode</span>
          </label>
        </div>
        <button className="w-full rounded-lg bg-pink-500 py-2 font-semibold text-white transition hover:bg-pink-600">
          Save Settings
        </button>
      </div>
    </div>
  );
}
