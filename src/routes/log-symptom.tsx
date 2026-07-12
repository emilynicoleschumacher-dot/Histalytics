import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader, SeveritySlider } from "~/components/shared";
import { Button } from "~/components/Button";
import { Input, Textarea, Select } from "~/components/Input";
import { getSymptomSystems, logSymptom, saveFavorite, isFavorite, type ActivityLevel } from "~/lib/data-store";
import { ActivityLevelToggle } from "~/components/ActivityLevelToggle";
import { FavoritesBar, SaveFavoriteToggle } from "~/components/FavoritesBar";

export const Route = createFileRoute("/log-symptom")({
  component: LogSymptom,
});

const symptomSystems = getSymptomSystems();

function nowISO() {
  return new Date().toISOString().slice(0, 16);
}

function LogSymptom() {
  const [selectedSystem, setSelectedSystem] = useState("");
  const [selectedSymptom, setSelectedSymptom] = useState("");
  const [severity, setSeverity] = useState(5);
  const [duration, setDuration] = useState("");
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>(null);
  const [notes, setNotes] = useState("");
  const [loggedAt, setLoggedAt] = useState(nowISO());
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const currentSystem = symptomSystems.find((s) => s.system === selectedSystem);
  const currentSymptom = currentSystem?.symptoms.find((s) => s.id === selectedSymptom);

  const label = currentSymptom?.name || "";
  const isFav = label ? isFavorite("symptom", label) : false;

  const handleFavoriteToggle = () => {
    if (!label || !selectedSystem || !selectedSymptom) return;
    saveFavorite({
      label,
      type: "symptom",
      symptomId: selectedSymptom,
      symptomName: label,
      bodySystem: selectedSystem,
      notes: notes || undefined,
    });
  };

  const handleFavoriteSelect = (fav: { symptomName?: string; symptomId?: string; bodySystem?: string; notes?: string }) => {
    if (fav.symptomId && fav.bodySystem) {
      setSelectedSystem(fav.bodySystem);
      setSelectedSymptom(fav.symptomId);
      if (fav.notes) setNotes(fav.notes);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSymptom || !currentSymptom) return;
    setSubmitting(true);
    await logSymptom({
      symptomId: selectedSymptom,
      symptomName: currentSymptom.name,
      bodySystem: selectedSystem,
      severity,
      durationMinutes: duration ? parseInt(duration.match(/\d+/)?.[0] || "0", 10) || null : null,
      activityLevel,
      notes: notes || null,
      loggedAt: loggedAt ? new Date(loggedAt).toISOString() : null,
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
      setLoggedAt(nowISO());
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

      <FavoritesBar type="symptom" onSelect={handleFavoriteSelect} />

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
          label="Duration"
          type="text"
          placeholder="e.g. 3 hours or 30 minutes"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          helperText="How long did the symptom last?"
        />

        <Input
          label="Date & Time"
          type="datetime-local"
          value={loggedAt}
          onChange={(e) => setLoggedAt(e.target.value)}
          helperText="When did this symptom occur?"
        />

        <Textarea
          label="Notes"
          placeholder="Any additional details about this flare..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />

        <ActivityLevelToggle
          value={activityLevel}
          onChange={setActivityLevel}
        />

        <div className="flex items-center justify-between">
          <SaveFavoriteToggle
            label={label}
            isFavorite={isFav}
            onToggle={handleFavoriteToggle}
          />
          <Button
            type="submit"
            size="lg"
            isLoading={submitting}
            disabled={!selectedSymptom}
          >
            Log Symptom
          </Button>
        </div>
      </form>
    </div>
  );
}