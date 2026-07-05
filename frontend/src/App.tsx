import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useRef } from 'react'
import Header from './components/Header'
import Hero from './components/Hero'
import Features from './components/Features'
import Categories from './components/Categories'
import PromoSection from './components/PromoSection'
import ProductCart from './components/ProductCart'
import Testimonials from './components/Testimonials'
import Footer from './components/Footer'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Wishlist from './pages/Wishlist'
import Cart from './pages/Cart'
import CustomerDashboard from './pages/CustomerDashboard'
import SellerDashboard from './pages/SellerDashboard'
import AdminDashboard from './pages/AdminDashboard'
import DeliveryDashboard from './pages/DeliveryDashboard'
import SearchResults from './pages/SearchResults'
import ScrollToTop from './components/ScrollToTop'
import ProtectedRoute from './components/ProtectedRoute'
import Checkout from './pages/Checkout'
import Orders from './pages/Orders'
import OrderSummary from './pages/OrderSummary'
import Payment from './pages/Payment'

function HomePage() {
  const shopRef = useRef<HTMLDivElement>(null)
  const categoriesRef = useRef<HTMLDivElement>(null)

  const scrollToShop = () => {
    shopRef.current?.scrollIntoView({
      behavior: 'smooth',
    })
  }

  const scrollToCategories = () => {
    categoriesRef.current?.scrollIntoView({
      behavior: 'smooth',
    })
  }

  return (
    <div className="min-h-screen bg-linear-to-r from-violet-950 via-purple-950 to-indigo-950">
      <Header />
      <Hero
        scrollToShop={scrollToShop}
        scrollToCategories={scrollToCategories}
      />
      <Features />
      <div ref={categoriesRef}>
        <Categories />
      </div>
      <PromoSection />
      <div ref={shopRef}>
        <ProductCart />
      </div>
      <Testimonials />
      <Footer />
      <ScrollToTop />
    </div>
  )
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/search" element={<SearchResults />} />
        <Route
          path="/dashboard/customer"
          element={
            <ProtectedRoute role="customer">
              <CustomerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/seller"
          element={
            <ProtectedRoute role="seller">
              <SellerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/admin"
          element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/delivery"
          element={
            <ProtectedRoute role="delivery">
              <DeliveryDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/order-summary" element={<OrderSummary />} />
        <Route path="/payment" element={<Payment />} />
      </Routes>
    </Router>
  )
}
