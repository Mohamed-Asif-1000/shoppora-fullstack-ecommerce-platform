import { useState, useEffect } from "react";
import { Search, Heart, ShoppingCart } from "lucide-react";
import { getProducts, addCart, addWishlist } from "../services/api";
import { motion } from "framer-motion";
import { useCart } from "../context/CartContext";
import type { SellerProduct } from "../types";

export default function ProductCart(): React.JSX.Element {
  const [products, setProducts] = useState<SellerProduct[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewAll, setViewAll] = useState<Record<string, boolean>>({});

  const { addToCart } = useCart();

  const filtered = searchQuery
    ? products.filter(
        (p) =>
          p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.category.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : products;

  const categories = Array.from(new Set(filtered.map((p) => p.category)));

  useEffect(() => {
    let isMounted = true;

    const loadProducts = async () => {
      try {
        const data = await getProducts();

        if (isMounted) {
          setProducts(Array.isArray(data) ? data : data.results || []);
        }
      } catch {
        if (isMounted) {
          setProducts([]);
        }
      }
    };

    void loadProducts();

    const handleProductsUpdated = () => {
      void loadProducts();
    };

    window.addEventListener("productsUpdated", handleProductsUpdated);

    return () => {
      isMounted = false;
      window.removeEventListener("productsUpdated", handleProductsUpdated);
    };
  }, []);
  return (
    <section className="bg-slate-900 py-16">
      <div className="container mx-auto px-6">
        {/* SEARCH */}
        <div className="relative mb-10 max-w-xl">
          <Search className="absolute top-3.5 left-4 h-5 w-5 text-slate-400" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products..."
            className="w-full rounded-lg bg-slate-700 py-3 pr-4 pl-12 text-white"
          />
        </div>

        {categories.map((category) => {
          const showAll = viewAll[category] ?? false;

          const items = filtered.filter((p) => p.category === category);
          const visible = showAll ? items : items.slice(0, 4);

          return (
            <div key={category} className="mb-14">
              <h3 className="mb-6 text-2xl font-bold text-white">
                {category} ({items.length})
              </h3>

              <div className="grid cursor-pointer grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
                {visible.map((p) => (
                  <motion.article
                    key={p.id}
                    whileHover={{
                      y: -8,
                      scale: 1.02,
                      boxShadow: "0px 10px 30px rgba(236,72,153,0.2)",
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 400,
                      damping: 10,
                    }}
                    className="overflow-hidden rounded-xl border border-slate-700 bg-slate-800"
                  >
                    {/* IMAGE */}
                    <div className="group relative h-64 overflow-hidden">
                      <img
                        src={`${import.meta.env.VITE_API_URL}${p.image}`}
                        alt={p.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110 group-hover:blur-[1px]"
                      />

                      {/* BADGE */}
                      <span
                        className={`absolute top-3 left-3 rounded-full px-3 py-1 text-xs font-bold text-white ${p.badgeColor}`}
                      >
                        {p.badge}
                      </span>

                      {/* HOVER BUTTONS */}
                      <div className="pointer-events-auto absolute inset-0 flex items-center justify-center gap-4 opacity-100 transition-all duration-300 md:pointer-events-none md:opacity-0 md:group-hover:pointer-events-auto md:group-hover:opacity-100">
                        {/* CART */}
                        <button
                          onClick={async () => {
                            const userId = localStorage.getItem("userId");

                            if (!userId) {
                              alert("Login first");
                              return;
                            }

                            await addCart(Number(userId), p.id);

                            addToCart({
                              id: p.id,
                              title: p.title,
                              price: p.price,
                              image: p.image,
                              qty: 1,
                            });

                            window.dispatchEvent(new Event("cartUpdated"));

                            alert("Added to cart");
                          }}
                          className="cursor-pointer rounded-full bg-pink-500 p-3"
                        >
                          <ShoppingCart size={18} className="text-white" />
                        </button>

                        {/* WISHLIST */}
                        <button
                          onClick={async () => {
                            const userId = localStorage.getItem("userId");

                            if (!userId) {
                              alert("Login first");
                              return;
                            }

                            try {
                              await addWishlist(p.id);

                              window.dispatchEvent(
                                new Event("wishlistUpdated"),
                              );

                              alert("Added to wishlist");
                            } catch (error) {
                              console.log(error);

                              alert("Wishlist failed");
                            }
                          }}
                          className="cursor-pointer rounded-full bg-slate-800 p-3 transition hover:bg-pink-500"
                        >
                          <Heart size={18} className="text-white" />
                        </button>
                      </div>
                    </div>

                    {/* DETAILS */}
                    <div className="p-4">
                      <h4 className="mb-1 text-sm font-semibold text-white">
                        {p.title}
                      </h4>

                      <p className="mb-2 text-xs text-slate-400">
                        ⭐ {p.rating} · {p.buyers} buyers
                      </p>

                      <p className="font-bold text-pink-500">₹ {p.price}</p>
                    </div>
                  </motion.article>
                ))}
              </div>

              {items.length > 4 && (
                <div className="mt-6 text-center">
                  <button
                    onClick={() =>
                      setViewAll((prev) => ({
                        ...prev,
                        [category]: !prev[category],
                      }))
                    }
                    className="rounded-lg border border-pink-500 px-6 py-2 text-pink-400"
                  >
                    {showAll ? "View Less" : "View All"}
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
