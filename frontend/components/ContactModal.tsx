"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Phone, MessageCircle, Mail, FileText, ArrowLeft } from "lucide-react";
import {
  CONTACT_PHONE_DISPLAY,
  CONTACT_PHONE_TEL,
  CONTACT_EMAIL,
  CONTACT_EMAIL_MAILTO,
  WHATSAPP_NUMBER,
} from "@/lib/constants/contact";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface ContactModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ContactModal({ open, onOpenChange }: ContactModalProps) {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const handleClose = (nextOpen: boolean) => {
    if (!nextOpen) {
      setShowForm(false);
      setStatus("idle");
    }
    onOpenChange(nextOpen);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus("idle");

    try {
      const response = await fetch(`${API_BASE_URL}/ecommerce/v1/contact-messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error("Failed to send message");
      setStatus("success");
      setFormData({ name: "", email: "", phone: "", message: "" });
    } catch {
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    "Hello! I'm interested in your car tuning services."
  )}`;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{showForm ? "Contact Form" : "Get in Touch"}</DialogTitle>
          <DialogDescription>
            {showForm
              ? "Send us a message and we'll get back to you within 1 day."
              : "Choose how you'd like to reach MS Performance."}
          </DialogDescription>
        </DialogHeader>

        {!showForm ? (
          <div className="grid gap-3">
            <a
              href={CONTACT_PHONE_TEL}
              className="flex items-center gap-4 rounded-xl border border-gray-200 p-4 transition hover:border-[#1d70ff] hover:bg-blue-50"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#1d70ff] text-white">
                <Phone className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold text-[#0c1b33]">Call Us</p>
                <p className="text-sm text-gray-500">{CONTACT_PHONE_DISPLAY}</p>
              </div>
            </a>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 rounded-xl border border-gray-200 p-4 transition hover:border-[#25D366] hover:bg-green-50"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#25D366] text-white">
                <MessageCircle className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold text-[#0c1b33]">Chat on WhatsApp</p>
                <p className="text-sm text-gray-500">Quick response via WhatsApp</p>
              </div>
            </a>

            <a
              href={CONTACT_EMAIL_MAILTO}
              className="flex items-center gap-4 rounded-xl border border-gray-200 p-4 transition hover:border-[#1d70ff] hover:bg-blue-50"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#0c1b33] text-white">
                <Mail className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold text-[#0c1b33]">Email Us</p>
                <p className="text-sm text-gray-500">{CONTACT_EMAIL}</p>
              </div>
            </a>

            <button
              type="button"
              onClick={() => setShowForm(true)}
              className="flex w-full items-center gap-4 rounded-xl border border-gray-200 p-4 text-left transition hover:border-[#1d70ff] hover:bg-blue-50"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gray-800 text-white">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold text-[#0c1b33]">Contact Form</p>
                <p className="text-sm text-gray-500">Send us a message online</p>
              </div>
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="flex items-center gap-1 text-sm text-gray-500 hover:text-[#1d70ff]"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>

            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="text"
                required
                placeholder="Your Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:border-[#1d70ff] focus:outline-none"
              />
              <input
                type="email"
                required
                placeholder="Your Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:border-[#1d70ff] focus:outline-none"
              />
              <input
                type="tel"
                placeholder="Your Phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:border-[#1d70ff] focus:outline-none"
              />
              <textarea
                required
                placeholder="Your Message"
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full resize-none rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:border-[#1d70ff] focus:outline-none"
              />
              {status === "success" && (
                <p className="text-sm font-medium text-green-600">Message sent successfully!</p>
              )}
              {status === "error" && (
                <p className="text-sm font-medium text-red-600">Failed to send. Please try again.</p>
              )}
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-[#1d70ff] py-2.5 text-sm font-semibold text-white hover:bg-[#1558cc] disabled:opacity-70"
              >
                {loading ? "Sending..." : "Send Message"}
              </button>
            </form>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
