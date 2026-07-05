import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createOrder } from "../services/api";
import { CreditCard, Loader } from "lucide-react";

export default function Payment() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handlePay = async () => {
    setLoading(true);
    setError("");

    try {
      const data = JSON.parse(localStorage.getItem("checkoutData") || "{}");
      const finalTotal = parseFloat(localStorage.getItem("finalTotal") || "0");

      // VALIDATE DATA
      if (!data.user || !data.address || finalTotal === 0) {
        throw new Error("Invalid checkout data");
      }

      // SIMULATING DEMO UPI PAYMENT SUCCESS
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // CREATE ORDER AFTER PAYMENT SUCCESS
      const orderResponse = await createOrder({
        user: data.user,
        address: data.address,
        payment_method: "UPI",
        total: finalTotal,
      });

      console.log("Order created:", orderResponse);

      // CLEAR CHECKOUT DATA
      localStorage.removeItem("checkoutData");
      localStorage.removeItem("checkoutTotal");
      localStorage.removeItem("finalTotal");

      navigate("/dashboard/customer?tab=orders");
    } catch (err) {
      console.error("Payment error:", err);
      setError("Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const finalTotal = parseFloat(localStorage.getItem("finalTotal") || "0");
  const data = JSON.parse(localStorage.getItem("checkoutData") || "{}");

  return (
    <div className="min-h-screen bg-linear-to-r from-violet-950 via-purple-950 to-indigo-950 p-6">
      <div className="mx-auto max-w-4xl rounded-2xl border border-slate-700 bg-slate-900 p-8">
        <h1 className="mb-8 flex items-center gap-3 text-3xl font-bold text-white">
          <CreditCard />
          UPI Payment
        </h1>

        {/* ORDER SUMMARY */}
        <div className="mt-8 rounded-xl bg-slate-800 p-6">
          <h2 className="mb-4 text-lg font-semibold text-white">
            Payment Summary
          </h2>

          <div className="space-y-2 text-sm text-slate-300">
            <p>
              <strong>Address:</strong> {data.address}
            </p>
            <p>
              <strong>Payment Method:</strong> UPI
            </p>
          </div>

          <hr className="my-4 border-slate-600" />

          <div className="flex justify-between text-xl font-bold text-pink-400">
            <span>Total Amount</span>
            <span>₹{finalTotal.toFixed(2)}</span>
          </div>
        </div>

        {/* ERROR MESSAGE */}
        {error && (
          <div className="mb-6 rounded-lg border border-red-500/50 bg-red-500/10 p-4 text-red-400">
            {error}
          </div>
        )}

        {/* PAY BUTTON */}
        <button
          onClick={handlePay}
          disabled={loading}
          className="w-full rounded-xl bg-pink-500 py-4 font-bold text-white transition hover:bg-pink-600 disabled:opacity-50"
        >
          {loading ? (
            <div className="flex items-center justify-center gap-2">
              <Loader className="h-5 w-5 animate-spin" />
              Processing Payment...
            </div>
          ) : (
            `Pay ₹${finalTotal.toFixed(2)}`
          )}
        </button>

        {/* BACK BUTTON */}
        <button
          onClick={() => navigate(-1)}
          disabled={loading}
          className="mt-3 w-full rounded-xl border border-slate-600 py-3 font-semibold text-slate-400 transition hover:bg-slate-800 disabled:opacity-50"
        >
          Back
        </button>
      </div>
    </div>
  );
}
