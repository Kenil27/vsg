"use client";

import { useEffect, useState } from "react";
import {
  type ClientFirebase,
  getClientFirebase,
} from "@/lib/firebase/client";

export function useClientFirebase(): ClientFirebase | null {
  const [fb, setFb] = useState<ClientFirebase | null>(null);

  useEffect(() => {
    try {
      setFb(getClientFirebase());
    } catch {
      setFb(null);
    }
  }, []);

  return fb;
}
