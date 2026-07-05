import type { ProductType } from "./adminTypes";

type Props = {
  products: ProductType[];
  formatCurrency: (value: number) => string;
};

export default function ProductsTab({
  products,
  formatCurrency,
}: Props): React.JSX.Element {
  return (
    <div className="rounded-xl border border-slate-700 bg-slate-800/50 p-4 sm:p-6">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div className="min-w-0">
          <h2 className="text-2xl font-bold text-white">Product Library</h2>
          <p className="text-slate-400">
            Review product listings across the marketplace.
          </p>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b border-slate-600 text-slate-400">
            <tr>
              <th className="px-4 py-3 text-left font-semibold">Product</th>
              <th className="px-4 py-3 text-left font-semibold">Price</th>
              <th className="px-4 py-3 text-left font-semibold">Category</th>
              <th className="px-4 py-3 text-left font-semibold">Stock</th>
              <th className="px-4 py-3 text-left font-semibold">Seller</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr
                key={product.id}
                className="border-b border-slate-700 hover:bg-slate-700/30"
              >
                <td className="px-4 py-3 text-white">{product.title}</td>
                <td className="px-4 py-3 text-slate-300">
                  {formatCurrency(product.price)}
                </td>
                <td className="px-4 py-3 text-slate-300">{product.category}</td>
                <td className="px-4 py-3 text-slate-300">{product.stock}</td>
                <td className="px-4 py-3 text-slate-300">
                  #{String(product.seller).padStart(3, "0")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {products.length === 0 && (
        <p className="mt-6 text-center text-slate-400">
          No products have been added yet.
        </p>
      )}
    </div>
  );
}
