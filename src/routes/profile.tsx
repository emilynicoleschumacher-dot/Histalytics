import { createFileRoute } from "@tanstack/react-router";
import { Card, CardBody, CardHeader } from "~/components/Card";
import { PageHeader } from "~/components/shared";

export const Route = createFileRoute("/profile")({
  component: Profile,
});

function Profile() {
  return (
    <div className="container-narrow py-8 max-w-2xl mx-auto">
      <PageHeader title="Profile" description="Your account and preferences" />

      <Card className="mb-6">
        <CardHeader>
          <h2 className="text-lg font-semibold text-text-primary">Account</h2>
        </CardHeader>
        <CardBody>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-brand-400 to-teal-400 flex items-center justify-center text-white text-2xl font-bold">
              U
            </div>
            <div>
              <p className="font-semibold text-text-primary text-lg">Demo User</p>
              <p className="text-sm text-text-muted">MCAS Symptom Tracker</p>
            </div>
          </div>
          <div className="space-y-4 text-sm text-text-secondary">
            <p className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-400" />
              Data is stored locally in SQLite
            </p>
            <p className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-brand-400" />
              Symptom knowledge base loaded from shared research
            </p>
            <p className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-teal-400" />
              Product recommendations loading from database
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
              Version 0.1.0 · Built with TanStack Start, React, Tailwind CSS, and SQLite
            </p>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}