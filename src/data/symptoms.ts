/**
 * Inlined symptom knowledge base for MCAS and histamine intolerance.
 * Embedded directly into the JS bundle so no filesystem I/O is needed at runtime.
 * Source: /home/team/shared/symptoms.json (compiled from peer-reviewed literature)
 */

export interface SymptomEntry {
  id: string;
  name: string;
  aliases: string[];
  severity_scale: {
    mild: string;
    moderate: string;
    severe: string;
  };
  common_triggers: string[];
  notes: string;
}

export interface BodySystem {
  system: string;
  description: string;
  symptoms: SymptomEntry[];
}

export interface SymptomsData {
  meta: {
    version: string;
    last_updated: string;
    source: string;
    description: string;
  };
  symptoms: Record<string, BodySystem>;
  biomarkers: {
    description: string;
    markers: Array<{
      name: string;
      normal_range: string;
      notes: string;
      timing: string;
    }>;
  };
  common_comorbidities: Array<{
    condition: string;
    prevalence: string;
    notes: string;
  }>;
}

const symptomsData: SymptomsData = {
  "meta": {
    "version": "1.0.0",
    "last_updated": "2026-07-08",
    "source": "Compiled from Wikipedia (Mast cell activation syndrome, Histamine intolerance), peer-reviewed literature, and clinical guidelines",
    "description": "Comprehensive symptom library for MCAS and histamine intolerance, organized by body system with severity scales and relevant biomarkers."
  },
  "symptoms": {
    "neurological": {
      "system": "Neurological",
      "description": "Brain and nervous system symptoms common in MCAS/histamine intolerance",
      "symptoms": [
        {
          "id": "neuro-001",
          "name": "Brain fog",
          "aliases": ["Cognitive dysfunction", "Mental fatigue", "Difficulty concentrating"],
          "severity_scale": {
            "mild": "Occasional difficulty focusing or remembering details",
            "moderate": "Frequent confusion, difficulty following conversations, trouble with routine tasks",
            "severe": "Debilitating cognitive impairment, inability to work or drive, requires assistance"
          },
          "common_triggers": ["High-histamine foods", "Stress", "Sleep deprivation", "Histamine liberators"],
          "notes": "One of the most commonly reported MCAS symptoms. Histamine acts as a neurotransmitter and can cross the blood-brain barrier."
        },
        {
          "id": "neuro-002",
          "name": "Headache / Migraine",
          "aliases": ["Head pressure", "Vascular headache", "Histamine headache"],
          "severity_scale": {
            "mild": "Mild dull headache, manageable without medication",
            "moderate": "Throbbing pain, photosensitivity, requires OTC relief",
            "severe": "Debilitating migraine with nausea, vomiting, aura, unresponsive to OTC medication"
          },
          "common_triggers": ["Aged cheeses", "Red wine", "Chocolate", "Fermented foods", "Alcohol", "Histamine-rich foods"],
          "notes": "Histamine is a potent vasodilator. CGRP and histamine interact in the trigeminovascular system to trigger migraines."
        },
        {
          "id": "neuro-003",
          "name": "Dizziness / Vertigo",
          "aliases": ["Lightheadedness", "Spinning sensation", "Vestibular disturbance"],
          "severity_scale": {
            "mild": "Occasional lightheadedness on standing quickly",
            "moderate": "Frequent dizziness requiring sitting down, affects balance",
            "severe": "Debilitating vertigo, unable to stand, risk of falling"
          },
          "common_triggers": ["Standing up quickly", "Heat", "High-histamine meals", "Stress"],
          "notes": "Often overlaps with POTS (postural orthostatic tachycardia syndrome), a common comorbidity of MCAS."
        },
        {
          "id": "neuro-004",
          "name": "Anxiety / Panic attacks",
          "aliases": ["Histamine-induced anxiety", "Panic-like symptoms", "Agitation"],
          "severity_scale": {
            "mild": "Occasional nervousness or unease",
            "moderate": "Frequent anxiety episodes affecting daily activities",
            "severe": "Panic attacks, sense of impending doom, requires intervention"
          },
          "common_triggers": ["Histamine-rich meals", "Stress", "Alcohol", "Food additives"],
          "notes": "Histamine can cause the release of epinephrine from adrenal glands, mimicking anxiety symptoms. Often misdiagnosed as primary anxiety disorder."
        },
        {
          "id": "neuro-005",
          "name": "Insomnia / Sleep disturbance",
          "aliases": ["Difficulty falling asleep", "Frequent waking", "Restless sleep"],
          "severity_scale": {
            "mild": "Takes >30 min to fall asleep, occasional waking",
            "moderate": "Frequent waking, difficulty returning to sleep, <6 hours sleep",
            "severe": "Chronic insomnia, <4 hours sleep, severely impacts daytime function"
          },
          "common_triggers": ["Late-night eating", "High-histamine foods before bed", "Stress", "Histamine release during sleep cycles"],
          "notes": "Histamine is involved in wakefulness regulation; excess can interfere with sleep-wake cycles."
        },
        {
          "id": "neuro-006",
          "name": "Tinnitus",
          "aliases": ["Ringing in ears", "Ear pressure"],
          "severity_scale": {
            "mild": "Occasional ringing, noticeable only in quiet environments",
            "moderate": "Frequent tinnitus, mildly distracting",
            "severe": "Constant loud ringing, interferes with hearing and concentration"
          },
          "common_triggers": ["Histamine-rich foods", "Stress", "Allergen exposure"],
          "notes": "Inner ear inflammation from mast cell activation can cause tinnitus and ear fullness."
        },
        {
          "id": "neuro-007",
          "name": "Peripheral neuropathy / Tingling",
          "aliases": ["Paresthesia", "Numbness", "Pins and needles", "Burning sensation"],
          "severity_scale": {
            "mild": "Occasional tingling in extremities",
            "moderate": "Frequent numbness or burning in hands/feet",
            "severe": "Constant debilitating neuropathy affecting mobility and fine motor skills"
          },
          "common_triggers": ["Inflammation", "Vitamin B6 issues (too high or low)", "Histamine release"],
          "notes": "Mast cells are found near peripheral nerves; their activation can directly affect nerve function."
        }
      ]
    },
    "gastrointestinal": {
      "system": "Gastrointestinal",
      "description": "Digestive system symptoms - often the first and most prominent in histamine intolerance",
      "symptoms": [
        {
          "id": "gi-001",
          "name": "Abdominal pain / Cramping",
          "aliases": ["Stomach pain", "GI cramping", "Visceral pain"],
          "severity_scale": {
            "mild": "Mild discomfort after meals, resolves within an hour",
            "moderate": "Moderate cramping lasting several hours, affects eating",
            "severe": "Severe debilitating pain, unable to eat, may require ER visit"
          },
          "common_triggers": ["High-histamine foods", "Fermented foods", "Alcohol", "Histamine liberators", "Large meals"],
          "notes": "Histamine increases gastric acid secretion and gut motility, directly causing pain and cramping."
        },
        {
          "id": "gi-002",
          "name": "Bloating / Gas",
          "aliases": ["Abdominal distension", "Flatulence", "Fullness"],
          "severity_scale": {
            "mild": "Slight bloating after meals, noticeable but manageable",
            "moderate": "Significant distension, uncomfortable clothing, visible swelling",
            "severe": "Severe distension, painful pressure, difficulty breathing from abdominal pressure"
          },
          "common_triggers": ["High-histamine foods", "Cross-reactive foods", "Lactose", "Gluten", "Legumes"],
          "notes": "Histamine slows gut transit and causes fluid secretion, leading to bloating."
        },
        {
          "id": "gi-003",
          "name": "Diarrhea",
          "aliases": ["Loose stools", "Frequent bowel movements", "Urgent stool"],
          "severity_scale": {
            "mild": "1-2 loose stools per day",
            "moderate": "3-5 urgent, watery stools per day",
            "severe": "6+ watery stools per day, risk of dehydration and electrolyte imbalance"
          },
          "common_triggers": ["High-histamine foods", "Food poisoning-like reaction", "Stress", "Alcohol"],
          "notes": "Histamine increases intestinal motility and secretion. Scombroid poisoning (histamine from spoiled fish) presents identically."
        },
        {
          "id": "gi-004",
          "name": "Nausea / Vomiting",
          "aliases": ["Sick to stomach", "Queasiness"],
          "severity_scale": {
            "mild": "Mild queasiness, able to eat",
            "moderate": "Frequent nausea, difficulty eating, occasional vomiting",
            "severe": "Persistent vomiting, unable to keep food down, risk of dehydration"
          },
          "common_triggers": ["High-histamine meals", "Odors", "Stress", "Motion"],
          "notes": "Histamine triggers nausea via H1 and H2 receptors in the gut and brainstem."
        },
        {
          "id": "gi-005",
          "name": "Acid reflux / GERD",
          "aliases": ["Heartburn", "Acid regurgitation", "Indigestion"],
          "severity_scale": {
            "mild": "Occasional heartburn after meals",
            "moderate": "Frequent reflux requiring OTC antacids",
            "severe": "Chronic GERD, esophageal damage, requires prescription medication"
          },
          "common_triggers": ["High-histamine foods", "Spicy foods", "Citrus", "Chocolate", "Caffeine", "Alcohol"],
          "notes": "Histamine directly stimulates gastric acid secretion via H2 receptors on parietal cells."
        },
        {
          "id": "gi-006",
          "name": "Constipation",
          "aliases": ["Infrequent bowel movements", "Straining"],
          "severity_scale": {
            "mild": "1-2 bowel movements per week, mild straining",
            "moderate": "Less than 1 per week, requires fiber or laxatives",
            "severe": "Chronic severe constipation, impaction risk, requires medical management"
          },
          "common_triggers": ["Mast cell mediators can slow gut transit in some patients", "Dehydration", "Low-fiber diet"],
          "notes": "Less common than diarrhea in histamine intolerance but can alternate."
        }
      ]
    },
    "dermatological": {
      "system": "Skin",
      "description": "Skin symptoms - highly visible and often diagnostic clues",
      "symptoms": [
        {
          "id": "derm-001",
          "name": "Flushing",
          "aliases": ["Facial flushing", "Redness", "Blotchy skin", "Erythema"],
          "severity_scale": {
            "mild": "Mild facial redness, resolves quickly",
            "moderate": "Significant flushing of face, neck, chest; lasts 30+ minutes",
            "severe": "Intense widespread flushing, burning sensation, may be mistaken for allergic reaction"
          },
          "common_triggers": ["Alcohol", "Histamine-rich foods", "Heat", "Emotional stress", "Exercise"],
          "notes": "Classic sign of histamine/mast cell mediator release. Histamine is a potent vasodilator of skin blood vessels."
        },
        {
          "id": "derm-002",
          "name": "Urticaria / Hives",
          "aliases": ["Wheals", "Welts", "Nettle rash"],
          "severity_scale": {
            "mild": "A few small hives, mild itching",
            "moderate": "Multiple hives covering limbs/torso, significant itching",
            "severe": "Widespread hives covering >50% body, severe itching, angioedema risk"
          },
          "common_triggers": ["Histamine-rich foods", "Pressure on skin", "Heat/cold", "Stress", "Insect bites"],
          "notes": "Dermatographism (skin writing) is common - lightly scratching skin produces red wheals."
        },
        {
          "id": "derm-003",
          "name": "Itching / Pruritus",
          "aliases": ["Generalized itching", "Skin crawling sensation"],
          "severity_scale": {
            "mild": "Occasional itching, easily distracted",
            "moderate": "Frequent itching, interferes with sleep and concentration",
            "severe": "Constant severe itching, skin damage from scratching, sleep deprivation"
          },
          "common_triggers": ["Heat", "Wool/rough fabrics", "Stress", "Histamine-rich foods", "Showers"],
          "notes": "Histamine directly stimulates sensory nerve endings in the skin, causing itch sensation."
        },
        {
          "id": "derm-004",
          "name": "Eczema / Dermatitis",
          "aliases": ["Atopic dermatitis", "Dry itchy patches", "Rash"],
          "severity_scale": {
            "mild": "Small patches of dry, itchy skin",
            "moderate": "Larger patches, weeping, requires topical steroids",
            "severe": "Widespread eczema, infection risk, requires systemic treatment"
          },
          "common_triggers": ["Food triggers", "Contact allergens", "Stress", "Weather changes"],
          "notes": "Mast cells are elevated in atopic dermatitis lesions."
        },
        {
          "id": "derm-005",
          "name": "Angioedema",
          "aliases": ["Swelling under skin", "Puffy eyes/lips", "Deep swelling"],
          "severity_scale": {
            "mild": "Mild lip or eyelid swelling",
            "moderate": "Noticeable facial swelling, tongue swelling, difficulty speaking",
            "severe": "Airway-threatening swelling (throat, tongue) - MEDICAL EMERGENCY"
          },
          "common_triggers": ["Food triggers", "Medications (NSAIDs)", "Stress", "Physical triggers"],
          "notes": "Can be life-threatening if it involves the throat/tongue. Requires immediate medical attention."
        }
      ]
    },
    "respiratory": {
      "system": "Respiratory",
      "description": "Breathing and airway symptoms",
      "symptoms": [
        {
          "id": "resp-001",
          "name": "Nasal congestion",
          "aliases": ["Stuffy nose", "Sinus congestion", "Rhinitis"],
          "severity_scale": {
            "mild": "Mild stuffiness, one nostril affected",
            "moderate": "Bilateral congestion, mouth breathing at night",
            "severe": "Complete nasal obstruction, sinus pressure/pain, loss of smell"
          },
          "common_triggers": ["Histamine-rich foods", "Alcohol (especially red wine)", "Allergens", "Temperature changes"],
          "notes": "Histamine causes nasal blood vessel dilation and increased mucus production via H1 receptors."
        },
        {
          "id": "resp-002",
          "name": "Sneezing / Runny nose",
          "aliases": ["Rhinorrhea", "Sneezing fits"],
          "severity_scale": {
            "mild": "Occasional sneezing, clear discharge",
            "moderate": "Frequent sneezing fits, runny nose interfering with activities",
            "severe": "Constant rhinitis, post-nasal drip, coughing"
          },
          "common_triggers": ["Histamine-rich foods", "Allergens", "Odors/perfumes", "Temperature changes"],
          "notes": "Histamine is a major mediator in allergic rhinitis; similar mechanism in histamine intolerance."
        },
        {
          "id": "resp-003",
          "name": "Shortness of breath",
          "aliases": ["Dyspnea", "Chest tightness", "Difficulty breathing"],
          "severity_scale": {
            "mild": "Mild chest tightness during flares",
            "moderate": "Noticeable shortness of breath with mild exertion",
            "severe": "Wheezing, air hunger, requires bronchodilator - can be MEDICAL EMERGENCY"
          },
          "common_triggers": ["High-histamine foods", "Exercise", "Stress", "Allergens"],
          "notes": "Histamine can cause bronchoconstriction via H1 receptors on bronchial smooth muscle."
        },
        {
          "id": "resp-004",
          "name": "Wheezing",
          "aliases": ["Asthma-like symptoms", "Bronchospasm"],
          "severity_scale": {
            "mild": "Mild expiratory wheeze, audible with stethoscope",
            "moderate": "Audible wheezing without stethoscope, mild distress",
            "severe": "Severe bronchospasm, use of accessory muscles, requires emergency care"
          },
          "common_triggers": ["Histamine-rich foods", "Exercise", "Cold air", "Stress"],
          "notes": "Can mimic asthma. Many MCAS patients are diagnosed with 'atypical asthma'."
        },
        {
          "id": "resp-005",
          "name": "Throat tightness",
          "aliases": ["Lump in throat", "Globus sensation", "Dysphagia"],
          "severity_scale": {
            "mild": "Sensation of lump in throat, no swallowing difficulty",
            "moderate": "Noticeable tightness, difficulty swallowing solids",
            "severe": "Severe constriction, difficulty breathing/swallowing - MEDICAL EMERGENCY"
          },
          "common_triggers": ["High-histamine foods", "Reflux", "Stress", "Allergens"],
          "notes": "Can be a precursor to anaphylaxis; must be taken seriously."
        }
      ]
    },
    "cardiovascular": {
      "system": "Cardiovascular",
      "description": "Heart and blood pressure symptoms",
      "symptoms": [
        {
          "id": "cardio-001",
          "name": "Heart palpitations",
          "aliases": ["Racing heart", "Pounding heartbeat", "Tachycardia"],
          "severity_scale": {
            "mild": "Occasional awareness of heartbeat",
            "moderate": "Frequent palpitations, heart rate >100 at rest",
            "severe": "Sustained tachycardia, chest discomfort, near-syncope"
          },
          "common_triggers": ["Histamine-rich meals", "Stress", "Alcohol", "Hormonal changes"],
          "notes": "Histamine increases heart rate via H2 receptors. Often comorbid with POTS (postural orthostatic tachycardia syndrome)."
        },
        {
          "id": "cardio-002",
          "name": "Hypotension / Blood pressure drop",
          "aliases": ["Low blood pressure", "Feeling faint", "Near-syncope"],
          "severity_scale": {
            "mild": "Slight BP drop, mild lightheadedness",
            "moderate": "Noticeable BP drop, needs to sit/lie down",
            "severe": "Severe hypotension, syncope (fainting) - MEDICAL EMERGENCY"
          },
          "common_triggers": ["High histamine load", "Heat", "Standing quickly", "Large meals"],
          "notes": "Histamine is a potent vasodilator; excessive release can cause anaphylactic shock."
        },
        {
          "id": "cardio-003",
          "name": "Chest pain / Tightness",
          "aliases": ["Non-cardiac chest pain", "Costochondritis-like pain"],
          "severity_scale": {
            "mild": "Mild chest discomfort, not limiting activities",
            "moderate": "Moderate pain, may be mistaken for cardiac",
            "severe": "Severe crushing pain - requires cardiac workup to rule out heart attack"
          },
          "common_triggers": ["Inflammation", "Stress", "Histamine-rich foods"],
          "notes": "Must rule out cardiac causes. Mast cell mediators can cause chest wall inflammation and esophageal spasm."
        }
      ]
    },
    "musculoskeletal": {
      "system": "Musculoskeletal",
      "description": "Muscle and joint symptoms",
      "symptoms": [
        {
          "id": "msk-001",
          "name": "Joint pain / Arthritis",
          "aliases": ["Arthralgia", "Joint inflammation", "Stiffness"],
          "severity_scale": {
            "mild": "Mild joint ache, worse with activity",
            "moderate": "Moderate pain, stiffness in mornings, affects mobility",
            "severe": "Severe chronic joint pain, requires pain management"
          },
          "common_triggers": ["Inflammatory foods", "Stress", "Weather changes"],
          "notes": "Mast cells are found in synovium and can contribute to joint inflammation. Often comorbid with Ehlers-Danlos syndrome."
        },
        {
          "id": "msk-002",
          "name": "Muscle pain / Myalgia",
          "aliases": ["Muscle aches", "Fibromyalgia-like pain"],
          "severity_scale": {
            "mild": "Occasional muscle soreness",
            "moderate": "Frequent muscle pain affecting daily activities",
            "severe": "Chronic widespread pain, often diagnosed as fibromyalgia"
          },
          "common_triggers": ["Overexertion", "Inflammation", "Stress", "Sleep deprivation"],
          "notes": "Mast cells are present in muscle tissue and can release pain-promoting mediators."
        },
        {
          "id": "msk-003",
          "name": "Fatigue / Chronic fatigue",
          "aliases": ["Exhaustion", "Post-exertional malaise", "Overwhelming tiredness"],
          "severity_scale": {
            "mild": "Tired after exertion, recovers with rest",
            "moderate": "Daily fatigue limits activities, needs naps",
            "severe": "Debilitating fatigue, bed-bound during flares, unable to work"
          },
          "common_triggers": ["High-histamine meals", "Sleep disturbance", "Stress", "Physical exertion"],
          "notes": "Common comorbidity: ME/CFS (myalgic encephalomyelitis/chronic fatigue syndrome). Mast cell activation consumes energy and releases inflammatory cytokines that cause fatigue."
        }
      ]
    },
    "genitourinary": {
      "system": "Genitourinary",
      "description": "Urinary and reproductive symptoms",
      "symptoms": [
        {
          "id": "gu-001",
          "name": "Urinary urgency / frequency",
          "aliases": ["Overactive bladder", "Frequent urination", "Interstitial cystitis-like symptoms"],
          "severity_scale": {
            "mild": "Slightly increased frequency",
            "moderate": "Urgency, frequency every 2 hours, nocturia",
            "severe": "Constant urgency, frequency every 30-60 min, incontinence"
          },
          "common_triggers": ["High-histamine foods", "Stress", "Bladder irritants", "Hormonal changes"],
          "notes": "Mast cells are abundant in the bladder lining; their activation can mimic interstitial cystitis."
        },
        {
          "id": "gu-002",
          "name": "Menstrual cycle disruption",
          "aliases": ["PMS worsening", "Painful periods", "Hormonal flares"],
          "severity_scale": {
            "mild": "Mild worsening of PMS symptoms",
            "moderate": "Significantly worse pre-menstrual symptoms, painful periods",
            "severe": "Debilitating menstrual flares, irregular cycles"
          },
          "common_triggers": ["Hormonal fluctuations (estrogen can trigger mast cells)", "Stress"],
          "notes": "Estrogen can directly activate mast cells, explaining why many women flare around their period."
        }
      ]
    },
    "systemic": {
      "system": "Systemic / General",
      "description": "Whole-body symptoms not limited to one system",
      "symptoms": [
        {
          "id": "sys-001",
          "name": "Temperature dysregulation",
          "aliases": ["Heat/cold intolerance", "Hot flashes", "Chills"],
          "severity_scale": {
            "mild": "Mild temperature sensitivity",
            "moderate": "Frequent hot/cold spells, sweating",
            "severe": "Severe temperature swings, chills, night sweats"
          },
          "common_triggers": ["Histamine release", "Hormonal changes", "Stress"],
          "notes": "Histamine affects the hypothalamus (body's thermostat)."
        },
        {
          "id": "sys-002",
          "name": "Malaise",
          "aliases": ["General feeling of illness", "Flu-like symptoms", "Feeling unwell"],
          "severity_scale": {
            "mild": "Slight feeling of being unwell",
            "moderate": "Noticeable illness feeling, reduced function",
            "severe": "Severe malaise, bed-ridden"
          },
          "common_triggers": ["High histamine load", "Inflammatory response", "Stress"],
          "notes": "Cytokine release from mast cells causes systemic inflammation and illness feeling."
        },
        {
          "id": "sys-003",
          "name": "Alcohol intolerance",
          "aliases": ["Reaction to alcohol", "Red wine headache", "Histamine reaction to drinks"],
          "severity_scale": {
            "mild": "Flushing and warmth after 1 drink",
            "moderate": "Immediate headache, nausea, flushing after small amounts",
            "severe": "Severe reaction to any alcohol - hives, breathing difficulty, tachycardia"
          },
          "common_triggers": ["Red wine", "Beer", "Champagne", "Aged spirits"],
          "notes": "Alcohol is a potent histamine liberator and also inhibits DAO (diamine oxidase). Red wine has the highest histamine content."
        },
        {
          "id": "sys-004",
          "name": "Anaphylaxis / Anaphylactoid reactions",
          "aliases": ["Idiopathic anaphylaxis", "Pseudo-anaphylaxis", "MCAS flares mimicking anaphylaxis"],
          "severity_scale": {
            "mild": "NOT APPLICABLE - anaphylaxis is always severe",
            "moderate": "NOT APPLICABLE",
            "severe": "Multi-system involvement: skin + respiratory + cardiovascular compromise. LIFE-THREATENING"
          },
          "common_triggers": ["Multiple triggers simultaneously", "Food", "Medication", "Exercise", "Idiopathic"],
          "notes": "MCAS patients can have recurrent 'idiopathic' anaphylaxis. Tryptase testing during episodes is diagnostic. Always carry epinephrine."
        }
      ]
    }
  },
  "biomarkers": {
    "description": "Laboratory markers used in MCAS diagnosis and monitoring",
    "markers": [
      {
        "name": "Serum Tryptase",
        "normal_range": "<11.4 ng/mL",
        "notes": "Elevated during acute flares (>20%+2 formula). Baseline may be normal. Gold standard mast cell mediator.",
        "timing": "Best measured within 1-4 hours of symptom onset"
      },
      {
        "name": "N-Methylhistamine (Urine)",
        "normal_range": "30-200 mcg/g creatinine",
        "notes": "24-hour urine collection. Reflects histamine metabolism over 24 hours.",
        "timing": "24-hour collection"
      },
      {
        "name": "Prostaglandin D2 (Urine)",
        "normal_range": "Varies by lab",
        "notes": "11-beta-PGF2 alpha is the major metabolite. Elevated in some MCAS patients with normal tryptase.",
        "timing": "Spot or 24-hour urine"
      },
      {
        "name": "Leukotriene E4 (Urine)",
        "normal_range": "<100 pg/mg creatinine",
        "notes": "Reflects cysteinyl leukotriene production from mast cell activation.",
        "timing": "Spot or 24-hour urine"
      },
      {
        "name": "Diamine Oxidase (DAO) (Serum)",
        "normal_range": ">10 U/mL (varies by lab)",
        "notes": "Low DAO indicates reduced ability to break down histamine. Used in histamine intolerance assessment.",
        "timing": "Can be measured anytime"
      },
      {
        "name": "Histamine (Plasma)",
        "normal_range": "0.3-1.0 ng/mL",
        "notes": "Has a very short half-life (minutes). Difficult to capture unless drawn during active symptoms.",
        "timing": "Within 15-30 minutes of symptom onset"
      }
    ]
  },
  "common_comorbidities": [
    {
      "condition": "Postural Orthostatic Tachycardia Syndrome (POTS)",
      "prevalence": "Very high among MCAS patients",
      "notes": "Dysautonomia condition; heart rate increases excessively upon standing. Mast cell mediators affect blood vessel regulation."
    },
    {
      "condition": "Ehlers-Danlos Syndrome (EDS) - Hypermobile type",
      "prevalence": "High",
      "notes": "Connective tissue disorder. Often co-occurs with MCAS and POTS (the 'triad'). Genetic link suspected."
    },
    {
      "condition": "Myalgic Encephalomyelitis / Chronic Fatigue Syndrome (ME/CFS)",
      "prevalence": "Elevated",
      "notes": "Mast cell activation may contribute to the inflammatory and fatigue symptoms in ME/CFS."
    },
    {
      "condition": "Irritable Bowel Syndrome (IBS)",
      "prevalence": "Very high",
      "notes": "Many MCAS patients are initially diagnosed with IBS. Gut mast cell activation is a known driver of IBS symptoms."
    },
    {
      "condition": "Interstitial Cystitis / Painful Bladder Syndrome",
      "prevalence": "Elevated",
      "notes": "Mast cells in bladder lining contribute to inflammation and pain."
    },
    {
      "condition": "Autoimmune Conditions",
      "prevalence": "Elevated",
      "notes": "Higher rates of Hashimoto's thyroiditis, Sjogren's syndrome, lupus in MCAS populations."
    },
    {
      "condition": "Long COVID",
      "prevalence": "Recognized as trigger or comorbidity",
      "notes": "SARS-CoV-2 can trigger mast cell activation; many long COVID symptoms overlap with MCAS."
    },
    {
      "condition": "Mastocytosis",
      "prevalence": "Rarer, but related",
      "notes": "SM (Systemic Mastocytosis) is a clonal mast cell disorder. MCAS can occur with or without mastocytosis."
    }
  ]
};

export default symptomsData;
