import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../services/api";
import { FiShield, FiCheckCircle, FiArrowLeft, FiCreditCard, FiSmartphone, FiBriefcase } from "react-icons/fi";
import { FaBuilding } from "react-icons/fa";

import "./PaymentPage.css";

const PLATFORM_FEE_PERCENT = 10;

function PaymentPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const [coupon, setCoupon] = useState(location.state?.coupon || null);
    const [loading, setLoading] = useState(false);
    const [paid, setPaid] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState("card");

    useEffect(() => {
        if (!coupon) {
            navigate("/browse");
        }
    }, [coupon, navigate]);

    if (!coupon) return null;

    const couponPrice = Number(coupon.price) || 0;
    const platformFee = Math.round((couponPrice * PLATFORM_FEE_PERCENT) / 100);
    const totalAmount = couponPrice + platformFee;

    const handleDummyPayment = async () => {
        setLoading(true);
        // Simulate payment delay
        setTimeout(async () => {
            try {
                await api.post("/payment/dummy-checkout", {
                    // Fix Coupon ID Bug: use _id, or id if from local JSON
                    couponId: coupon._id || coupon.id,
                    amount: totalAmount,
                    paymentMethod: paymentMethod
                });
                setLoading(false);
                setPaid(true);
            } catch (err) {
                alert(err.response?.data?.message || "Payment initiation failed");
                setLoading(false);
            }
        }, 1500);
    };

    if (paid) {
        return (
            <div className="container section max-w-lg text-center mx-auto">
                <div className="glass-card py-16 px-8 rounded-2xl shadow-xl mt-12 bg-white dark:bg-gray-800">
                    <div className="text-6xl mb-6 flex justify-center text-green-500">
                        <FiCheckCircle size={80} />
                    </div>
                    <h2 className="text-3xl font-bold mb-4 text-gray-800 dark:text-white">Payment Successful!</h2>
                    <p className="text-gray-500 dark:text-gray-400 mb-8">
                        Your coupon <strong className="text-indigo-600">{coupon.code || "SUCCESS"}</strong> has been unlocked!
                    </p>
                    <div className="flex gap-4 justify-center">
                        <button className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors" onClick={() => navigate("/claimed")}>
                            View My Coupons
                        </button>
                        <button className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-medium transition-colors" onClick={() => navigate("/browse")}>
                            Browse More
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container section max-w-4xl mx-auto px-4 py-4">
            <button
                className="flex items-center gap-2 text-gray-500 hover:text-indigo-600 mb-4 transition-colors font-medium text-sm"
                onClick={() => navigate(-1)}
            >
                <FiArrowLeft /> Back to Browse
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column: Payment Methods */}
                <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Select Payment Method</h2>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <label className={`block p-3 border rounded-lg cursor-pointer transition-all ${paymentMethod === 'card' ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20' : 'border-gray-200 hover:border-indigo-300 dark:border-gray-700'} `}>
                            <div className="flex items-center gap-3">
                                <input type="radio" name="paymentMethod" value="card" checked={paymentMethod === 'card'} onChange={(e) => setPaymentMethod(e.target.value)} className="w-4 h-4 text-indigo-600 focus:ring-indigo-500" />
                                <FiCreditCard className="text-xl text-gray-600 dark:text-gray-300" />
                                <div>
                                    <h4 className="font-semibold text-gray-800 dark:text-white text-sm">Credit / Debit Card</h4>
                                    <p className="text-xs text-gray-500">Pay securely with your card</p>
                                </div>
                            </div>
                        </label>

                        <label className={`block p-3 border rounded-lg cursor-pointer transition-all ${paymentMethod === 'upi' ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20' : 'border-gray-200 hover:border-indigo-300 dark:border-gray-700'} `}>
                            <div className="flex items-center gap-3">
                                <input type="radio" name="paymentMethod" value="upi" checked={paymentMethod === 'upi'} onChange={(e) => setPaymentMethod(e.target.value)} className="w-4 h-4 text-indigo-600 focus:ring-indigo-500" />
                                <FiSmartphone className="text-xl text-gray-600 dark:text-gray-300" />
                                <div>
                                    <h4 className="font-semibold text-gray-800 dark:text-white text-sm">UPI</h4>
                                    <p className="text-xs text-gray-500">Google Pay, PhonePe, Paytm</p>
                                </div>
                            </div>
                        </label>

                        <label className={`block p-3 border rounded-lg cursor-pointer transition-all ${paymentMethod === 'netbanking' ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20' : 'border-gray-200 hover:border-indigo-300 dark:border-gray-700'} `}>
                            <div className="flex items-center gap-3">
                                <input type="radio" name="paymentMethod" value="netbanking" checked={paymentMethod === 'netbanking'} onChange={(e) => setPaymentMethod(e.target.value)} className="w-4 h-4 text-indigo-600 focus:ring-indigo-500" />
                                <FaBuilding className="text-xl text-gray-600 dark:text-gray-300" />
                                <div>
                                    <h4 className="font-semibold text-gray-800 dark:text-white text-sm">Net Banking</h4>
                                    <p className="text-xs text-gray-500">All major Indian banks</p>
                                </div>
                            </div>
                        </label>

                        <label className={`block p-3 border rounded-lg cursor-pointer transition-all ${paymentMethod === 'wallet' ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20' : 'border-gray-200 hover:border-indigo-300 dark:border-gray-700'} `}>
                            <div className="flex items-center gap-3">
                                <input type="radio" name="paymentMethod" value="wallet" checked={paymentMethod === 'wallet'} onChange={(e) => setPaymentMethod(e.target.value)} className="w-4 h-4 text-indigo-600 focus:ring-indigo-500" />
                                <FiBriefcase className="text-xl text-gray-600 dark:text-gray-300" />
                                <div>
                                    <h4 className="font-semibold text-gray-800 dark:text-white text-sm">Wallet</h4>
                                    <p className="text-xs text-gray-500">Pay using your app wallet</p>
                                </div>
                            </div>
                        </label>
                    </div>
                </div>

                {/* Right Column: Order Summary */}
                <div>
                    <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm sticky top-24">
                        <h3 className="text-lg font-bold mb-3 flex items-center gap-2 text-gray-800 dark:text-white">
                            Order Summary
                        </h3>

                        {/* Coupon Details */}
                        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 mb-4 flex items-start gap-3">
                            <div className="flex-1">
                                <span className="inline-block px-2 py-0.5 bg-indigo-100 text-indigo-800 text-[10px] font-bold rounded mb-1">{coupon.brand || coupon.store}</span>
                                <h4 className="font-bold text-gray-800 dark:text-white text-base leading-tight mb-1">{coupon.title}</h4>
                                <p className="text-green-600 font-semibold text-xs">{coupon.discount} OFF</p>
                            </div>
                            <div className="text-right flex-shrink-0">
                                <p className="text-xl font-extrabold text-gray-900 dark:text-white">₹{couponPrice}</p>
                            </div>
                        </div>

                        {/* Cost Breakdown */}
                        <div className="space-y-2 mb-4 text-sm">
                            <div className="flex justify-between text-gray-600 dark:text-gray-400">
                                <span>Item Price</span>
                                <span>₹{couponPrice}</span>
                            </div>
                            <div className="flex justify-between text-gray-600 dark:text-gray-400">
                                <span>Platform Fee ({PLATFORM_FEE_PERCENT}%)</span>
                                <span>₹{platformFee}</span>
                            </div>
                            <div className="flex justify-between text-gray-600 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700 pb-2">
                                <span>Taxes</span>
                                <span>Included</span>
                            </div>
                            <div className="pt-2 flex justify-between font-bold text-lg text-gray-900 dark:text-white">
                                <span>Total Amount</span>
                                <span>₹{totalAmount}</span>
                            </div>
                        </div>

                        {/* Secure Note */}
                        <div className="flex items-start gap-2 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 p-3 rounded-lg mb-4 text-xs">
                            <FiShield className="mt-0.5 shrink-0 text-sm" />
                            <span>Your payment is secure. We use industry-standard encryption to protect your details.</span>
                        </div>

                        {/* Action Button */}
                        <button
                            className={`w-full py-3 px-4 rounded-lg font-bold text-base text-white transition-all shadow-md flex justify-center items-center gap-2 ${loading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-indigo-500/30'}`}
                            onClick={handleDummyPayment}
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <svg style={{ width: 24, height: 24 }} className="animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                    Processing Payment...
                                </>
                            ) : (
                                `Pay ₹${totalAmount} Now`
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PaymentPage;
