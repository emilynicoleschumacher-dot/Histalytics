import { Link, useLocation } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";

// Check if Clerk is configured — Clerk components throw without ClerkProvider
const hasClerk = Boolean(import.meta.env.VITE_CLERK_PUBLISHABLE_KEY);

// Simple SVG icons instead of emoji for a more polished look
const icons = {
  home: (
    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955a1.126 1.126 0 011.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
    </svg>
  ),
  dashboard: (
    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
    </svg>
  ),
  plus: (
    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
  ),
  meal: (
    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
    </svg>
  ),
  calendar: (
    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
    </svg>
  ),
  lightbulb: (
    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
    </svg>
  ),
  profile: (
    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
    </svg>
  ),
  product: (
    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" />
    </svg>
  ),
  supplement: (
    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2-10a4 4 0 014 4v6a4 4 0 01-4 4H7a4 4 0 01-4-4v-6a4 4 0 014-4h10zM7 4a2 2 0 012-2h6a2 2 0 012 2v2H7V4z" />
    </svg>
  ),
  heart: (
    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
    </svg>
  ),
  community: (
    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
    </svg>
  ),
  chevronDown: (
    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
    </svg>
  ),
};

const insightsIcon = (
  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
  </svg>
);

interface NavLink {
  path: string;
  label: string;
  icon: React.ReactNode;
}

interface NavDropdown {
  type: "dropdown";
  label: string;
  icon: React.ReactNode;
  children: NavLink[];
}

type NavItem = NavLink | NavDropdown;

const logChildren: NavLink[] = [
  { path: "/log-symptom", label: "Log Symptom", icon: icons.heart },
  { path: "/log-meal", label: "Log Meal", icon: icons.meal },
  { path: "/log-product", label: "Log Product", icon: icons.product },
  { path: "/log-supplement", label: "Log Supplement", icon: icons.supplement },
];

const navConfig: NavItem[] = [
  { path: "/dashboard", label: "Dashboard", icon: icons.dashboard },
  { type: "dropdown", label: "Log", icon: icons.plus, children: logChildren },
  { path: "/insights", label: "Insights", icon: insightsIcon },
  { path: "/recommendations", label: "Products", icon: icons.lightbulb },
  { path: "/history", label: "History", icon: icons.calendar },
  { path: "/community", label: "Community", icon: icons.community },
];

function isDropdown(item: NavItem): item is NavDropdown {
  return "type" in item && item.type === "dropdown";
}

function isActivePath(path: string, currentPath: string): boolean {
  return currentPath === path;
}

function anyChildActive(children: NavLink[], currentPath: string): boolean {
  return children.some((c) => currentPath === c.path);
}

