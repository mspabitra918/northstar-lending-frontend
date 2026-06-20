// BackButton.tsx

"use client";

import { useRouter } from "next/navigation";
import { BiLeftArrow } from "react-icons/bi";

export default function BackButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className="flex gap-1 items-center rounded-md border border-[#f5d5b0] px-3 py-1 hover:bg-[#f49221] hover:text-white"
    >
      <BiLeftArrow />
      Back
    </button>
  );
}
