 
import React, { lazy, Suspense } from "react";
import Layout from "@/components/layout";
import { Outlet, RouteObject } from "react-router-dom";
import Loader from "@/components/layout/Loader";
import { Toaster } from "@/components/ui/toaster";

// Auth
const LoginLazy = lazy(() => import("@/modules/auth/pages/Login"));

// Dashboard
const DashboardLazy = lazy(() => import("@/modules/dashboard/pages/Dashboard"));
const OrdersLazy = lazy(() => import("@/modules/orders/pages/Orders"));
const RevenueLazy = lazy(() => import("@/modules/revenue/pages/Revenue"));
const UsersLazy = lazy(() => import("@/modules/users/pages/Users"));
const BeauticiansListLazy = lazy(() => import("@/modules/applications/pages/BeauticiansList"));
const VerfiedBeauticiansLazy = lazy(() => import("@/modules/applications/pages/VerifiedBeuticans"));
const VerificationDetailsLazy = lazy(() => import("@/modules/applications/pages/VerificationDetails"));
const MessagingLazy = lazy(() => import("@/modules/messaging/pages/Messaging"));
const SettingsLazy = lazy(() => import("@/modules/settings/pages/Settings"));
const OrderDetailsLazy = lazy(() => import("@/modules/orders/pages/OrderDetails"));
const UserDetailsLazy = lazy(() => import('@/modules/users/pages/UserDetails'));
const ProfessionalsDetailsLazy = lazy(() => import('@/modules/applications/pages/ProfessionalDetails'));
const CreateUserLazy = lazy(() => import("@/modules/users/pages/CreateUserPage"));
const LedgerLazy = lazy(() => import('@/modules/ledger/pages/Ledger'));
const LedgerLazyDetail = lazy(() => import ('@/modules/ledger/pages/LedgerBookDetails'));
const CreateLoanLazy = lazy(() => import('@/modules/ledger/pages/LoanCreatePage'));
const BoothsLazy = lazy(() => import("@/modules/booths/pages/Booths"));

export const routes: RouteObject[] = [
  {
    path: "/",
    element: (
      <Layout>
        <Outlet />
        <Toaster />
      </Layout>
    ),
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<Loader />}>
            <DashboardLazy />
          </Suspense>
        )
      },
      {
        path: "/orders",
        children: [
          {
            index: true,
            element: (
              <Suspense fallback={<Loader />}>
                <OrdersLazy />
              </Suspense>
            ),
          },
          {
            path: ":orderId",
            element: (
              <Suspense fallback={<Loader />}>
                <OrderDetailsLazy />
              </Suspense>
            )
          }
        ]
      },
      {
        path: "/revenue",
        element: (
          <Suspense fallback={<Loader />}>
            <RevenueLazy />
          </Suspense>
        )
      },
      {
        path: "/users",
        children: [
          {
            index: true,
            element: (
              <Suspense fallback={<Loader />}>
                <UsersLazy />
              </Suspense>
            )
          },
          {
            path: ":userId",
            element: (
              <Suspense fallback={<Loader />}>
                <UserDetailsLazy />
              </Suspense>
            )
          },
          {
            path: "create-user",
            element: (
              <Suspense fallback={<Loader />}>
                <CreateUserLazy />
              </Suspense>
            )
          }
        ]
      },
      {
        path: "/professionals",
        children: [
          {
            index:true,
            element: (
              <Suspense fallback={<Loader />}>
                <BeauticiansListLazy />
              </Suspense>
            )
          },
          {
            path: ":professionalId",
            element: (
              <Suspense fallback={<Loader />} >
                <ProfessionalsDetailsLazy />
              </Suspense>
            )
          }
        ]
      },
      {
        path: "/dashboard/verifications",
        children: [
          {
            index: true,
            element: (
              <Suspense fallback={<Loader />}>
                <VerfiedBeauticiansLazy />
              </Suspense>
            )
          },
          {
            path: ":beauticianId",
            element: (
              <Suspense fallback={<Loader />}>
                <VerificationDetailsLazy />
              </Suspense>
            )
          }
        ]
      },
      {
        path: "/messaging",
        element: (
          <Suspense fallback={<Loader />}>
            <MessagingLazy />
          </Suspense>
        )
      },
      {
        path: "/settings",
        element: (
          <Suspense fallback={<Loader />}>
            <SettingsLazy />
          </Suspense>
        )
      },
      {
        path: "/ledgers/books",
        children:[
          {
            index: true,
            element: (
              <Suspense fallback={<Loader />}>
                <LedgerLazy />
              </Suspense>
            )
          },
          {
            path: ":bookId",
            element: (
              <Suspense fallback={<Loader />}>
                <LedgerLazyDetail />
              </Suspense>
            )
          },
          {
            path: "create-loan",
            element: (
              <Suspense fallback={<Loader />}>
                <CreateLoanLazy />
              </Suspense>
            )
          }
        ]
      },
      {
        path: "/booths",
        element: (
          <Suspense fallback={<Loader />}>
            <BoothsLazy />
          </Suspense>
        )
      },
      {
        path: "/ledger",
        element: (
          <Suspense fallback={<Loader />}>
            <LedgerLazy />
          </Suspense>
        )
      },
    ]
  },
  {
    path: "auth",
    children: [
      {
        path: "/auth/login",
        element: (
          <Suspense fallback={<Loader />}>
            <LoginLazy />
          </Suspense>
        )
      },
    ]
  }

];