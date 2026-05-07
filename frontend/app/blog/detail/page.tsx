"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

// This page previously contained hardcoded static blog content.
// Blog details are now fully dynamic via /blog/[slug].
// Redirect visitors to the blog listing page.
export default function BlogDetailPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/blog");
  }, [router]);

  return null;
}
