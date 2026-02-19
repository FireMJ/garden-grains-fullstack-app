import { ReactNode } from "react";
import FixedHeader from "@/components/FixedHeader";
import AdminNavbar from "@/components/layout/AdminNavbar";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <FixedHeader />
      <AdminNavbar />
      <div className="pt-28">
        {children}
      </div>
    </>
  );
}
