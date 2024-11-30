import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

import { generateReactHelpers } from "@uploadthing/react";
import { OurFileRouter } from "@/app/api/uploadthing/core";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const { useUploadThing } = generateReactHelpers<OurFileRouter>();