# Component Architecture - Visual Overview

## 🏗️ Current State (INCORRECT)

```
┌─────────────────────────────────────────────────────────────┐
│                     APPLICATION ROUTES                       │
│                    (src/routes/index.tsx)                    │
└─────────────────────────────────────────────────────────────┘
                              │
                ┌─────────────┴─────────────┐
                │                           │
                ▼                           ▼
    ┌──────────────────┐        ┌──────────────────┐
    │  MaterialsPage   │  ❌    │  StudyPlanPage   │  ❌
    │  (generated)     │        │  (generated)     │
    │  [MOCK DATA]     │        │  [MOCK DATA]     │
    └──────────────────┘        └──────────────────┘
                │                         │
                └─────────┬───────────────┘
                          ▼
                ┌───────────────────┐
                │  VerificationQuiz │
                │   (generated)     │
                │   [MOCK DATA]     │
                └───────────────────┘

❌ PROBLEMS:
   • Routes pointing to mock components
   • Generated components importing from each other
   • No Supabase connection
   • Production components sitting unused
```

---

## ✅ Target State (CORRECT)

```
┌─────────────────────────────────────────────────────────────┐
│                     APPLICATION ROUTES                       │
│                    (src/routes/index.tsx)                    │
└─────────────────────────────────────────────────────────────┘
                              │
                ┌─────────────┴─────────────┐
                │                           │
                ▼                           ▼
    ┌──────────────────┐        ┌──────────────────┐
    │  MaterialsPage   │  ✅    │  StudyPlanPage   │  ✅
    │   (material/)    │        │    (common/)     │
    │   + Supabase     │        │   + Supabase     │
    └──────────────────┘        └──────────────────┘
                │                         │
                └─────────┬───────────────┘
                          ▼
                ┌───────────────────┐
                │  VerificationQuiz │
                │     (quiz/)       │
                │   + Supabase      │
                └───────────────────┘
                          │
                          ▼
                ┌───────────────────┐
                │   Supabase DB     │
                │   • Materials     │
                │   • Study Tasks   │
                │   • Quiz Data     │
                └───────────────────┘

✅ BENEFITS:
   • Routes point to production components
   • Clean separation of concerns
   • Real data from Supabase
   • Generated folder archived for reference
```

---

## 📁 Folder Structure Comparison

### Current (Mixed Up)

```
src/components/
├── generated/                    ← ❌ Being used in routes
│   ├── MaterialsPage.tsx         ← ❌ IN USE (wrong!)
│   ├── StudyPlanPage.tsx         ← ❌ IN USE (wrong!)
│   ├── VerificationQuiz.tsx      ← ❌ Referenced by common/
│   ├── MoodCheckModal.tsx        ← ❌ Referenced by quiz/
│   ├── GardenProgress.tsx        ← ❌ Referenced by quiz/
│   └── [20+ other components]    ← All mock data
│
├── common/                       ← ✅ Should be primary
│   ├── StudyPlanPage.tsx         ← ❌ Not being used!
│   ├── ProfilePage.tsx
│   ├── SettingsPage.tsx
│   ├── MoodCheckModal.tsx        ← ❌ Not being used!
│   └── AuthContext.tsx           ← ✅ This one is used
│
├── material/                     ← ✅ Has production version
│   └── MaterialsPage.tsx         ← ❌ Not being used!
│
├── dashboard/
├── subject/
├── quiz/
└── auth/
```

### Target (Clean)

```
src/components/
├── _archived_generated/          ← ✅ Renamed for reference only
│   └── [all generated files]     ← Keep for UI/UX reference
│
├── common/                       ← ✅ Shared production components
│   ├── StudyPlanPage.tsx         ← ✅ USED in routes
│   ├── ProfilePage.tsx           ← ✅ Has Supabase integration
│   ├── SettingsPage.tsx          ← ✅ Has Supabase integration
│   ├── MoodCheckModal.tsx        ← ✅ Used by quiz components
│   └── AuthContext.tsx           ← ✅ Authentication provider
│
├── material/                     ← ✅ Material management
│   └── MaterialsPage.tsx         ← ✅ USED in routes + Supabase
│
├── dashboard/                    ← ✅ Dashboard features
│   ├── DashboardPage.tsx         ← ✅ USED in routes + Supabase
│   ├── GardenProgress.tsx        ← ✅ Used by quiz results
│   └── GardenWidget.tsx
│
├── quiz/                         ← ✅ Quiz features
│   ├── QuizzesPage.tsx           ← ✅ Has Supabase
│   ├── QuizSession.tsx           ← ✅ Has Supabase
│   ├── QuizResultsPage.tsx       ← ✅ Has Supabase
│   └── VerificationQuiz.tsx      ← ✅ Moved from generated
│
├── subject/                      ← ✅ Subject management
│   └── SubjectsPage.tsx          ← ✅ Has Supabase
│
├── auth/                         ← ✅ Authentication pages
│   ├── SignInPage.tsx
│   ├── SignUpPage.tsx
│   └── LandingPage.tsx
│
└── layout/                       ← ✅ App shells
    └── AuthenticatedApp.tsx
```

---

## 🔄 Import Flow Comparison

### Current (WRONG)

