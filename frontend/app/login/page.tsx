"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useLoginMutation } from "@/lib/store/api/authApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [login, { isLoading }] = useLoginMutation();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const result = await login(formData).unwrap();

      if (result.access_token) {
        toast.success("Logged in successfully!");
        const redirect = searchParams.get("redirect") || "/products";
        router.push(redirect);
        router.refresh();
      }
    } catch (err: any) {
      const errorMessage = err?.data?.message || err?.message || "Login failed. Please try again.";
      setError(errorMessage);

      // Check if email not confirmed
      if (err?.data?.data?.email_confirmed === false) {
        toast.error("Please confirm your email address first. Check your inbox for the confirmation email.");
      } else {
        toast.error(errorMessage);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0f1a] via-[#0c1b33] to-[#1a2332] flex items-center justify-center p-4">
      <div className="w-full max-w-6xl">
        <div className="grid lg:grid-cols-2 gap-0 bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Left Side - Visual/Image Section */}
          <div className="hidden lg:flex relative bg-gradient-to-br from-[#1d70ff] via-[#0c1b33] to-[#1a2332] p-12 flex-col justify-between">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0" style={{
                backgroundImage: `url('/images/hero/slider1.jpg')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                filter: 'blur(20px)'
              }} />
            </div>
            <div className="relative z-10">
              <Link href="/" className="inline-block mb-8">
                <Image
                  src="/images/logos/ms-logo.png"
                  alt="MS Performance"
                  width={180}
                  height={54}
                  className="brightness-0 invert"
                  priority
                />
              </Link>
              <h1 className="text-5xl font-black text-white mb-6 leading-tight">
                Welcome Back!
              </h1>
              <p className="text-xl text-white/80 mb-8 leading-relaxed">
                Access your account to continue shopping for premium car performance parts and accessories.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-4 text-white/90">
                  <div className="mt-1">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-[#60a5fa]">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Secure Access</h3>
                    <p className="text-sm text-white/70">Your data is protected with enterprise-grade security</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 text-white/90">
                  <div className="mt-1">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-[#60a5fa]">
                      <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Fast Checkout</h3>
                    <p className="text-sm text-white/70">Quick and easy order process</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 text-white/90">
                  <div className="mt-1">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-[#60a5fa]">
                      <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Track Orders</h3>
                    <p className="text-sm text-white/70">Monitor your orders in real-time</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative z-10 text-white/60 text-sm">
              <p>© 2025 MS Performance. All rights reserved.</p>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className="bg-white p-8 lg:p-12 flex flex-col justify-center">
            <div className="lg:hidden mb-8 text-center">
              <Link href="/">
                <Image src="/images/logos/ms-logo.png" alt="MS Performance" width={160} height={48} priority />
              </Link>
            </div>

            <div className="max-w-md mx-auto w-full">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-[#0c1b33] mb-2">Login to Your Account</h2>
                <p className="text-[#5c6c86]">Enter your credentials to access your account</p>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-[#0c1b33] font-semibold text-sm">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="w-full rounded-xl border-2 border-gray-200 bg-gray-50 px-4 py-3.5 text-sm text-[#0c1b33] placeholder:text-gray-400 focus:border-[#1d70ff] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1d70ff]/20 transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-[#0c1b33] font-semibold text-sm">
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                    className="w-full rounded-xl border-2 border-gray-200 bg-gray-50 px-4 py-3.5 text-sm text-[#0c1b33] placeholder:text-gray-400 focus:border-[#1d70ff] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1d70ff]/20 transition-all"
                  />
                </div>

                <div className="flex justify-end">
                  <Link href="/forgot-password" className="text-sm text-[#1d70ff] hover:text-[#0c5ae0] font-medium hover:underline transition">
                    Forgot password?
                  </Link>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full rounded-xl bg-gradient-to-r from-[#1d70ff] to-[#0c5ae0] px-6 py-3.5 text-base font-semibold text-white hover:from-[#1a5fdd] hover:to-[#0a4bc0] transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Logging in...
                    </span>
                  ) : (
                    "Login"
                  )}
                </Button>
              </form>

              <div className="mt-8 pt-8 border-t border-gray-200 space-y-4 text-center">
                <p className="text-sm text-[#5c6c86]">
                  Don't have an account?{" "}
                  <Link href="/signup" className="text-[#1d70ff] hover:text-[#0c5ae0] font-semibold hover:underline transition">
                    Create one now
                  </Link>
                </p>
                <Link href="/" className="block text-sm text-[#5c6c86] hover:text-[#1d70ff] transition">
                  ← Back to home
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}

