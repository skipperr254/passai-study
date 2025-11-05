# Files Affected - Quick Reference Tree

## 🔴 Phase 1: IMMEDIATE FIXES (5 files)

```
passai-magicpath/
├── src/
│   ├── routes/
│   │   └── index.tsx  ⬅️ FIX THIS (Lines 12-13)
│   │
│   └── components/
│       ├── common/
│       │   └── StudyPlanPage.tsx  ⬅️ FIX THIS (Line 37)
│       │
│       └── quiz/
│           ├── QuizSession.tsx  ⬅️ FIX THIS (Line 22)
│           ├── QuizResultsPage.tsx  ⬅️ FIX THIS (Line 26)
│           └── VerificationQuiz.tsx  ⬅️ CHECK IF EXISTS (may need to move)
```

---

## 📁 Full Component Tree (Where Everything Lives)

```
passai-magicpath/src/components/

├── 🎨 generated/  ⚠️ REFERENCE ONLY - DO NOT IMPORT FROM HERE
│   ├── AppShell.tsx
│   ├── AuthContext.tsx  (duplicate - delete later)
│   ├── AuthenticatedApp.tsx
│   ├── CreateQuizFlow.tsx
│   ├── DashboardPage.tsx  (duplicate)
│   ├── ForgotPasswordPage.tsx  (duplicate)
│   ├── GardenProgress.tsx  (duplicate)
│   ├── GardenWidget.tsx  (duplicate)
│   ├── LandingPage.tsx  (duplicate)
│   ├── MaterialPreviewModal.tsx
│   ├── MaterialsPage.tsx  ❌ CURRENTLY BEING USED (WRONG!)
│   ├── MoodCheckModal.tsx  (duplicate)
│   ├── ProfilePage.tsx  (duplicate)
│   ├── QuizDetailPage.tsx
│   ├── QuizFeaturesSummary.tsx
│   ├── QuizResultsPage.tsx
│   ├── QuizSession.tsx
│   ├── QuizzesPage.tsx
│   ├── SettingsPage.tsx  (duplicate)
│   ├── SignInPage.tsx  (duplicate)
│   ├── SignUpPage.tsx  (duplicate)
│   ├── StudyDashboard.tsx
│   ├── StudyPlanPage.tsx  ❌ CURRENTLY BEING USED (WRONG!)
│   ├── SubjectsPage.tsx  (duplicate)
│   └── VerificationQuiz.tsx  ⚠️ IMPORTED BY PRODUCTION (needs to move)
│
├── ✅ common/  ← PRODUCTION - SHARED COMPONENTS
│   ├── AuthContext.tsx  ✅ THE REAL AUTH (keep this)
│   ├── MoodCheckModal.tsx  ✅ PRODUCTION VERSION
│   ├── ProfilePage.tsx  ✅ PRODUCTION VERSION
│   ├── SettingsPage.tsx  ✅ PRODUCTION VERSION
│   ├── StudyPlanPage.tsx  ✅ PRODUCTION VERSION (should be used)
│   │   └── imports from: ../generated/VerificationQuiz  ❌ FIX THIS
│   ├── SupabaseConnectionTest.tsx  ✅
│   └── index.ts
│
├── ✅ auth/  ← PRODUCTION - AUTHENTICATION PAGES
│   ├── ForgotPasswordPage.tsx  ✅
│   ├── LandingPage.tsx  ✅
│   ├── SignInPage.tsx  ✅
│   ├── SignUpPage.tsx  ✅
│   └── index.ts
│
├── ✅ dashboard/  ← PRODUCTION - DASHBOARD FEATURES
│   ├── DashboardPage.tsx  ✅ (used in routes)
│   ├── GardenProgress.tsx  ✅ (imported by quiz results)
│   ├── GardenWidget.tsx  ✅
│   ├── StudyDashboard.tsx  ✅
│   └── index.ts
│
├── ✅ subject/  ← PRODUCTION - SUBJECT MANAGEMENT
│   ├── SubjectsPage.tsx  ✅ (used in routes, has Supabase)
│   └── index.ts
│
├── ✅ material/  ← PRODUCTION - MATERIAL MANAGEMENT
│   ├── MaterialsPage.tsx  ✅ (should be used in routes)
│   └── index.ts
│
├── ✅ quiz/  ← PRODUCTION - QUIZ FEATURES
│   ├── CreateQuizFlow.tsx  ✅
│   ├── QuizDetailPage.tsx  ✅
│   ├── QuizFeaturesSummary.tsx  ✅
│   ├── QuizResultsPage.tsx  ✅
│   │   └── imports from: ../generated/GardenProgress  ❌ FIX THIS
│   ├── QuizSession.tsx  ✅
│   │   └── imports from: ../generated/MoodCheckModal  ❌ FIX THIS
│   ├── QuizzesPage.tsx  ✅ (used in routes, has Supabase)
│   ├── VerificationQuiz.tsx  ⚠️ CHECK IF EXISTS (may need to create/move)
│   └── index.ts
│
├── ✅ layout/  ← PRODUCTION - APP LAYOUTS
│   └── AuthenticatedApp.tsx  ✅ (main app shell)
│
└── ProtectedRoute.tsx  ✅
```

---

## 🔍 Import Chain Analysis

### Current (BROKEN)

```
src/routes/index.tsx
├─→ imports: generated/MaterialsPage  ❌
│   └─→ uses: mock data only
│
└─→ imports: generated/StudyPlanPage  ❌
    ├─→ uses: mock data only
    └─→ imports: generated/VerificationQuiz  ❌

src/components/common/StudyPlanPage.tsx  (NOT USED!)
└─→ imports: generated/VerificationQuiz  ❌

src/components/quiz/QuizSession.tsx
└─→ imports: generated/MoodCheckModal  ❌

src/components/quiz/QuizResultsPage.tsx
└─→ imports: generated/GardenProgress  ❌
```