```
Routes (index.tsx)
    │
    ├─→ generated/MaterialsPage      ❌ Mock data
    │       └─→ (no database calls)
    │
    └─→ generated/StudyPlanPage      ❌ Mock data
            ├─→ generated/VerificationQuiz
            └─→ (no database calls)

common/StudyPlanPage                 ❌ Sitting unused!
    ├─→ generated/VerificationQuiz   ❌ Cross-folder import
    ├─→ services/study-task.service  ✅ Has Supabase!
    └─→ services/topic.service       ✅ Has Supabase!

quiz/QuizSession                     ✅ Being used
    └─→ generated/MoodCheckModal     ❌ Cross-folder import

quiz/QuizResultsPage                 ✅ Being used
    └─→ generated/GardenProgress     ❌ Cross-folder import
```

### Target (CORRECT)

```
Routes (index.tsx)
    │
    ├─→ material/MaterialsPage       ✅ Production
    │       ├─→ hooks/useMaterials   ✅ Supabase hooks
    │       └─→ services/materials   ✅ Supabase service
    │
    └─→ common/StudyPlanPage         ✅ Production
            ├─→ quiz/VerificationQuiz    ✅ Same domain
            ├─→ services/study-task      ✅ Supabase
            └─→ services/topic           ✅ Supabase

quiz/QuizSession                     ✅ Production
    ├─→ common/MoodCheckModal        ✅ Shared component
    └─→ services/quiz                ✅ Supabase

quiz/QuizResultsPage                 ✅ Production
    ├─→ dashboard/GardenProgress     ✅ Dashboard feature
    └─→ services/quiz-attempt        ✅ Supabase
```

---

## 🎯 Component Type Legend

```
📦 PRODUCTION COMPONENTS (Use These!)
   ├── Connect to Supabase
   ├── Use real authentication
   ├── Handle actual user data
   └── May need UI polish

🎨 GENERATED COMPONENTS (Reference Only!)
   ├── Beautiful UI/UX designs
   ├── Mock data only
   ├── No backend integration
   └── Good for copying styles

🔄 HYBRID COMPONENTS (Need Work)
   ├── Has backend connection
   ├── Falls back to mocks
   ├── Needs full integration
   └── Example: common/StudyPlanPage
```

---

## 📊 Data Flow Diagram

### Current (Broken)

```
User Action
    ↓
React Router
    ↓
generated/MaterialsPage  ❌
    ↓
Mock Data Array ❌
    ↓
Display (No persistence!)
```

### Target (Working)

```
User Action
    ↓
React Router
    ↓
material/MaterialsPage  ✅
    ↓
useMaterials Hook  ✅
    ↓
materials.service  ✅
    ↓
Supabase Client  ✅
    ↓
PostgreSQL Database  ✅
    ↓
Real Data Display  ✅
```

---

## 🔍 How to Identify Component Type

### Generated Component (Don't Use!)

```tsx
// ❌ Signs of a generated component:

import React, { useState } from 'react';
import { Book, Plus } from 'lucide-react';

// No imports from services/hooks
// No useAuth
// No Supabase

const mockData = [/* ... */];  // ← RED FLAG!

export const SomePage = () => {
  const [data, setData] = useState(mockData);  // ← Using mock!

  // Pure UI logic, no API calls

  return (/* Beautiful UI */);
};
```

### Production Component (Use This!)

```tsx
// ✅ Signs of a production component:

import React, { useState, useEffect } from 'react';
import { Book, Plus } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';           // ← Authentication!
import { getMaterials } from '@/services/materials'; // ← Real service!

export const SomePage = () => {
  const { user } = useAuth();  // ← Real auth!
  const [data, setData] = useState([]);

  useEffect(() => {
    // Fetch from Supabase
    const fetchData = async () => {
      const result = await getMaterials(user.id);  // ← Real API call!
      setData(result);
    };
    fetchData();
  }, [user]);

  return (/* UI */);
};
```

---

## 🚀 Migration Path

```
Step 1: Fix Routes
   generated/ ──X──→ routes/  ❌
   material/  ──✓──→ routes/  ✅

Step 2: Fix Imports
   common/ ──X──→ generated/  ❌
   common/ ──✓──→ quiz/       ✅

Step 3: Consolidate
   generated/ ────→ _archived/
   Production components enhanced

Step 4: Integrate
   Mock data ──→ Supabase API
   All components connected
```

---

## 📈 Before & After Metrics

| Metric                     | Before | After |
| -------------------------- | ------ | ----- |
| Mock components in routes  | 2      | 0     |
| Cross-folder imports       | 3      | 0     |
| Components with Supabase   | 60%    | 100%  |
| Duplicate components       | 15+    | 0     |
| Confusing folder structure | Yes    | No    |
| Production ready           | No     | Yes   |

---

## 💡 Key Takeaways

1. **`generated/` folder** = Reference UI/UX designs only
2. **Production folders** = Real components that connect to Supabase
3. **Routes should NEVER import from `generated/`**
4. **Production components should NEVER import from `generated/`**
5. **After fixing, rename `generated/` to `_archived_generated/`**

---

## ✅ Success Criteria

You'll know it's fixed when:

- [ ] No imports from `generated/` folder
- [ ] Routes use production components
- [ ] All components connect to Supabase
- [ ] No duplicate components
- [ ] Tests pass
- [ ] User data persists correctly
- [ ] `generated/` folder renamed to `_archived_generated/`
