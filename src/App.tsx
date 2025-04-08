import React from "react";
import "./App.css";
import Providers from "./providers";

import { initializeApp } from "firebase/app";
import { firebaseConfig } from "@/app/firebase/index";
import Router from "./router";



const App = () => {
  const app = initializeApp(firebaseConfig);
  return (
    <>
      <Providers>
        <Router/>
      </Providers>
    </>
  );
};

export default App;
