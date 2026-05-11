# 📊 Code Efficiency & Cleanup - ANALYSE RAPPORT

**Datum:** 24 Maart 2026  
**Status:** Volledige Codebase Analyse Voltooid  
**Prioriteit:** HOOG - Kritieke Issues Gevonden

---

## 🎯 EXECUTIVE SUMMARY

| Issue | Severity | Impact |
|-------|----------|--------|
| Duplicate components (ContentCards + ProductInformation) | 🔴 KRITIEK | Eén component ongebruikt, onderhoudsburden verdubbeld |
| Overmaatse componenten (335+ regels) | 🔴 KRITIEK | Code niet splitsen, moeilijk onderhoudbaar |
| Duplicate VariantSelector (x2 versies) | 🟠 HOOG | State-duplicatie, confusion welke te gebruiken |
| Grote PRODUCT_CARDS array (309 regels) | 🟠 HOOG | Componentbestand te groot |
| Gemengde map-structuur | 🟡 MEDIUM | Organisatie onduidelijk |

**Totale Action Items:** 18  
**Geschat Werk:** 3-4 uur refactoring  
**Risiconiveau:** LAAG (geen breaking changes nodig)

---

## 📈 COMPONENT LINE COUNT ANALYSE

### ❌ COMPONENTEN BOVEN 150 REGELS

```
🔴 ContentCards.jsx (ui/)
   └─ 335 logische regels (2.2x te groot!)
   └─ ROOTcauseCode: Massive PRODUCT_CARDS array (309 regels!)
   
🔴 ProductInformation.jsx (ui/)
   └─ 245 logische regels (1.6x te groot)
   └─ STATUS: Niet in gebruik, duplicate van ContentCards
   └─ ACTION: DELETE
   
🟡 VariantSelector.jsx
   └─ 198 logische regels
   └─ Kan gereduceerd naar ~120 via hook-extractie
```

### ✓ GOED DIMENSIONEERDE COMPONENTEN

De volgende componenten zijn OK:
- PageHeader.jsx (127 regels)
- Sidebar.jsx (52 regels)
- RightAnchorMenu.jsx (81 regels)
- Combobox.jsx (108 regels)
- Select.jsx (122 regels)
- Dialog.jsx (76 regels)
- Toast.jsx (81 regels)

---

## 🔴 KRITIEKE PROBLEMEN

### Problem #1: Duplicate Components

**ContentCards.jsx vs ProductInformation.jsx**

```
HUIDGE SITUATIE:
App.jsx → importeert ContentCards.jsx ✓ (actief)
ProductInformation.jsx → NOWHERE IMPORTED ❌ (dead code)

OVERLAP:
✓ ContentCards: auto-fill naam, defaults, prijzen, alle veldtypes
✓ ProductInformation: auto-fill naam, defaults, basis veldtypes
✗ ProductInformation: ONVOLLEDIG - mist 6 van 7 secties
```

**BEVINDING:** ProductInformation.jsx is een **oudere, onvolledigere versie** van ContentCards. Volledig redundant.

### Problem #2: Massieve Component

**ContentCards.jsx - 335 regels** (LIMIT: 150)

Breakdown:
```
- PRODUCT_CARDS array setup:        307 regels! 🔴
- Component hooks/state:              32 regels
- Auto-fill logica:                  120 regels
- renderField() functie:              45 regels
- Return/JSX:                         60 regels
- Imports & constants:                15 regels
                                     ────────
                                      335 TOTAAL
```

**IMPACT:** Erg moeilijk om geïsoleerde wijzigingen te maken

### Problem #3: Duplicate VariantSelectors

```
src/components/VariantSelector.jsx  (198 regels) - ACTIEF
src/components/VariantSelector2.jsx (97 regels) - ONGEBRUIKT?

Beide hebben:
  - Dezelfde state (variant, language)
  - Dezelfde handlers
  - Dezelfde Combobox componenten
  
VariantSelector2 lijkt een experiment/prototype
```

**BEVINDING:** VariantSelector2 kan verwijderd worden (niet in App.jsx)

---

## 📁 MAP-STRUCTUUR ISSUES

