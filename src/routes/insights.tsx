import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { PageHeader, StatCard } from "~/components/shared";
import { Card, CardBody, CardHeader, CardFooter } from "~/components/Card";
import { Badge } from "~/components/Badge";
import { Button } from "~/components/Button";
import {
  DisclaimerBanner,
  InfoTooltip,
  InsightFootnote,
  TimeToggle,
  SymptomTrendChart,
  FlareDayChart,
  DayOfWeekBreakdown,
  CorrelationBar,
  CombinedTimeline,
  ReliefInsightsPanel,
} from "~/components/InsightsComponents";
import { Link } from "@tanstack/react-router";
import {
  getInsightStats,
  getSymptomTrends,
  getFlareDayAnalysis,
  getIngredientCorrelations,
  getCombinedTimeline,
  getActivityLevelCorrelation,
  getReliefInsights,
  type InsightStats,
  type TrendDayPoint,
  type FlareDayItem,
  type DayOfWeekItem,
  type IngredientCorrelation,
  type TimelineEntry,
  type ActivityLevelCorrelation,
  type ReliefInsight,
} from "~/lib/data-store";

export const Route = createFileRoute("/insights")({
  component: InsightsPage,
});

type TimeRange = "7d" | "14d" | "30d";

function useInsightData() {
  const [timeRange, setTimeRange] = useState<TimeRange>("7d");

  const [stats, setStats] = useState<InsightStats>({
    daysTracked: 0, symptomsLogged: 0, currentStreak: 0, avgSeverity7d: 0,
  });
  const [trendData, setTrendData] = useState<TrendDayPoint[]>([]);
  const [flareData, setFlareData] = useState<FlareDayItem[]>([]);
  const [flareCount, setFlareCount] = useState(0);
  const [totalDays, setTotalDays] = useState(7);
  const [dayOfWeekData, setDayOfWeekData] = useState<DayOfWeekItem[]>([]);
  const [correlations, setCorrelations] = useState<IngredientCorrelation[]>([]);
  const [timelineEntries, setTimelineEntries] = useState<TimelineEntry[]>([]);
  const [activityCorrelation, setActivityCorrelation] = useState<ActivityLevelCorrelation[]>([]);
  const [reliefData, setReliefData] = useState<ReliefInsight[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const statsData = getInsightStats(timeRange);
    setStats(statsData);
    setTrendData(getSymptomTrends(timeRange));
    const fa = getFlareDayAnalysis(timeRange);
    setFlareData(fa.flareData);
    setFlareCount(fa.flareCount);
    setTotalDays(fa.totalDays);
    setDayOfWeekData(fa.dayOfWeekData);
    setCorrelations(getIngredientCorrelations(timeRange));
    setTimelineEntries(getCombinedTimeline(50));
    setActivityCorrelation(getActivityLevelCorrelation(timeRange));
    setReliefData(getReliefInsights());
    setLoading(false);
  }, [timeRange]);

  return {
    stats, trendData, flareData, flareCount, totalDays, dayOfWeekData,
    correlations, timelineEntries, activityCorrelation, reliefData, timeRange, setTimeRange, loading,
  };
}