### Target (FIXED)

```
src/routes/index.tsx
├─→ imports: material/MaterialsPage  ✅
│   ├─→ uses: Supabase
│   └─→ persists data
│
└─→ imports: common/StudyPlanPage  ✅
    ├─→ uses: Supabase
    ├─→ persists data
    └─→ imports: quiz/VerificationQuiz  ✅

src/components/quiz/QuizSession.tsx
└─→ imports: common/MoodCheckModal  ✅

src/components/quiz/QuizResultsPage.tsx
└─→ imports: dashboard/GardenProgress  ✅
```

---

## 🎯 Files to Change (Phase 1)

### File 1: `src/routes/index.tsx`

```tsx
// Line 12 - CHANGE THIS:
import { MaterialsPage } from '@/components/generated/MaterialsPage';
// TO THIS:
import { MaterialsPage } from '@/components/material/MaterialsPage';

// Line 13 - CHANGE THIS:
import { StudyPlanPage } from '@/components/generated/StudyPlanPage';
// TO THIS:
import { StudyPlanPage } from '@/components/common/StudyPlanPage';
```

### File 2: `src/components/common/StudyPlanPage.tsx`

```tsx
// Line 37 - CHANGE THIS:
import { VerificationQuiz } from '../generated/VerificationQuiz';
// TO THIS:
import { VerificationQuiz } from '../quiz/VerificationQuiz';
```

### File 3: `src/components/quiz/QuizSession.tsx`

```tsx
// Line 22 - CHANGE THIS:
import { MoodCheckModal } from '../generated/MoodCheckModal';
// TO THIS:
import { MoodCheckModal } from '../common/MoodCheckModal';
```

### File 4: `src/components/quiz/QuizResultsPage.tsx`

```tsx
// Line 26 - CHANGE THIS:
import { GardenProgress } from '../generated/GardenProgress';
// TO THIS:
import { GardenProgress } from '../dashboard/GardenProgress';
```

### File 5: Check/Move VerificationQuiz

```bash
# Check if exists:
ls src/components/quiz/VerificationQuiz.tsx

# If doesn't exist, move it:
# From: src/components/generated/VerificationQuiz.tsx
# To:   src/components/quiz/VerificationQuiz.tsx
```

---

## 🗂️ Duplicate Components to Consolidate (Phase 2)

| Component      | Generated | Production     | Action                       |
| -------------- | --------- | -------------- | ---------------------------- |
| AuthContext    | ✓         | ✓ (common/)    | Delete generated             |
| DashboardPage  | ✓         | ✓ (dashboard/) | Merge UI, delete generated   |
| GardenProgress | ✓         | ✓ (dashboard/) | Delete generated             |
| GardenWidget   | ✓         | ✓ (dashboard/) | Delete generated             |
| MoodCheckModal | ✓         | ✓ (common/)    | Delete generated             |
| ProfilePage    | ✓         | ✓ (common/)    | Delete generated (identical) |
| SettingsPage   | ✓         | ✓ (common/)    | Delete generated (identical) |
| StudyPlanPage  | ✓         | ✓ (common/)    | Merge UI, delete generated   |
| SubjectsPage   | ✓         | ✓ (subject/)   | Delete generated             |
| Auth Pages     | ✓         | ✓ (auth/)      | Delete all from generated    |

---

## 📦 Component Status Legend

```
✅ = Production component (has Supabase, should be used)
❌ = Wrong component being used or wrong import
⚠️ = Needs attention (move, check, or merge)
🎨 = Generated/mock component (reference only)
```

---

## 🔄 After Phase 1, Directory Should Look Like:

```
passai-magicpath/src/components/

├── generated/  (still here, but not imported by anything)
│   └── [all files unchanged - for reference]
│
├── common/
│   └── StudyPlanPage.tsx  ✅ NOW IMPORTS FROM ../quiz/
│
├── material/
│   └── MaterialsPage.tsx  ✅ NOW USED IN ROUTES
│
├── quiz/
│   ├── QuizSession.tsx  ✅ NOW IMPORTS FROM ../common/
│   ├── QuizResultsPage.tsx  ✅ NOW IMPORTS FROM ../dashboard/
│   └── VerificationQuiz.tsx  ✅ MOVED HERE (or already here)
│
└── [other folders unchanged]
```

---

## 📝 Testing Checklist After Changes

```bash
# Test these routes:
✓ /app/materials        (should load material/MaterialsPage)
✓ /app/study-plan       (should load common/StudyPlanPage)

# Test these flows:
✓ Upload a material     (should persist to Supabase)
✓ Create a study task   (should persist to Supabase)
✓ Start a task          (verification quiz should work)
✓ Complete a quiz       (mood modal should appear)
✓ View quiz results     (garden progress should show)

# Verify in browser console:
✓ No import errors
✓ No "cannot find module" errors
✓ Components load correctly
```

---

## 🎉 Success Indicators

After completing Phase 1, you should see:

1. ✅ Routes use production components
2. ✅ No imports from `generated/` folder in production code
3. ✅ Data persists to Supabase
4. ✅ No console errors
5. ✅ All features still work

---

## 📚 Related Documentation

- `COMPONENT_AUDIT.md` - Full analysis
- `QUICK_FIX_CHECKLIST.md` - Detailed task list
- `ARCHITECTURE_VISUAL.md` - Visual diagrams
- `SUMMARY.md` - Executive summary
- `FILE_TREE.md` - This file