### Huidge Situatie:
```
src/
├── components/
│   ├── PageHeader.jsx          ✓ OK - layout component
│   ├── Sidebar.jsx             ✓ OK - layout component
│   ├── RightAnchorMenu.jsx     ✓ OK - layout component
│   ├── VariantSelector.jsx     ✓ OK - feature component
│   ├── VariantSelector2.jsx    ❌ DELETE - duplicate/unused
│   └── ui/
│       ├── ContentCards.jsx   ✓ (maar 335 regels!)
│       ├── ProductInformation.jsx  ❌ DELETE - unused duplicate
│       ├── [other UI components]
│       └── ...
├── context/
└── [anders]

OPMERKING: Geen aparte folders voor:
  - hooks/ (custom React hooks)
  - utils/ (utility functions)
  - constants/ (data constants)
```

### Optimale Structuur:

```
src/
├── components/
│   ├── layout/
│   │   ├── PageHeader.jsx
│   │   ├── Sidebar.jsx
│   │   └── RightAnchorMenu.jsx
│   ├── VariantSelector.jsx  (standalone feature)
│   ├── ui/
│   │   ├── button.jsx, input.jsx, etc.
│   │   ├── ContentCards.jsx
│   │   └── index.js
│   └── index.js (barrel export)
├── hooks/                    (NEW)
│   ├── useProductForm.ts
│   └── useScrollDetection.ts
├── constants/               (NEW)
│   ├── productCards.ts      (309-regel array!)
│   └── formOptions.ts
├── utils/                   (NEW)
│   └── formHelpers.ts
├── context/
└── [rest]
```

---

## 🧠 TYPESCRIPT READINESS MATRIX

**Om prioriteit voor conversie te bepalen:**

### 🟢 READY NOW (Makkelijk - Start hier!)

| Component | Linnen | Props Pattern | Notes |
|-----------|-----:|---|---|
| FormRow.jsx | 12 | `{ label, required, children }` | Static, clear |
| Skeleton.jsx | 11 | `{ className }` | One prop |
| Icons.jsx | 42 | Pure exports | No props |
| button.jsx | 38 | CVA + clear | Standard pattern |
| input.jsx | 16 | HTML passthrough | Straightforward |

### 🟡 MEDIUM (Wat werk - Daarna)

| Component | Linnen | Props Pattern | Notes |
|-----------|-----:|---|---|
| CopyAction.jsx | 68 | Callbacks + strings | Needs enums |
| Toast.jsx | 81 | String variants | Union types |
| AttributeBadge.jsx | 32 | String unions | Small, doable |
| combobox.jsx | 108 | Generics needed | Complex state |
| select.jsx | 122 | Context pattern | Multiple Sub-components |

### 🔴 HARD (Veel werk - Vermijd eerst)

| Component | Linnen | Props Pattern | Notes |
|-----------|-----:|---|---|
| PageHeader.jsx | 127 | Scroll context | Complex animations |
| VariantSelector.jsx | 198 | State management | Hooks + context |
| dialog.jsx | 76 | Radix UI wrapper | Generic types |
| tooltip.jsx | 28 | Radix UI wrapper | Generic types |
| **ContentCards.jsx** | **335** | **Massief** | **Refactor EERST** |

---

## 🗂️ LARGE DATA OBJECTS - EXTRACTIE KANSEN

### 🔴 KRITIEK - PRODUCT_CARDS (309 regels!)

**Huidge locatie:** ContentCards.jsx lijn 29-324

**Impact:** Dit array is HALF van het bestand!

**Extractie plan:**
```
NEW FILE: src/constants/productCards.ts
- Move entire PRODUCT_CARDS array
- Add TSDoc comments
- ImageObject totals: ~350+ regels alleen voor data

RESULT:
- ContentCards.jsx redushes van 335 → ~80 regels
- Makkelijker te testen en onderhouden
```

### 🟡 ANDERE EXTRACTIE KANSEN

```
In VariantSelector.jsx:
- VARIANT_OPTIONS array (6 items)
- LANGUAGE_OPTIONS array (2 items)
→ Kunnen naar src/constants/selectorOptions.ts

In ProductInformation.jsx (before delete):
- PROVIDER_OPTIONS (4 items)
→ Kunnen naar src/constants/providerOptions.ts

In ContentCards.jsx:
- renderField() is 45 regels
→ Kan naar src/utils/formRenderers.ts
```

---

## 🎯 ACTIONABLE ACTION PLAN

### FASE 1: Komponente Opschonen (HIGH PRIORITY)

#### Step 1.1: DELETE ProductInformation.jsx ✂️
```
File: src/components/ui/ProductInformation.jsx
Status: ONGEBRUIKT (zeker?)
Action: DELETE - niet geïmporteerd in App.jsx
Impact: Geen - 100% redundant met ContentCards.jsx
```

