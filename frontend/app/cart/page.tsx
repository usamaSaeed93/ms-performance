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

export default function CartPage() {
  const router = useRouter();
  const [items, setItems] = useState<typeof cartItems>([]);
  const [promoCode, setPromoCode] = useState("");
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Check if user is authenticated
    if (!isCustomerAuthenticated()) {
      router.push("/login?redirect=/cart");
      return;
    }

    // Load cart from localStorage
    const cartItems = getCartItems();
    setItems(cartItems);
    setIsChecking(false);
  }, [router]);

  // Save cart to localStorage whenever items change
  useEffect(() => {
    if (!isChecking) {
      if (items.length === 0) {
        // Clear localStorage if cart is empty
        if (typeof window !== 'undefined') {
          localStorage.removeItem('cart');
        }
      } else {
        saveCartItems(items);
      }
    }
  }, [items, isChecking]);

  if (isChecking) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
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
  const discount = subtotal * 0.2; // 20% discount
  const deliveryFee = 15;
  const deliveryVat = deliveryFee * 0.2; // VAT on delivery
  const total = subtotal + vat - discount + deliveryFee + deliveryVat;

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
                        className={`bg-white rounded-xl p-4 flex flex-col gap-3 shadow-sm sm:rounded-2xl sm:p-5 sm:flex-row sm:gap-4 md:rounded-[16px] md:p-6 card-hover ${
                          index === 0 ? 'animate-card' : index === 1 ? 'animate-card-delay-1' : 'animate-card-delay-2'
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
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-[#5c6c86]">Discount (-20%)</span>
                        <span className="font-semibold text-red-500">-£{discount.toFixed(2)}</span>
                      </div>
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
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <input
                            type="text"
                            placeholder="Add promo code"
                            value={promoCode}
                            onChange={(e) => setPromoCode(e.target.value)}
                            className="w-full rounded-[8px] border border-gray-300 bg-gray-50 px-4 py-3 pl-10 pr-4 text-sm text-[#0c1b33] placeholder:text-gray-400 focus:border-[#1d70ff] focus:outline-none"
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
                        <button className="rounded-[8px] bg-[#1d70ff] px-6 py-3 text-sm font-semibold text-white hover:bg-[#1a5fdd] transition animate-button">
                          Apply
                        </button>
                      </div>
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

            {/* Footer */}
            <footer className="border-t border-[#1d70ff]/100 px-8 py-12">
              <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr_1fr_1fr]">
                <div className="space-y-4">
                  <Link href="/">
                    <Image src="/images/logos/ms-logo.png" alt="MS Performance" width={160} height={48} />
                  </Link>
                  <p className="text-sm leading-relaxed text-[#5c6c86]">
                    At MSPerformance, we specialize in car performance boosting services, ranging from ECU
                    remapping to custom exhausts. With our wealth of experience, we also offer comprehensive
                    basic servicing to ensure the overall maintenance and reliability of your vehicle.
                  </p>
                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <span className="text-xs font-semibold text-[#9aa6bd]">Payment Methods:</span>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs text-[#5c6c86]">Visa</span>
                      <span className="text-xs text-[#5c6c86]">Mastercard</span>
                      <span className="text-xs text-[#5c6c86]">Maestro</span>
                      <span className="text-xs text-[#5c6c86]">American Express</span>
                      <span className="text-xs text-[#5c6c86]">PayPal</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-[#0c1b33]">Our headquarters address is:</h3>
                  <p className="text-sm text-[#5c6c86]">Unit 16, Bakers Ln, Chelmsford CM2 8LD</p>
                </div>

                <div className="space-y-4">
                  <h3 className="flex items-center gap-2 text-sm font-bold text-[#0c1b33]">
                    <span className="h-4 w-px bg-[#1d70ff]" />
                    Mailing Subscription
                  </h3>
                  <div className="space-y-3">
                    <input
                      type="text"
                      placeholder="Your Name"
                      className="w-full rounded-[8px] border border-[#dfe6f2] px-4 py-3 text-sm text-[#0c1b33] placeholder:text-[#9aa6bd] focus:border-[#1d70ff] focus:outline-none"
                    />
                    <input
                      type="email"
                      placeholder="Your Email"
                      className="w-full rounded-[8px] border border-[#dfe6f2] px-4 py-3 text-sm text-[#0c1b33] placeholder:text-[#9aa6bd] focus:border-[#1d70ff] focus:outline-none"
                    />
                    <button className="w-full rounded-[8px] bg-[#1d70ff] px-6 py-3 text-sm font-semibold text-white">
                      Subscribe
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-[#5c6c86]">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-[#1d70ff]">
                        <path
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                          fill="currentColor"
                        />
                      </svg>
                      <span>07751798603 / 01297715060</span>
                    </div>
                    <p className="text-xs text-[#9aa6bd]">Mon till Sat: 9:30 till 18:00</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-[#5c6c86]">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-[#1d70ff]">
                        <path
                          d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zm0 2v.51l8 5.33 8-5.33V6H4zm0 12h16V9.49l-8 5.33-8-5.33V18z"
                          fill="currentColor"
                        />
                      </svg>
                      <span>info@msperformance.co.uk</span>
                    </div>
                    <p className="text-xs text-[#9aa6bd]">We reply within 1 day</p>
                    <p className="text-xs text-[#5c6c86]">For overseas customers: +44 (0)1687 675-209</p>
                  </div>
                  <div className="pt-4">
                    <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-[#0c1b33]">
                      <span className="h-4 w-px bg-[#1d70ff]" />
                      Follow us
                    </h3>
                    <div className="space-y-2">
                      {["Facebook", "YouTube", "Twitter", "Instagram"].map((social) => (
                        <a
                          key={social}
                          href="#"
                          className="flex items-center gap-2 text-sm text-[#5c6c86] transition hover:text-[#1d70ff]"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-[#1d70ff]">
                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                            <path d="M12 8v8M8 12h8" stroke="currentColor" strokeWidth="2" />
                          </svg>
                          <span>{social}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-[#dfe6f2] pt-6">
                <p className="text-sm text-[#5c6c86]">© Copyright 2025 MSPerformance</p>
                <div className="flex flex-wrap items-center gap-3 text-sm text-[#5c6c86]">
                  <a href="#" className="hover:text-[#1d70ff]">
                    Privacy Policy
                  </a>
                  <span className="text-[#dfe6f2]">|</span>
                  <a href="#" className="hover:text-[#1d70ff]">
                    Delivery & Returns
                  </a>
                  <span className="text-[#dfe6f2]">|</span>
                  <a href="#" className="hover:text-[#1d70ff]">
                    Legal Information
                  </a>
                  <span className="text-[#dfe6f2]">|</span>
                  <a href="#" className="hover:text-[#1d70ff]">
                    Terms & Conditions
                  </a>
                </div>
              </div>
            </footer>
          </main>
        </div>
      </div>
    </div>
  );
}