/* ── Desktop Dropdown ── */
function DesktopDropdown({ item, currentPath }: { item: NavDropdown; currentPath: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const anyActive = anyChildActive(item.children, currentPath);

  return (
    <div ref={ref} className="relative" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <button
        onClick={() => setOpen(!open)}
        className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
          anyActive
            ? "text-brand-600 bg-brand-50"
            : "text-text-secondary hover:text-brand-600 hover:bg-brand-50/50"
        }`}
      >
        {item.icon}
        {item.label}
        <span className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}>
          {icons.chevronDown}
        </span>
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-1 w-56 rounded-xl border border-border-light bg-white shadow-lg py-2 z-50 animate-in fade-in slide-in-from-top-1 duration-200">
          {item.children.map((child) => (
            <Link
              key={child.path}
              to={child.path}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors ${
                isActivePath(child.path, currentPath)
                  ? "text-brand-600 bg-brand-50"
                  : "text-text-secondary hover:text-brand-600 hover:bg-brand-50/50"
              }`}
            >
              <span className="shrink-0">{child.icon}</span>
              {child.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Mobile Expandable Submenu ── */
function MobileDropdown({
  item,
  currentPath,
  onClose,
}: {
  item: NavDropdown;
  currentPath: string;
  onClose: () => void;
}) {
  const [expanded, setExpanded] = useState(() => anyChildActive(item.children, currentPath));

  const anyActive = anyChildActive(item.children, currentPath);

  return (
    <div>
      <button
        onClick={() => setExpanded(!expanded)}
        className={`flex items-center justify-between w-full px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
          anyActive
            ? "text-brand-600 bg-brand-50"
            : "text-text-secondary hover:text-brand-600 hover:bg-brand-50/50"
        }`}
      >
        <span className="flex items-center gap-3">
          {item.icon}
          {item.label}
        </span>
        <span className={`transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}>
          {icons.chevronDown}
        </span>
      </button>
      {expanded && (
        <div className="ml-4 mt-1 space-y-0.5 border-l-2 border-brand-100 pl-3">
          {item.children.map((child) => (
            <Link
              key={child.path}
              to={child.path}
              onClick={onClose}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                isActivePath(child.path, currentPath)
                  ? "text-brand-600 bg-brand-50"
                  : "text-text-secondary hover:text-brand-600 hover:bg-brand-50/50"
              }`}
            >
              <span className="shrink-0">{child.icon}</span>
              {child.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export function Header() {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isHome = location.pathname === "/";

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-normal ${
        scrolled || !isHome
          ? "glass border-b border-border-light"
          : "bg-transparent"
      }`}
    >
      <div className="container-narrow flex h-16 items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2.5 font-display font-bold text-lg text-text-primary hover:text-brand-600 transition-colors"
        >
          <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-teal-500 text-white text-sm font-bold">
            H
          </span>
          <span className="flex items-center gap-2">
            Histalytics
            <span className="hidden sm:inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-brand-50/80 border border-brand-200/60 text-[11px] font-medium text-brand-500">
              <svg width="10" height="10" fill="currentColor" viewBox="0 0 24 24">
                <path d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
              </svg>
              MCAS community
            </span>
            <span className="sm:hidden flex items-center justify-center w-6 h-6 rounded-full bg-brand-50 text-brand-400">
              <svg width="12" height="12" fill="currentColor" viewBox="0 0 24 24">
                <path d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
              </svg>
            </span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          <Link
            to="/"
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
              isHome
                ? "text-brand-600 bg-brand-50"
                : "text-text-secondary hover:text-brand-600 hover:bg-brand-50/50"
            }`}
          >
            Home
          </Link>
          {navConfig.map((item) =>
            isDropdown(item) ? (
              <DesktopDropdown key={item.label} item={item} currentPath={location.pathname} />
            ) : (
              <Link
                key={item.path}
                to={item.path}
                className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActivePath(item.path, location.pathname)
                    ? "text-brand-600 bg-brand-50"
                    : "text-text-secondary hover:text-brand-600 hover:bg-brand-50/50"
                }`}
              >
                {item.icon}
                {item.label}
              </Link>
            )
          )}
          {hasClerk && (
            <>
              <SignedIn>
                <UserButton afterSignOutUrl="/" />
              </SignedIn>
              <SignedOut>
                <SignInButton mode="modal">
                  <button className="ml-2 flex items-center justify-center w-9 h-9 rounded-full transition-all text-text-muted hover:text-brand-600 hover:bg-brand-50">
                    {icons.profile}
                  </button>
                </SignInButton>
              </SignedOut>
            </>
          )}
        </nav>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg text-text-secondary hover:text-brand-600 hover:bg-brand-50 transition-colors"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border-light bg-white/95 backdrop-blur-xl">
          <nav className="container-narrow py-3 space-y-1">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isHome
                  ? "text-brand-600 bg-brand-50"
                  : "text-text-secondary hover:text-brand-600 hover:bg-brand-50/50"
              }`}
            >
              {icons.home}
              Home
            </Link>
            {navConfig.map((item) =>
              isDropdown(item) ? (
                <MobileDropdown
                  key={item.label}
                  item={item}
                  currentPath={location.pathname}
                  onClose={() => setMobileMenuOpen(false)}
                />
              ) : (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    isActivePath(item.path, location.pathname)
                      ? "text-brand-600 bg-brand-50"
                      : "text-text-secondary hover:text-brand-600 hover:bg-brand-50/50"
                  }`}
                >
                  {item.icon}
                  {item.label}
                </Link>
              )
            )}
            {hasClerk && (
              <div className="border-t border-border-light pt-2 mt-2 space-y-1">
                <SignedIn>
                  <div className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-text-secondary">
                    <UserButton afterSignOutUrl="/" />
                    <span>Account</span>
                  </div>
                </SignedIn>
                <SignedOut>
                  <SignInButton mode="modal">
                    <button className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-text-secondary hover:text-brand-600 hover:bg-brand-50/50 transition-colors">
                      {icons.profile}
                      Sign In
                    </button>
                  </SignInButton>
                </SignedOut>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}