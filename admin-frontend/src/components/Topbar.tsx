import { useAuth } from "../context/AuthContext";

const Topbar = () => {
  const { email } = useAuth();
  
  return (
    <div className="bg-white shadow px-6 py-4 flex justify-between items-center">
      <div className="h-1 bg-[var(--color-accent)] mt-2 rounded"></div>
      <h1 className="text-xl font-semibold">Admin Dashboard</h1>
      <div className="text-gray-600">{email || "Admin"}</div>
    </div>
  );
};

export default Topbar;
