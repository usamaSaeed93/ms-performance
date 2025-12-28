"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useConfirmEmailMutation, useResendConfirmationMutation } from "@/lib/store/api/authApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [confirmEmail, { isLoading: isConfirming }] = useConfirmEmailMutation();
  const [resendConfirmation, { isLoading: isResending }] = useResendConfirmationMutation();
  const [status, setStatus] = useState<"pending" | "success" | "error">("pending");
  const [message, setMessage] = useState("");
  const [resendEmail, setResendEmail] = useState("");

  useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      handleConfirm(token);
    }
  }, [searchParams]);

  const handleConfirm = async (token: string) => {
    try {
      const result = await confirmEmail({ token }).unwrap();
      if (result.email_confirmed) {
        setStatus("success");
        setMessage("Your email has been confirmed successfully!");
        toast.success("Email confirmed! You can now log in.");
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      }
    } catch (err: any) {
      setStatus("error");
      setMessage(err?.data?.message || "Invalid or expired confirmation token.");
      toast.error("Confirmation failed. Please try again.");
    }
  };

  const handleResend = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await resendConfirmation({ email: resendEmail }).unwrap();
      toast.success("Confirmation email sent! Please check your inbox.");
      setMessage("Confirmation email sent! Please check your inbox.");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to resend confirmation email.");
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="bg-white overflow-hidden max-w-md w-full">
        <div className={`p-8 text-center ${status === "success"
          ? "bg-gradient-to-r from-green-500 to-green-600"
          : status === "error"
            ? "bg-gradient-to-r from-red-500 to-red-600"
            : "bg-gradient-to-r from-[#0c1b33] to-[#1d70ff]"
          }`}>
          {status === "pending" && (
            <>
              <div className="mb-4">
                <svg className="w-16 h-16 mx-auto text-white animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">Verifying Email</h1>
              <p className="text-white/80">Please wait while we verify your email address...</p>
            </>
          )}

          {status === "success" && (
            <>
              <div className="mb-4">
                <svg className="w-16 h-16 mx-auto text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">Email Verified!</h1>
              <p className="text-white/80">{message}</p>
            </>
          )}

          {status === "error" && (
            <>
              <div className="mb-4">
                <svg className="w-16 h-16 mx-auto text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">Verification Failed</h1>
              <p className="text-white/80">{message}</p>
            </>
          )}
        </div>

        <div className="p-8 space-y-4">
          {status === "error" && (
            <form onSubmit={handleResend} className="space-y-4">
              <p className="text-[#5c6c86] text-sm">Need a new confirmation email? Enter your email address below:</p>
              <Input
                type="email"
                placeholder="your.email@example.com"
                value={resendEmail}
                onChange={(e) => setResendEmail(e.target.value)}
                required
                className="w-full rounded-[8px] border border-gray-300 bg-gray-50 px-4 py-3 text-sm text-[#0c1b33] placeholder:text-gray-400 focus:border-[#1d70ff] focus:outline-none"
              />
              <Button
                type="submit"
                disabled={isResending}
                className="w-full rounded-[12px] bg-[#1d70ff] px-6 py-4 text-base font-semibold text-white hover:bg-[#1a5fdd] transition disabled:opacity-50"
              >
                {isResending ? "Sending..." : "Resend Confirmation Email"}
              </Button>
            </form>
          )}

          <div className="pt-4 space-y-2">
            <Button
              onClick={() => router.push("/login")}
              className="w-full rounded-[12px] bg-[#1d70ff] px-6 py-4 text-base font-semibold text-white hover:bg-[#1a5fdd] transition"
            >
              Go to Login
            </Button>
            <Link href="/" className="block text-center text-sm text-[#5c6c86] hover:text-[#1d70ff] transition">
              ← Back to home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="bg-white overflow-hidden max-w-md w-full">
          <div className="p-8 text-center bg-gradient-to-r from-[#0c1b33] to-[#1d70ff]">
            <div className="mb-4">
              <svg className="w-16 h-16 mx-auto text-white animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Loading...</h1>
            <p className="text-white/80">Please wait...</p>
          </div>
        </div>
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
}

