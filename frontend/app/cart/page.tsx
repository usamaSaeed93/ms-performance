"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { isCustomerAuthenticated } from "@/lib/utils/auth";
import { Navbar } from "@/components/Navbar";
import { toast } from "sonner";
import { getCartItems, saveCartItems, removeFromCart, updateCartItemQuantity } from "@/lib/utils/cart";

// Dummy cart items
const cartItems = [
  {
    id: 1,
    name: "Gradient Graphic T-shirt",
    price: 145,
    quantity: 1,
    image: "/images/products/product1.png",
  },
  {
    id: 2,
    name: "Checkered Shirt",
    price: 180,
    quantity: 1,
    image: "/images/products/product2.png",
  },
  {
    id: 3,
    name: "Skinny Fit Jeans",
    price: 240,
    quantity: 1,
    image: "/images/products/product3.png",
  },
];

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

interface AppliedDiscount {
  code: string;
  name: string;
  discount_type: string;
  discount_value: number;
  discount_amount: number;
}

export default function CartPage() {
  const router = useRouter();
  const [items, setItems] = useState<typeof cartItems>([]);
  const [promoCode, setPromoCode] = useState("");
  const [isChecking, setIsChecking] = useState(true);
  const [isApplyingPromo, setIsApplyingPromo] = useState(false);
  const [appliedDiscount, setAppliedDiscount] = useState<AppliedDiscount | null>(null);
  const [promoError, setPromoError] = useState("");

  useEffect(() => {
    // Check if user is authenticated
    if (!isCustomerAuthenticated()) {
      router.push("/login?redirect=/cart");
      return;
    }

    // Load cart from localStorage
    const cartItems = getCartItems();
    setItems(cartItems);

    // Load applied discount from localStorage if any
    const savedDiscount = localStorage.getItem('applied_discount');
    if (savedDiscount) {
      try {
        setAppliedDiscount(JSON.parse(savedDiscount));
      } catch (e) {
        localStorage.removeItem('applied_discount');
      }
    }

    setIsChecking(false);
  }, [router]);

  // Save cart to localStorage whenever items change
  useEffect(() => {
    if (!isChecking) {
      if (items.length === 0) {
        // Clear localStorage if cart is empty
        if (typeof window !== 'undefined') {
          localStorage.removeItem('cart');
          localStorage.removeItem('applied_discount');
          setAppliedDiscount(null);
        }
      } else {
        saveCartItems(items);
      }
    }
  }, [items, isChecking]);

  // Re-validate discount when subtotal changes
  useEffect(() => {
    if (appliedDiscount && items.length > 0) {
      // Recalculate discount amount based on new subtotal
      const newSubtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      validatePromoCode(appliedDiscount.code, newSubtotal, true);
    }
  }, [items]);

  const validatePromoCode = async (code: string, orderAmount: number, silent: boolean = false) => {
    try {
      const response = await fetch(`${API_BASE_URL}/ecommerce/v1/validate-discount`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: code,
          order_amount: orderAmount,
        }),
      });

      const result = await response.json();
      const data = result.data || result;

      if (data.valid) {
        const discount: AppliedDiscount = {
          code: data.code,
          name: data.name,
          discount_type: data.discount_type,
          discount_value: data.discount_value,
          discount_amount: data.discount_amount,
        };
        setAppliedDiscount(discount);
        localStorage.setItem('applied_discount', JSON.stringify(discount));
        setPromoError("");
        if (!silent) {
          toast.success(data.message);
        }
        return true;
      } else {
        if (!silent) {
          setPromoError(data.message);
          toast.error(data.message);
        }
        // If validation fails on recalculation, remove the discount
        if (silent) {
          setAppliedDiscount(null);
          localStorage.removeItem('applied_discount');
        }
        return false;
      }
    } catch (error) {
      if (!silent) {
        const errorMsg = "Failed to validate promo code";
        setPromoError(errorMsg);
        toast.error(errorMsg);
      }
      return false;
    }
  };

  const handleApplyPromo = async () => {
    if (!promoCode.trim()) {
      setPromoError("Please enter a promo code");
      return;
    }

    setIsApplyingPromo(true);
    setPromoError("");

    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    await validatePromoCode(promoCode.trim(), subtotal);

    setIsApplyingPromo(false);
  };

  const handleRemoveDiscount = () => {
    setAppliedDiscount(null);
    setPromoCode("");
    setPromoError("");
    localStorage.removeItem('applied_discount');
    toast.success("Promo code removed");
  };

  if (isChecking) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  const updateQuantity = (id: number, change: number) => {
    setItems((prevItems) => {
      const updatedItems = prevItems.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + change) }
          : item
      );
      // Update localStorage
      saveCartItems(updatedItems);
      return updatedItems;
    });
  };

  const removeItem = (id: number) => {
    removeFromCart(id);
    setItems((prevItems) => prevItems.filter((item) => item.id !== id));
    toast.success("Item removed from cart");
  };

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const vat = subtotal * 0.2; // 20% UK VAT
  const discount = appliedDiscount ? appliedDiscount.discount_amount : 0;
  const deliveryFee = items.length > 0 ? 15 : 0;
  const deliveryVat = deliveryFee * 0.2; // VAT on delivery
  const total = items.length > 0 ? subtotal + vat - discount + deliveryFee + deliveryVat : 0;

  return (
    <div className="min-h-screen bg-white">
      <div className="pt-8">
        <div className="bg-white overflow-hidden">
          <Navbar ctaText="Become A Dealer" />

          <main className="space-y-12">
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-[#030814] text-white h-[360px]">
              <Image
                src="/images/hero/slider1.jpg"
                alt="Cart"
                width={1600}
                height={200}
                className="absolute inset-0 h-full w-full object-cover"
                priority
              />
              <div className="absolute inset-0 bg-black/60" />
              <div className="relative h-full flex items-center px-4 sm:px-6 md:px-8 lg:px-12">
                <h1 className="text-3xl font-black sm:text-4xl md:text-5xl lg:text-6xl animate-heading">Cart</h1>
              </div>
            </section>

            {/* Cart Content */}
            <section className="px-4 py-6 sm:px-6 sm:py-8 md:px-8 md:py-10 lg:px-12">
              <div className="grid gap-6 lg:grid-cols-[2fr_1fr] lg:gap-8">
                {/* Left Column - Cart Items */}
                <div className="space-y-3 sm:space-y-4">
                  <h2 className="text-xl font-bold text-[#0c1b33] mb-4 sm:text-2xl sm:mb-6">Cart</h2>
                  {items.length === 0 ? (
                    <div className="bg-white rounded-xl p-6 text-center shadow-sm sm:rounded-2xl sm:p-8">
                      <p className="text-sm text-[#5c6c86] sm:text-base">Your cart is empty</p>
                      <Link href="/products" className="mt-3 inline-block text-sm text-[#1d70ff] hover:underline sm:mt-4 sm:text-base">
                        Continue Shopping
                      </Link>
                    </div>
                  ) : (
                    items.map((item, index) => (
                      <div
                        key={item.id}
                        className={`bg-white rounded-xl p-4 flex flex-col gap-3 shadow-sm sm:rounded-2xl sm:p-5 sm:flex-row sm:gap-4 md:rounded-[16px] md:p-6 card-hover ${index === 0 ? 'animate-card' : index === 1 ? 'animate-card-delay-1' : 'animate-card-delay-2'
                          }`}
                      >
                        {/* Product Image */}
                        <div className="relative w-full h-32 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 sm:w-24 sm:h-24 sm:rounded-[8px]">
                          <Image
                            src={item.image}
                            alt={item.name}
                            width={96}
                            height={96}
                            className="w-full h-full object-cover animate-image-hover"
                          />
                        </div>

                        {/* Product Details */}
                        <div className="flex-1 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                          <div className="flex-1">
                            <h3 className="text-base font-semibold text-[#0c1b33] mb-1 sm:text-lg sm:mb-2">{item.name}</h3>
                            <p className="text-lg font-bold text-[#0c1b33] sm:text-xl">£{item.price}</p>
                          </div>

                          <div className="flex items-center justify-between sm:justify-end sm:gap-4">
                            {/* Quantity Selector */}
                            <div className="flex items-center gap-2 sm:gap-3">
                              <button
                                onClick={() => updateQuantity(item.id, -1)}
                                className="flex h-7 w-7 items-center justify-center rounded-lg border border-gray-300 bg-white hover:bg-gray-50 transition animate-button sm:h-8 sm:w-8 sm:rounded-[8px]"
                              >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-[#0c1b33] sm:w-4 sm:h-4">
                                  <path d="M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                </svg>
                              </button>
                              <span className="text-sm font-semibold text-[#0c1b33] min-w-[1.5rem] text-center sm:text-base sm:min-w-[2rem]">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.id, 1)}
                                className="flex h-7 w-7 items-center justify-center rounded-lg border border-gray-300 bg-white hover:bg-gray-50 transition animate-button sm:h-8 sm:w-8 sm:rounded-[8px]"
                              >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-[#0c1b33] sm:w-4 sm:h-4">
                                  <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                </svg>
                              </button>
                            </div>

                            {/* Remove Button */}
                            <button
                              onClick={() => removeItem(item.id)}
                              className="flex h-8 w-8 items-center justify-center rounded-lg text-red-500 hover:bg-red-50 transition sm:h-10 sm:w-10 sm:ml-4 sm:rounded-[8px]"
                            >
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                <path
                                  d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14zM10 11v6M14 11v6"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Right Column - Order Summary */}
                <div className="lg:sticky lg:top-8 h-fit">
                  <div className="bg-white rounded-xl p-4 space-y-4 shadow-sm sm:rounded-2xl sm:p-5 sm:space-y-5 md:rounded-[16px] md:p-6 md:space-y-6">
                    <h2 className="text-xl font-bold text-[#0c1b33] sm:text-2xl">Order Summary</h2>

                    {/* Price Breakdown */}
                    <div className="space-y-3 border-b border-gray-200 pb-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-[#5c6c86]">Subtotal</span>
                        <span className="font-semibold text-[#0c1b33]">£{subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-[#5c6c86]">VAT (20%)</span>
                        <span className="font-semibold text-[#0c1b33]">£{(subtotal * 0.2).toFixed(2)}</span>
                      </div>
                      {appliedDiscount && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-[#5c6c86]">
                            Discount ({appliedDiscount.code})
                            {appliedDiscount.discount_type === 'percentage'
                              ? ` -${appliedDiscount.discount_value}%`
                              : ''}
                          </span>
                          <span className="font-semibold text-green-600">-£{discount.toFixed(2)}</span>
                        </div>
                      )}
                      {items.length > 0 && (
                        <>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-[#5c6c86]">Delivery Fee</span>
                            <span className="font-semibold text-[#0c1b33]">£{deliveryFee.toFixed(2)}</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-[#5c6c86]">VAT on Delivery (20%)</span>
                            <span className="font-semibold text-[#0c1b33]">£{deliveryVat.toFixed(2)}</span>
                          </div>
                        </>
                      )}
                    </div>

                    {/* Total */}
                    <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                      <span className="text-lg font-bold text-[#0c1b33]">Total</span>
                      <span className="text-2xl font-black text-[#0c1b33]">£{total.toFixed(2)}</span>
                    </div>

                    {/* Promo Code */}
                    <div className="space-y-2">
                      {appliedDiscount ? (
                        <div className="flex items-center justify-between p-3 bg-green-50 rounded-[8px] border border-green-200">
                          <div className="flex items-center gap-2">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-green-600">
                              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <div>
                              <span className="text-sm font-semibold text-green-700">{appliedDiscount.code}</span>
                              <span className="text-xs text-green-600 ml-2">
                                {appliedDiscount.discount_type === 'percentage'
                                  ? `${appliedDiscount.discount_value}% off`
                                  : `£${appliedDiscount.discount_value} off`}
                              </span>
                            </div>
                          </div>
                          <button
                            onClick={handleRemoveDiscount}
                            className="text-sm text-red-500 hover:text-red-700 font-medium"
                          >
                            Remove
                          </button>
                        </div>
                      ) : (
                        <>
                          <div className="flex gap-2">
                            <div className="relative flex-1">
                              <input
                                type="text"
                                placeholder="Add promo code"
                                value={promoCode}
                                onChange={(e) => {
                                  setPromoCode(e.target.value.toUpperCase());
                                  setPromoError("");
                                }}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    e.preventDefault();
                                    handleApplyPromo();
                                  }
                                }}
                                className={`w-full rounded-[8px] border ${promoError ? 'border-red-400' : 'border-gray-300'} bg-gray-50 px-4 py-3 pl-10 pr-4 text-sm text-[#0c1b33] placeholder:text-gray-400 focus:border-[#1d70ff] focus:outline-none`}
                              />
                              <svg
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                              >
                                <path
                                  d="M7 7h.01M7 3h5a2 2 0 012 2v5M7 7v5a2 2 0 002 2h5m0 0h5a2 2 0 002-2v-5a2 2 0 00-2-2h-5m0 0V5a2 2 0 012-2h5a2 2 0 012 2v5a2 2 0 01-2 2h-5"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </div>
                            <button
                              onClick={handleApplyPromo}
                              disabled={isApplyingPromo || !promoCode.trim()}
                              className="rounded-[8px] bg-[#1d70ff] px-6 py-3 text-sm font-semibold text-white hover:bg-[#1a5fdd] transition animate-button disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {isApplyingPromo ? "..." : "Apply"}
                            </button>
                          </div>
                          {promoError && (
                            <p className="text-xs text-red-500">{promoError}</p>
                          )}
                        </>
                      )}
                    </div>

                    {/* Checkout Button */}
                    <button
                      onClick={() => {
                        // Ensure cart is saved before navigating
                        if (items.length > 0) {
                          localStorage.setItem('cart', JSON.stringify(items));
                          router.push("/checkout");
                        } else {
                          toast.error("Your cart is empty");
                        }
                      }}
                      className="block w-full rounded-[12px] bg-[#1d70ff] px-6 py-4 text-center text-base font-semibold text-white hover:bg-[#1a5fdd] transition animate-button"
                    >
                      Go to Checkout →
                    </button>
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


