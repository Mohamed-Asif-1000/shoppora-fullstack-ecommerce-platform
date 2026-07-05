import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CreditCard } from 'lucide-react'

export default function Checkout() {
  const navigate = useNavigate()

  const [form, setForm] = useState({
    name: '',
    phone: '',
    address: '',
    payment: 'COD',
  })

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    })
  }

  const placeOrder = async () => {
    if (!form.name || !form.phone || !form.address) {
      alert('Fill all fields')
      return
    }

    const userId = localStorage.getItem('userId')

    if (!userId) {
      alert('Login first')
      return
    }

    localStorage.setItem(
      'checkoutData',
      JSON.stringify({
        user: Number(userId),
        name: form.name,
        phone: form.phone,
        address: form.address,
        payment_method: form.payment,
        total: Number(localStorage.getItem('checkoutTotal') || 0),
      }),
    )
    console.log(
      JSON.stringify({
        user: Number(userId),
        name: form.name,
        phone: form.phone,
        address: form.address,
        payment_method: form.payment,
        total: Number(localStorage.getItem('checkoutTotal') || 0),
      }),
    )

    navigate('/order-summary')
  }

  return (
    <div className="min-h-screen bg-linear-to-r from-violet-950 via-purple-950 to-indigo-950 p-6">
      <div className="mx-auto max-w-3xl rounded-2xl border border-slate-700 bg-slate-900 p-8">
        <h1 className="mb-8 flex items-center gap-3 text-3xl font-bold text-white">
          <CreditCard />
          Checkout
        </h1>

        <div className="space-y-6">
          <div>
            <label className="text-slate-300">Full Name</label>

            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="mt-2 w-full rounded-lg bg-slate-800 p-3 text-white"
            />
          </div>

          <div>
            <label className="text-slate-300">Phone</label>

            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className="mt-2 w-full rounded-lg bg-slate-800 p-3 text-white"
            />
          </div>

          <div>
            <label className="text-slate-300">Address</label>

            <textarea
              name="address"
              rows={4}
              value={form.address}
              onChange={handleChange}
              className="mt-2 w-full rounded-lg bg-slate-800 p-3 text-white"
            />
          </div>

          <div>
            <label className="text-slate-300">Payment Method</label>

            <select
              name="payment"
              value={form.payment}
              onChange={handleChange}
              className="mt-2 w-full rounded-lg bg-slate-800 p-3 text-white"
            >
              <option value="COD">Cash On Delivery</option>

              <option value="UPI">UPI</option>
            </select>
          </div>

          <button
            onClick={placeOrder}
            className="w-full cursor-pointer rounded-xl bg-pink-500 py-4 font-bold text-white hover:bg-pink-600"
          >
            Place Order
          </button>
        </div>
      </div>
    </div>
  )
}
