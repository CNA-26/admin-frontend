import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminDashboard from "./pages/AdminDashboard";
import Products from "./pages/products";
import AdminLogin from "./pages/AdminLogin";
import AdminUsers from "./pages/AdminUsers";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AdminDashboard />} />
        <Route path="/login" element={<AdminLogin />} />
        <Route path="/users" element={<AdminUsers />} />
        <Route path="/products" element={<Products />} />
        <Route path="*" element={<AdminLogin />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
