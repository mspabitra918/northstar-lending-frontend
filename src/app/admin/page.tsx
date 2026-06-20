"use client";

import { getToken } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
export default function AdminPage() {
  const router = useRouter();

  useEffect(() => {
    const token = getToken();
    if (token) {
      router.replace("/admin/dashboard");
    } else {
      router.replace("/auth");
    }
  }, [router]);

  return null;
}
