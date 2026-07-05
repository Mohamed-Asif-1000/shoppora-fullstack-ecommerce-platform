import type { ProductType, User } from "./adminTypes";

type Props = {
  sellers: User[];
  products: ProductType[];
};

export default function SellersTab({
  sellers,
  products,
}: Props): React.JSX.Element {
  return (
    <div className="rounded-xl border border-slate-700 bg-slate-800/50 p-4 sm:p-6">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div className="min-w-0">
          <h2 className="text-2xl font-bold text-white">Seller Management</h2>
          <p className="text-slate-400">
            Monitor seller stores, listings, and product counts.
          </p>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b border-slate-600 text-slate-400">
            <tr>
              <th className="px-4 py-3 text-left font-semibold">Seller</th>
              <th className="px-4 py-3 text-left font-semibold">Email</th>
              <th className="px-4 py-3 text-left font-semibold">Products</th>
              <th className="px-4 py-3 text-left font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            {sellers.map((seller) => {
              const sellerProducts = products.filter(
                (product) => product.seller === seller.id,
              );
              return (
                <tr
                  key={seller.id}
                  className="border-b border-slate-700 hover:bg-slate-700/30"
                >
                  <td className="px-4 py-3 text-white">{seller.username}</td>
                  <td className="px-4 py-3 text-slate-400">{seller.email}</td>
                  <td className="px-4 py-3 text-slate-300">
                    {sellerProducts.length}
                  </td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-blue-500/20 px-3 py-1 text-xs text-blue-200">
                      active
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {sellers.length === 0 && (
        <p className="mt-6 text-center text-slate-400">
          No seller accounts available yet.
        </p>
      )}
    </div>
  );
}
