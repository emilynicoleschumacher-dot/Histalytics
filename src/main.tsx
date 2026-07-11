import { RouterProvider } from "@tanstack/react-router";
import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { ClerkProvider } from "@clerk/clerk-react";

import { getRouter } from "./router";
import "./styles/app.css";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
const hasClerk = Boolean(PUBLISHABLE_KEY);
const router = getRouter();

const root = document.getElementById("root");
if (!root) throw new Error("Root element not found");

ReactDOM.createRoot(root).render(
  <StrictMode>
    {hasClerk ? (
      <ClerkProvider publishableKey={PUBLISHABLE_KEY!}>
        <RouterProvider router={router} />
      </ClerkProvider>
    ) : (
      <RouterProvider router={router} />
    )}
  </StrictMode>
);