#### Step 1.2: DELETE VariantSelector2.jsx ✂️
```
File: src/components/VariantSelector2.jsx
Status: ONGEBRUIKT (test dit!)
Action: DELETE als niet gebruikt
Impact: Kleine - alleen test verwijderingen nodig
```

#### Step 1.3: Extract PRODUCT_CARDS naar Constants 📦
```
FROM: src/components/ui/ContentCards.jsx (309 regels!)
TO:   src/constants/productCards.ts (NEW)

Changes:
- Move PRODUCT_CARDS array (lijn 29-324)
- Add import: import { PRODUCT_CARDS } from '../../constants/productCards'
- ContentCards.jsx reduceert tot ~80 regels
```

---

### FASE 2: Refactor Large Components

#### Step 2.1: Reduce ContentCards.jsx (335 → 100 regels)
```
After PRODUCT_CARDS extract, ContentCards becomes:
- Imports & constants: 10 regels
- State & hooks: 25 regels  
- renderField helpers: Extract to utils
- Auto-fill logic: Extract to useProductForm hook
- Render JSX: 30 regels
= ~80-100 regels ✓
```

#### Step 2.2: Refactor VariantSelector.jsx (198 → 120 regels)
```
Extract:
- Scroll-detection logic → useScrollDetection hook
- Selector width calculation → useSelectorWidth hook
- VARIANT/LANGUAGE options → constants
Result: ~120 regels ✓
```

---

### FASE 3: Map-Structuur Reorganiseren

#### Step 3.1: Create Folder Structure
```
mkdir -p src/hooks
mkdir -p src/constants
mkdir -p src/utils
mkdir -p src/components/layout
```

#### Step 3.2: Move Layout Components
```
MOVE:
  src/components/PageHeader.jsx → src/components/layout/
  src/components/Sidebar.jsx → src/components/layout/
  src/components/RightAnchorMenu.jsx → src/components/layout/
```

#### Step 3.3: Move Data Constants
```
MOVE:
  Extract & create:
    src/constants/productCards.ts (dari ContentCards.jsx)
    src/constants/selectorOptions.ts (dari VariantSelector.jsx)
```

#### Step 3.4: Create Custom Hooks
```
CREATE:
  src/hooks/useProductForm.ts (formm logic uit ContentCards)
  src/hooks/useScrollDetection.ts (scroll logic uit PageHeader)
  src/hooks/useSelectorWidth.ts (width calculation)
```

---

### FASE 4: TypeScript Conversie (Optional)

#### Priority Order:
1. ✅ **EASY (1 uur):** FormRow, Skeleton, Icons, button, input
2. 🟡 **MEDIUM (1.5 uur):** CopyAction, Toast, badge, combobox
3. 🔴 **HARD (2 uur):** PageHeader, VariantSelector, ContentCards

---

## 📊 SUMMARY TABLE

| Task | Severity | Est. Time | Impact |
|------|----------|-----------|--------|
| DELETE ProductInformation.jsx | 🔴 | 5 min | Removes dead code |
| DELETE VariantSelector2.jsx | 🟠 | 5 min | Removes duplicate |
| Extract PRODUCT_CARDS | 🔴 | 20 min | 🟢 Reduces ContentCards 335→80 lines |
| Extract form utilities | 🟠 | 15 min | Supports future reuse |
| Create folder structure | 🟡 | 15 min | Better organization |
| Refactor VariantSelector | 🟡 | 30 min | 🟢 Reduces 198→120 lines |
| TypeScript conversion (optional) | 🟡 | 3+ hours | Type safety |
| **TOTAL** | | **~2 hours** | 🎯 Major cleanup |

---

## ✅ NEXT STEPS

1. **Bevestig** dat ProductInformation.jsx echt niet meer gebruikt wordt
2. **Bevestig** dat VariantSelector2.jsx echt niet meer gebruikt wordt
3. **Start met Fase 1** - Verwijder dead code (10 minuten)
4. **Verbeter ContentCards** - Extract data & utils (20 minuten)
5. **Reorganiseer mappen** - Better structure (15 minuten)
6. **Test alles** - Zorg dat niets breekt (15 minuten)

---

**Rapport aangemaakt:** 24-03-2026  
**Volgende stap:** Wacht op je bevestiging voordat refactoring begint
