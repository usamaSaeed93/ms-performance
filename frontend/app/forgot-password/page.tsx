"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useForgotPasswordMutation } from "@/lib/store/api/authApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function ForgotPasswordPage() {
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      await forgotPassword({ email }).unwrap();
      setSubmitted(true);
      toast.success("If an account with that email exists, a reset link has been sent.");
    } catch (err: any) {
      const errorMessage = err?.data?.message || "Something went wrong. Please try again.";
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0f1a] via-[#0c1b33] to-[#1a2332] flex items-center justify-center p-4">
      <div className="w-full max-w-6xl">
        <div className="grid lg:grid-cols-2 gap-0 bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Left Side - Visual Section */}
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
                Reset Your Password
              </h1>
              <p className="text-xl text-white/80 mb-8 leading-relaxed">
                Don't worry, it happens to the best of us. Enter your email and we'll send you a link to reset your password.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-4 text-white/90">
                  <div className="mt-1">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-[#60a5fa]">
                      <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Check Your Email</h3>
                    <p className="text-sm text-white/70">We'll send a secure reset link to your inbox</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 text-white/90">
                  <div className="mt-1">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-[#60a5fa]">
                      <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Secure Process</h3>
                    <p className="text-sm text-white/70">Your reset link expires in 1 hour for safety</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative z-10 text-white/60 text-sm">
              <p>© 2025 MS Performance. All rights reserved.</p>
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="bg-white p-8 lg:p-12 flex flex-col justify-center">
            <div className="lg:hidden mb-8 text-center">
              <Link href="/">
                <Image src="/images/logos/ms-logo.png" alt="MS Performance" width={160} height={48} priority />
              </Link>
            </div>

            <div className="max-w-md mx-auto w-full">
              {!submitted ? (
                <>
                  <div className="mb-8">
                    <h2 className="text-3xl font-bold text-[#0c1b33] mb-2">Forgot Password</h2>
                    <p className="text-[#5c6c86]">Enter the email address associated with your account</p>
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
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full rounded-xl border-2 border-gray-200 bg-gray-50 px-4 py-3.5 text-sm text-[#0c1b33] placeholder:text-gray-400 focus:border-[#1d70ff] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1d70ff]/20 transition-all"
                      />
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
                          Sending...
                        </span>
                      ) : (
                        "Send Reset Link"
                      )}
                    </Button>
                  </form>
                </>
              ) : (
                <div className="text-center">
                  <div className="mb-6">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h2 className="text-3xl font-bold text-[#0c1b33] mb-2">Check Your Email</h2>
                    <p className="text-[#5c6c86] leading-relaxed">
                      If an account exists for <strong className="text-[#0c1b33]">{email}</strong>, we've sent a password reset link. Please check your inbox and spam folder.
                    </p>
                  </div>
                  <p className="text-sm text-[#5c6c86] mb-6">
                    The link will expire in 1 hour.
                  </p>
                  <Button
                    onClick={() => { setSubmitted(false); setEmail(""); }}
                    variant="outline"
                    className="rounded-xl border-2 border-gray-200 px-6 py-3 text-sm font-semibold text-[#0c1b33] hover:bg-gray-50 transition-all"
                  >
                    Try another email
                  </Button>
                </div>
              )}

              <div className="mt-8 pt-8 border-t border-gray-200 space-y-4 text-center">
                <p className="text-sm text-[#5c6c86]">
                  Remember your password?{" "}
                  <Link href="/login" className="text-[#1d70ff] hover:text-[#0c5ae0] font-semibold hover:underline transition">
                    Back to Login
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
