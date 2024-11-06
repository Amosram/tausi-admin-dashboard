import React from "react";
import "./App.css";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import Providers from "./providers";

import { initializeApp } from "firebase/app";
import { firebaseConfig } from "@/app/firebase/index";
import { Router, BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./redux/store";
const router = createRouter({
  routeTree,
  defaultPreload: "intent",
});

// Register things for typesafety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const App = () => {
  const app = initializeApp(firebaseConfig);
  return (
    <>
      <BrowserRouter>
        <Providers>
          <RouterProvider router={router} />
        </Providers>
      </BrowserRouter>
    </>
  );
};

export default App;
