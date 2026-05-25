"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useResetPasswordMutation } from "@/lib/store/api/authApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [resetPassword, { isLoading }] = useResetPasswordMutation();
  const [formData, setFormData] = useState({
    new_password: "",
    confirm_password: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (formData.new_password !== formData.confirm_password) {
      setError("Passwords do not match");
      return;
    }

    if (formData.new_password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (!token) {
      setError("Invalid reset link. Please request a new one.");
      return;
    }

    try {
      await resetPassword({ token, new_password: formData.new_password }).unwrap();
      setSuccess(true);
      toast.success("Password reset successfully!");
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (err: any) {
      const errorMessage = err?.data?.message || "Failed to reset password. The link may be invalid or expired.";
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0f1a] via-[#0c1b33] to-[#1a2332] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-[#0c1b33] mb-2">Invalid Reset Link</h2>
          <p className="text-[#5c6c86] mb-6">This password reset link is invalid or missing. Please request a new one.</p>
          <Link href="/forgot-password">
            <Button className="rounded-xl bg-gradient-to-r from-[#1d70ff] to-[#0c5ae0] px-6 py-3 text-base font-semibold text-white hover:from-[#1a5fdd] hover:to-[#0a4bc0] transition-all">
              Request New Link
            </Button>
          </Link>
        </div>
      </div>
    );
  }

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
                Set New Password
              </h1>
              <p className="text-xl text-white/80 mb-8 leading-relaxed">
                Choose a strong password to keep your account secure. Make sure it's at least 6 characters long.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-4 text-white/90">
                  <div className="mt-1">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-[#60a5fa]">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Strong Password</h3>
                    <p className="text-sm text-white/70">Use at least 6 characters with a mix of letters and numbers</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 text-white/90">
                  <div className="mt-1">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-[#60a5fa]">
                      <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Account Protection</h3>
                    <p className="text-sm text-white/70">Your password is encrypted with industry-standard security</p>
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
              {!success ? (
                <>
                  <div className="mb-8">
                    <h2 className="text-3xl font-bold text-[#0c1b33] mb-2">Reset Password</h2>
                    <p className="text-[#5c6c86]">Enter your new password below</p>
                  </div>

                  {error && (
                    <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
                      <p className="text-sm text-red-700">{error}</p>
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="new_password" className="text-[#0c1b33] font-semibold text-sm">
                        New Password
                      </Label>
                      <Input
                        id="new_password"
                        type="password"
                        placeholder="Enter new password"
                        value={formData.new_password}
                        onChange={(e) => setFormData({ ...formData, new_password: e.target.value })}
                        required
                        minLength={6}
                        className="w-full rounded-xl border-2 border-gray-200 bg-gray-50 px-4 py-3.5 text-sm text-[#0c1b33] placeholder:text-gray-400 focus:border-[#1d70ff] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1d70ff]/20 transition-all"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirm_password" className="text-[#0c1b33] font-semibold text-sm">
                        Confirm Password
                      </Label>
                      <Input
                        id="confirm_password"
                        type="password"
                        placeholder="Confirm new password"
                        value={formData.confirm_password}
                        onChange={(e) => setFormData({ ...formData, confirm_password: e.target.value })}
                        required
                        minLength={6}
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
                          Resetting...
                        </span>
                      ) : (
                        "Reset Password"
                      )}
                    </Button>
                  </form>
                </>
              ) : (
                <div className="text-center">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h2 className="text-3xl font-bold text-[#0c1b33] mb-2">Password Reset!</h2>
                  <p className="text-[#5c6c86] mb-6">Your password has been reset successfully. Redirecting to login...</p>
                </div>
              )}

              <div className="mt-8 pt-8 border-t border-gray-200 space-y-4 text-center">
                <Link href="/login" className="block text-sm text-[#5c6c86] hover:text-[#1d70ff] transition">
                  ← Back to Login
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
