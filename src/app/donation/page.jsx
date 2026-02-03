"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  createPaymentOrder,
  verifyPayment,
} from "@/app/actions/payment.actions";

export default function DonatePage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get params from URL
  const ngoId = searchParams.get("ngoId");
  const campaignId = searchParams.get("campaignId");
  const ngoName = searchParams.get("ngoName");
  const campaignTitle = searchParams.get("campaignTitle");
  const prefilledAmount = searchParams.get("amount");

  const [amount, setAmount] = useState(prefilledAmount || "");
  const [customAmount, setCustomAmount] = useState("");
  const [donatedBy, setDonatedBy] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);

  const presetAmounts = [100, 500, 1000, 2000, 5000, 10000];

  // Load Razorpay
  useEffect(() => {
    if (!window.Razorpay) {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.onload = () => setRazorpayLoaded(true);
      script.onerror = () => setError("Failed to load payment gateway");
      document.body.appendChild(script);
      return () => document.body.removeChild(script);
    }
    setRazorpayLoaded(true);
  }, []);

  const finalAmount =
    amount === "custom" ? Number(customAmount) : Number(amount);

  const handleDonate = async () => {
    // Validation
    if (!finalAmount || finalAmount < 1)
      return setError("Minimum amount is ₹1");
    if (finalAmount > 10000000)
      return setError("Maximum amount is ₹1,00,00,000");
    if (!razorpayLoaded) return setError("Payment gateway loading...");

    setLoading(true);
    setError("");

    try {
      console.log(campaignId)
      const order = await createPaymentOrder({
        amount: finalAmount,
        ngoId,
        campaignId,
        donatedBy: donatedBy.trim() || "Anonymous",
      });

      if (order?.error) {
        setError(order.error);
        setLoading(false);
        return;
      }

      const razorpay = new window.Razorpay({
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: finalAmount * 100,
        currency: "INR",
        name: "Aasha.Hope",
        description: `Donation to ${ngoName || campaignTitle}`,
        order_id: order.orderId,
        prefill: {
          name: donatedBy.trim(),
          email: email.trim(),
          contact: phone.trim(),
        },
        theme: { color: "#16a34a" },

        handler: async (res) => {
          const verify = await verifyPayment({
            razorpay_order_id: res.razorpay_order_id,
            razorpay_payment_id: res.razorpay_payment_id,
            razorpay_signature: res.razorpay_signature,
            donationId: order.donationId,
          });

          if (verify?.success) {
            router.push("/donation/success?id=" + verify.donationId);
          } else {
            setError("Payment verification failed");
            setLoading(false);
          }
        },

        modal: { ondismiss: () => setLoading(false) },
      });

      razorpay.on("payment.failed", (res) => {
        setError(res.error?.description || "Payment failed");
        setLoading(false);
      });

      razorpay.open();
    } catch (err) {
      setError("An error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="mb-6 text-gray-600 hover:text-gray-900 flex items-center gap-2"
        >
          ← Back
        </button>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Support {ngoName ? "NGO" : "Campaign"} :{" "}
              {ngoName || campaignTitle}
            </h1>
            {/* {campaignTitle && (
              <p className="text-gray-600">{campaignTitle}</p>
            )} */}
            <div className="mt-4 p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-gray-700">
                Your donation will help make a difference in someone's life
              </p>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div
              className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700"
              role="alert"
            >
              {error}
            </div>
          )}

          {/* Amount Selection */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Select Donation Amount
            </label>
            <div className="grid grid-cols-3 gap-3 mb-4">
              {presetAmounts.map((preset) => (
                <button
                  key={preset}
                  onClick={() => {
                    setAmount(String(preset));
                    setError("");
                  }}
                  disabled={loading}
                  className={`border-2 rounded-lg py-3 font-semibold transition-all focus:ring-2 focus:ring-green-500 disabled:opacity-50 ${
                    amount === String(preset)
                      ? "border-green-600 bg-green-50 text-green-700"
                      : "border-gray-300 hover:border-green-400"
                  }`}
                >
                  ₹{preset}
                </button>
              ))}
            </div>

            <button
              onClick={() => {
                setAmount("custom");
                setError("");
              }}
              disabled={loading}
              className={`w-full border-2 rounded-lg py-3 font-semibold transition-all focus:ring-2 focus:ring-green-500 disabled:opacity-50 ${
                amount === "custom"
                  ? "border-green-600 bg-green-50 text-green-700"
                  : "border-gray-300 hover:border-green-400"
              }`}
            >
              Enter Custom Amount
            </button>

            {amount === "custom" && (
              <input
                type="number"
                min="1"
                placeholder="Enter amount"
                value={customAmount}
                onChange={(e) => {
                  setCustomAmount(e.target.value);
                  setError("");
                }}
                disabled={loading}
                className="w-full mt-3 px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:opacity-50 text-lg"
              />
            )}
          </div>

          {/* Personal Information */}
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Your Name (Optional)
              </label>
              <input
                type="text"
                placeholder="Enter your name"
                value={donatedBy}
                onChange={(e) =>
                  e.target.value.length <= 100 && setDonatedBy(e.target.value)
                }
                disabled={loading}
                maxLength={100}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:opacity-50"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email (Optional)
              </label>
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:opacity-50"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Phone (Optional)
              </label>
              <input
                type="tel"
                placeholder="10-digit phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                disabled={loading}
                maxLength={10}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:opacity-50"
              />
            </div>
          </div>

          {/* Donation Summary */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex justify-between items-center text-lg font-semibold">
              <span>Total Donation:</span>
              <span className="text-green-600 text-2xl">
                ₹{finalAmount || 0}
              </span>
            </div>
          </div>

          {/* Donate Button */}
          <button
            onClick={handleDonate}
            disabled={loading || !amount || !razorpayLoaded}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:ring-2 focus:ring-green-500 focus:ring-offset-2 text-lg"
          >
            {loading
              ? "Processing..."
              : !razorpayLoaded
                ? "Loading Payment Gateway..."
                : `Donate ₹${finalAmount || 0}`}
          </button>

          <p className="text-sm text-gray-500 text-center mt-4">
            🔒 Your payment is secure and encrypted
          </p>
        </div>
      </div>
    </div>
  );
}
