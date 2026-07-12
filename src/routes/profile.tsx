import { createFileRoute } from "@tanstack/react-router";
import { useUser } from "@clerk/clerk-react";
import { Card, CardBody, CardHeader } from "~/components/Card";
import { PageHeader } from "~/components/shared";

export const Route = createFileRoute("/profile")({
  component: Profile,
});

function Profile() {
  const { isLoaded, isSignedIn, user } = useUser();

  const displayName = user?.fullName || user?.username || user?.primaryEmailAddress?.emailAddress || "Guest";
  const email = user?.primaryEmailAddress?.emailAddress || "";
  const avatarUrl = user?.imageUrl;
  const initials = (displayName.charAt(0) || "?").toUpperCase();

  return (
    <div className="container-narrow py-8 max-w-2xl mx-auto">
      <PageHeader title="Profile" description="Your account and preferences" />

      <Card className="mb-6">
        <CardHeader>
          <h2 className="text-lg font-semibold text-text-primary">Account</h2>
        </CardHeader>
        <CardBody>
          {!isLoaded ? (
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-brand-100 animate-pulse" />
              <div className="space-y-2">
                <div className="h-5 w-32 bg-brand-100 rounded animate-pulse" />
                <div className="h-4 w-48 bg-brand-100 rounded animate-pulse" />
              </div>
            </div>
          ) : !isSignedIn ? (
            <div className="text-center py-4">
              <p className="text-text-muted text-sm">Sign in to view your profile</p>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-4 mb-6">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={displayName}
                    className="w-16 h-16 rounded-full object-cover border-2 border-brand-200"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-brand-400 to-teal-400 flex items-center justify-center text-white text-2xl font-bold">
                    {initials}
                  </div>
                )}
                <div>
                  <p className="font-semibold text-text-primary text-lg">{displayName}</p>
                  {email && <p className="text-sm text-text-muted">{email}</p>}
                </div>
              </div>
              <div className="space-y-4 text-sm text-text-secondary">
                <p className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-400" />
                  Signed in with Clerk
                </p>
                <p className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-brand-400" />
                  Symptom knowledge base loaded from shared research
                </p>
                <p className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-teal-400" />
                  Data stored securely — never shared or sold
                </p>
              </div>
            </>
          )}
        </CardBody>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <h2 className="text-lg font-semibold text-text-primary">Privacy</h2>
        </CardHeader>
        <CardBody>
          <div className="space-y-3 text-sm text-text-secondary">
            <p>
              <strong>Your data is yours.</strong> Histalytics stores symptom logs, meals, and other health
              data you enter so you can track your patterns over time.
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Your data is stored in a secure database (Neon Postgres)</li>
              <li>We do <strong>not</strong> share, sell, or rent your data to anyone</li>
              <li>Your data is not used for advertising or training AI models</li>
              <li>You can delete your data at any time by contacting us</li>
            </ul>
            <p className="text-xs text-text-muted mt-2">
              Last updated: July 2026 · Questions? Email privacy@histalytics.com
            </p>
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-text-primary">About Histalytics</h2>
        </CardHeader>
        <CardBody>
          <div className="prose prose-sm text-text-secondary">
            <p>
              Histalytics is a smart symptom tracker purpose-built for MCAS and histamine intolerance.
              Log symptoms, meals, triggers, and flare severity, then get personalized product
              recommendations matched to your symptom profile.
            </p>
            <p className="mt-2">
              Built by the Histalytics team — a collaborative effort between research, design, and engineering.
            </p>
            <p className="mt-2 text-xs text-text-muted">
              Version 0.1.0 · Built with React, Tailwind CSS, and Clerk Auth
            </p>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}