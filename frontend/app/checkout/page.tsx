"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { isCustomerAuthenticated, getCustomerToken } from "@/lib/utils/auth";
import { Navbar } from "@/components/Navbar";
import { createCheckoutSession } from "@/lib/api/stripe";
import { toast } from "sonner";
import Image from "next/image";
import { getCartItems } from "@/lib/utils/cart";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

type PaymentMethod = 'card' | 'cod';

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
  const [loading, setLoading] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [shippingCost, setShippingCost] = useState(15);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [processingCOD, setProcessingCOD] = useState(false);
  const [processingStripe, setProcessingStripe] = useState(false);
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

  const handleStripeCheckout = async () => {
    try {
      setProcessingStripe(true);
      const token = getCustomerToken();

      if (!token) {
        toast.error("Please log in to continue");
        router.push("/login?redirect=/checkout");
        return;
      }

      // Save cart before redirecting (Stripe will redirect back)
      localStorage.setItem('cart', JSON.stringify(cartItems));

      // Create Stripe Checkout Session
      const checkoutSession = await createCheckoutSession(
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

      // Redirect to Stripe Checkout
      if (checkoutSession.checkout_url) {
        window.location.href = checkoutSession.checkout_url;
      } else {
        throw new Error("No checkout URL returned");
      }
    } catch (error: any) {
      console.error("Stripe checkout error:", error);
      const errorMessage = error.message || "Failed to create checkout session";
      toast.error(errorMessage);

      if (errorMessage.includes("authorized") || errorMessage.includes("403")) {
        router.push("/login?redirect=/checkout");
      }
    } finally {
      setProcessingStripe(false);
    }
  };

  if (isChecking) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
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
    <div className="min-h-screen bg-gray-100">
      <div className="pt-8">
        <div className="overflow-hidden">
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

                    {/* Payment Method Selection */}
                    <div className="mb-8">
                      <h3 className="font-semibold mb-4">Payment Method</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <button
                          type="button"
                          onClick={() => setPaymentMethod('card')}
                          className={`p-4 border-2 rounded-lg text-left transition ${paymentMethod === 'card'
                            ? 'border-[#635BFF] bg-[#635BFF]/5'
                            : 'border-gray-200 hover:border-gray-300'
                            }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'card' ? 'border-[#635BFF]' : 'border-gray-300'
                              }`}>
                              {paymentMethod === 'card' && (
                                <div className="w-3 h-3 rounded-full bg-[#635BFF]" />
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              {/* Stripe Logo */}
                              <Image
                                src="/images/payment/stripe.png"
                                alt="Stripe"
                                width={60}
                                height={25}
                                className="object-contain"
                              />
                            </div>
                          </div>
                          <p className="text-xs text-gray-500 mt-1 ml-8">Pay securely with card</p>
                          <div className="mt-3 ml-8 flex flex-wrap gap-2">
                            {/* Visa */}
                            <div className="bg-white border border-gray-200 rounded px-1.5 py-0.5">
                              <Image
                                src="/images/payment/visa.jpg"
                                alt="Visa"
                                width={40}
                                height={25}
                                className="object-contain"
                              />
                            </div>
                            {/* Mastercard */}
                            <div className="bg-white border border-gray-200 rounded px-1.5 py-0.5">
                              <Image
                                src="/images/payment/mastercard.png"
                                alt="Mastercard"
                                width={40}
                                height={25}
                                className="object-contain"
                              />
                            </div>
                          </div>
                        </button>

                        <button
                          type="button"
                          onClick={() => setPaymentMethod('cod')}
                          className={`p-4 border-2 rounded-lg text-left transition ${paymentMethod === 'cod'
                            ? 'border-green-500 bg-green-50'
                            : 'border-gray-200 hover:border-gray-300'
                            }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'cod' ? 'border-green-500' : 'border-gray-300'
                              }`}>
                              {paymentMethod === 'cod' && (
                                <div className="w-3 h-3 rounded-full bg-green-500" />
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              {/* Cash Icon */}
                              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="text-green-600">
                                <rect x="2" y="6" width="20" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" />
                                <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" />
                                <path d="M6 9V9.01M18 15V15.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                              </svg>
                              <span className="font-semibold text-[#0c1b33]">Cash on Delivery</span>
                            </div>
                          </div>
                          <p className="text-xs text-gray-500 mt-1 ml-8">Pay when you receive your order</p>
                          <div className="mt-3 ml-8">
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded font-medium">No advance payment required</span>
                          </div>
                        </button>
                      </div>
                    </div>

                    {/* Card Payment (Stripe Checkout) */}
                    {paymentMethod === 'card' && (
                      <div className="space-y-4">
                        <div className="bg-[#635BFF]/5 border border-[#635BFF]/20 rounded-lg p-4">
                          <div className="flex items-start gap-3">
                            <Image
                              src="/images/payment/stripe.png"
                              alt="Stripe"
                              width={50}
                              height={22}
                              className="object-contain mt-0.5"
                            />
                            <div>
                              <p className="font-semibold text-[#0c1b33]">Secure Checkout</p>
                              <p className="text-sm text-gray-600 mt-1">
                                You will be redirected to Stripe's secure payment page to complete your purchase of <strong>£{total.toFixed(2)}</strong>.
                              </p>
                            </div>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={handleStripeCheckout}
                          disabled={processingStripe}
                          className="w-full rounded-[12px] bg-[#635BFF] px-6 py-4 text-center text-base font-semibold text-white hover:bg-[#5851ea] transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                        >
                          {processingStripe ? (
                            <>
                              <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Redirecting to Stripe...
                            </>
                          ) : (
                            <>
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-white">
                                <rect x="2" y="5" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="2" />
                                <path d="M2 10h20" stroke="currentColor" strokeWidth="2" />
                              </svg>
                              Pay with Card
                            </>
                          )}
                        </button>

                        <p className="text-xs text-gray-500 text-center">
                          You'll be securely redirected to Stripe to complete your payment
                        </p>
                      </div>
                    )}

                    {/* Cash on Delivery */}
                    {paymentMethod === 'cod' && (
                      <div className="space-y-4">
                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                          <div className="flex items-start gap-3">
                            <svg className="w-5 h-5 text-amber-600 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <div>
                              <p className="font-semibold text-amber-800">Cash on Delivery</p>
                              <p className="text-sm text-amber-700 mt-1">
                                You will pay <strong>£{total.toFixed(2)}</strong> in cash when your order is delivered.
                                Please keep the exact amount ready for our delivery partner.
                              </p>
                            </div>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={async () => {
                            if (!shippingAddress.address || !shippingAddress.city || !shippingAddress.postcode) {
                              toast.error("Please fill in all shipping address fields");
                              return;
                            }

                            setProcessingCOD(true);
                            try {
                              const token = getCustomerToken();
                              if (!token) {
                                toast.error("Please log in to continue");
                                router.push("/login?redirect=/checkout");
                                return;
                              }

                              // Create COD order
                              const response = await fetch(`${API_BASE_URL}/ecommerce/v1/purchase_products`, {
                                method: 'POST',
                                headers: {
                                  'Content-Type': 'application/json',
                                  'Authorization': `Bearer ${token}`,
                                },
                                body: JSON.stringify({
                                  items: cartItems.map((item) => ({
                                    product_id: item.id,
                                    quantity: item.quantity,
                                  })),
                                  payment_method: 'cod',
                                  shipping_address: shippingAddress.address,
                                  city: shippingAddress.city,
                                  state: shippingAddress.state,
                                  postcode: shippingAddress.postcode,
                                  country_code: shippingAddress.country,
                                }),
                              });

                              const result = await response.json();

                              if (response.ok && result.success) {
                                localStorage.removeItem('cart');
                                localStorage.removeItem('applied_discount');
                                toast.success("Order placed successfully!");
                                router.push(`/order-confirmation?order_id=${result.data?.order_id || ''}&cod=true`);
                              } else {
                                throw new Error(result.message || "Failed to place order");
                              }
                            } catch (error: any) {
                              toast.error(error.message || "Failed to place order");
                            } finally {
                              setProcessingCOD(false);
                            }
                          }}
                          disabled={processingCOD}
                          className="w-full rounded-[12px] bg-green-600 px-6 py-4 text-center text-base font-semibold text-white hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {processingCOD ? "Processing Order..." : "Place Order (Cash on Delivery)"}
                        </button>
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

