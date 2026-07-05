import { useEffect, useState } from "react";
import { ShoppingCart } from "lucide-react";
import { getCart, removeCart } from "../services/api";
import { useNavigate } from "react-router-dom";
import { useCallback } from "react";

export default function Cart() {
  type CartItem = {
    id: number;
    image: string;
    title: string;
    price: number;
    quantity: number;
  };
  const [cart, setCart] = useState<CartItem[]>([]);
  const navigate = useNavigate();

  const loadCart = useCallback(async () => {
    const userId = localStorage.getItem("userId");

    if (!userId) return;

    const data = await getCart(Number(userId));

    setCart(data as CartItem[]);
  }, []);

  useEffect(() => {
    const loadInitialCart = async () => {
      await loadCart();
    };

    loadInitialCart();

    const handleCartUpdate = () => {
      loadCart();
    };

    window.addEventListener("cartUpdated", handleCartUpdate);

    return () => {
      window.removeEventListener("cartUpdated", handleCartUpdate);
    };
  }, [loadCart]);

  // REMOVE ITEM FUNCTION
  const removeItem = async (id: number) => {
    await removeCart(id);
    await loadCart();

    window.dispatchEvent(new Event("cartUpdated"));
  };

  // SUBTOTAL CALCULATION
  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  return (
    <div className="min-h-screen bg-linear-to-r from-violet-950 via-purple-950 to-indigo-950">
      <div className="mx-auto max-w-5xl p-6">
        <h1 className="flex items-center gap-3 text-2xl font-bold text-white">
          <ShoppingCart />
          Cart
        </h1>

        {cart.length === 0 ? (
          <p className="mt-10 text-slate-400">Your cart is empty.</p>
        ) : (
          <>
            <div className="mt-6 grid gap-4">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 rounded-xl border border-slate-700 bg-slate-800 p-4"
                >
                  <img
                    src={`${import.meta.env.VITE_API_URL}${item.image}`}
                    className="h-24 w-24 rounded-md object-cover"
                  />

                  <div className="flex-1">
                    <h3 className="font-semibold text-white">{item.title}</h3>

                    <p className="text-slate-400">
                      ₹ {item.price} × {item.quantity}
                    </p>
                  </div>

                  <div>
                    <p className="text-white">₹ {item.price * item.quantity}</p>

                    <button
                      onClick={() => removeItem(item.id)}
                      className="mt-2 text-pink-400"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-xl border border-slate-700 bg-slate-900 p-6">
              <p className="text-slate-400">Subtotal</p>

              <p className="mt-2 text-3xl font-bold text-white">₹ {subtotal}</p>

              <button
                onClick={() => {
                  localStorage.setItem("checkoutTotal", String(subtotal));

                  navigate("/checkout");
                }}
                className="mt-6 w-full rounded-xl bg-pink-500 py-3 font-semibold text-white transition hover:bg-pink-600"
              >
                Proceed to Checkout
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
