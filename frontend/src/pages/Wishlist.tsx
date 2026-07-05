import { useEffect, useState } from "react";
import { Heart, Trash2 } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { getWishlist, removeWishlist, addCart } from "../services/api";

export default function Wishlist(): React.JSX.Element {
  type WishlistItem = {
    id: number;
    product: { id: number; title: string; price: number; image: string };
  };

  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const loadWishlist = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;

    const data = await getWishlist(Number(userId));
    setWishlist(data || []);
  };

  useEffect(() => {
    const initializeWishlist = async () => {
      await loadWishlist();
    };

    initializeWishlist();

    const handler = () => {
      initializeWishlist();
    };

    window.addEventListener("wishlistUpdated", handler);

    return () => {
      window.removeEventListener("wishlistUpdated", handler);
    };
  }, []);

  return (
    <div className="min-h-screen bg-linear-to-r from-violet-950 via-purple-950 to-indigo-950 p-6">
      <h1 className="flex items-center gap-3 text-3xl text-white">
        <Heart className="text-pink-500" />
        Wishlist
      </h1>

      {wishlist.length === 0 && (
        <p className="mt-10 text-white">Wishlist is empty</p>
      )}

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        {wishlist.map((item) => (
          <div key={item.id} className=" bg-slate-900 p-4 rounded-2xl">
            <img
              src={`${import.meta.env.VITE_API_URL}${item.product.image}`}
              className="h-56 w-full object-cover"
            />

            <h3 className="mt-2 text-white">{item.product.title}</h3>
            <p className="text-pink-500">₹ {item.product.price}</p>

            <div className="mt-3 flex gap-3">
              <button
                onClick={async () => {
                  try {
                    const userId = localStorage.getItem("userId");

                    if (!userId) {
                      alert("Login first");

                      return;
                    }

                    await addCart(Number(userId), item.product.id);

                    // update frontend cart
                    addToCart({
                      id: item.product.id,
                      title: item.product.title,
                      price: item.product.price,
                      image: item.product.image,
                      qty: 1,
                    });

                    // remove from wishlist
                    await removeWishlist(item.id);

                    // refresh UI
                    window.dispatchEvent(new Event("cartUpdated"));

                    window.dispatchEvent(new Event("wishlistUpdated"));

                    // remove instantly
                    setWishlist((prev) => prev.filter((w) => w.id !== item.id));

                    navigate("/cart");
                  } catch (error) {
                    console.log(error);

                    alert("Move failed");
                  }
                }}
                className="rounded bg-pink-500 px-4 py-2"
              >
                Move to Cart
              </button>

              <button
                onClick={async () => {
                  try {
                    await removeWishlist(item.id);

                    setWishlist((prev) => prev.filter((w) => w.id !== item.id));

                    window.dispatchEvent(new Event("wishlistUpdated"));
                  } catch (err) {
                    console.log(err);
                  }
                }}
                className="flex items-center gap-1 text-red-400"
              >
                <Trash2 size={16} /> Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
