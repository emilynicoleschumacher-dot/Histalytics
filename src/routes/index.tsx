import { createFileRoute, Link } from "@tanstack/react-router";

import { Button } from "~/components/Button";
import { Card, CardBody } from "~/components/Card";
import { Badge } from "~/components/Badge";

export const Route = createFileRoute("/")({
  component: Home,
});

const features = [
  {
    icon: (
      <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
      </svg>
    ),
    title: "Log Symptoms & Meals",
    description:
      "Quickly log symptoms, meals, and potential triggers in seconds. Tag severity levels so you can spot patterns over time.",
  },
  {
    icon: (
      <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
      </svg>
    ),
    title: "See Your Patterns",
    description:
      "Visualize symptom trends, identify trigger foods, and understand what affects your flares — all in one dashboard.",
  },
  {
    icon: (
      <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
      </svg>
    ),
    title: "Personalized Reference Information",
    description:
      "Get product suggestions matched to your symptom profile — supplements, low-histamine foods, OTC relief, and mast cell stabilizers.",
  },
];

const howItWorks = [
  {
    step: "01",
    title: "Track daily",
    description: "Log symptoms, meals, and severity in seconds during or after a flare.",
  },
  {
    step: "02",
    title: "Discover patterns",
    description: "Our analytics connect the dots between what you eat and how you feel.",
  },
  {
    step: "03",
    title: "Learn About What Helps",
    description: "Get access to researched backed reference information based on your symptoms to discuss with your provider.",
  },
];


