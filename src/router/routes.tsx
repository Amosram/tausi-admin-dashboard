 
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
const ApplicationsLazy = lazy(() => import("@/modules/applications/pages/Applications"));
const MessagingLazy = lazy(() => import("@/modules/messaging/pages/Messaging"));
const SettingsLazy = lazy(() => import("@/modules/settings/pages/Settings"));

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
        element: (
          <Suspense fallback={<Loader />}>
            <OrdersLazy />
          </Suspense>
        )
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
        element: (
          <Suspense fallback={<Loader />}>
            <UsersLazy />
          </Suspense>
        )
      },
      {
        path: "/applications",
        element: (
          <Suspense fallback={<Loader />}>
            <ApplicationsLazy />
          </Suspense>
        )
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