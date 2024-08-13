import React from 'react';
import './App.css';
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen';
import Providers from "./providers";

const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
})

// Register things for typesafety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

const App = () => {


  return (
    <Providers>
      <RouterProvider router={router} />
    </Providers>
  )
}

export default App
