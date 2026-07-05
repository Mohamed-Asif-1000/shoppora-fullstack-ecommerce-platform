import type { Wishlist } from "../../types";

type Props = {
  wishlist: Wishlist[];
  moveToCart: (productId: number) => Promise<void>;
};

export default function CustomerWishlist({
  wishlist,
  moveToCart,
}: Props): React.JSX.Element {
  return (
    <div className="rounded-xl border border-slate-700 bg-slate-800/50 p-6">
      <h2 className="mb-6 text-2xl font-bold text-white">My Wishlist</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {wishlist.length === 0 ? (
          <p className="text-slate-400">No wishlist items</p>
        ) : (
          wishlist.map((item) => (
            <div
              key={item.id}
              className="overflow-hidden rounded-lg border border-slate-600 bg-slate-700/30"
            >
              <img
                src={`${import.meta.env.VITE_API_URL}${item.product.image}`}
                className="h-40 w-full object-cover"
              />
              <div className="p-4">
                <p className="font-semibold text-white">{item.product.title}</p>
                <p className="mt-2 font-bold text-pink-400">
                  ₹ {item.product.price}
                </p>
                <button
                  onClick={() => moveToCart(item.product.id)}
                  className="mt-3 w-full rounded-lg bg-pink-500 py-2 text-white hover:bg-pink-600"
                >
                  Add To Cart
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