function Home() {
  return (
    <div>
      {/* ── Hero ── */}
      <section className="relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-brand-50/60 via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[600px] h-[600px] rounded-full bg-brand-200/20 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -translate-y-1/4 -translate-x-1/4 w-[400px] h-[400px] rounded-full bg-teal-200/20 blur-3xl pointer-events-none" />

        <div className="container-narrow relative pt-16 pb-20 sm:pt-24 sm:pb-28 lg:pt-32 lg:pb-36">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left column */}
            <div className="max-w-xl">
              <Badge variant="brand" dot className="mb-6">
                Coming soon
              </Badge>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-text-primary tracking-tight leading-[1.1]">
                Stop guessing.{" "}
                <span className="text-gradient">Start tracking.</span>
              </h1>
              <p className="mt-5 text-lg sm:text-xl text-text-secondary leading-relaxed max-w-lg">
                The smart symptom tracker built for MCAS and histamine
                intolerance. Log symptoms, find patterns, and discover what
                actually helps — no more spreadsheets and Facebook groups.
              </p>
              <div className="mt-6 flex items-center gap-2.5 text-sm text-text-secondary">
                <span className="flex items-center justify-center w-7 h-7 rounded-full bg-brand-50 text-brand-500">
                  <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                  </svg>
                </span>
                <span className="text-text-muted">Built by the MCAS community, for the MCAS community</span>
              </div>
              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <Link to="/dashboard">
                  <Button size="lg" className="shadow-elevated">
                    Get started — free
                  </Button>
                </Link>
                <Button variant="outline" size="lg" onClick={() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })}>
                  See how it works
                </Button>
              </div>
              <p className="mt-4 text-sm text-text-muted">
                Free during beta. No credit card required.
              </p>
            </div>

            {/* Right column — hero image */}
            <div className="relative hidden lg:flex items-center justify-center">
              <div className="relative w-full max-w-[480px]">
                <img
                  src="/images/hero-illustration.png"
                  alt="Histalytics app illustration showing symptom tracking on mobile"
                  className="w-full h-auto rounded-2xl shadow-elevated"
                />
                {/* Floating card */}
                <div className="absolute -bottom-4 -left-4 card p-4 max-w-[200px] animate-pulse hidden sm:block">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="severity-dot mild" />
                    <span className="text-text-primary font-medium">
                      Flare severity
                    </span>
                    <span className="text-text-muted ml-auto">40%</span>
                  </div>
                  <div className="mt-2 h-1.5 rounded-full bg-green-100">
                    <div className="h-1.5 rounded-full bg-green-400 w-[60%]" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="py-20 sm:py-28 bg-surface-alt/50">
        <div className="container-narrow">
          <div className="text-center max-w-xl mx-auto mb-16">
            <Badge variant="teal" className="mb-4">
              Simple workflow
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-text-primary tracking-tight">
              Three steps to clarity
            </h2>
            <p className="mt-3 text-text-secondary text-lg">
              No complex setup. Start understanding your body in minutes.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {howItWorks.map((item) => (
              <Card key={item.step} elevated className="text-center p-8">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-brand-100 text-brand-600 font-bold text-lg mb-5">
                  {item.step}
                </div>
                <h3 className="text-lg font-semibold text-text-primary mb-2">
                  {item.title}
                </h3>
                <p className="text-text-secondary text-sm leading-relaxed">
                  {item.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="py-20 sm:py-28" id="features">
        <div className="container-narrow">
          <div className="text-center max-w-xl mx-auto mb-16">
            <Badge className="mb-4">Features</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-text-primary tracking-tight">
              Everything you need to manage MCAS
            </h2>
            <p className="mt-3 text-text-secondary text-lg">
              Purpose-built for mast cell disorders — not a generic health app.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {features.map((feature) => (
              <Card key={feature.title} elevated className="p-6 sm:p-8">
                <div className="w-12 h-12 rounded-xl bg-brand-50 text-brand-500 flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-text-primary mb-2">
                  {feature.title}
                </h3>
                <p className="text-text-secondary text-sm leading-relaxed">
                  {feature.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ── Founder Story ── */}
      <section className="py-20 sm:py-28">
        <div className="container-narrow">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <Badge className="mb-4">Our story</Badge>
              <h2 className="text-3xl sm:text-4xl font-bold text-text-primary tracking-tight">
                Built because I needed it
              </h2>
            </div>
            <Card elevated className="p-8 sm:p-10">
              <div className="flex flex-col sm:flex-row gap-6 items-start">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-brand-500 to-teal-500 flex items-center justify-center text-white text-2xl font-bold shrink-0">
                  H
                </div>
                <div className="space-y-4">
                  <p className="text-text-secondary leading-relaxed">
                    After years of unexplained symptoms, doctors appointments,
                    and more questions than answers, I finally got a diagnosis:
                    Mast Cell Activation Syndrome.
                  </p>
                  <p className="text-text-secondary leading-relaxed">
                    The hardest part wasn't the diagnosis — it was the
                    day-to-day management. Tracking symptoms in spreadsheets,
                    cross-referencing ingredient lists against every product I
                    used, and trying to remember what I ate three days ago when
                    a flare hit.
                  </p>
                  <p className="text-text-secondary leading-relaxed">
                    I built Histalytics because I needed it. Something that
                    connects the dots between what I eat, use, and feel — so
                    I can spend less time managing and more time living.
                  </p>
                  <div className="pt-2 flex items-center gap-3">
                    <div className="h-px flex-1 bg-border-light" />
                    <div className="flex items-center gap-2 text-sm text-text-muted">
                      <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24" className="text-brand-400">
                        <path d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                      </svg>
                      <span className="italic">Fellow traveler, living with MCAS</span>
                    </div>
                    <div className="h-px flex-1 bg-border-light" />
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-border-light py-8">
        <div className="container-narrow flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-gradient-to-br from-brand-500 to-teal-500 text-white text-xs font-bold">
              H
            </span>
            <span className="font-bold text-text-primary">Histalytics</span>
            <span className="hidden sm:inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-brand-50/80 border border-brand-200/60 text-[11px] font-medium text-brand-500">
              <svg width="10" height="10" fill="currentColor" viewBox="0 0 24 24">
                <path d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
              </svg>
              MCAS community
            </span>
          </div>
          <p className="text-sm text-text-muted">
            &copy; {new Date().getFullYear()} Histalytics.{" "}
            <span className="text-text-secondary">Built for the MCAS community.</span>
          </p>
          <p className="text-xs text-text-muted mt-3 max-w-md mx-auto leading-relaxed">
            <strong>Your data is yours.</strong> We do <strong>not</strong> share, sell, or rent your data.
            Not used for advertising or AI training.{" "}
            <a href="/profile" className="text-brand-500 hover:text-brand-600 underline">Privacy details</a>
          </p>
        </div>
      </footer>
    </div>
  );
}