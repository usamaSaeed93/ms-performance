"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * APPOINTMENTS MODULE - TEMPORARILY DISABLED
 * 
 * This module has been disabled but the code is preserved in page.tsx.backup
 * To re-enable: restore the code from the backup file
 */

export default function BookAppointmentPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to home page - appointments module temporarily disabled
    router.replace("/home");
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <div className="animate-spin h-8 w-8 border-4 border-[#1d70ff] border-t-transparent rounded-full mx-auto mb-4" />
        <p className="text-gray-600">Redirecting...</p>
      </div>
    </div>
  );
}