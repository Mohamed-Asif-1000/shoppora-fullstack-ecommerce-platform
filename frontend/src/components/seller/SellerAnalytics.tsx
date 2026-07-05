import { useEffect, useState } from 'react'
import { getSellerProducts, getSellerOrders } from '../../services/api'
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { TrendingUp, Package, ShoppingCart, DollarSign } from 'lucide-react'
import type { SellerProduct, SellerOrder } from '../../types'

type SellerAnalyticsOrder = SellerOrder & {
  items: {
    product_title: string
    product_image: string
    quantity: number
    price: number
    item_total: number
  }[]
  items_count: number
  seller_items_total: number
  order_total: number
}

export default function SellerAnalytics() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // CHART DATA STATES
  type ProductPerformance = {
    name: string
    fullName?: string
    sold: number
    revenue: number
  }

  type StatusDatum = { name: string; value: number }
  type RevenueDatum = { date: string; revenue: number }

  const [productPerformance, setProductPerformance] = useState<ProductPerformance[]>([])
  const [orderStatusData, setOrderStatusData] = useState<StatusDatum[]>([])
  const [revenueData, setRevenueData] = useState<RevenueDatum[]>([])
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalSold: 0,
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const sellerId = Number(localStorage.getItem('userId'))

        if (!sellerId) {
          setError('Seller ID not found')
          setLoading(false)
          return
        }

        // FETCH PRODUCTS AND ORDERS
        const productsData = await getSellerProducts(sellerId)
        const ordersData = await getSellerOrders(sellerId)

        // Check if data is valid arrays
        if (!Array.isArray(productsData) || !Array.isArray(ordersData)) {
          console.error('Invalid data format:', { productsData, ordersData })
          setError('Invalid data format received from server')
          setLoading(false)
          return
        }

        // PROCESS ANALYTICS DATA
        processAnalytics(productsData, ordersData)
        setError(null)

        // LOG DATA FOR DEBUGGING
        console.log('Products Data:', productsData)
        console.log('Orders Data:', ordersData)
      } catch (error) {
        console.error('Error fetching analytics data:', error)
        setError('Failed to load analytics data. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const processAnalytics = (
    products: SellerProduct[],
    orders: SellerAnalyticsOrder[],
  ) => {
    const orderStatuses: Record<string, number> = {}
    const orderRevenueTrend: Record<string, number> = {}
    const productSales: Record<string, number> = {}
    const productRevenue: Record<string, number> = {}
    const flattenedOrders: {
      product_title: string
      quantity: number
      total: number
    }[] = []

    let totalRevenue = 0
    let totalSold = 0

    orders.forEach((order) => {
      orderStatuses[order.status] = (orderStatuses[order.status] || 0) + 1

      const date = new Date(order.created_at).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      })

      orderRevenueTrend[date] =
        (orderRevenueTrend[date] || 0) + (order.seller_items_total || 0)
      totalRevenue += order.seller_items_total || 0

      if (order.items && Array.isArray(order.items)) {
        order.items.forEach((item) => {
          flattenedOrders.push({
            product_title: item.product_title,
            quantity: item.quantity || 0,
            total: item.item_total || 0,
          })
          totalSold += item.quantity || 0
        })
      }
    })

    flattenedOrders.forEach((item) => {
      productSales[item.product_title] =
        (productSales[item.product_title] || 0) + item.quantity
      productRevenue[item.product_title] =
        (productRevenue[item.product_title] || 0) + item.total
    })

    const performance = Object.keys(productSales).map((title) => ({
      name: title.length > 15 ? `${title.substring(0, 15)}...` : title,
      fullName: title,
      sold: productSales[title],
      revenue: Math.round(productRevenue[title] * 100) / 100,
    }))

    setProductPerformance(performance)

    const statusData = Object.keys(orderStatuses).map((status) => ({
      name: status.charAt(0).toUpperCase() + status.slice(1),
      value: orderStatuses[status],
    }))

    setOrderStatusData(statusData)

    const trend = Object.keys(orderRevenueTrend)
      .sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
      .map((date) => ({
        date,
        revenue: Math.round(orderRevenueTrend[date] * 100) / 100,
      }))

    setRevenueData(trend)

    setStats({
      totalRevenue: Math.round(totalRevenue * 100) / 100,
      totalOrders: orders.length,
      totalProducts: products.length,
      totalSold,
    })
  }

  const COLORS = ['#ec4899', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b']

  // FORMAT RUPEES WITH COMMAS
  const formatRupees = (amount: number): string => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount)
  }

  if (loading) {
    return (
      <div className="rounded-xl border border-slate-700 bg-slate-800/50 p-6">
        <h2 className="text-2xl font-bold text-white">Analytics</h2>
        <p className="mt-4 text-slate-400">Loading analytics...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-700 bg-red-900/30 p-6">
        <h2 className="text-2xl font-bold text-red-400">Analytics Error</h2>
        <p className="mt-4 text-red-300">{error}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* STAT CARDS */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* TOTAL REVENUE */}
        <div className="rounded-xl border border-slate-700 bg-slate-900/40 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Total Revenue</p>
              <p className="mt-2 text-2xl font-bold text-green-400">
                {formatRupees(stats.totalRevenue)}
              </p>
            </div>
            <div className="rounded-lg bg-green-500/20 p-3">
              <DollarSign className="h-6 w-6 text-green-400" />
            </div>
          </div>
        </div>

        {/* TOTAL ORDERS */}
        <div className="rounded-xl border border-slate-700 bg-slate-900/40 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Total Orders</p>
              <p className="mt-2 text-2xl font-bold text-blue-400">
                {stats.totalOrders}
              </p>
            </div>
            <div className="rounded-lg bg-blue-500/20 p-3">
              <ShoppingCart className="h-6 w-6 text-blue-400" />
            </div>
          </div>
        </div>

        {/* TOTAL PRODUCTS */}
        <div className="rounded-xl border border-slate-700 bg-slate-900/40 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Total Products</p>
              <p className="mt-2 text-2xl font-bold text-pink-400">
                {stats.totalProducts}
              </p>
            </div>
            <div className="rounded-lg bg-pink-500/20 p-3">
              <Package className="h-6 w-6 text-pink-400" />
            </div>
          </div>
        </div>

        {/* ITEMS SOLD */}
        <div className="rounded-xl border border-slate-700 bg-slate-900/40 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Items Sold</p>
              <p className="mt-2 text-2xl font-bold text-purple-400">
                {stats.totalSold}
              </p>
            </div>
            <div className="rounded-lg bg-purple-500/20 p-3">
              <TrendingUp className="h-6 w-6 text-purple-400" />
            </div>
          </div>
        </div>
      </div>

      {/* CHARTS SECTION */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* PRODUCT PERFORMANCE CHART */}
        {productPerformance.length > 0 && (
          <div className="rounded-xl border border-slate-700 bg-slate-900/40 p-6">
            <h3 className="mb-4 text-lg font-semibold text-white">
              Product Sales & Revenue
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={productPerformance}>
                <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                <XAxis
                  dataKey="name"
                  tick={{ fill: '#cbd5e1', fontSize: 12 }}
                />
                <YAxis
                  yAxisId="left"
                  tick={{ fill: '#cbd5e1', fontSize: 12 }}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tick={{ fill: '#cbd5e1', fontSize: 12 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: '1px solid #475569',
                    borderRadius: '8px',
                  }}
                  labelStyle={{ color: '#fff' }}
                  formatter={(value, name) => {
                    if (name === 'sold') {
                      return [`${value} units`, 'Units Sold']
                    }
                    return [formatRupees(value as number), 'Revenue']
                  }}
                  cursor={{ fill: 'rgba(236, 72, 153, 0.1)' }}
                />
                <Bar
                  yAxisId="left"
                  dataKey="sold"
                  fill="#ec4899"
                  radius={[8, 8, 0, 0]}
                  name="Units Sold"
                />
                <Bar
                  yAxisId="right"
                  dataKey="revenue"
                  fill="#8b5cf6"
                  radius={[8, 8, 0, 0]}
                  name="Revenue"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* ORDER STATUS PIE CHART */}
        {orderStatusData.length > 0 && (
          <div className="rounded-xl border border-slate-700 bg-slate-900/40 p-6">
            <h3 className="mb-4 text-lg font-semibold text-white">
              Order Status
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={orderStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {orderStatusData.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: '1px solid #475569',
                    borderRadius: '8px',
                    color: '#fff',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* REVENUE TREND CHART */}
      {revenueData.length > 0 && (
        <div className="rounded-xl border border-slate-700 bg-slate-900/40 p-6">
          <h3 className="mb-4 text-lg font-semibold text-white">
            Revenue Trend
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
              <XAxis dataKey="date" tick={{ fill: '#cbd5e1', fontSize: 12 }} />
              <YAxis tick={{ fill: '#cbd5e1', fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e293b',
                  border: '1px solid #475569',
                  borderRadius: '8px',
                }}
                labelStyle={{ color: '#fff' }}
                formatter={(value) => formatRupees(value as number)}
                cursor={{ stroke: '#ec4899' }}
              />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#10b981"
                strokeWidth={3}
                dot={{ fill: '#10b981', r: 5 }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* NO DATA MESSAGE */}
      {productPerformance.length === 0 &&
        orderStatusData.length === 0 &&
        revenueData.length === 0 && (
          <div className="rounded-xl border border-slate-700 bg-slate-900/40 p-8 text-center text-slate-400">
            <p>No detailed analytics data available yet.</p>
            <p className="mt-2 text-sm">
              Start by adding products and receiving orders to see detailed
              analytics charts.
            </p>
            <p className="mt-4 text-sm text-slate-500">
              Your sales summary is displayed in the stat cards above.
            </p>
          </div>
        )}
    </div>
  )
}
