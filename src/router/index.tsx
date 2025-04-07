import React from 'react';
import { createBrowserRouter, createRoutesFromChildren, matchRoutes, RouterProvider, useLocation, useNavigationType } from 'react-router-dom';
import { routes } from './routes';
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "https://00e00302bd7166482898da7528456f97@o4508663216865280.ingest.us.sentry.io/4509110661152768",
  integrations: [
    Sentry.reactRouterV6BrowserTracingIntegration({
      useEffect: React.useEffect,
      useLocation,
      useNavigationType,
      createRoutesFromChildren,
      matchRoutes,
    }),
  ],
  tracesSampleRate: 1.0,
});

const Router = () => {
  const sentryCreateBrowserRouter = Sentry.wrapCreateBrowserRouterV6(
    createBrowserRouter,
  );
  const router = sentryCreateBrowserRouter(routes);

  return (
    <RouterProvider router={router}/>
  );
};

export default Router;