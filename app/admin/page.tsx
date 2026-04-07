import { AdminScreen } from "@/components/admin/AdminScreen";

export default function AdminPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-white">
          Admin
        </h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Sign in to record a vihar entry. Data is stored in Firestore.
        </p>
      </div>
      <AdminScreen />
    </div>
  );
}
