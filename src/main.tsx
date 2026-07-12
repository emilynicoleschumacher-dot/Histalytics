import { RouterProvider } from "@tanstack/react-router";
import { StrictMode, useEffect } from "react";
import ReactDOM from "react-dom/client";
import { ClerkProvider, useUser } from "@clerk/clerk-react";

import { getRouter } from "./router";
import { setClerkId } from "~/lib/data-store";
import "./styles/app.css";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
const hasClerk = Boolean(PUBLISHABLE_KEY);
const router = getRouter();

/* ─── Sync Clerk user ID to data-store ─── */
function ClerkSync() {
  const { user, isLoaded } = useUser();
  useEffect(() => {
    if (isLoaded) {
      setClerkId(user?.id || null);
    }
  }, [user?.id, isLoaded]);
  return null;
}

const root = document.getElementById("root");
if (!root) throw new Error("Root element not found");

ReactDOM.createRoot(root).render(
  <StrictMode>
    {hasClerk ? (
      <ClerkProvider publishableKey={PUBLISHABLE_KEY!}>
        <ClerkSync />
        <RouterProvider router={router} />
      </ClerkProvider>
    ) : (
      <RouterProvider router={router} />
    )}
  </StrictMode>
);