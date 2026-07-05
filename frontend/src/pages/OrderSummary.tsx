import { useNavigate } from 'react-router-dom'
import { createOrder } from '../services/api'

export default function OrderSummary() {
  const navigate = useNavigate()

  const data = JSON.parse(localStorage.getItem('checkoutData') || '{}')
  console.log('Order Summary Data:', JSON.stringify(data, null, 2))
  const subtotal = data.total || 0
  console.log('Subtotal:', subtotal)
  console.log('Data Total:', data.total)
  const deliveryCharge = subtotal > 1000 ? 0 : 50

  const platformFee = 10

  const discount = subtotal > 2000 ? 100 : 0

  const finalTotal = subtotal + deliveryCharge + platformFee - discount

  const handleContinue = async () => {
    console.log('FINAL TOTAL SENT = ', finalTotal)

    // STORE FINAL TOTAL IN LOCALSTORAGE FOR PAYMENT PAGE
    localStorage.setItem('finalTotal', String(finalTotal))

    try {
      if (data.payment_method === 'COD') {
        // CREATE ORDER IMMEDIATELY FOR COD
        await createOrder({
          user: data.user,
          address: data.address,
          payment_method: 'COD',
          total: finalTotal,
        })

        // CLEAR CHECKOUT DATA
        localStorage.removeItem('checkoutData')
        localStorage.removeItem('checkoutTotal')
        localStorage.removeItem('finalTotal')

        navigate('/dashboard/customer?tab=orders')
      } else if (data.payment_method === 'UPI') {
        // FOR UPI, NAVIGATE TO PAYMENT PAGE
        // ORDER WILL BE CREATED AFTER PAYMENT SUCCEEDS
        navigate('/payment')
      }
    } catch (error) {
      console.error('Error placing order:', error)
      alert('Failed to place order. Please try again.')
    }
  }

  return (
    <div className="min-h-screen bg-linear-to-r from-violet-950 via-purple-950 to-indigo-950 p-6">
      <div className="mx-auto max-w-4xl rounded-2xl border border-slate-700 bg-slate-900 p-8">
        <h1 className="mb-8 text-3xl font-bold text-white">Order Summary</h1>

        <div className="space-y-3 text-slate-300">
          <p>
            <strong>Name:</strong> {data.name}
          </p>

          <p>
            <strong>Phone:</strong> {data.phone}
          </p>

          <p>
            <strong>Address:</strong> {data.address}
          </p>

          <p>
            <strong>Payment:</strong>{' '}
            <span className="font-semibold text-white">
              {data.payment_method === 'COD'
                ? 'Cash On Delivery'
                : 'UPI Payment'}
            </span>
          </p>
        </div>

        <div className="mt-8 rounded-xl bg-slate-800 p-6">
          <div className="flex justify-between text-white">
            <span>Subtotal</span>
            <span>₹{subtotal.toFixed(2)}</span>
          </div>

          <div className="mt-2 flex justify-between text-white">
            <span>Delivery Charge</span>
            <span>{deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge}`}</span>
          </div>

          <div className="mt-2 flex justify-between text-white">
            <span>Platform Fee</span>
            <span>₹{platformFee}</span>
          </div>

          {discount > 0 && (
            <div className="mt-2 flex justify-between text-green-400">
              <span>Discount</span>
              <span>-₹{discount}</span>
            </div>
          )}

          <hr className="my-4 border-slate-600" />

          <div className="flex justify-between text-xl font-bold text-green-400">
            <span>Total Amount</span>
            <span>₹{finalTotal.toFixed(2)}</span>
          </div>
        </div>

        <button
          onClick={handleContinue}
          className="mt-8 w-full rounded-xl bg-pink-500 py-4 font-bold text-white transition hover:bg-pink-600 disabled:opacity-50"
        >
          {data.payment_method === 'COD'
            ? 'Confirm Order'
            : 'Proceed To UPI Payment'}
        </button>
      </div>
    </div>
  )
}
