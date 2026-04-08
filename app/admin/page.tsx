import { AdminScreen } from "@/components/admin/AdminScreen";

export default function AdminPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-white">
          Admin
        </h1>
      </div>
      <AdminScreen />
    </div>
  );
}
