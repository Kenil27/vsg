"use client";

import { signOut } from "firebase/auth";
import { onAuthStateChanged, type User } from "firebase/auth";
import { useEffect, useState } from "react";
import { useClientFirebase } from "@/lib/hooks/useClientFirebase";
import { LoginCard } from "@/components/admin/LoginCard";
import { ViharEntryForm } from "@/components/admin/ViharEntryForm";
import { Button } from "@/components/ui/Button";

export function AdminScreen() {
  const fb = useClientFirebase();
  const [user, setUser] = useState<User | null | undefined>(undefined);

  useEffect(() => {
    if (!fb) return;
    return onAuthStateChanged(fb.auth, setUser);
  }, [fb]);

  if (!fb) {
    return (
      <p className="text-center text-sm text-zinc-500 dark:text-zinc-400">
        Loading…
      </p>
    );
  }

  if (user === undefined) {
    return (
      <p className="text-center text-sm text-zinc-500 dark:text-zinc-400">
        Checking session…
      </p>
    );
  }

  if (!user) {
    return <LoginCard auth={fb.auth} />;
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-zinc-600 dark:text-zinc-300">
          Signed in as{" "}
          <span className="font-medium text-zinc-900 dark:text-white">
            {user.email}
          </span>
        </p>
        <Button
          type="button"
          variant="secondary"
          className="self-start sm:self-auto"
          onClick={() => signOut(fb.auth)}
        >
          Sign out
        </Button>
      </div>
      <ViharEntryForm db={fb.db} auth={fb.auth} />
    </div>
  );
}
