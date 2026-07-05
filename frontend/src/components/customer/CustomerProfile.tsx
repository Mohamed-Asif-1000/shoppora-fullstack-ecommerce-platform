type Props = {
  profile: {
    username: string;
    email: string;
    phone: string;
  };
  setProfile: (profile: {
    username: string;
    email: string;
    phone: string;
  }) => void;
  saveProfile: () => Promise<void>;
};

export default function CustomerProfile({
  profile,
  setProfile,
  saveProfile,
}: Props): React.JSX.Element {
  return (
    <div className="rounded-xl border border-slate-700 bg-slate-800/50 p-6">
      <h2 className="mb-6 text-2xl font-bold text-white">Profile Settings</h2>
      <div className="space-y-4">
        <div>
          <label className="mb-2 block text-sm text-slate-400">Full Name</label>
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
          <label className="mb-2 block text-sm text-slate-400">Email</label>
          <input
            type="email"
            value={profile.email}
            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
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
            onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
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
  );
}
