import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import AdminDashboard from "./pages/AdminDashboard";
import Products from "./pages/products";
import AdminLogin from "./pages/AdminLogin";
import AdminUsers from "./pages/AdminUsers";
import RequireAuth from "./auth/RequireAuth";
import GuestOnlyRoute from "./auth/GuestOnlyRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<GuestOnlyRoute />}>
          <Route path="/login" element={<AdminLogin />} />
        </Route>

        <Route element={<RequireAuth />}>
          <Route path="/" element={<AdminDashboard />} />
          <Route path="/users" element={<AdminUsers />} />
          <Route path="/products" element={<Products />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
