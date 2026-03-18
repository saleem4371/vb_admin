"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function BackButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className="flex items-center gap-2 text-sm text-gray-600 hover:text-black mb-2 cursor-pointer"
    >
      <ArrowLeft size={16} />
      Go Back
    </button>
  );
}