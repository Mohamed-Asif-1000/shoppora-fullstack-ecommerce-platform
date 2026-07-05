import type { Address } from "../../types";

type Props = {
  addresses: Address[];
  addressType: string;
  newAddress: string;
  setAddressType: (value: string) => void;
  setNewAddress: (value: string) => void;
  saveAddress: () => Promise<void>;
  deleteUserAddress: (id: number) => Promise<void>;
};

export default function CustomerAddresses({
  addresses,
  addressType,
  newAddress,
  setAddressType,
  setNewAddress,
  saveAddress,
  deleteUserAddress,
}: Props): React.JSX.Element {
  return (
    <div className="rounded-xl border border-slate-700 bg-slate-800/50 p-6">
      <h2 className="mb-6 text-2xl font-bold text-white">Saved Addresses</h2>

      <div className="mb-6 space-y-4">
        {addresses.length === 0 ? (
          <p className="text-slate-400">No addresses added</p>
        ) : (
          addresses.map((addr) => (
            <div
              key={addr.id}
              className="rounded-lg border border-slate-600 bg-slate-700/30 p-4"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-white">{addr.type}</p>
                    {addr.default && (
                      <span className="rounded bg-pink-500 px-2 py-1 text-xs">
                        Default
                      </span>
                    )}
                  </div>
                  <p className="mt-2 text-slate-400">{addr.address}</p>
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
  );
}
