import { useState, useEffect, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  ShoppingCart,
  Search,
  Menu,
  X,
  User,
  Heart,
  ShoppingBag,
} from "lucide-react";
import { getCart, getWishlist } from "../services/api";

export default function Header() {
  const [searchQuery, setSearchQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);

  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const userType = localStorage.getItem("userType");

  const isLoggedIn = !!token && !!userType;

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleUserClick = () => {
    if (!isLoggedIn) {
      navigate("/login");

      return;
    }

    navigate(`/dashboard/${userType}`);
  };

  const logout = () => {
    localStorage.clear();

    window.dispatchEvent(new Event("cartUpdated"));

    window.dispatchEvent(new Event("wishlistUpdated"));

    navigate("/login");
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const handleMobileUserClick = () => {
    closeMenu();
    handleUserClick();
  };

  const handleMobileLogout = () => {
    closeMenu();
    logout();
  };

  const handleMobileSearch = (e: React.FormEvent<HTMLFormElement>) => {
    handleSearch(e);
    closeMenu();
  };

  const loadCounts = useCallback(async () => {
    const userId = localStorage.getItem("userId");

    if (!userId || !token) {
      setCartCount(0);
      setWishlistCount(0);
      return;
    }

    try {
      const cart = await getCart(Number(userId));
      setCartCount(Array.isArray(cart) ? cart.length : 0);

      const wishlist = await getWishlist(Number(userId));
      setWishlistCount(Array.isArray(wishlist) ? wishlist.length : 0);
    } catch (err) {
      console.error(err);
      setCartCount(0);
      setWishlistCount(0);
    }
  }, [token]);

  useEffect(() => {
    (async () => {
      await loadCounts();
    })();

    window.addEventListener("cartUpdated", loadCounts);
    window.addEventListener("wishlistUpdated", loadCounts);

    return () => {
      window.removeEventListener("cartUpdated", loadCounts);
      window.removeEventListener("wishlistUpdated", loadCounts);
    };
  }, [loadCounts]);

  return (
    <>
      <header className="sticky top-0 z-50 bg-linear-to-r from-violet-950 via-purple-950 to-indigo-950">
        <div className="container mx-auto flex h-16 items-center justify-between px-3 sm:h-20 sm:px-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="rounded-lg p-2 text-white transition hover:bg-white/10 md:hidden"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
            >
              {menuOpen ? <X /> : <Menu />}
            </button>

            <Link to="/" className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-pink-500">
                <ShoppingBag className="text-white" />
              </div>

              <span className="font-bold text-pink-400">Shoppora</span>
            </Link>
          </div>

          <form onSubmit={handleSearch} className="mx-4 hidden flex-1 md:block">
            <div className="relative">
              <Search className="absolute top-3 left-4 text-gray-400" />

              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search"
                className="w-full rounded-full bg-white/20 py-3 pl-12 text-white"
              />
            </div>
          </form>

          <div className="hidden items-center gap-6 text-white md:flex">
            <Link to="/wishlist">
              <div className="relative">
                <Heart />

                {wishlistCount > 0 && (
                  <span className="absolute -top-2 -right-2 rounded-full bg-pink-500 px-1">
                    {wishlistCount}
                  </span>
                )}
              </div>
            </Link>

            <Link to="/cart">
              <div className="relative">
                <ShoppingCart />

                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 rounded-full bg-pink-500 px-1">
                    {cartCount}
                  </span>
                )}
              </div>
            </Link>

            <div className="flex items-center gap-3">
              <button
                onClick={handleUserClick}
                className="flex items-center gap-2"
              >
                <User />

                {isLoggedIn ? userType : "Login"}
              </button>

              {isLoggedIn && (
                <button
                  onClick={logout}
                  className="rounded bg-red-500 px-3 py-1 text-sm hover:bg-red-600"
                >
                  Logout
                </button>
              )}
            </div>
          </div>
        </div>

        {menuOpen && (
          <div className="border-t border-white/10 bg-linear-to-r from-violet-950 via-purple-950 to-indigo-950 px-3 py-4 shadow-xl md:hidden">
            <form onSubmit={handleMobileSearch} className="mb-4">
              <div className="relative">
                <Search className="absolute top-3 left-3 h-5 w-5 text-gray-400" />
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products"
                  className="w-full rounded-full bg-white/15 py-2.5 pr-4 pl-10 text-white placeholder:text-slate-400"
                />
              </div>
            </form>

            <nav className="grid gap-2 text-white">
              <Link
                to="/wishlist"
                onClick={closeMenu}
                className="flex items-center justify-between rounded-lg px-3 py-3 hover:bg-white/10"
              >
                <span className="flex items-center gap-3">
                  <Heart className="h-5 w-5" />
                  Wishlist
                </span>
                {wishlistCount > 0 && (
                  <span className="rounded-full bg-pink-500 px-2 py-0.5 text-xs">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              <Link
                to="/cart"
                onClick={closeMenu}
                className="flex items-center justify-between rounded-lg px-3 py-3 hover:bg-white/10"
              >
                <span className="flex items-center gap-3">
                  <ShoppingCart className="h-5 w-5" />
                  Cart
                </span>
                {cartCount > 0 && (
                  <span className="rounded-full bg-pink-500 px-2 py-0.5 text-xs">
                    {cartCount}
                  </span>
                )}
              </Link>

              <button
                onClick={handleMobileUserClick}
                className="flex items-center gap-3 rounded-lg px-3 py-3 text-left hover:bg-white/10"
              >
                <User className="h-5 w-5" />
                {isLoggedIn ? `${userType} dashboard` : "Login"}
              </button>

              {isLoggedIn && (
                <button
                  onClick={handleMobileLogout}
                  className="rounded-lg bg-red-500/20 px-3 py-3 text-left text-red-300 hover:bg-red-500/30"
                >
                  Logout
                </button>
              )}
            </nav>
          </div>
        )}
      </header>
    </>
  );
}
