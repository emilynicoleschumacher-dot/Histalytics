import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { getDb, getOrCreateDefaultUser } from "~/db/local";
import { PageHeader } from "~/components/shared";
import { Card, CardBody } from "~/components/Card";
import { Button } from "~/components/Button";
import { Input, Textarea, Select } from "~/components/Input";

const logProduct = createServerFn({ method: "POST" }).handler(async (data: unknown) => {
  const { productName, brand, productType, ingredients, notes } = data as any;
  const db = getDb();
  const userId = getOrCreateDefaultUser();
  const result = db.query(`
    INSERT INTO personal_care_logs (user_id, product_name, brand, product_type, ingredients, notes)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING id, logged_at
  `).get(userId, productName, brand ?? null, productType ?? "other", ingredients ?? null, notes ?? null);

  // Auto-log ingredients
  if (ingredients) {
    const ingList = ingredients.split(",").map((i: string) => i.trim()).filter(Boolean);
    for (const ing of ingList) {
      db.query(`
        INSERT INTO ingredient_logs (user_id, name, category, source_type, source_id, notes)
        VALUES ($1, $2, 'personal-care', 'product', $3, $4)
      `).run(userId, ing, (result as any)?.id, `From: ${productName}`);
    }
  }
  return result;
});

const getKnownIngredients = createServerFn({ method: "GET" }).handler(async () => {
  const db = getDb();
  const rows = db.query("SELECT id, name, category, histamine_level FROM known_ingredients ORDER BY name LIMIT 10").all();
  return rows;
});

export const Route = createFileRoute("/log-product")({
  loader: () => getKnownIngredients(),
  component: LogProduct,
});

function LogProduct() {
  const knownIngredients = Route.useLoaderData() as any[];
  const [productName, setProductName] = useState("");
  const [brand, setBrand] = useState("");
  const [productType, setProductType] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productName.trim()) return;
    setSubmitting(true);
    await logProduct({
      productName: productName.trim(),
      brand: brand.trim() || null,
      productType: productType || null,
      ingredients: ingredients.trim() || null,
      notes: notes.trim() || null,
    });
    setSubmitting(false);
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      setProductName("");
      setBrand("");
      setProductType("");
      setIngredients("");
      setNotes("");
    }, 2000);
  };

  return (
    <div className="container-narrow py-8 max-w-2xl mx-auto">
      <PageHeader
        title="Log Product"
        description="Track personal care products and their ingredients"
      />

      {success && (
        <div className="mb-6 p-4 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm font-medium">
          ✓ Product logged! Ingredients auto-tracked for flare correlation.
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="Product Name"
          placeholder="e.g. Vanicream Moisturizing Cream"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          required
        />

        <Input
          label="Brand"
          placeholder="e.g. Vanicream, CeraVe, La Roche-Posay"
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
        />

        <Select
          label="Product Type"
          placeholder="Select type..."
          options={[
            { value: "skincare", label: "Skincare" },
            { value: "haircare", label: "Haircare" },
            { value: "oral-care", label: "Oral Care" },
            { value: "makeup", label: "Makeup" },
            { value: "fragrance", label: "Fragrance" },
            { value: "cleaning", label: "Cleaning" },
            { value: "other", label: "Other" },
          ]}
          value={productType}
          onChange={(e) => setProductType(e.target.value)}
        />

        <div>
          <Textarea
            label="Ingredients List (comma-separated)"
            placeholder="e.g. Water, Glycerin, Ceramide NP, Ceramide AP, Ceramide EOP"
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
            helperText="Each ingredient will be tracked individually for flare correlation"
          />
          {knownIngredients.length > 0 && (
            <div className="mt-2">
              <p className="text-xs text-text-muted mb-1">Common MCAS-triggering ingredients:</p>
              <div className="flex flex-wrap gap-1">
                {knownIngredients.slice(0, 8).map((ing: any) => (
                  <button
                    key={ing.id}
                    type="button"
                    onClick={() => setIngredients((prev) => (prev ? `${prev}, ${ing.name}` : ing.name))}
                    className="text-xs px-2 py-0.5 rounded-full bg-coral-50 text-coral-600 border border-coral-200 hover:bg-coral-100"
                  >
                    {ing.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <Textarea
          label="Notes"
          placeholder="Any reactions or observations..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />

        <Button type="submit" size="lg" fullWidth isLoading={submitting} disabled={!productName.trim()}>
          Log Product
        </Button>
      </form>
    </div>
  );
}