function InsightsPage() {
  const {
    stats, trendData, flareData, flareCount, totalDays, dayOfWeekData,
    correlations, timelineEntries, activityCorrelation, reliefData, timeRange, setTimeRange, loading,
  } = useInsightData();

  const hasAnyData = stats.symptomsLogged > 0 || stats.daysTracked > 0;

  return (
    <div className="container-narrow py-8">
      <PageHeader title="My Insights" description="Personal analytics based on your logs — understand your patterns over time.">
        {!hasAnyData && (
          <p className="text-sm text-text-muted">Log symptoms and meals to see your insights here.</p>
        )}
        <Link to="/history"><Button variant="outline" size="sm">View History</Button></Link>
      </PageHeader>

      <DisclaimerBanner />

      {!hasAnyData && !loading ? (
        <Card elevated className="mb-8">
          <CardBody>
            <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
              <div className="mb-4 w-16 h-16 rounded-2xl bg-brand-50 text-brand-400 flex items-center justify-center">
                <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-text-primary mb-1">No data yet</h3>
              <p className="text-sm text-text-muted max-w-sm mb-6">Start logging symptoms, meals, and products to unlock personal insights about your triggers and patterns.</p>
              <div className="flex gap-3">
                <Link to="/log-symptom"><Button variant="primary" size="sm">Log a Symptom</Button></Link>
                <Link to="/log-meal"><Button variant="outline" size="sm">Log a Meal</Button></Link>
              </div>
            </div>
          </CardBody>
        </Card>
      ) : (
        <>
          {/* ── Section 1: Overview Stats ── */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard label="Days Tracked" value={stats.daysTracked} icon={<svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" /></svg>} />
            <StatCard label="Symptoms Logged" value={stats.symptomsLogged} icon={<svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" /></svg>} />
            <StatCard label="Current Streak" value={`${stats.currentStreak} days`} trend={stats.currentStreak > 0 ? "up" : undefined} trendLabel={stats.currentStreak > 0 ? "Keep going!" : undefined} icon={<svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" /></svg>} />
            <StatCard label="Avg Severity (7d)" value={stats.avgSeverity7d} trend={stats.avgSeverity7d > 0 && stats.avgSeverity7d <= 3 ? "down" : stats.avgSeverity7d > 6 ? "up" : "neutral"} trendLabel={stats.avgSeverity7d > 0 ? `Last 7 days` : undefined} icon={<svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" /></svg>} />
          </div>

          {/* ── Section 2: Symptom Trends ── */}
          <Card elevated className="mb-8">
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-semibold text-text-primary">Symptom Trends</h2>
                  <InfoTooltip text="Your most-logged symptoms over time. Each line represents one symptom's severity (0-10) per day." />
                </div>
                <TimeToggle value={timeRange} onChange={setTimeRange} />
              </div>
            </CardHeader>
            <CardBody><SymptomTrendChart data={trendData} /></CardBody>
            <CardFooter><p className="text-xs text-text-muted">Showing your top 5 most-logged symptoms.</p></CardFooter>
          </Card>

          {/* ── Section 3: Flare Day Analysis ── */}
          <Card elevated className="mb-8">
            <CardHeader>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold text-text-primary">Flare Day Analysis</h2>
                <InfoTooltip text="A 'flare day' is any day where your average symptom severity was 6 or higher out of 10." />
              </div>
            </CardHeader>
            <CardBody>
              <div className="space-y-6">
                <FlareDayChart data={flareData} flareCount={flareCount} totalDays={totalDays} />
                <div className="border-t border-border-light pt-6">
                  <div className="flex items-center gap-2 mb-4">
                    <h3 className="text-sm font-semibold text-text-primary">Day-of-Week Breakdown</h3>
                    <InfoTooltip text="Average symptom severity by day of the week." />
                  </div>
                  <DayOfWeekBreakdown data={dayOfWeekData} />
                </div>
              </div>
            </CardBody>
            <CardFooter><p className="text-xs text-text-muted">Based on the last {totalDays} days of logs.</p></CardFooter>
          </Card>

          {/* ── Section 4: Activity Level Correlation ── */}
          <Card elevated className="mb-8">
            <CardHeader>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold text-text-primary">Activity Level Correlation</h2>
                <Badge variant="teal" dot>New</Badge>
                <InfoTooltip text="See how your average symptom severity compares across days with different activity levels. Tag 'Activity Level' when logging to build this over time." />
              </div>
            </CardHeader>
            <CardBody>
              {activityCorrelation.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 px-6 text-center">
                  <h3 className="text-sm font-semibold text-text-primary mb-1">No activity data yet</h3>
                  <p className="text-xs text-text-muted max-w-xs">Tag your activity level (Low / Medium / High) when logging symptoms to see how activity affects your severity.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-sm text-text-muted">Average symptom severity by activity level tag.</p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {activityCorrelation.map((item) => (
                      <div key={item.level} className="flex flex-col items-center p-5 rounded-xl border border-border-light bg-surface-card text-center">
                        <span className="text-xs font-medium text-text-muted uppercase mb-1">{item.label}</span>
                        <span className="text-3xl font-bold text-text-primary">{item.avgSeverity}</span>
                        <span className="text-xs text-text-muted mt-1">/10 avg severity</span>
                        <span className="text-xs text-text-muted mt-1">{item.symptomCount} log{item.symptomCount !== 1 ? "s" : ""}</span>
                        <div className={`mt-3 w-full h-2 rounded-full ${item.color}`} style={{ opacity: 0.3 + (item.avgSeverity / 10) * 0.7 }} />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardBody>
            <CardFooter>
              <Link to="/log-symptom" className="text-xs text-brand-600 hover:text-brand-700 font-medium">Tag activity level on your next symptom log</Link>
            </CardFooter>
          </Card>

          {/* ── Section 5: Ingredient Correlations ── */}
          <Card elevated className="mb-8">
            <CardHeader>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold text-text-primary">Ingredient Correlations</h2>
                <Badge variant="teal" dot>New</Badge>
                <InfoTooltip text="Correlation means these ingredients were often present on days when your symptom severity was high — not that one caused the other. Use this to identify ingredients to discuss with your provider." />
              </div>
            </CardHeader>
            <CardBody>
              {correlations.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 px-6 text-center">
                  <h3 className="text-sm font-semibold text-text-primary mb-1">No ingredient data yet</h3>
                  <p className="text-xs text-text-muted max-w-xs">Start logging ingredients in your meals and products to discover your personal triggers.</p>
                </div>
              ) : (
                <>
                  <p className="text-sm text-text-muted mb-5">
                    Ingredients ranked by how often they appear on your flare days. <strong>Flare-only</strong> ingredients are highlighted — these appeared on flare days but never on non-flare days.
                  </p>
                  <div className="flex flex-wrap items-center gap-2 mb-5 text-xs sm:text-sm text-text-muted">
                    <span className="text-coral-500 font-medium">Red</span> = frequent companion,
                    <span className="text-amber-500 font-medium">Amber</span> = often present,
                    <span className="text-brand-300 font-medium">Gray</span> = low correlation
                  </div>
                  <div className="space-y-3">
                    {correlations.map((item) => (
                      <CorrelationBar key={item.ingredientName} item={item} />
                    ))}
                  </div>
                </>
              )}
            </CardBody>
            <CardFooter>
              <div className="flex items-center justify-between text-xs text-text-muted">
                <span>Based on {correlations.reduce((a, c) => a + c.timesLogged, 0)} logged ingredient occurrences</span>
                <Link to="/log-meal" className="text-brand-600 hover:text-brand-700 font-medium">Log a meal with ingredients</Link>
              </div>
            </CardFooter>
          </Card>

          {/* ── Section 6: What Helps? ── */}
          <Card elevated className="mb-8">
            <CardHeader>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold text-text-primary">What Helps?</h2>
                <Badge variant="teal" dot>New</Badge>
                <InfoTooltip text="Interventions you've logged when logging symptoms. Track what helps and how quickly it works." />
              </div>
            </CardHeader>
            <CardBody>
              <ReliefInsightsPanel data={reliefData} />
            </CardBody>
            <CardFooter>
              <Link to="/log-symptom" className="text-xs text-brand-600 hover:text-brand-700 font-medium">Add 'What helped?' on your next symptom log</Link>
            </CardFooter>
          </Card>

          {/* ── Section 7: Combined Timeline ── */}
          <Card elevated className="mb-8">
            <CardHeader>
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-semibold text-text-primary">Combined Timeline</h2>
                  <InfoTooltip text="Your symptoms, meals, products, and supplements in one chronological view." />
                </div>
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-text-muted justify-end">
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-coral-400 shrink-0" /> Symptom</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-teal-400 shrink-0" /> Meal</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-brand-400 shrink-0" /> Product</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" /> Supplement</span>
                </div>
              </div>
            </CardHeader>
            <CardBody>
              {timelineEntries.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 px-6 text-center">
                  <h3 className="text-sm font-semibold text-text-primary mb-1">No timeline entries yet</h3>
                  <p className="text-xs text-text-muted max-w-xs">Your symptoms, meals, products, and supplements will appear here.</p>
                </div>
              ) : (
                <>
                  <p className="text-sm text-text-muted mb-6">See your symptoms alongside what you ate, used, and took — in one place.</p>
                  <CombinedTimeline entries={timelineEntries} />
                </>
              )}
            </CardBody>
          </Card>

          <InsightFootnote />
        </>
      )}
    </div>
  );
}