"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { adminApi } from "@/lib/api/admin";
import { useTheme } from "@/lib/contexts/theme-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export default function AdminForgotPasswordPage() {
  const { theme } = useTheme();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await adminApi.forgotPassword({ email });
      setSubmitted(true);
      toast.success("If an account with that email exists, a reset link has been sent.");
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
      toast.error(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Image
                src="/images/logos/ms-logo.png"
                alt="MS Performance"
                width={160}
                height={48}
                className="h-12 w-auto"
              />
            </div>
            <CardTitle className="text-3xl font-bold">
              {submitted ? "Check Your Email" : "Forgot Password"}
            </CardTitle>
            <CardDescription>
              {submitted
                ? "We've sent a password reset link to your email"
                : "Enter your email to receive a reset link"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!submitted ? (
              <>
                {error && (
                  <div className="mb-6 p-4 rounded-lg bg-destructive/20 border border-destructive/30 text-destructive text-sm">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="admin@example.com"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={loading}
                    size="lg"
                  >
                    {loading ? "Sending..." : "Send Reset Link"}
                  </Button>
                </form>
              </>
            ) : (
              <div className="text-center space-y-6">
                <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  If an account exists for <strong className="text-foreground">{email}</strong>, we have sent a password reset link. Please check your inbox and spam.
                </p>
                <Button
                  onClick={() => { setSubmitted(false); setEmail(""); }}
                  variant="outline"
                  className="w-full"
                >
                  Try another email
                </Button>
              </div>
            )}

            <div className="mt-6 text-center">
              <Link href="/admin/login" className="text-sm text-primary hover:underline font-medium">
                Back to Admin Login
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
