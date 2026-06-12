import { RequireRole } from "@/components/platform/guard";
import { DashboardShell } from "@/components/platform/DashboardShell";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <RequireRole role="employee">
      <DashboardShell>{children}</DashboardShell>
    </RequireRole>
  );
}
