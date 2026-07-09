/**
 * Inlined product database for MCAS and histamine intolerance management.
 * Embedded directly into the JS bundle so no filesystem I/O is needed at runtime.
 * Source: /home/team/shared/products.json (compiled from clinical literature)
 */

export interface ProductEntry {
  id: string;
  category: string;
  name: string;
  type: string;
  forms?: string[];
  typical_dose?: string;
  mechanism?: string;
  helps_with: { symptoms: string[]; description: string };
  evidence_level: string;
  evidence_notes?: string;
  common_brands?: string[];
  potential_side_effects?: string[];
  notes?: string;
  price_range?: string;
}

export interface ProductsData {
  meta: {
    version: string;
    last_updated: string;
    source: string;
    description: string;
  };
  categories: Array<{
    id: string;
    name: string;
    description: string;
  }>;
  products: ProductEntry[];
}

const productsData: ProductsData = {
  "meta": {
    "version": "1.0.0",
    "last_updated": "2026-07-08",
    "source": "Compiled from Wikipedia, PubMed clinical studies, British Journal of Pharmacology, Mast Cell Disease Society, expert clinical guidelines, and supplement research literature",
    "description": "Comprehensive product database for MCAS and histamine intolerance management, organized by category with symptom mapping."
  },
  "categories": [
    {
      "id": "mast-cell-stabilizers",
      "name": "Mast Cell Stabilizers",
      "description": "Substances that prevent mast cells from degranulating (releasing histamine and other mediators). These are the first-line preventatives."
    },
    {
      "id": "antihistamines-h1",
      "name": "H1 Antihistamines",
      "description": "Block histamine at H1 receptors - primarily for allergic-type symptoms (itching, hives, sneezing, runny nose, airway constriction)."
    },
    {
      "id": "antihistamines-h2",
      "name": "H2 Antihistamines",
      "description": "Block histamine at H2 receptors in the stomach and blood vessels - primarily for GI symptoms (reflux, heartburn, abdominal pain) and cardiovascular symptoms."
    },
    {
      "id": "dao-supplements",
      "name": "DAO Enzyme Supplements",
      "description": "Provide exogenous diamine oxidase enzyme to break down histamine in the gut before absorption. Taken with meals."
    },
    {
      "id": "supplements",
      "name": "Nutritional Supplements",
      "description": "Vitamins, minerals, and nutraceuticals that support mast cell stability, histamine breakdown, and overall resilience."
    },
    {
      "id": "otc-relief",
      "name": "OTC Relief / Acute Support",
      "description": "Over-the-counter products for acute symptom management during flares."
    },
    {
      "id": "low-histamine-foods",
      "name": "Low-Histamine Food Products",
      "description": "Brands and food categories suitable for low-histamine diets."
    },
    {
      "id": "prescription",
      "name": "Prescription Medications",
      "description": "Medications requiring a prescription, used in more severe MCAS."
    }
  ],
  "products": [
    {
      "id": "ms-001",
      "category": "mast-cell-stabilizers",
      "name": "Quercetin",
      "type": "supplement",
      "forms": ["Capsules", "Powder", "Liposomal"],
      "typical_dose": "500-1000 mg, 2-3 times daily with meals",
      "mechanism": "Natural mast cell stabilizer - inhibits IgE-mediated degranulation, reduces histamine and leukotriene release, antioxidant",
      "helps_with": {
        "symptoms": ["neuro-001", "neuro-002", "neuro-004", "neuro-006", "gi-001", "gi-003", "gi-004", "derm-001", "derm-002", "derm-003", "resp-001", "resp-002", "resp-003"],
        "description": "Broad-spectrum mast cell stabilizer. Helps prevent flares across all body systems when taken consistently."
      },
      "evidence_level": "moderate",
      "evidence_notes": "In vitro and animal studies show mast cell stabilization. Human trials limited but positive. Cited in British Journal of Pharmacology (Finn & Walsh, 2013) as a natural mast cell stabilizer.",
      "common_brands": ["Pure Encapsulations Quercetin", "NOW Quercetin", "Thorne Quercetin", "Jarrow Formulas Quercetin"],
      "potential_side_effects": ["Can cause headache at high doses", "May interact with some medications (CYP3A4 substrate)", "Can cause tingling in extremities"],
      "notes": "Often combined with bromelain for better absorption. Take between meals for best absorption. Liposomal forms may cause fewer GI side effects."
    },
    {
      "id": "ms-002",
      "category": "mast-cell-stabilizers",
      "name": "Cromolyn Sodium (Gastrocrom)",
      "type": "prescription",
      "forms": ["Oral ampules", "Nebulizer solution", "Ophthalmic drops"],
      "typical_dose": "100-200 mg (1-2 ampules) 4x daily before meals and bedtime",
      "mechanism": "Synthetic mast cell stabilizer - prevents degranulation by stabilizing mast cell membranes",
      "helps_with": {
        "symptoms": ["gi-001", "gi-002", "gi-003", "gi-004", "gi-005", "derm-001", "derm-002", "derm-003", "neuro-001"],
        "description": "First-line prescription mast cell stabilizer. Particularly effective for GI symptoms but helps all systems."
      },
      "evidence_level": "high",
      "evidence_notes": "FDA-approved for mastocytosis. Widely used off-label for MCAS. Supported by AAAAI clinical guidelines (Weiler et al., 2019).",
      "common_brands": ["Gastrocrom (oral)", "Crolom (ophthalmic)", "Nasalcrom (nasal spray - OTC)"],
      "potential_side_effects": ["GI upset initially", "Diarrhea", "Nausea", "Headache"],
      "notes": "Often requires gradual dosing increase. Start with 1 ampule (100mg) 4x daily and increase as tolerated. Not absorbed systemically - works locally in the gut."
    },
    {
      "id": "ms-003",
      "category": "mast-cell-stabilizers",
      "name": "Ketotifen",
      "type": "prescription",
      "forms": ["Oral tablets", "Ophthalmic drops"],
      "typical_dose": "1-2 mg, 1-2 times daily (oral). Start low, titrate up.",
      "mechanism": "Dual action: H1 antihistamine AND mast cell stabilizer - prevents degranulation and blocks histamine effects",
      "helps_with": {
        "symptoms": ["derm-001", "derm-002", "derm-003", "derm-004", "derm-005", "neuro-001", "neuro-005", "resp-001", "resp-002", "gi-001", "gi-003"],
        "description": "Powerful dual-action medication. Particularly good for skin symptoms and brain fog."
      },
      "evidence_level": "moderate",
      "evidence_notes": "Used widely in MCAS treatment. Better evidence in atopic conditions. Not FDA-approved for oral use in the US (compounded).",
      "common_brands": ["Compounded by specialty pharmacies", "Zaditor (ophthalmic - OTC)"],
      "potential_side_effects": ["Sedation (significant initially)", "Increased appetite", "Weight gain", "Dizziness"],
      "notes": "Causes significant sedation for first 2-4 weeks. Start at bedtime and titrate slowly. Sedation typically resolves with continued use."
    },
    {
      "id": "ms-004",
      "category": "mast-cell-stabilizers",
      "name": "Luteolin",
      "type": "supplement",
      "forms": ["Capsules", "With quercetin blends"],
      "typical_dose": "50-100 mg, 1-2 times daily",
      "mechanism": "Flavonoid - inhibits mast cell degranulation and cytokine release, crosses blood-brain barrier",
      "helps_with": {
        "symptoms": ["neuro-001", "neuro-004", "neuro-005", "gi-001", "gi-003", "derm-002", "derm-003"],
        "description": "Especially helpful for neurological symptoms due to ability to cross blood-brain barrier."
      },
      "evidence_level": "moderate",
      "evidence_notes": "In vitro and animal studies show potent mast cell stabilization. Human data limited.",
      "common_brands": ["NeuroProtek (liposomal luteolin)", "Pure Encapsulations Luteolin", "Thorne Luteolin"],
      "potential_side_effects": ["Generally well-tolerated", "Mild GI upset"],
      "notes": "Liposomal forms have better absorption. Often combined with quercetin for synergistic effects."
    },
    {
      "id": "ms-005",
      "category": "mast-cell-stabilizers",
      "name": "Palmitoylethanolamide (PEA)",
      "type": "supplement",
      "forms": ["Capsules", "Ultra-micronized powder"],
      "typical_dose": "400-600 mg, 2-3 times daily",
      "mechanism": "Endogenous fatty acid amide - activates PPAR-alpha receptors on mast cells to reduce activation and inflammation",
      "helps_with": {
        "symptoms": ["neuro-001", "neuro-004", "neuro-007", "msk-001", "msk-002", "msk-003", "derm-003", "gi-001"],
        "description": "Good for pain, neuroinflammation, and chronic mast cell activation."
      },
      "evidence_level": "moderate",
      "evidence_notes": "Supported by clinical trials for pain and neuroinflammation. Growing evidence in MCAS.",
      "common_brands": ["PEA-1000 (Spectrum Therapeutics)", "NOW PEA", "Pure Encapsulations PEA"],
      "potential_side_effects": ["Very well-tolerated", "Mild GI upset in some"],
      "notes": "Ultra-micronized forms have better bioavailability. Does not cause psychoactive effects. Safe for long-term use."
    },
    {
      "id": "ah1-001",
      "category": "antihistamines-h1",
      "name": "Fexofenadine (Allegra)",
      "type": "otc",
      "forms": ["Tablets 60mg, 180mg", "Orally disintegrating"],
      "typical_dose": "180 mg daily (or 60 mg twice daily)",
      "mechanism": "Second-generation H1 antihistamine - does not cross blood-brain barrier (non-sedating)",
      "helps_with": {
        "symptoms": ["derm-001", "derm-002", "derm-003", "resp-001", "resp-002", "resp-003", "resp-005", "neuro-002"],
        "description": "Non-sedating antihistamine for daily allergy-type symptoms. Preferred for daytime use."
      },
      "evidence_level": "high",
      "evidence_notes": "Standard of care for histamine-mediated conditions. Recommended in AAAAI MCAS guidelines.",
      "common_brands": ["Allegra", "Fexofenadine (generic)"],
      "potential_side_effects": ["Generally well-tolerated", "Very rarely headache or nausea"],
      "notes": "Non-sedating. Safe for long-term use. Some MCAS patients need higher or more frequent dosing."
    },
    {
      "id": "ah1-002",
      "category": "antihistamines-h1",
      "name": "Cetirizine (Zyrtec)",
      "type": "otc",
      "forms": ["Tablets 10mg", "Liquid", "Chewable"],
      "typical_dose": "10-20 mg daily (up to 40mg daily for MCAS under doctor supervision)",
      "mechanism": "Second-generation H1 antihistamine - minimal blood-brain barrier penetration",
      "helps_with": {
        "symptoms": ["derm-001", "derm-002", "derm-003", "resp-001", "resp-002", "resp-003", "derm-005"],
        "description": "Slightly more sedating than fexofenadine, but stronger antihistamine effect."
      },
      "evidence_level": "high",
      "evidence_notes": "Standard of care. MCAS patients often need higher doses (up to 40mg daily).",
      "common_brands": ["Zyrtec", "Cetirizine (generic)"],
      "potential_side_effects": ["Mild sedation in some", "Dry mouth", "Can cause drowsiness"],
      "notes": "Some sedation initially. Many MCAS patients use higher doses (20-40mg) divided twice daily."
    },
    {
      "id": "ah1-003",
      "category": "antihistamines-h1",
      "name": "Loratadine (Claritin)",
      "type": "otc",
      "forms": ["Tablets 10mg", "Orally disintegrating", "Liquid"],
      "typical_dose": "10 mg daily",
      "mechanism": "Second-generation H1 antihistamine - non-sedating",
      "helps_with": {
        "symptoms": ["derm-001", "derm-002", "derm-003", "resp-001", "resp-002"],
        "description": "Milder antihistamine. Good for mild symptoms or those sensitive to other antihistamines."
      },
      "evidence_level": "high",
      "evidence_notes": "Standard OTC antihistamine. Often used as part of a rotation.",
      "common_brands": ["Claritin", "Loratadine (generic)"],
      "potential_side_effects": ["Well-tolerated", "Very rarely dry mouth"],
      "notes": "Weaker than cetirizine. May not be sufficient for moderate-severe MCAS symptoms."
    },
    {
      "id": "ah1-004",
      "category": "antihistamines-h1",
      "name": "Diphenhydramine (Benadryl)",
      "type": "otc",
      "forms": ["Tablets 25mg, 50mg", "Liquid", "Capsules", "Topical cream"],
      "typical_dose": "25-50 mg as needed at bedtime",
      "mechanism": "First-generation H1 antihistamine - crosses blood-brain barrier (strongly sedating)",
      "helps_with": {
        "symptoms": ["derm-001", "derm-002", "derm-003", "derm-005", "neuro-005", "resp-003", "resp-005"],
        "description": "Fast-acting rescue antihistamine for acute flares. Strongly sedating - best used at bedtime."
      },
      "evidence_level": "high",
      "evidence_notes": "Standard rescue medication for acute allergic/histamine reactions.",
      "common_brands": ["Benadryl", "Diphenhydramine (generic)"],
      "potential_side_effects": ["Significant sedation", "Impaired driving/operation", "Dizziness", "Dry mouth", "Urinary retention", "Not for long-term use - associated with dementia risk"],
      "notes": "Use as rescue only, not daily. Long-term use associated with increased dementia risk. Not recommended for daily MCAS management."
    },
    {
      "id": "ah1-005",
      "category": "antihistamines-h1",
      "name": "Levocetirizine (Xyzal)",
      "type": "otc",
      "forms": ["Tablets 5mg", "Liquid"],
      "typical_dose": "5 mg daily (max 10mg daily for MCAS)",
      "mechanism": "Second-generation H1 antihistamine - purified isomer of cetirizine with higher potency",
      "helps_with": {
        "symptoms": ["derm-001", "derm-002", "derm-003", "resp-001", "resp-002", "derm-005"],
        "description": "Higher potency than cetirizine with potentially less sedation."
      },
      "evidence_level": "high",
      "evidence_notes": "Standard antihistamine. May be better tolerated than cetirizine.",
      "common_brands": ["Xyzal", "Levocetirizine (generic)"],
      "potential_side_effects": ["Mild sedation in some", "Dry mouth", "Fatigue"],
      "notes": "Some patients tolerate this better than cetirizine. Slightly more potent."
    },
    {
      "id": "ah2-001",
      "category": "antihistamines-h2",
      "name": "Famotidine (Pepcid)",
      "type": "otc",
      "forms": ["Tablets 10mg, 20mg, 40mg"],
      "typical_dose": "20-40 mg, 1-2 times daily",
      "mechanism": "H2 receptor antagonist - blocks histamine at H2 receptors in stomach (reduces acid) and blood vessels",
      "helps_with": {
        "symptoms": ["gi-001", "gi-005", "gi-004", "cardio-001", "cardio-002", "derm-001"],
        "description": "Essential second antihistamine for MCAS. Helps GI symptoms and supports cardiovascular stability."
      },
      "evidence_level": "high",
      "evidence_notes": "Standard of care for MCAS in combination with H1 blocker. Recommended by AAAAI guidelines.",
      "common_brands": ["Pepcid AC", "Famotidine (generic)"],
      "potential_side_effects": ["Well-tolerated", "Headache", "Dizziness", "Constipation"],
      "notes": "MCAS patients typically take BOTH H1 and H2 antihistamines daily. Do NOT take if you have kidney impairment without doctor approval."
    },
    {
      "id": "ah2-002",
      "category": "antihistamines-h2",
      "name": "Cimetidine (Tagamet)",
      "type": "otc",
      "forms": ["Tablets 200mg, 400mg"],
      "typical_dose": "200-400 mg, 1-2 times daily",
      "mechanism": "H2 receptor antagonist - also has some CYP3A4 inhibition (can affect medication metabolism)",
      "helps_with": {
        "symptoms": ["gi-001", "gi-005", "gi-004", "derm-002", "derm-003"],
        "description": "Alternative to famotidine. May have additional anti-inflammatory properties."
      },
      "evidence_level": "moderate",
      "evidence_notes": "Less commonly used due to drug interaction potential.",
      "common_brands": ["Tagamet HB", "Cimetidine (generic)"],
      "potential_side_effects": ["Can increase levels of other drugs (CYP450 inhibition)", "Gynecomastia in long-term use", "Confusion in elderly"],
      "notes": "Significant drug interactions. Famotidine is generally preferred. Not recommended if on warfarin, theophylline, or phenytoin."
    },
    {
      "id": "dao-001",
      "category": "dao-supplements",
      "name": "DAO Enzyme (Diamine Oxidase)",
      "type": "supplement",
      "forms": ["Capsules taken with meals"],
      "typical_dose": "1-2 capsules with each meal (varies by brand - follow label)",
      "mechanism": "Provides exogenous diamine oxidase to break down dietary histamine in the GI tract before absorption",
      "helps_with": {
        "symptoms": ["gi-001", "gi-002", "gi-003", "gi-004", "gi-005", "gi-006", "neuro-002", "derm-001", "derm-003", "resp-001"],
        "description": "Specifically for dietary histamine - helps when histamine-rich foods are eaten. Must be taken WITH the meal."
      },
      "evidence_level": "moderate",
      "evidence_notes": "Multiple human studies show symptom reduction. Manufacturer-funded studies show benefit (though criticized). Widely used by patients with reported benefit.",
      "common_brands": ["Histamine Block (Seeking Health)", "DAO Sin (SIN)", "HistDAO (Nutrition Dynamics)", "DAO-Plus (Pure Encapsulations)", "Umbrellux DAO"],
      "potential_side_effects": ["Very well-tolerated", "GI upset in some"],
      "notes": "Critically - must be taken WITH meals (not before, not after). Opens and digests dietary histamine in the gut. Different brands have different potencies."
    },
    {
      "id": "dao-002",
      "category": "dao-supplements",
      "name": "DAO Enzyme (High Potency / Fast Acting)",
      "type": "supplement",
      "forms": ["Chewable or sublingual tablets"],
      "typical_dose": "1-2 tablets as needed before or with meals",
      "mechanism": "Fast-acting DAO enzyme that starts breaking down histamine in the mouth and stomach",
      "helps_with": {
        "symptoms": ["gi-001", "gi-002", "gi-003", "gi-004", "gi-005", "neuro-002"],
        "description": "For more immediate histamine breakdown at the earliest point of ingestion."
      },
      "evidence_level": "preliminary",
      "evidence_notes": "Newer formulations. Less evidence but patient reports are positive.",
      "common_brands": ["HistDAO (Nutrition Dynamics)", "DAO-Plus (chewable)"],
      "potential_side_effects": ["Very well-tolerated"],
      "notes": "Chewable forms may work faster by starting histamine breakdown in the mouth/esophagus. Good for 'emergency' use before a questionable meal."
    },
    {
      "id": "sup-001",
      "category": "supplements",
      "name": "Vitamin C (Ascorbic acid / Sodium ascorbate / Liposomal C)",
      "type": "supplement",
      "forms": ["Powder", "Capsules", "Liposomal", "Buffered sodium ascorbate"],
      "typical_dose": "1000-4000 mg daily (in divided doses)",
      "mechanism": "Natural antihistamine - inhibits histamine release and increases histamine breakdown. Also antioxidant and mast cell stabilizer.",
      "helps_with": {
        "symptoms": ["derm-001", "derm-002", "derm-003", "resp-001", "resp-002", "neuro-001", "sys-002"],
        "description": "Broad support for histamine breakdown. Take in divided doses throughout the day."
      },
      "evidence_level": "moderate",
      "evidence_notes": "Multiple studies show vitamin C reduces blood histamine levels. High-dose vitamin C has antihistamine effects.",
      "common_brands": ["Pure Encapsulations Buffered Ascorbic Acid", "NOW Vitamin C", "Liposomal Vitamin C brands", "Thorne Vitamin C"],
      "potential_side_effects": ["GI upset / diarrhea at high doses (especially ascorbic acid)", "Buffered forms are gentler on stomach", "Can be constipating for some"],
      "notes": "Buffered sodium ascorbate or liposomal forms are better for sensitive GI tracts. High doses (5000+ mg) can cause diarrhea. Start low and increase gradually."
    },
    {
      "id": "sup-002",
      "category": "supplements",
      "name": "Magnesium",
      "type": "supplement",
      "forms": ["Magnesium glycinate", "Magnesium citrate", "Magnesium malate", "Magnesium threonate", "Epsom salt baths"],
      "typical_dose": "200-400 mg elemental magnesium daily (varies by form)",
      "mechanism": "Mast cell membrane stabilization, nervous system support, muscle relaxation, improves sleep quality",
      "helps_with": {
        "symptoms": ["neuro-001", "neuro-005", "neuro-004", "msk-001", "msk-002", "msk-003", "gi-006", "cardio-001"],
        "description": "Multi-purpose mineral for MCAS. Form matters - glycinate for sleep, malate for energy, citrate for bowel issues."
      },
      "evidence_level": "moderate",
      "evidence_notes": "Magnesium deficiency is common in MCAS patients. Essential for DAO enzyme function and mast cell stability.",
      "common_brands": ["Pure Encapsulations Magnesium Glycinate", "Thorne Magnesium Citramate", "NOW Magnesium", "Natural Calm (citrate)"],
      "potential_side_effects": ["Citrate forms can cause loose stools", "Glycinate best for sleep", "Threonate for cognitive support", "Too much can cause diarrhea"],
      "notes": "Magnesium glycinate is best tolerated for most MCAS patients. Magnesium citrate is good if constipation is an issue. Magnesium oxide is poorly absorbed."
    },
    {
      "id": "sup-003",
      "category": "supplements",
      "name": "Vitamin B6 (Pyridoxal 5-Phosphate / P5P)",
      "type": "supplement",
      "forms": ["P5P (active form)", "Pyridoxine HCl"],
      "typical_dose": "25-50 mg P5P daily",
      "mechanism": "Essential cofactor for DAO enzyme production. P5P is the active form needed for histamine breakdown.",
      "helps_with": {
        "symptoms": ["gi-001", "gi-003", "gi-004", "derm-001", "derm-002", "neuro-002"],
        "description": "Directly supports histamine degradation through DAO enzyme function."
      },
      "evidence_level": "moderate",
      "evidence_notes": "B6 is a required cofactor for DAO synthesis. Deficiency can impair histamine breakdown.",
      "common_brands": ["Pure Encapsulations P5P", "Thorne P5P", "NOW P5P", "Source Naturals P5P"],
      "potential_side_effects": ["P5P is well-tolerated", "Pyridoxine HCl at >200mg daily can cause neuropathy (P5P is safer at lower doses)", "Can cause vivid dreams"],
      "notes": "P5P is the active form and preferred. Most adults need 25-50mg/day. Do NOT exceed 100mg P5P without medical supervision."
    },
    {
      "id": "sup-004",
      "category": "supplements",
      "name": "Vitamin D3",
      "type": "supplement",
      "forms": ["D3 drops", "Capsules", "With K2"],
      "typical_dose": "2000-5000 IU daily (based on blood levels)",
      "mechanism": "Immunomodulator - stabilizes mast cells, reduces inflammatory cytokines, supports immune regulation",
      "helps_with": {
        "symptoms": ["msk-001", "msk-003", "sys-002", "derm-002", "derm-004", "neuro-001"],
        "description": "Immunomodulatory support. Most MCAS patients are deficient."
      },
      "evidence_level": "high",
      "evidence_notes": "Widely studied immunomodulator. Deficiency linked to higher allergic disease prevalence and autoimmune conditions.",
      "common_brands": ["Thorne D3 + K2", "Pure Encapsulations D3", "NOW D3", "Nordic Naturals D3"],
      "potential_side_effects": ["Well-tolerated at appropriate doses", "Very high doses can cause toxicity (rare)"],
      "notes": "Get levels tested before supplementing. Most MCAS patients are deficient. D3 with K2 is ideal."
    },
    {
      "id": "sup-005",
      "category": "supplements",
      "name": "Zinc (Picolinate / Glycinate / Carnosine)",
      "type": "supplement",
      "forms": ["Zinc picolinate", "Zinc glycinate", "Zinc carnosine (for gut healing)"],
      "typical_dose": "15-30 mg elemental zinc daily",
      "mechanism": "Essential for DAO function, immune regulation, and mast cell stability. Zinc carnosine supports gut lining.",
      "helps_with": {
        "symptoms": ["gi-001", "gi-003", "gi-005", "derm-002", "derm-004", "sys-002"],
        "description": "Supports DAO enzyme and gut health. Zinc carnosine is specific for GI barrier repair."
      },
      "evidence_level": "moderate",
      "evidence_notes": "Zinc is a cofactor for DAO. Deficiency impairs histamine breakdown.",
      "common_brands": ["Pure Encapsulations Zinc Picolinate", "Thorne Zinc Picolinate", "NOW Zinc", "Integrative Therapeutics Zinc Carnosine"],
      "potential_side_effects": ["Nausea on empty stomach", "Can cause copper deficiency with long-term use", "Metallic taste"],
      "notes": "Take with food to avoid nausea. Long-term use requires copper balance (1-3mg copper for every 30mg zinc)."
    },
    {
      "id": "sup-006",
      "category": "supplements",
      "name": "Copper (Glycinate / Chelated)",
      "type": "supplement",
      "forms": ["Copper glycinate", "Copper chelate"],
      "typical_dose": "1-3 mg daily (or in a multi with zinc)",
      "mechanism": "Essential for DAO enzyme function and histamine breakdown. Copper is a cofactor for DAO.",
      "helps_with": {
        "symptoms": ["gi-001", "derm-002", "derm-003"],
        "description": "Supporting histamine degradation. Often needed alongside zinc supplementation."
      },
      "evidence_level": "moderate",
      "evidence_notes": "DAO is a copper-dependent enzyme. Copper deficiency impairs DAO activity.",
      "common_brands": ["Pure Encapsulations Copper Glycinate", "Thorne Copper"],
      "potential_side_effects": ["Nausea at high doses", "Copper toxicity is rare but serious"],
      "notes": "Only needed if taking zinc long-term or if deficiency is confirmed."
    },
    {
      "id": "sup-007",
      "category": "supplements",
      "name": "N-Acetylcysteine (NAC)",
      "type": "supplement",
      "forms": ["Capsules", "Powder"],
      "typical_dose": "500-1000 mg, 1-2 times daily",
      "mechanism": "Precursor to glutathione - body's master antioxidant. Supports liver detoxification and histamine breakdown.",
      "helps_with": {
        "symptoms": ["resp-003", "resp-004", "neuro-001", "sys-002", "neuro-005"],
        "description": "Antioxidant support and detoxification. Helps break down histamine via glutathione conjugation."
      },
      "evidence_level": "low",
      "evidence_notes": "Good evidence for glutathione support. Less direct evidence in MCAS specifically, but supports histamine clearance pathways.",
      "common_brands": ["Pure Encapsulations NAC", "Thorne NAC", "NOW NAC", "Jarrow Formulas NAC"],
      "potential_side_effects": ["Some people react poorly (especially sulfur-sensitive)", "Can cause GI upset", "Can mobilize histamine (start low)"],
      "notes": "NAC can paradoxically trigger symptoms in some MCAS patients due to sulfur content. Start with low dose."
    },
    {
      "id": "sup-008",
      "category": "supplements",
      "name": "Omega-3 Fatty Acids (Fish Oil)",
      "type": "supplement",
      "forms": ["Fish oil liquid", "Softgels", "Algal oil (vegan)"],
      "typical_dose": "2000-4000 mg daily (providing EPA+DHA)",
      "mechanism": "Anti-inflammatory - reduces production of inflammatory mediators from mast cells, supports cell membrane stability",
      "helps_with": {
        "symptoms": ["derm-002", "derm-004", "msk-001", "msk-002", "msk-003", "neuro-001", "gi-001"],
        "description": "Anti-inflammatory support for all body systems."
      },
      "evidence_level": "high",
      "evidence_notes": "Well-established anti-inflammatory effects. Omega-3 fatty acids support mast cell membrane stability.",
      "common_brands": ["Nordic Naturals", "Pure Encapsulations Omega-3", "Thorne Omega-3", "Viva Naturals"],
      "potential_side_effects": ["Fishy burps (quality matters - refrigerate)", "Thin blood (caution with blood thinners)", "Mild GI upset"],
      "notes": "Quality matters for tolerability. Look for molecularly distilled, enteric-coated, or lemon-flavored options."
    },
    {
      "id": "sup-009",
      "category": "supplements",
      "name": "Probiotics (Low-Histamine Strains)",
      "type": "supplement",
      "forms": ["Capsules (refrigerated or shelf-stable)"],
      "typical_dose": "Per label directions",
      "mechanism": "Support healthy gut microbiome and DAO production. Must use low/no histamine-producing strains.",
      "helps_with": {
        "symptoms": ["gi-001", "gi-002", "gi-003", "gi-004", "gi-005"],
        "description": "Gut health support for long-term histamine tolerance improvement."
      },
      "evidence_level": "moderate",
      "evidence_notes": "Growing evidence that gut microbiome composition affects histamine levels.",
      "common_brands": ["Seeking Health HistaminX", "Klaire Labs Ther-Biotic Histamine Support", "Custom Probiotics 11 Strain"],
      "potential_side_effects": ["Initial die-off (herx) reaction in some", "Bloating initially"],
      "notes": "CHOOSE STRAINS CAREFULLY. Avoid: L. casei, L. bulgaricus, S. thermophilus. SAFE strains: B. infantis, B. longum, B. bifidum, L. plantarum, L. rhamnosus, L. salivarius, B. coagulans."
    },
    {
      "id": "otc-001",
      "category": "otc-relief",
      "name": "Nasal Cromolyn (Nasalcrom)",
      "type": "otc",
      "forms": ["Nasal spray"],
      "typical_dose": "1 spray each nostril, 3-4 times daily",
      "mechanism": "Topical mast cell stabilizer for nasal passages",
      "helps_with": {
        "symptoms": ["resp-001", "resp-002"],
        "description": "Specifically for nasal symptoms - congestion, sneezing, runny nose."
      },
      "evidence_level": "high",
      "evidence_notes": "OTC in the US. Well-established for allergic rhinitis. Safe for frequent use.",
      "common_brands": ["Nasalcrom"],
      "potential_side_effects": ["Very well-tolerated", "Mild nasal irritation", "Sneezing after application"],
      "notes": "Safe to use multiple times daily. Works best preventatively - start before symptoms peak."
    },
    {
      "id": "otc-002",
      "category": "otc-relief",
      "name": "Ketotifen Ophthalmic (Zaditor)",
      "type": "otc",
      "forms": ["Eye drops"],
      "typical_dose": "1 drop each eye, 2 times daily",
      "mechanism": "Topical mast cell stabilizer + H1 antihistamine for eyes",
      "helps_with": {
        "symptoms": ["derm-001", "derm-003"],
        "description": "For red, itchy, watery eyes during flares."
      },
      "evidence_level": "high",
      "evidence_notes": "OTC for allergic conjunctivitis. Dual action - mast cell stabilizer and antihistamine.",
      "common_brands": ["Zaditor", "Alaway", "Ketotifen (generic)"],
      "potential_side_effects": ["Mild stinging on application", "Well-tolerated"],
      "notes": "Good for ocular symptoms. Safe for daily use."
    },
    {
      "id": "otc-003",
      "category": "otc-relief",
      "name": "Epinephrine Auto-Injector (EpiPen, Auvi-Q)",
      "type": "prescription",
      "forms": ["Auto-injector (adult 0.3mg, junior 0.15mg)"],
      "typical_dose": "One injection into outer thigh, repeat after 5-15 min if needed",
      "mechanism": "Life-saving emergency medication - reverses anaphylaxis by constricting blood vessels, relaxing airways, and reducing swelling",
      "helps_with": {
        "symptoms": ["sys-004", "resp-003", "resp-005", "cardio-002", "derm-005"],
        "description": "EMERGENCY ONLY - for anaphylaxis/mast cell mediator storm. Not for daily use."
      },
      "evidence_level": "high",
      "evidence_notes": "FDA-approved, gold standard for anaphylaxis. All MCAS patients with history of severe reactions should carry one.",
      "common_brands": ["EpiPen", "EpiPen Jr", "Auvi-Q", "Adrenaclick", "Generic epinephrine auto-injector"],
      "potential_side_effects": ["Rapid heartbeat", "Anxiety", "Tremors", "Palpitations", "Nausea"],
      "notes": "CRITICAL: Never hesitate to use epinephrine for anaphylaxis. It is safer than NOT using it. Side effects are temporary. Always call 911 after use. Carry TWO auto-injectors."
    },
    {
      "id": "rx-001",
      "category": "prescription",
      "name": "Montelukast (Singulair)",
      "type": "prescription",
      "forms": ["Tablets 10mg", "Chewable 4mg, 5mg", "Granules"],
      "typical_dose": "10 mg daily (adults)",
      "mechanism": "Leukotriene receptor antagonist - blocks cysteinyl leukotrienes (other mast cell mediators besides histamine)",
      "helps_with": {
        "symptoms": ["resp-003", "resp-004", "derm-002", "derm-003", "gi-001"],
        "description": "For respiratory and skin symptoms when antihistamines alone are insufficient."
      },
      "evidence_level": "high",
      "evidence_notes": "Well-established for asthma and allergic rhinitis. Used off-label in MCAS for leukotriene-mediated symptoms.",
      "common_brands": ["Singulair", "Montelukast (generic)"],
      "potential_side_effects": ["Generally well-tolerated", "RARE: neuropsychiatric events (mood changes, depression, suicidal thoughts) - monitor closely", "Headache", "GI upset"],
      "notes": "Take in the evening. Now has FDA black box warning about mental health side effects - discontinue if mood changes occur."
    },
    {
      "id": "rx-002",
      "category": "prescription",
      "name": "Omalizumab (Xolair)",
      "type": "prescription",
      "forms": ["Subcutaneous injection (self-administered)"],
      "typical_dose": "150-375 mg every 2-4 weeks based on IgE levels and weight",
      "mechanism": "Monoclonal anti-IgE antibody - binds IgE and prevents it from activating mast cells and basophils",
      "helps_with": {
        "symptoms": ["derm-002", "derm-003", "derm-005", "resp-003", "resp-004", "gi-003", "sys-004"],
        "description": "For moderate-severe MCAS with allergic/IgE component. Reduces baseline mast cell reactivity."
      },
      "evidence_level": "high",
      "evidence_notes": "FDA-approved for chronic urticaria and allergic asthma. Increasingly used off-label for MCAS with good results.",
      "common_brands": ["Xolair"],
      "potential_side_effects": ["Injection site reactions", "RARE: anaphylaxis", "Headache", "Joint pain"],
      "notes": "Self-injectable after training. Can take 8-12 weeks to reach full effect."
    },
    {
      "id": "rx-003",
      "category": "prescription",
      "name": "Aspirin (Low Dose)",
      "type": "otc/prescription",
      "forms": ["Tablets 81mg, 325mg"],
      "typical_dose": "81-650 mg daily (under doctor supervision)",
      "mechanism": "COX-1/COX-2 inhibitor - reduces production of prostaglandin D2 (a mast cell mediator). At low doses, can stabilize mast cells.",
      "helps_with": {
        "symptoms": ["derm-001", "derm-002", "cardio-001", "cardio-002", "msk-001"],
        "description": "For patients with elevated PGD2. Can be very helpful OR can trigger flares - highly individual."
      },
      "evidence_level": "moderate",
      "evidence_notes": "Aspirin desensitization used in some MCAS patients. Must be carefully managed as some patients have severe reactions.",
      "common_brands": ["Bayer", "Generic aspirin"],
      "potential_side_effects": ["GI bleeding (take with food)", "Can trigger urticaria or anaphylaxis in sensitive patients", "Tinnitus"],
      "notes": "CRITICAL: Some MCAS patients react severely to aspirin. NEVER start without doctor supervision."
    }
  ]
};

export default productsData;
