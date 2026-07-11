import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "~/components/shared";
import { Card, CardBody } from "~/components/Card";
import { Button } from "~/components/Button";
import { Input, Textarea } from "~/components/Input";
import { logSupplement } from "~/lib/data-store";

export const Route = createFileRoute("/log-supplement")({
  component: LogSupplement,
});

const COMMON_ADDITIVES = [
  "Microcrystalline Cellulose",
  "Magnesium Stearate",
  "Silicon Dioxide",
  "Titanium Dioxide",
  "Gelatin",
  "Stearic Acid",
  "Crosscarmellose Sodium",
  "Talc",
  "Propylene Glycol",
  "PEG",
  "Soy Lecithin",
  "Sugar / Dextrose",
];

function LogSupplement() {
  const [supplementName, setSupplementName] = useState("");
  const [brand, setBrand] = useState("");
  const [dosage, setDosage] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supplementName.trim()) return;
    setSubmitting(true);
    try {
      logSupplement({
        supplementName: supplementName.trim(),
        brand: brand.trim() || null,
        dosage: dosage.trim() || null,
        ingredients: ingredients.trim() || null,
        notes: notes.trim() || null,
      });
      setSuccess(true);
      setSupplementName("");
      setBrand("");
      setDosage("");
      setIngredients("");
      setNotes("");
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error("Failed to log supplement:", err);
    }
    setSubmitting(false);
  };

  return (
    <div className="container-narrow py-8 max-w-2xl mx-auto">
      <PageHeader
        title="Log Supplement"
        description="Track supplements, vitamins, and medications. Additives and fillers can be hidden MCAS triggers."
      />
      {success && (
        <div className="mb-6 p-4 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm font-medium">
          ✓ Supplement logged successfully! Ingredients have been added to your tracking.
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="Supplement Name"
          placeholder="e.g. Vitamin D3, Quercetin, DAO"
          value={supplementName}
          onChange={(e) => setSupplementName(e.target.value)}
          required
        />
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Brand"
            placeholder="e.g. Pure Encapsulations, NOW"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
          />
          <Input
            label="Dosage"
            placeholder="e.g. 500mg, 1 capsule, 2 sprays"
            value={dosage}
            onChange={(e) => setDosage(e.target.value)}
          />
        </div>
        <Textarea
          label="Ingredients List (fillers, binders, excipients)"
          placeholder="List all ingredients from the label. Many supplements contain hidden triggers like microcrystalline cellulose, magnesium stearate, etc."
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
          helperText="Separate ingredients with commas. Even 'inactive' ingredients matter for MCAS."
        />
        <Textarea
          label="Notes"
          placeholder="Any reaction after taking this supplement? How did you feel?"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
        <Button
          type="submit"
          size="lg"
          fullWidth
          isLoading={submitting}
          disabled={!supplementName.trim()}
        >
          Log Supplement
        </Button>
      </form>
      {/* Quick-reference: Common supplement additives that trigger MCAS */}
      <Card elevated className="mt-10">
        <CardBody>
          <h3 className="text-sm font-semibold text-text-primary mb-3">
            Common supplement additives known to trigger MCAS
          </h3>
          <div className="flex flex-wrap gap-2">
            {COMMON_ADDITIVES.map((additive) => (
              <button
                key={additive}
                type="button"
                className="px-3 py-1.5 rounded-lg text-xs font-medium bg-purple-50 text-purple-700 border border-purple-200 hover:bg-purple-100 transition-colors"
                onClick={() => {
                  setIngredients((prev) =>
                    prev ? `${prev}, ${additive}` : additive
                  );
                }}
              >
                + {additive}
              </button>
            ))}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
