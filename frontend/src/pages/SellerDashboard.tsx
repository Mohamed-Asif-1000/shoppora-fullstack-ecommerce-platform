import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { LogOut, Package, BarChart3, Settings, TrendingUp } from 'lucide-react'
import SellerProducts from '../components/seller/SellerProducts'
import SellerOrders from '../components/seller/SellerOrders'
import SellerAnalytics from '../components/seller/SellerAnalytics'
import SellerSettings from '../components/seller/SellerSettings'
import { getSellerProducts } from '../services/api'
import type { SellerProduct } from '../types'

export default function SellerDashboard(): React.JSX.Element {
  const [activeTab, setActiveTab] = useState<
    'products' | 'orders' | 'analytics' | 'settings'
  >('products')

  const [products, setProducts] = useState<SellerProduct[]>([])
  const navigate = useNavigate()

  const userEmail = localStorage.getItem('userEmail') || 'seller@example.com'

  const handleLogout = () => {
    localStorage.removeItem('userType')

    localStorage.removeItem('userEmail')

    localStorage.removeItem('userId')

    localStorage.removeItem('token')

    localStorage.removeItem('refresh')

    navigate('/login')
  }

  const fetchProducts = async () => {
    try {
      const sellerId = Number(localStorage.getItem('userId'))

      const data = await getSellerProducts(sellerId)

      setProducts(data)
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    const loadProducts = async () => {
      await fetchProducts()
    }

    loadProducts()

    const handleProductsUpdated = () => {
      void fetchProducts()
    }

    window.addEventListener('productsUpdated', handleProductsUpdated)

    return () => {
      window.removeEventListener('productsUpdated', handleProductsUpdated)
    }
  }, [])

  return (
    <div className="min-h-screen bg-linear-to-r from-violet-950 via-purple-950 to-indigo-950">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-slate-700 bg-slate-800/50">
        <div className="container mx-auto flex h-16 items-center justify-between gap-3 px-3 sm:px-6">
          <div className="min-w-0">
            <h1 className="truncate text-xl font-bold text-pink-400 sm:text-2xl">
              Shoppora Seller
            </h1>

            <p className="truncate text-sm text-slate-400">{userEmail}</p>
          </div>

          <button
            onClick={handleLogout}
            className="flex shrink-0 items-center gap-2 rounded-lg bg-red-500/20 px-3 py-2 text-red-400 transition hover:bg-red-500/30 sm:px-4"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      <div className="container mx-auto px-3 py-4 sm:px-6 sm:py-8">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-4 lg:gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="rounded-xl border border-slate-700 bg-slate-800/50 p-3 lg:sticky lg:top-20 lg:p-6">
              <nav className="flex gap-2 overflow-x-auto lg:block lg:space-y-2 lg:overflow-visible">
                {/* Products */}
                <button
                  onClick={() => setActiveTab('products')}
                  className={`flex shrink-0 items-center gap-3 rounded-lg px-4 py-3 transition lg:w-full ${
                    activeTab === 'products'
                      ? 'border border-pink-500/50 bg-pink-500/20 text-pink-400'
                      : 'text-slate-400 hover:bg-slate-700/50 hover:text-white'
                  }`}
                >
                  <Package className="h-5 w-5" />
                  Products
                </button>

                {/* Orders */}
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`flex shrink-0 items-center gap-3 rounded-lg px-4 py-3 transition lg:w-full ${
                    activeTab === 'orders'
                      ? 'border border-pink-500/50 bg-pink-500/20 text-pink-400'
                      : 'text-slate-400 hover:bg-slate-700/50 hover:text-white'
                  }`}
                >
                  <TrendingUp className="h-5 w-5" />
                  Orders
                </button>

                {/* Analytics */}
                <button
                  onClick={() => setActiveTab('analytics')}
                  className={`flex shrink-0 items-center gap-3 rounded-lg px-4 py-3 transition lg:w-full ${
                    activeTab === 'analytics'
                      ? 'border border-pink-500/50 bg-pink-500/20 text-pink-400'
                      : 'text-slate-400 hover:bg-slate-700/50 hover:text-white'
                  }`}
                >
                  <BarChart3 className="h-5 w-5" />
                  Analytics
                </button>

                {/* Settings */}
                <button
                  onClick={() => setActiveTab('settings')}
                  className={`flex shrink-0 items-center gap-3 rounded-lg px-4 py-3 transition lg:w-full ${
                    activeTab === 'settings'
                      ? 'border border-pink-500/50 bg-pink-500/20 text-pink-400'
                      : 'text-slate-400 hover:bg-slate-700/50 hover:text-white'
                  }`}
                >
                  <Settings className="h-5 w-5" />
                  Settings
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Products */}
            {activeTab === 'products' && (
              <SellerProducts
                products={products}
                fetchProducts={fetchProducts}
              />
            )}

            {/* Orders */}
            {activeTab === 'orders' && <SellerOrders />}

            {/* Analytics */}
            {activeTab === 'analytics' && <SellerAnalytics />}

            {/* Settings */}
            {activeTab === 'settings' && <SellerSettings />}
          </div>
        </div>
      </div>
    </div>
  )
}
