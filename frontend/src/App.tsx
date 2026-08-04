import { Route, Routes } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext";
import { ProtectedRoute } from "./auth/ProtectedRoute";
import { PublicLayout } from "./components/layout/PublicLayout";
import { AdminLayout } from "./components/layout/AdminLayout";
import { HomePage } from "./pages/HomePage";
import { CatalogPage } from "./pages/CatalogPage";
import { ProductDetailPage } from "./pages/ProductDetailPage";
import { ProcedurePage } from "./pages/ProcedurePage";
import { SellDevicePage } from "./pages/SellDevicePage";
import { CheckoutPage } from "./pages/CheckoutPage";
import { RequestDevicePage } from "./pages/RequestDevicePage";
import { AdminLoginPage } from "./pages/AdminLoginPage";
import { AdminDashboardPage } from "./pages/AdminDashboardPage";
import { AdminProductFormPage } from "./pages/AdminProductFormPage";
import { AdminSellRequestsPage } from "./pages/AdminSellRequestsPage";
import { AdminSellRequestDetailPage } from "./pages/AdminSellRequestDetailPage";
import { AdminOrdersPage } from "./pages/AdminOrdersPage";
import { AdminOrderDetailPage } from "./pages/AdminOrderDetailPage";
import { AdminDeviceRequestsPage } from "./pages/AdminDeviceRequestsPage";
import { AdminDeviceRequestDetailPage } from "./pages/AdminDeviceRequestDetailPage";
import { TermsPage } from "./pages/TermsPage";
import { AdminComplaintsPage } from "./pages/AdminComplaintsPage";
import { AdminComplaintDetailPage } from "./pages/AdminComplaintDetailPage";
import { NotFoundPage } from "./pages/NotFoundPage";

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/catalog" element={<CatalogPage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/procedure" element={<ProcedurePage />} />
          <Route path="/sell" element={<SellDevicePage />} />
          <Route path="/checkout/:id" element={<CheckoutPage />} />
          <Route path="/request" element={<RequestDevicePage />} />
          <Route path="/terms" element={<TermsPage />} />
        </Route>

        <Route path="/admin/login" element={<AdminLoginPage />} />

        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboardPage />} />
          <Route path="products/new" element={<AdminProductFormPage />} />
          <Route path="products/:id/edit" element={<AdminProductFormPage />} />
          <Route path="sell-requests" element={<AdminSellRequestsPage />} />
          <Route path="sell-requests/:id" element={<AdminSellRequestDetailPage />} />
          <Route path="orders" element={<AdminOrdersPage />} />
          <Route path="orders/:id" element={<AdminOrderDetailPage />} />
          <Route path="device-requests" element={<AdminDeviceRequestsPage />} />
          <Route path="device-requests/:id" element={<AdminDeviceRequestDetailPage />} />
          <Route path="complaints" element={<AdminComplaintsPage />} />
          <Route path="complaints/:id" element={<AdminComplaintDetailPage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AuthProvider>
  );
}
