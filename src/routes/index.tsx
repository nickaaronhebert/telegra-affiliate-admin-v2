import { createBrowserRouter, Navigate } from "react-router-dom";
import {
  DashboardPage,
  SubscriptionsPage,
  CouponsPage,
  CouponDetailsPage,
  EncountersPage,
  SettingsPage,
} from "@/pages";
import SidebarLayout from "@/components/common/sidebar/sidebar-layout";
import LoginPage from "@/pages/Auth/LoginPage";
import ForgotPassword from "@/pages/Auth/ForgotPassword";
import ResetPassword from "@/pages/Auth/ResetPassword";
import { GuestLayout } from "@/layouts";
import Order from "@/pages/Order";
import { ROUTES } from "@/constants/routes";
import ProtectedRoute from "@/components/common/ProtectedRoute";
import GuestRoute from "@/components/common/GuestRoute";
import Journey from "@/pages/Journey";
import Products from "@/pages/Products";
import CreateJourneyPage from "@/pages/Journey/create";
import CreateCoupon from "@/pages/Coupons/Create";
import CreateProductPage from "@/pages/Products/Create";
import EditProductPage from "@/pages/Products/Edit";
import CreateCommerceOrder from "@/pages/Order/Create";
import EditCoupon from "@/pages/Coupons/Edit";
import { PatientsPage } from "@/pages/Patient";
import PatientDetailsPage from "@/pages/Patient/details";
import EditJourneyPage from "@/pages/Journey/edit";
import ViewEcommerceOrderDetails from "@/pages/Order/details";
import EditCommerceOrder from "@/pages/Order/Edit";
import { OrganizationIdentityPage } from "@/pages/Settings/organizationIdentity";
import ProductVariations from "@/pages/Settings/ProductVariations";
import WorkflowSettingsPage from "@/pages/Settings/workflowSettings";
import FinancialManagementPage from "@/pages/Settings/FinancialManagement";
import CreateSubscription from "@/pages/Subscription/Create";
import SubscriptionDetail from "@/pages/Subscription/Detail";
import ViewAllLabOrders from "@/pages/LabOrder";
import LabOrderDetails from "@/pages/LabOrder/details";
import NotFound from "@/pages/NotFound";

export const router = createBrowserRouter([
  {
    path: ROUTES.ROOT,
    element: <Navigate to={ROUTES.LOGIN} replace />,
  },
  {
    path: ROUTES.ROOT,
    element: (
      <GuestRoute>
        <GuestLayout />
      </GuestRoute>
    ),
    children: [
      {
        path: ROUTES.LOGIN_PATH,
        element: <LoginPage />,
      },
      {
        path: ROUTES.FORGOT_PASSWORD_PATH,
        element: <ForgotPassword />,
      },
      {
        path: ROUTES.RESET_PASSWORD_PATH,
        element: <ResetPassword />,
      },
    ],
  },

  {
    path: ROUTES.ROOT,
    element: (
      <ProtectedRoute>
        <SidebarLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: ROUTES.DASHBOARD_PATH,
        element: <DashboardPage />,
      },
      {
        path: ROUTES.ORDERS_PATH,
        element: <Order />,
      },
      {
        path: ROUTES.ORDER_DETAILS,
        element: <ViewEcommerceOrderDetails />,
      },
      {
        path: ROUTES.ORDER_EDIT,
        element: <EditCommerceOrder />,
      },
      {
        path: ROUTES.ORDERS_CREATE,
        element: <CreateCommerceOrder />,
      },
      {
        path: ROUTES.SUBSCRIPTIONS_PATH,
        element: <SubscriptionsPage />,
      },
      {
        path: ROUTES.COUPONS_PATH,
        element: <CouponsPage />,
      },
      {
        path: "coupons/:id",
        element: <CouponDetailsPage />,
      },
      {
        path: ROUTES.COUPONS_CREATE,
        element: <CreateCoupon />,
      },
      {
        path: ROUTES.PRODUCTS_PATH,
        element: <Products />,
      },
      {
        path: ROUTES.PRODUCT_VARIATIONS_PATH,
        element: <ProductVariations />,
      },
      {
        path: ROUTES.WORKFLOW_SETTINGS_PATH,
        element: <WorkflowSettingsPage />,
      },

      {
        path: ROUTES.COUPONS_EDIT,
        element: <EditCoupon />,
      },
      {
        path: ROUTES.PRODUCTS_CREATE,
        element: <CreateProductPage />,
      },
      {
        path: "products/:id",
        element: <EditProductPage />,
      },
      {
        path: ROUTES.JOURNEYS_PATH,
        element: <Journey />,
      },
      {
        path: ROUTES.JOURNEYS_CREATE,
        element: <CreateJourneyPage />,
      },
      {
        path: ROUTES.JOURNEYS_EDIT,
        element: <EditJourneyPage />,
      },
      {
        path: ROUTES.PATIENTS_PATH,
        element: <PatientsPage />,
      },
      {
        path: "patients/:id",
        element: <PatientDetailsPage />,
      },
      {
        path: ROUTES.ENCOUNTERS_PATH,
        element: <EncountersPage />,
      },
      // {
      //   path: ROUTES.LAB_ORDERS_PATH,
      //   element: <LabOrdersPage />,
      // },
      {
        path: ROUTES.SETTINGS_PATH,
        element: <SettingsPage />,
      },
      {
        path: ROUTES.ORGANIZATION_IDENTITY_PATH,
        element: <OrganizationIdentityPage />,
      },
      {
        path: ROUTES.FINANCIAL_MANAGEMENT_PATH,
        element: <FinancialManagementPage />,
      },
      {
        path: ROUTES.CREATE_SUBSCRIPTION,
        element: <CreateSubscription />,
      },
      {
        path: ROUTES.SUBSCRIPTION_DETAILS,
        element: <SubscriptionDetail />,
      },
      {
        path: ROUTES.LAB_ORDERS,
        element: <ViewAllLabOrders />,
      },
      {
        path: ROUTES.LAB_ORDER_DETAILS,
        element: <LabOrderDetails />,
      },
      {
        path: ROUTES.NOT_FOUND,
        element: <NotFound />,
      },
    ],
  },
]);
