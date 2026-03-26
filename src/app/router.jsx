import { Navigate, createBrowserRouter } from "react-router-dom";
import { AdminLayout } from "../layouts/AdminLayout";
import { AccountLayout } from "../layouts/AccountLayout";
import { MainLayout } from "../layouts/MainLayout";
import { RouteGuard } from "../components/routing/RouteGuard";
import { ErrorBoundaryPage } from "../components/ui/ErrorBoundaryPage";
import { HomePage } from "../pages/HomePage";
import { ShopPage } from "../pages/ShopPage";
import { ProductDetailPage } from "../pages/ProductDetailPage";
import { CartPage } from "../pages/CartPage";
import { CheckoutPage } from "../pages/CheckoutPage";
import { SearchPage } from "../pages/SearchPage";
import { LoginPage, RegisterPage, ForgotPasswordPage, ResetPasswordPage, VerifyEmailPage } from "../pages/auth/AuthPages";
import { OrderConfirmationPage } from "../pages/OrderConfirmationPage";
import { PaymentPage } from "../pages/PaymentPage";
import { TrackOrderPage } from "../pages/TrackOrderPage";
import { AboutPage, ContactPage, FaqPage, TermsPrivacyPage } from "../pages/UtilityPages";
import { NotFoundPage } from "../pages/NotFoundPage";
import { AccountPage, AccountAddressesPage, AccountOrderDetailPage, AccountOrdersPage, WishlistPage } from "../pages/account/AccountPages";
import { AdminAnalyticsPage, AdminCategoriesPage, AdminCouponsPage, AdminDashboardPage, AdminOrderDetailPage, AdminOrdersPage, AdminProductsPage, AdminProductFormPage, AdminReviewsPage, AdminShipmentsPage, AdminUsersPage } from "../pages/admin/AdminPages";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <ErrorBoundaryPage />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "shop", element: <ShopPage /> },
      { path: "shop/:slug", element: <ProductDetailPage /> },
      { path: "search", element: <SearchPage /> },
      { path: "cart", element: <CartPage /> },
      { path: "checkout", element: <CheckoutPage /> },
      { path: "payment", element: <PaymentPage /> },
      { path: "order-confirmation/:orderId", element: <OrderConfirmationPage /> },
      { path: "track/:orderId", element: <TrackOrderPage /> },
      { path: "login", element: <LoginPage /> },
      { path: "register", element: <RegisterPage /> },
      { path: "forgot-password", element: <ForgotPasswordPage /> },
      { path: "reset-password/:token", element: <ResetPasswordPage /> },
      { path: "verify-email/:token?", element: <VerifyEmailPage /> },
      { path: "about", element: <AboutPage /> },
      { path: "contact", element: <ContactPage /> },
      { path: "faq", element: <FaqPage /> },
      { path: "terms", element: <TermsPrivacyPage /> },
    ],
  },
  {
    path: "/account",
    element: (
      <RouteGuard>
        <AccountLayout />
      </RouteGuard>
    ),
    children: [
      { index: true, element: <AccountPage /> },
      { path: "orders", element: <AccountOrdersPage /> },
      { path: "orders/:id", element: <AccountOrderDetailPage /> },
      { path: "addresses", element: <AccountAddressesPage /> },
      { path: "wishlist", element: <WishlistPage /> },
    ],
  },
  {
    path: "/admin",
    element: (
      <RouteGuard requireAdmin>
        <AdminLayout />
      </RouteGuard>
    ),
    children: [
      { index: true, element: <AdminDashboardPage /> },
      { path: "products", element: <AdminProductsPage /> },
      { path: "products/new", element: <AdminProductFormPage /> },
      { path: "products/:id/edit", element: <AdminProductFormPage /> },
      { path: "orders", element: <AdminOrdersPage /> },
      { path: "orders/:id", element: <AdminOrderDetailPage /> },
      { path: "users", element: <AdminUsersPage /> },
      { path: "coupons", element: <AdminCouponsPage /> },
      { path: "shipments", element: <AdminShipmentsPage /> },
      { path: "categories", element: <AdminCategoriesPage /> },
      { path: "reviews", element: <AdminReviewsPage /> },
      { path: "analytics", element: <AdminAnalyticsPage /> },
    ],
  },
  { path: "/404", element: <NotFoundPage /> },
  { path: "*", element: <Navigate to="/404" replace /> },
]);
