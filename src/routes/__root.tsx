import { createRootRoute, Outlet } from "@tanstack/react-router";
import type { ReactNode } from "react";

import { Header } from "~/components/Header";
import { InstallPWABanner } from "~/components/InstallPWABanner";

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
      <InstallPWABanner />
      <Header />
      <main className="min-h-[calc(100dvh-4rem)]">{children}</main>
    </>
  );
}
