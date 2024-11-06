/* eslint-disable react-refresh/only-export-components */
import React, { lazy, Suspense } from "react";
import Layout from "@/components/layout";
import { Outlet, RouteObject } from "react-router-dom";

// Auth
const LoginLazy = lazy(() => import("@/modules/auth/pages/Login"));

// Dashboard
const DashboardLazy = lazy(() => import("@/modules/dashboard/pages/Dashboard"));

export const routes: RouteObject[] = [
    {
        path: "/",
        element: (
            <Layout>
                <Outlet />
            </Layout>
        ),
        children: [
            {
                index: true,
                element: (
                    <Suspense fallback={<div>Loading...</div>}>
                        <DashboardLazy />
                    </Suspense>
                )
            }
        ]
    },
    {
        path: "auth",
        children: [
            {
                path: "/auth/login",
                element: (
                    <Suspense fallback={<div>Loading...</div>}>
                        <LoginLazy />
                    </Suspense>
                )
            },
        ]
    }

]