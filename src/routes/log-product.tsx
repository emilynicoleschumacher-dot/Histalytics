import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "~/components/shared";
import { Card, CardBody } from "~/components/Card";
import { Button } from "~/components/Button";
import { Input, Textarea, Select } from "~/components/Input";
import { logPersonalCareProduct, saveFavorite, isFavorite } from "~/lib/data-store";
import { FavoritesBar, SaveFavoriteToggle } from "~/components/FavoritesBar";

export const Route = createFileRoute("/log-product")({
  component: LogProduct,
});

function nowISO() {
  return new Date().toISOString().slice(0, 16);
}

function LogProduct() {
  const [productName, setProductName] = useState("");
  const [brand, setBrand] = useState("");
  const [productType, setProductType] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [notes, setNotes] = useState("");
  const [loggedAt, setLoggedAt] = useState(nowISO());
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const label = productName.trim();
  const isFav = label ? isFavorite("product", label) : false;

  const handleFavoriteToggle = () => {
    if (!label) return;
    saveFavorite({
      label,
      type: "product",
      productName: label,
      productType: productType || undefined,
      brand: brand.trim() || undefined,
      notes: notes.trim() || undefined,
    });
  };

  const handleFavoriteSelect = (fav: { productName?: string; brand?: string; productType?: string; notes?: string }) => {
    if (fav.productName) {
      setProductName(fav.productName);
      if (fav.brand) setBrand(fav.brand);
      if (fav.productType) setProductType(fav.productType);
      if (fav.notes) setNotes(fav.notes);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productName.trim()) return;
    setSubmitting(true);
    logPersonalCareProduct({
      productName: productName.trim(),
      brand: brand || null,
      productType: productType || "other",
      ingredients: ingredients || null,
      notes: notes || null,
      loggedAt: loggedAt ? new Date(loggedAt).toISOString() : null,
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
      setLoggedAt(nowISO());
    }, 2000);
  };

  return (
    <div className="container-narrow py-8 max-w-2xl mx-auto">
      <PageHeader
        title="Log Personal Care Product"
        description="Track skincare, toiletries, and household products for ingredient triggers."
      />

      {success && (
        <div className="mb-6 p-4 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm font-medium">
          ✓ Product logged successfully!
        </div>
      )}

      <FavoritesBar type="product" onSelect={handleFavoriteSelect} />

      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="Product Name"
          placeholder="e.g. Cetaphil Gentle Skin Cleanser"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          required
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Brand"
            placeholder="e.g. Cetaphil, CeraVe, Vanicream"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
          />
          <Select
            label="Product Type"
            placeholder="Select type..."
            options={[
              { value: "skincare", label: "Skincare" },
              { value: "haircare", label: "Haircare" },
              { value: "body-wash", label: "Body Wash / Soap" },
              { value: "oral-care", label: "Oral Care" },
              { value: "makeup", label: "Makeup" },
              { value: "fragrance", label: "Fragrance" },
              { value: "household", label: "Household Cleaner" },
              { value: "laundry", label: "Laundry" },
              { value: "other", label: "Other" },
            ]}
            value={productType}
            onChange={(e) => setProductType(e.target.value)}
          />
        </div>

        <Input
          label="Date & Time"
          type="datetime-local"
          value={loggedAt}
          onChange={(e) => setLoggedAt(e.target.value)}
          helperText="When did you use this product?"
        />

        <Textarea
          label="Ingredients List"
          placeholder="Paste the full ingredients list from the label. This helps us identify trigger ingredients."
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
          helperText="Separate ingredients with commas. The more detail, the better your trigger analysis."
        />

        <Textarea
          label="Notes"
          placeholder="Any reaction after using this product? How did your skin feel?"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
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
            disabled={!productName.trim()}
          >
            Log Product
          </Button>
        </div>
      </form>

      {/* Quick-reference: Common MCAS-triggering ingredients */}
      <Card elevated className="mt-10">
        <CardBody>
          <h3 className="text-sm font-semibold text-text-primary mb-3">
            Common trigger ingredients to watch for
          </h3>
          <div className="flex flex-wrap gap-2">
            {["Fragrance / Parfum", "Essential Oils", "SLS", "Parabens", "Phthalates", "Propylene Glycol", "Sulfates", "Alcohol Denat."].map((ing) => (
              <button
                key={ing}
                type="button"
                className="px-3 py-1.5 rounded-lg text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100 transition-colors"
                onClick={() => {
                  setIngredients((prev) => (prev ? `${prev}, ${ing}` : ing));
                }}
              >
                + {ing}
              </button>
            ))}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}