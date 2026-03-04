import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

const AdminLayout = ({ children }: Props) => {
  return (
    <div className="flex min-h-screen bg-[var(--color-background)] text-gray-800">
      <Sidebar />

      <div className="flex flex-col flex-1 ml-64">
        <Topbar />
        <main className="flex-1 p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
