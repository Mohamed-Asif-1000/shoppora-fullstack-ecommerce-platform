import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { loginUser } from '../services/api'
import { Mail, Lock, User, Store, BarChart3, Truck } from 'lucide-react'

export default function Login(): React.JSX.Element {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [userType, setUserType] = useState<
    'customer' | 'seller' | 'admin' | 'delivery'
  >('customer')
  const navigate = useNavigate()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const response = await loginUser(email, password)

      if (response.error) {
        alert(response.error)

        return
      }

      if (response.user.role !== userType) {
        alert('Selected role does not match account')

        return
      }

      switch (response.user.role) {
        case 'customer':
          navigate('/dashboard/customer')

          break

        case 'seller':
          navigate('/dashboard/seller')

          break

        case 'admin':
          navigate('/dashboard/admin')

          break

        case 'delivery':
          navigate('/dashboard/delivery')

          break
      }
    } catch (err) {
      if (err instanceof Error) {
        alert(err.message)
      } else {
        alert('Login failed')
      }
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-r from-violet-950 via-purple-950 to-indigo-950 px-6 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-linear-to-br from-pink-500 to-pink-600">
              <span className="text-xl font-bold text-white">S</span>
            </div>
            <span className="text-3xl font-bold text-pink-400">Shoppora</span>
          </div>
          <p className="text-slate-400">Welcome back to shopping</p>
        </div>

        {/* Login Form */}
        <form
          onSubmit={handleLogin}
          className="space-y-6 rounded-2xl border border-slate-700 bg-slate-800/50 p-8"
        >
          {/* User Type Selection */}
          <div className="space-y-3">
            <label className="mb-4 block text-sm font-semibold text-white">
              Login As
            </label>
            <div className="grid grid-cols-2 gap-3 text-white">
              <button
                type="button"
                onClick={() => setUserType('customer')}
                className={`flex flex-col items-center gap-2 rounded-lg border-2 p-3 transition ${
                  userType === 'customer'
                    ? 'border-pink-500 bg-pink-500/10'
                    : 'border-slate-600 bg-slate-700/30 hover:border-slate-500'
                }`}
              >
                <User className="h-5 w-5" />
                <span className="text-xs font-medium">Customer</span>
              </button>
              <button
                type="button"
                onClick={() => setUserType('seller')}
                className={`flex flex-col items-center gap-2 rounded-lg border-2 p-3 transition ${
                  userType === 'seller'
                    ? 'border-pink-500 bg-pink-500/10'
                    : 'border-slate-600 bg-slate-700/30 hover:border-slate-500'
                }`}
              >
                <Store className="h-5 w-5" />
                <span className="text-xs font-medium">Seller</span>
              </button>
              <button
                type="button"
                onClick={() => setUserType('admin')}
                className={`flex flex-col items-center gap-2 rounded-lg border-2 p-3 transition ${
                  userType === 'admin'
                    ? 'border-pink-500 bg-pink-500/10'
                    : 'border-slate-600 bg-slate-700/30 hover:border-slate-500'
                }`}
              >
                <BarChart3 className="h-5 w-5" />
                <span className="text-xs font-medium">Admin</span>
              </button>
              <button
                type="button"
                onClick={() => setUserType('delivery')}
                className={`flex flex-col items-center gap-2 rounded-lg border-2 p-3 transition ${
                  userType === 'delivery'
                    ? 'border-pink-500 bg-pink-500/10'
                    : 'border-slate-600 bg-slate-700/30 hover:border-slate-500'
                }`}
              >
                <Truck className="h-5 w-5" />
                <span className="text-xs font-medium">Delivery</span>
              </button>
            </div>
          </div>

          {/* Email Field */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-white">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute top-3.5 left-3 h-5 w-5 text-slate-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full rounded-lg border border-slate-600 bg-slate-700/50 py-2.5 pr-4 pl-10 text-white placeholder-slate-500 transition focus:border-transparent focus:ring-2 focus:ring-pink-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-white">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute top-3.5 left-3 h-5 w-5 text-slate-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className="w-full rounded-lg border border-slate-600 bg-slate-700/50 py-2.5 pr-4 pl-10 text-white placeholder-slate-500 transition focus:border-transparent focus:ring-2 focus:ring-pink-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Remember & Forgot */}
          <div className="flex items-center justify-between text-sm">
            <label className="flex cursor-pointer items-center gap-2 text-slate-400 hover:text-slate-300">
              <input type="checkbox" className="h-4 w-4 rounded" />
              Remember me
            </label>
            <a href="#" className="text-pink-400 hover:text-pink-300">
              Forgot password?
            </a>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full transform rounded-lg bg-pink-500 py-2.5 font-semibold text-white transition duration-200 hover:scale-105 hover:bg-pink-600"
          >
            Sign In
          </button>

          {/* Sign Up Link */}
          <p className="text-center text-sm text-slate-400">
            Don't have an account?{' '}
            <button
              type="button"
              onClick={() => navigate('/signup')}
              className="font-semibold text-pink-400 hover:text-pink-300"
            >
              Sign up
            </button>
          </p>
        </form>
      </div>
    </div>
  )
}
