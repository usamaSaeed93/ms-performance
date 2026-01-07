"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import Image from "next/image";
import { getCustomerToken, isCustomerAuthenticated } from "@/lib/utils/auth";
import { toast } from "sonner";

function OrderConfirmationContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  // Try multiple possible parameter names that Stripe might use
  const paymentIntentId = searchParams?.get("payment_intent") ||
    searchParams?.get("payment_intent_id") ||
    searchParams?.get("pi");
  const sessionId = searchParams?.get("session_id"); // Stripe Checkout session ID
  const orderId = searchParams?.get("order_id");
  const isCOD = searchParams?.get("cod") === "true";
  const isCancelled = searchParams?.get("cancelled") === "true";
  const [orderStatus, setOrderStatus] = useState<"loading" | "confirmed" | "processing" | "error" | "cancelled">("loading");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [orderNumber, setOrderNumber] = useState<string | null>(null);

  useEffect(() => {
    if (!isCustomerAuthenticated()) {
      router.push("/login");
      return;
    }

    // Handle cancelled checkout
    if (isCancelled) {
      setOrderStatus("cancelled");
      return;
    }

    // Handle COD orders - they're confirmed immediately
    if (isCOD && orderId) {
      setOrderStatus("confirmed");
      setOrderNumber(`ORD-${orderId}`);
      return;
    }

    // Handle Stripe Checkout session completion
    if (sessionId) {
      // Clear cart since payment was successful
      localStorage.removeItem('cart');
      localStorage.removeItem('applied_discount');

      // Check if order already exists (webhook may have created it)
      checkOrderBySessionId(sessionId);
      return;
    }

    if (!paymentIntentId) {
      // If no payment intent ID, try to get it from localStorage (if we stored it)
      const storedPaymentIntent = localStorage.getItem("last_payment_intent_id");
      if (storedPaymentIntent) {
        // Use stored payment intent and verify order
        verifyOrder(storedPaymentIntent);
        return;
      }

      // If also no order ID, show error
      if (!orderId) {
        setOrderStatus("error");
        setErrorMessage("No payment information found. Please check your email for order confirmation or contact support.");
        return;
      }
    }

    if (paymentIntentId) {
      verifyOrder(paymentIntentId);
    }
  }, [paymentIntentId, sessionId, orderId, isCOD, isCancelled, router]);

  const verifyOrder = async (paymentIntentIdToCheck: string) => {
    try {
      const token = getCustomerToken();
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

      // Check order status
      const orderResponse = await fetch(
        `${API_URL}/ecommerce/v1/check_order_status?payment_intent_id=${encodeURIComponent(paymentIntentIdToCheck)}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (orderResponse.ok) {
        const orderData = await orderResponse.json();
        if (orderData.data?.order_exists) {
          setOrderStatus("confirmed");
          setOrderNumber(orderData.data.order_number);
          return;
        }
      }

      // Check webhook status for errors
      const webhookResponse = await fetch(
        `${API_URL}/ecommerce/v1/check_webhook_status?payment_intent_id=${encodeURIComponent(paymentIntentIdToCheck)}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (webhookResponse.ok) {
        const webhookData = await webhookResponse.json();
        if (webhookData.data?.status === "failed") {
          setOrderStatus("error");
          setErrorMessage(webhookData.data.error || "Order processing failed. Please contact support.");
          toast.error("Order processing failed. Please contact support with your payment ID.");
          return;
        } else if (webhookData.data?.status === "processing" || webhookData.data?.status === "pending") {
          setOrderStatus("processing");
          return;
        }
      }

      // If we get here, order is still processing
      setOrderStatus("processing");
    } catch (error) {
      console.error("Error verifying order:", error);
      setOrderStatus("processing"); // Assume processing rather than error
    }
  };

  const checkOrderBySessionId = async (sessionIdToCheck: string) => {
    try {
      const token = getCustomerToken();
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

      // Check order status by session ID
      const orderResponse = await fetch(
        `${API_URL}/ecommerce/v1/check_order_status?session_id=${encodeURIComponent(sessionIdToCheck)}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (orderResponse.ok) {
        const orderData = await orderResponse.json();
        if (orderData.data?.order_exists) {
          setOrderStatus("confirmed");
          setOrderNumber(orderData.data.order_number);
          return;
        }
      }

      // Order not found yet, webhook may still be processing
      setOrderStatus("processing");
    } catch (error) {
      console.error("Error checking order by session ID:", error);
      setOrderStatus("processing"); // Assume processing rather than error
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="pt-8">
        <div className="overflow-hidden">
          <Navbar ctaText="Become A Dealer" />

          <main className="space-y-12">
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-[#030814] text-white h-[360px]">
              <Image
                src="/images/hero/slider1.jpg"
                alt="Order Confirmation"
                width={1600}
                height={200}
                className="absolute inset-0 h-full w-full object-cover"
                priority
              />
              <div className="absolute inset-0 bg-black/60" />
              <div className="relative h-full flex items-center px-4 sm:px-6 md:px-8 lg:px-12">
                <h1 className="text-3xl font-black sm:text-4xl md:text-5xl lg:text-6xl animate-heading">
                  {orderStatus === "confirmed" ? "Order Confirmed" :
                    orderStatus === "processing" ? "Processing Order" :
                      orderStatus === "error" ? "Order Issue" : "Order Confirmation"}
                </h1>
              </div>
            </section>

            {/* Confirmation Content */}
            <section className="px-4 py-6 sm:px-8 md:py-10 lg:px-12">
              <div className="max-w-2xl mx-auto text-center">
                {orderStatus === "loading" && (
                  <>
                    <div className="bg-blue-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6 animate-pulse">
                      <svg className="w-12 h-12 text-blue-600 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    </div>
                    <h2 className="text-3xl font-bold mb-4">Verifying Your Order...</h2>
                    <p className="text-gray-600 mb-8">Please wait while we confirm your order status.</p>
                  </>
                )}

                {orderStatus === "confirmed" && (
                  <>
                    <div className="bg-green-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                      <svg
                        className="w-12 h-12 text-green-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <h2 className="text-3xl font-bold mb-4">Thank You for Your Order!</h2>
                    {isCOD ? (
                      <div className="space-y-4 mb-8">
                        <p className="text-gray-600">
                          Your order has been placed successfully. You will pay in cash when your order is delivered.
                        </p>
                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-left">
                          <p className="font-semibold text-amber-800 mb-2">Cash on Delivery</p>
                          <p className="text-sm text-amber-700">
                            Please have the exact amount ready when our delivery partner arrives.
                            You will receive a confirmation email with your order details.
                          </p>
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-600 mb-8">
                        Your payment has been processed successfully. We've sent a confirmation email with your order details.
                      </p>
                    )}
                    {orderNumber && (
                      <div className="bg-gray-50 rounded-lg p-4 mb-8">
                        <p className="text-sm text-gray-600">Order Number</p>
                        <p className="font-mono text-lg font-bold">{orderNumber}</p>
                      </div>
                    )}
                  </>
                )}

                {orderStatus === "processing" && (
                  <>
                    <div className="bg-yellow-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                      <svg className="w-12 h-12 text-yellow-600 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    </div>
                    <h2 className="text-3xl font-bold mb-4">Your Order is Being Processed</h2>
                    <p className="text-gray-600 mb-8">
                      Your payment was successful! Your order is currently being processed. You will receive a confirmation email shortly.
                    </p>
                  </>
                )}

                {orderStatus === "error" && (
                  <>
                    <div className="bg-red-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                      <svg
                        className="w-12 h-12 text-red-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </div>
                    <h2 className="text-3xl font-bold mb-4 text-red-600">Order Processing Issue</h2>
                    <p className="text-gray-600 mb-4">
                      {errorMessage || "There was an issue processing your order. Your payment was successful, but we encountered an error creating your order."}
                    </p>
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
                      <p className="text-sm font-semibold text-red-800 mb-2">What to do:</p>
                      <ul className="text-sm text-red-700 text-left space-y-1">
                        <li>• Your payment was successful and will not be charged again</li>
                        <li>• Please contact support with your Payment ID below</li>
                        <li>• Our team will manually process your order</li>
                      </ul>
                    </div>
                  </>
                )}

                {orderStatus === "cancelled" && (
                  <>
                    <div className="bg-gray-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                      <svg
                        className="w-12 h-12 text-gray-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <h2 className="text-3xl font-bold mb-4">Checkout Cancelled</h2>
                    <p className="text-gray-600 mb-8">
                      Your checkout was cancelled. No payment has been made. You can return to checkout to complete your order.
                    </p>
                  </>
                )}

                {paymentIntentId && (
                  <div className="bg-gray-50 rounded-lg p-4 mb-8">
                    <p className="text-sm text-gray-600 mb-1">Payment ID</p>
                    <p className="font-mono text-sm break-all">{paymentIntentId}</p>
                    {orderStatus === "error" && (
                      <p className="text-xs text-red-600 mt-2">Please save this ID and contact support</p>
                    )}
                  </div>
                )}

                <div className="flex gap-4 justify-center flex-wrap">
                  {orderStatus === "confirmed" && (
                    <>
                      <Link
                        href="/products"
                        className="rounded-[12px] bg-[#1d70ff] px-6 py-3 text-white font-semibold hover:bg-[#1a5fdd] transition"
                      >
                        Continue Shopping
                      </Link>
                      <Link
                        href="/orders"
                        className="rounded-[12px] border-2 border-[#1d70ff] px-6 py-3 text-[#1d70ff] font-semibold hover:bg-[#1d70ff]/5 transition"
                      >
                        View Orders
                      </Link>
                    </>
                  )}
                  {orderStatus === "processing" && (
                    <>
                      <Link
                        href="/products"
                        className="rounded-[12px] bg-[#1d70ff] px-6 py-3 text-white font-semibold hover:bg-[#1a5fdd] transition"
                      >
                        Continue Shopping
                      </Link>
                      <button
                        onClick={() => window.location.reload()}
                        className="rounded-[12px] border-2 border-[#1d70ff] px-6 py-3 text-[#1d70ff] font-semibold hover:bg-[#1d70ff]/5 transition"
                      >
                        Refresh Status
                      </button>
                    </>
                  )}
                  {orderStatus === "error" && (
                    <>
                      <Link
                        href="/contact-us"
                        className="rounded-[12px] bg-red-600 px-6 py-3 text-white font-semibold hover:bg-red-700 transition"
                      >
                        Contact Support
                      </Link>
                      <Link
                        href="/products"
                        className="rounded-[12px] border-2 border-gray-300 px-6 py-3 text-gray-700 font-semibold hover:bg-gray-50 transition"
                      >
                        Continue Shopping
                      </Link>
                    </>
                  )}
                  {orderStatus === "cancelled" && (
                    <>
                      <Link
                        href="/checkout"
                        className="rounded-[12px] bg-[#1d70ff] px-6 py-3 text-white font-semibold hover:bg-[#1a5fdd] transition"
                      >
                        Return to Checkout
                      </Link>
                      <Link
                        href="/cart"
                        className="rounded-[12px] border-2 border-[#1d70ff] px-6 py-3 text-[#1d70ff] font-semibold hover:bg-[#1d70ff]/5 transition"
                      >
                        View Cart
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}

export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-100">
        <div className="pt-8">
          <div className="overflow-hidden">
            <Navbar ctaText="Become A Dealer" />
            <main className="space-y-12">
              <section className="relative overflow-hidden bg-[#030814] text-white h-[360px]">
                <Image
                  src="/images/hero/slider1.jpg"
                  alt="Order Confirmation"
                  width={1600}
                  height={200}
                  className="absolute inset-0 h-full w-full object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-black/60" />
                <div className="relative h-full flex items-center px-4 sm:px-6 md:px-8 lg:px-12">
                  <h1 className="text-3xl font-black sm:text-4xl md:text-5xl lg:text-6xl animate-heading">
                    Order Confirmation
                  </h1>
                </div>
              </section>
              <section className="px-4 py-6 sm:px-8 md:py-10 lg:px-12">
                <div className="max-w-2xl mx-auto text-center">
                  <div className="bg-blue-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6 animate-pulse">
                    <svg className="w-12 h-12 text-blue-600 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </div>
                  <h2 className="text-3xl font-bold mb-4">Loading...</h2>
                  <p className="text-gray-600 mb-8">Please wait while we load your order confirmation.</p>
                </div>
              </section>
            </main>
          </div>
        </div>
      </div>
    }>
      <OrderConfirmationContent />
    </Suspense>
  );
}

