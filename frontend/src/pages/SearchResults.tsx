import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Search, ArrowLeft } from "lucide-react";
import { useEffect } from "react";
import { useCart } from "../context/CartContext";
import { getProducts, addCart } from "../services/api";

export default function SearchResults(): React.JSX.Element {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const query = searchParams.get("q") || "";
  const [localQuery, setLocalQuery] = useState(query);

  type MinimalProduct = {
    id: number;
    title: string;
    image: string;
    category: string;
    rating: number;
    price: number;
  };

  const [products, setProducts] = useState<MinimalProduct[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getProducts();
      setProducts(data as MinimalProduct[]);
    };
    fetchData();
  }, []);

  const filteredProducts = products.filter(
    (p) =>
      p.title.toLowerCase().includes(query.toLowerCase()) ||
      p.category.toLowerCase().includes(query.toLowerCase()),
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/search?q=${encodeURIComponent(localQuery)}`);
  };
  const handleAddToCart = async (product: MinimalProduct) => {
    try {
      const userId = localStorage.getItem("userId");

      if (!userId) {
        alert("Login first");
        return;
      }

      await addCart(Number(userId), product.id);

      addToCart({
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.image,
        qty: 1,
      });

      window.dispatchEvent(new Event("cartUpdated"));

      navigate("/cart");
    } catch (error) {
      console.log(error);
      alert("Failed to add product to cart");
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-r from-violet-950 via-purple-950 to-indigo-950">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-slate-700 bg-slate-800/50">
        <div className="container mx-auto px-6 py-6">
          <button
            onClick={() => navigate("/")}
            className="mb-4 flex items-center gap-2 text-pink-400 transition hover:text-pink-300"
          >
            <ArrowLeft className="h-5 w-5" />
            Back to Home
          </button>

          <form onSubmit={handleSearch} className="relative max-w-2xl">
            <Search className="absolute top-3.5 left-4 h-5 w-5 text-slate-400" />
            <input
              type="text"
              value={localQuery}
              onChange={(e) => setLocalQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full rounded-lg border border-slate-600 bg-slate-700/50 py-3 pr-4 pl-12 text-white placeholder-slate-500 transition focus:border-transparent focus:ring-2 focus:ring-pink-500 focus:outline-none"
            />
          </form>
        </div>
      </header>

      <div className="container mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-white">
            Search Results for "<span className="text-pink-400">{query}</span>"
          </h1>
          <p className="text-slate-400">
            Found {filteredProducts.length}{" "}
            {filteredProducts.length === 1 ? "product" : "products"}
          </p>
        </div>

        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="overflow-hidden rounded-xl border border-slate-700 bg-slate-800/50 transition-all hover:border-pink-500 hover:shadow-lg"
              >
                <div className="relative flex h-64 items-center justify-center bg-slate-100">
                  <img
                    src={`${import.meta.env.VITE_API_URL}${product.image}`}
                    alt={product.title}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "/fallback.jpg";
                    }}
                  />
                </div>

                <div className="p-4">
                  <p className="mb-2 text-xs text-slate-400">
                    {product.category}
                  </p>
                  <h3 className="mb-3 line-clamp-2 text-sm font-semibold text-white">
                    {product.title}
                  </h3>

                  <div className="mb-4 flex items-center gap-2">
                    <div className="flex text-yellow-400">
                      {Array.from({ length: product.rating }).map((_, i) => (
                        <span key={i}>★</span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="font-bold text-pink-500">
                      ₹{product.price.toLocaleString("en-IN")}
                    </span>

                    <button
                      onClick={() => handleAddToCart(product)}
                      className="rounded-full bg-pink-500 px-3 py-2 text-sm font-medium text-white transition hover:bg-pink-600"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-16 text-center">
            <p className="mb-4 text-lg text-slate-400">
              No products found matching "
              <span className="text-pink-400">{query}</span>"
            </p>
            <button
              onClick={() => navigate("/")}
              className="inline-block rounded-lg bg-pink-500 px-6 py-3 font-semibold text-white transition hover:bg-pink-600"
            >
              Back to Home
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
