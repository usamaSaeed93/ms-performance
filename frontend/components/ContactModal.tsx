"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Phone, MessageCircle, Mail, FileText } from "lucide-react";
import Link from "next/link";
import {
  CONTACT_PHONE_DISPLAY,
  CONTACT_PHONE_TEL,
  CONTACT_EMAIL,
  CONTACT_EMAIL_MAILTO,
  WHATSAPP_NUMBER,
} from "@/lib/constants/contact";

interface ContactModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ContactModal({ open, onOpenChange }: ContactModalProps) {
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    "Hello! I'm interested in your car tuning services."
  )}`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Get in Touch</DialogTitle>
          <DialogDescription>
            Choose how you&apos;d like to reach MS Performance.
          </DialogDescription>
        </DialogHeader>

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

          <Link
            href="/contact-us"
            onClick={() => onOpenChange(false)}
            className="flex items-center gap-4 rounded-xl border border-gray-200 p-4 transition hover:border-[#1d70ff] hover:bg-blue-50"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gray-800 text-white">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <p className="font-semibold text-[#0c1b33]">Contact Form</p>
              <p className="text-sm text-gray-500">Send us a message online</p>
            </div>
          </Link>
        </div>
      </DialogContent>
    </Dialog>
  );
}
