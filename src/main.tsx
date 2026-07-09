import { RouterProvider } from "@tanstack/react-router";
import { StrictMode } from "react";
import ReactDOM from "react-dom/client";

import { getRouter } from "./router";
import "./styles/app.css";

const router = getRouter();

const root = document.getElementById("root");
if (!root) throw new Error("Root element not found");

ReactDOM.createRoot(root).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);