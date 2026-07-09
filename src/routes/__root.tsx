import {
  Outlet,
  createRootRoute,
} from "@tanstack/react-router";
import type { ReactNode } from "react";

import { Header } from "~/components/Header";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  );
}

function RootDocument({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      <main className="min-h-[calc(100dvh-4rem)]">{children}</main>
    </>
  );
}