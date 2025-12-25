"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { isCustomerAuthenticated, getCustomerToken } from "@/lib/utils/auth";
import { Navbar } from "@/components/Navbar";
import { createPaymentIntent } from "@/lib/api/stripe";
import { toast } from "sonner";
import Image from "next/image";
import { getCartItems } from "@/lib/utils/cart";

// Initialize Stripe
const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
if (!stripePublishableKey) {
  console.error("NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not set!");
}

const stripePromise = stripePublishableKey ? loadStripe(stripePublishableKey) : null;

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [shippingCost, setShippingCost] = useState(15);
  const [shippingAddress, setShippingAddress] = useState({
    country: "GB",
    state: "",
    postcode: "",
    city: "",
    address: "",
  });

  useEffect(() => {
    // Check authentication
    if (!isCustomerAuthenticated()) {
      router.push("/login?redirect=/checkout");
      return;
    }

    // Load cart items from localStorage
    const cartItems = getCartItems();
    if (cartItems.length > 0) {
      setCartItems(cartItems);
      setIsChecking(false);
    } else {
      // If no cart found, redirect to cart page
      toast.error("Your cart is empty. Please add items to your cart first.");
      router.push("/cart");
    }
  }, [router]);

  useEffect(() => {
    if (cartItems.length > 0 && !clientSecret) {
      initializePayment();
    }
  }, [cartItems]);

  const initializePayment = async () => {
    try {
      setLoading(true);
      const token = getCustomerToken();
      console.log("Token retrieved:", token ? "Token exists" : "No token");
      
      if (!token) {
        toast.error("Please log in to continue");
        router.push("/login?redirect=/checkout");
        return;
      }

      const subtotal = cartItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
      const vat = subtotal * 0.2;
      const total = subtotal + vat + shippingCost;

      console.log("Creating payment intent with data:", {
        items: cartItems.map((item) => ({
          product_id: item.id,
          quantity: item.quantity,
        })),
        shipping_cost: shippingCost,
        country_code: shippingAddress.country,
      });

      const paymentIntent = await createPaymentIntent(
        {
          items: cartItems.map((item) => ({
            product_id: item.id,
            quantity: item.quantity,
          })),
          shipping_cost: shippingCost,
          country_code: shippingAddress.country,
          state_code: shippingAddress.state || undefined,
          postcode: shippingAddress.postcode || undefined,
          city: shippingAddress.city || undefined,
          shipping_address: shippingAddress.address || undefined,
        },
        token
      );

      console.log("Payment intent created:", paymentIntent);
      setClientSecret(paymentIntent.client_secret);
    } catch (error: any) {
      console.error("Payment initialization error:", error);
      const errorMessage = error.message || "Failed to initialize payment";
      toast.error(errorMessage);
      
      // If authentication failed, redirect to login
      if (errorMessage.includes("authorized") || errorMessage.includes("403")) {
        router.push("/login?redirect=/checkout");
      }
    } finally {
      setLoading(false);
    }
  };

  if (isChecking) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const vat = subtotal * 0.2;
  const total = subtotal + vat + shippingCost;

  return (
    <div className="min-h-screen bg-black">
      <div className="pt-8">
        <div className="bg-white rounded-[20px] shadow-[0_20px_60px_rgba(0,0,0,0.3)] overflow-hidden">
          <Navbar ctaText="Become A Dealer" />

          <main className="space-y-12">
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-[#030814] text-white h-[360px]">
              <Image
                src="/images/hero/slider1.jpg"
                alt="Checkout"
                width={1600}
                height={200}
                className="absolute inset-0 h-full w-full object-cover"
                priority
              />
              <div className="absolute inset-0 bg-black/60" />
              <div className="relative h-full flex items-center px-4 sm:px-6 md:px-8 lg:px-12">
                <h1 className="text-3xl font-black sm:text-4xl md:text-5xl lg:text-6xl animate-heading">
                  Checkout
                </h1>
              </div>
            </section>

            {/* Checkout Content */}
            <section className="px-4 py-6 sm:px-8 md:py-10 lg:px-12">
              <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Order Summary */}
                <div className="lg:col-span-1">
                  <div className="bg-white rounded-[12px] border border-gray-200 p-6 sticky top-8">
                    <h2 className="text-xl font-bold mb-6">Order Summary</h2>

                    <div className="space-y-4 mb-6">
                      {cartItems.map((item) => (
                        <div key={item.id} className="flex gap-4">
                          <Image
                            src={item.image}
                            alt={item.name}
                            width={80}
                            height={80}
                            className="rounded-lg object-cover"
                          />
                          <div className="flex-1">
                            <h3 className="font-semibold">{item.name}</h3>
                            <p className="text-sm text-gray-600">
                              Qty: {item.quantity}
                            </p>
                            <p className="font-semibold mt-1">
                              £{(item.price * item.quantity).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="border-t pt-4 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Subtotal</span>
                        <span>£{subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>VAT (20%)</span>
                        <span>£{vat.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Shipping</span>
                        <span>£{shippingCost.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between font-bold text-lg border-t pt-2 mt-2">
                        <span>Total</span>
                        <span>£{total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment Form */}
                <div className="lg:col-span-2">
                  <div className="bg-white rounded-[12px] border border-gray-200 p-6">
                    <h2 className="text-xl font-bold mb-6">Shipping & Payment</h2>

                    {/* Shipping Address */}
                    <div className="mb-8 space-y-4">
                      <h3 className="font-semibold">Shipping Address</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Country
                          </label>
                          <select
                            className="w-full px-4 py-2 border rounded-lg"
                            value={shippingAddress.country}
                            onChange={(e) =>
                              setShippingAddress({
                                ...shippingAddress,
                                country: e.target.value,
                              })
                            }
                          >
                            <option value="GB">United Kingdom</option>
                            <option value="US">United States</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            City
                          </label>
                          <input
                            type="text"
                            className="w-full px-4 py-2 border rounded-lg"
                            value={shippingAddress.city}
                            onChange={(e) =>
                              setShippingAddress({
                                ...shippingAddress,
                                city: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            State/County
                          </label>
                          <input
                            type="text"
                            className="w-full px-4 py-2 border rounded-lg"
                            value={shippingAddress.state}
                            onChange={(e) =>
                              setShippingAddress({
                                ...shippingAddress,
                                state: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Postcode
                          </label>
                          <input
                            type="text"
                            className="w-full px-4 py-2 border rounded-lg"
                            value={shippingAddress.postcode}
                            onChange={(e) =>
                              setShippingAddress({
                                ...shippingAddress,
                                postcode: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Address
                        </label>
                        <textarea
                          className="w-full px-4 py-2 border rounded-lg"
                          rows={3}
                          value={shippingAddress.address}
                          onChange={(e) =>
                            setShippingAddress({
                              ...shippingAddress,
                              address: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>

                    {/* Stripe Payment Element */}
                    {clientSecret && stripePromise && (
                      <Elements
                        stripe={stripePromise}
                        options={{
                          clientSecret,
                          appearance: {
                            theme: "stripe",
                          },
                        }}
                      >
                        <CheckoutForm
                          onSuccess={(paymentIntentId?: string) => {
                            if (paymentIntentId) {
                              router.push(`/order-confirmation?payment_intent=${paymentIntentId}`);
                            } else {
                              router.push("/order-confirmation");
                            }
                          }}
                        />
                      </Elements>
                    )}
                    {clientSecret && !stripePromise && (
                      <div className="text-center py-8">
                        <p className="text-red-600">Stripe is not configured. Please set NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY in your environment variables.</p>
                      </div>
                    )}

                    {!clientSecret && (
                      <div className="text-center py-8">
                        <p className="text-gray-600">Initializing payment...</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}

function CheckoutForm({ onSuccess }: { onSuccess: (paymentIntentId?: string) => void }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const router = useRouter();

  const checkOrderStatus = async (paymentIntentId: string): Promise<{ exists: boolean; error?: string }> => {
    try {
      const token = getCustomerToken();
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      
      // Check order status
      const orderResponse = await fetch(
        `${API_URL}/ecommerce/v1/check_order_status?payment_intent_id=${encodeURIComponent(paymentIntentId)}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );
      
      if (orderResponse.ok) {
        const orderData = await orderResponse.json();
        if (orderData.data?.order_exists) {
          return { exists: true };
        }
      }
      
      // If order doesn't exist, check webhook status for errors
      const webhookResponse = await fetch(
        `${API_URL}/ecommerce/v1/check_webhook_status?payment_intent_id=${encodeURIComponent(paymentIntentId)}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );
      
      if (webhookResponse.ok) {
        const webhookData = await webhookResponse.json();
        if (webhookData.data?.status === "failed") {
          return { 
            exists: false, 
            error: webhookData.data.error || "Order processing failed. Please contact support." 
          };
        }
      }
      
      return { exists: false };
    } catch (error) {
      console.error('Error checking order status:', error);
      return { exists: false };
    }
  };

  const pollOrderStatus = async (paymentIntentId: string, maxAttempts = 15): Promise<{ success: boolean; error?: string }> => {
    for (let i = 0; i < maxAttempts; i++) {
      await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds between checks
      const result = await checkOrderStatus(paymentIntentId);
      if (result.exists) {
        return { success: true };
      }
      if (result.error) {
        return { success: false, error: result.error };
      }
    }
    return { success: false, error: "Order is still processing. Please check your email for confirmation or contact support if you don't receive it within a few minutes." };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setLoading(true);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/order-confirmation`,
      },
      redirect: "if_required",
    });

    if (error) {
      toast.error(error.message || "Payment failed");
      setLoading(false);
    } else if (paymentIntent && paymentIntent.status === "succeeded") {
      // Payment succeeded, now wait for webhook to process
      setLoading(false);
      setProcessing(true);
      toast.info("Payment successful! Processing your order...", { duration: 5000 });
      
      // Poll for order creation (webhook should create it)
      const result = await pollOrderStatus(paymentIntent.id);
      
      if (result.success) {
        toast.success("Order placed successfully!");
        // Store payment intent ID in localStorage as backup
        localStorage.setItem("last_payment_intent_id", paymentIntent.id);
        onSuccess(paymentIntent.id);
      } else {
        // Show error message
        toast.error(result.error || "Order processing failed. Please contact support with your payment ID.");
        setProcessing(false);
        
        // Don't redirect to success page if there's an error
        // Show error state instead
        toast.error(
          `Payment ID: ${paymentIntent.id}. Please save this ID and contact support if the issue persists.`,
          { duration: 10000 }
        );
        
        // Still redirect but with payment intent ID so they can see the error on confirmation page
        // This allows them to see the payment ID and contact support
        localStorage.setItem("last_payment_intent_id", paymentIntent.id);
        setTimeout(() => {
          onSuccess(paymentIntent.id);
        }, 3000);
      }
    } else {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      <button
        type="submit"
        disabled={!stripe || loading || processing}
        className="w-full rounded-[12px] bg-[#1d70ff] px-6 py-4 text-center text-base font-semibold text-white hover:bg-[#1a5fdd] transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Processing Payment..." : processing ? "Processing Order..." : "Pay Now"}
      </button>
      {processing && (
        <p className="text-sm text-gray-600 text-center">
          Please wait while we process your order...
        </p>
      )}
    </form>
  );
}

