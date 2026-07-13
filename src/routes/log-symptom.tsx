import { createFileRoute, useNavigate, useSearch } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { PageHeader, SeveritySlider } from "~/components/shared";
import { Button } from "~/components/Button";
import { Input, Textarea, Select } from "~/components/Input";
import {
  getSymptomSystems,
  logSymptom,
  saveFavorite,
  removeFavorite,
  getFavorites,
  isFavorite,
  getSymptomById,
  updateSymptom,
  utcToLocalDatetime,
  localDatetimeToISO,
  type ActivityLevel,
} from "~/lib/data-store";
import { ActivityLevelToggle } from "~/components/ActivityLevelToggle";
import { FavoritesBar, SaveFavoriteToggle } from "~/components/FavoritesBar";

export const Route = createFileRoute("/log-symptom")({
  component: LogSymptom,
  validateSearch: (search: Record<string, unknown>) => ({
    edit: typeof search.edit === "string" ? search.edit : undefined,
  }),
});

const symptomSystems = getSymptomSystems();

function nowISO() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const h = String(d.getHours()).padStart(2, "0");
  const min = String(d.getMinutes()).padStart(2, "0");
  return `${y}-${m}-${day}T${h}:${min}`;
}

function LogSymptom() {
  const navigate = useNavigate();
  const { edit } = useSearch({ from: Route.id });

  const [selectedSystem, setSelectedSystem] = useState("");
  const [selectedSymptom, setSelectedSymptom] = useState("");
  const [severity, setSeverity] = useState(5);
  const [duration, setDuration] = useState("");
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>(null);
  const [notes, setNotes] = useState("");
  const [loggedAt, setLoggedAt] = useState(nowISO());
  const [reliefAt, setReliefAt] = useState("");
  const [reliefNote, setReliefNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [favoriteVersion, setFavoriteVersion] = useState(0);
  const [editId, setEditId] = useState<string | undefined>(edit);

  // Load existing entry for editing
  useEffect(() => {
    if (editId) {
      const entry = getSymptomById(editId);
      if (entry) {
        setSelectedSystem(entry.bodySystem);
        setSelectedSymptom(entry.symptomId);
        setSeverity(entry.severity);
        if (entry.durationMinutes) setDuration(`${entry.durationMinutes} min`);
        if (entry.activityLevel) setActivityLevel(entry.activityLevel);
        if (entry.notes) setNotes(entry.notes);
        if (entry.reliefAt) setReliefAt(utcToLocalDatetime(entry.reliefAt));
        if (entry.reliefNote) setReliefNote(entry.reliefNote);
        setLoggedAt(utcToLocalDatetime(entry.loggedAt));
      }
    }
  }, [editId]);

  const currentSystem = symptomSystems.find((s) => s.system === selectedSystem);
  const currentSymptom = currentSystem?.symptoms.find((s) => s.id === selectedSymptom);

  const label = currentSymptom?.name || "";
  const isFav = label ? isFavorite("symptom", label) : false;

  const handleFavoriteToggle = () => {
    if (!label || !selectedSystem || !selectedSymptom) return;
    if (isFav) {
      const favs = getFavorites().filter((f) => f.type === "symptom" && f.label === label);
      favs.forEach((f) => removeFavorite(f.id));
    } else {
      saveFavorite({
        label,
        type: "symptom",
        symptomId: selectedSymptom,
        symptomName: label,
        bodySystem: selectedSystem,
        severity,
        durationMinutes: duration ? parseInt(duration.match(/\d+/)?.[0] || "0", 10) || null : null,
        notes: notes || undefined,
      });
    }
    setFavoriteVersion((v) => v + 1);
  };

  const handleFavoriteSelect = (fav: { symptomName?: string; symptomId?: string; bodySystem?: string; severity?: number; durationMinutes?: number | null; notes?: string }) => {
    if (fav.symptomId && fav.bodySystem) {
      setSelectedSystem(fav.bodySystem);
      setSelectedSymptom(fav.symptomId);
      if (fav.severity !== undefined) setSeverity(fav.severity);
      if (fav.durationMinutes !== undefined && fav.durationMinutes !== null) setDuration(`${fav.durationMinutes} min`);
      if (fav.notes) setNotes(fav.notes);
      setFavoriteVersion((v) => v + 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSymptom || !currentSymptom) return;
    setSubmitting(true);

    const data = {
      symptomId: selectedSymptom,
      symptomName: currentSymptom.name,
      bodySystem: selectedSystem,
      severity,
      durationMinutes: duration ? parseInt(duration.match(/\d+/)?.[0] || "0", 10) || null : null,
      activityLevel,
      notes: notes || null,
      loggedAt: loggedAt || null,
      reliefAt: reliefAt || null,
      reliefNote: reliefNote.trim() || null,
    };

    if (editId) {
      updateSymptom(editId, data);
    } else {
      await logSymptom(data);
    }

    setSubmitting(false);
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      if (editId) {
        navigate({ to: "/history" });
      } else {
        setEditId(undefined);
        setSelectedSystem("");
        setSelectedSymptom("");
        setSeverity(5);
        setDuration("");
        setNotes("");
        setReliefAt("");
        setReliefNote("");
        setLoggedAt(nowISO());
      }
    }, 2000);
  };

  return (
    <div className="container-narrow py-8 max-w-2xl mx-auto">
      <PageHeader
        title={editId ? "Edit Symptom" : "Log Symptom"}
        description={editId ? "Update a logged symptom entry." : "Record a symptom flare — what, when, and how bad"}
      >
        {editId && (
          <Button variant="ghost" onClick={() => navigate({ to: "/history" })}>
            Cancel
          </Button>
        )}
      </PageHeader>

      {success && (
        <div className="mb-6 p-4 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm font-medium">
          ✓ Symptom {editId ? "updated" : "logged"} successfully!
        </div>
      )}

      <FavoritesBar key={favoriteVersion} type="symptom" onSelect={handleFavoriteSelect} />

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

        {/* ── What Helped? ── */}
        <div className="border-t border-border-light pt-6">
          <h3 className="text-sm font-semibold text-text-primary mb-1">What helped?</h3>
          <p className="text-xs text-text-muted mb-4">
            Optional — track which interventions provided relief and how quickly.
          </p>
          <div className="space-y-4">
            <Input
              label="What intervention helped?"
              type="text"
              placeholder="e.g. DAO supplement, Antihistamine, Rest"
              value={reliefNote}
              onChange={(e) => setReliefNote(e.target.value)}
              helperText="Common interventions: DAO supplement, Antihistamine, Rest, Heat pack, Ice pack, Low histamine meal"
            />
            <Input
              label="When did relief start?"
              type="datetime-local"
              value={reliefAt}
              onChange={(e) => setReliefAt(e.target.value)}
              helperText="Approximately when did you start feeling relief?"
            />
          </div>
        </div>

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
            {editId ? "Update Symptom" : "Log Symptom"}
          </Button>
        </div>
      </form>
    </div>
  );
}