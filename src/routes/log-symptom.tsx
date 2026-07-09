import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { getDb, getOrCreateDefaultUser } from "~/db/local";
import { readFile } from "node:fs/promises";
import { PageHeader, SeveritySlider } from "~/components/shared";
import { Button } from "~/components/Button";
import { Input, Textarea, Select } from "~/components/Input";

// Load knowledge base for symptom selection
const getSymptoms = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const raw = await readFile("/home/team/shared/symptoms.json", "utf8");
    const data = JSON.parse(raw);
    const options: { system: string; symptoms: { id: string; name: string }[] }[] = [];
    for (const [key, sys] of Object.entries(data.symptoms as any)) {
      options.push({
        system: sys.system,
        symptoms: sys.symptoms.map((s: any) => ({ id: s.id, name: s.name })),
      });
    }
    return options;
  } catch {
    return [];
  }
});

const logSymptom = createServerFn({ method: "POST" }).handler(async (data: unknown) => {
  const { symptomId, symptomName, bodySystem, severity, durationMinutes, notes } = data as any;
  const db = getDb();
  const userId = getOrCreateDefaultUser();
  db.query(`
    INSERT INTO symptom_logs (user_id, symptom_id, symptom_name, body_system, severity, duration_minutes, notes)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
  `).run(userId, symptomId, symptomName, bodySystem, severity, durationMinutes ?? null, notes ?? null);
  return { success: true };
});

export const Route = createFileRoute("/log-symptom")({
  loader: () => getSymptoms(),
  component: LogSymptom,
});

function LogSymptom() {
  const symptomSystems = Route.useLoaderData();

  const [selectedSystem, setSelectedSystem] = useState("");
  const [selectedSymptom, setSelectedSymptom] = useState("");
  const [severity, setSeverity] = useState(5);
  const [duration, setDuration] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const currentSystem = symptomSystems.find((s) => s.system === selectedSystem);
  const currentSymptom = currentSystem?.symptoms.find((s) => s.id === selectedSymptom);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSymptom || !currentSymptom) return;
    setSubmitting(true);
    await logSymptom({
      symptomId: selectedSymptom,
      symptomName: currentSymptom.name,
      bodySystem: selectedSystem,
      severity,
      durationMinutes: duration ? parseInt(duration) : null,
      notes: notes || null,
    });
    setSubmitting(false);
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      setSelectedSystem("");
      setSelectedSymptom("");
      setSeverity(5);
      setDuration("");
      setNotes("");
    }, 2000);
  };

  return (
    <div className="container-narrow py-8 max-w-2xl mx-auto">
      <PageHeader
        title="Log Symptom"
        description="Record a symptom flare — what, when, and how bad"
      />

      {success && (
        <div className="mb-6 p-4 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm font-medium">
          ✓ Symptom logged successfully!
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <Select
          label="Body System"
          placeholder="Select body system..."
          options={symptomSystems.map((s) => ({ value: s.system, label: s.system }))}
          value={selectedSystem}
          onChange={(e) => { setSelectedSystem(e.target.value); setSelectedSymptom(""); }}
        />

        {selectedSystem && (
          <Select
            label="Symptom"
            placeholder="Select symptom..."
            options={currentSystem?.symptoms.map((s) => ({ value: s.id, label: s.name })) ?? []}
            value={selectedSymptom}
            onChange={(e) => setSelectedSymptom(e.target.value)}
          />
        )}

        <SeveritySlider
          label="Severity"
          value={severity}
          onChange={setSeverity}
        />

        <Input
          label="Duration (minutes)"
          type="number"
          placeholder="e.g. 60"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          helperText="How long did the symptom last?"
        />

        <Textarea
          label="Notes"
          placeholder="Any additional details about this flare..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />

        <Button
          type="submit"
          size="lg"
          fullWidth
          isLoading={submitting}
          disabled={!selectedSymptom}
        >
          Log Symptom
        </Button>
      </form>
    </div>
  );
}