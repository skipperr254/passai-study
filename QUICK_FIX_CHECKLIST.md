# Quick Fix Checklist - Component Architecture

## ⚡ PHASE 1: Critical Import Fixes (30 minutes)

These are the **immediate** fixes needed to stop using mock components in production routes.

### Task 1: Fix Routes ✅

**File:** `src/routes/index.tsx`

```tsx
// CHANGE THESE TWO LINES:

// Line 12: BEFORE
import { MaterialsPage } from '@/components/generated/MaterialsPage';

// Line 12: AFTER
import { MaterialsPage } from '@/components/material/MaterialsPage';

// Line 13: BEFORE
import { StudyPlanPage } from '@/components/generated/StudyPlanPage';

// Line 13: AFTER
import { StudyPlanPage } from '@/components/common/StudyPlanPage';
```

**Test:** Navigate to `/app/materials` and `/app/study-plan` - should still work

---

### Task 2: Fix StudyPlanPage Import ✅

**File:** `src/components/common/StudyPlanPage.tsx`

```tsx
// Line 37: BEFORE
import { VerificationQuiz } from '../generated/VerificationQuiz';

// Line 37: AFTER
import { VerificationQuiz } from '../quiz/VerificationQuiz';
```

**Note:** First check if `VerificationQuiz` exists in the quiz folder. If not, move it there first (see Task 5).

**Test:** Start a study task that requires verification

---

### Task 3: Fix QuizSession Import ✅

**File:** `src/components/quiz/QuizSession.tsx`

```tsx
// Line 22: BEFORE
import { MoodCheckModal } from '../generated/MoodCheckModal';

// Line 22: AFTER
import { MoodCheckModal } from '../common/MoodCheckModal';
```

**Test:** Complete a quiz and check if mood modal appears

---

### Task 4: Fix QuizResultsPage Import ✅

**File:** `src/components/quiz/QuizResultsPage.tsx`

```tsx
// Line 26: BEFORE
import { GardenProgress } from '../generated/GardenProgress';

// Line 26: AFTER
import { GardenProgress } from '../dashboard/GardenProgress';
```

**Test:** Complete a quiz and view results page

---

### Task 5: Move VerificationQuiz (if needed) ⚠️

**Check first:** Does `src/components/quiz/VerificationQuiz.tsx` already exist?

- **If YES:** Compare with generated version, merge if needed
- **If NO:** Move from `src/components/generated/VerificationQuiz.tsx` to `src/components/quiz/VerificationQuiz.tsx`

```bash
# If moving:
mv src/components/generated/VerificationQuiz.tsx src/components/quiz/VerificationQuiz.tsx
```

---

## 📊 Testing After Phase 1

Run through these user flows to ensure nothing broke:

1. ✅ Navigate to Materials page (`/app/materials`)
2. ✅ Navigate to Study Plan page (`/app/study-plan`)
3. ✅ Start a study task with verification
4. ✅ Take a quiz and complete it
5. ✅ View quiz results
6. ✅ Check if mood modal appears

**Expected Result:** Everything still works, but now using production components

---

## 🔄 PHASE 2: Component Consolidation (1-2 days)

After Phase 1 is complete and tested, tackle these duplicates:

### Priority 1: Delete Pure Duplicates (1 hour)

These are identical in both folders - just delete from `generated`:

- [ ] `ProfilePage.tsx`
- [ ] `SettingsPage.tsx`
- [ ] `MoodCheckModal.tsx`
- [ ] `AuthContext.tsx` (keep only in `/common/`)
- [ ] Auth pages: `SignInPage`, `SignUpPage`, `ForgotPasswordPage`, `LandingPage`

### Priority 2: Merge & Enhance (2-4 hours each)

These need UI/logic merging:

- [ ] `StudyPlanPage` - Merge UI from generated → common
- [ ] `DashboardPage` - Merge UI from generated → dashboard
- [ ] `SubjectsPage` - Keep production version, delete generated
- [ ] `GardenProgress` - Keep dashboard version, delete generated
- [ ] `GardenWidget` - Keep dashboard version, delete generated

### Priority 3: Move to Archive (Optional)

Don't delete `generated` folder yet - rename it:

```bash
mv src/components/generated src/components/_archived_generated_reference
```

This keeps the UI/UX reference available while cleaning up the active codebase.

---

## 🚀 PHASE 3: Supabase Integration (2-3 days)

Once components are consolidated, add real data to these mock-based components:

### Components Still Using Mock Data:

1. **StudyPlanPage** (`/common/`)

   - Status: Partially integrated (has hooks but falls back to mocks)
   - Needs: Full Supabase study plan API integration
   - Time: 4-6 hours

2. **MaterialsPage** (`/material/`)

   - Status: Pure mock data
   - Needs: File upload, storage, and retrieval from Supabase
   - Time: 6-8 hours

3. **DashboardPage** (`/dashboard/`)

   - Status: Pure mock data
   - Needs: Real stats from quiz attempts, study sessions
   - Time: 4-6 hours

4. **ProfilePage** (`/common/`)
   - Status: Pure mock data
   - Needs: User profile CRUD operations
   - Time: 3-4 hours

---

## 📋 Summary

| Phase   | Tasks                    | Time     | Priority      |
| ------- | ------------------------ | -------- | ------------- |
| Phase 1 | 5 import fixes           | 30 min   | 🔴 **URGENT** |
| Phase 2 | Delete/merge duplicates  | 1-2 days | 🟡 **HIGH**   |
| Phase 3 | Add Supabase integration | 2-3 days | 🟢 **MEDIUM** |

---

## 🎯 Start Here

**Your very next steps:**

1. Read the full `COMPONENT_AUDIT.md` document
2. Start with Task 1 (fix routes)
3. Do Task 5 if needed (move VerificationQuiz)
4. Complete Tasks 2-4
5. Test all user flows
6. Commit changes
7. Move to Phase 2

---

## ⚠️ Important Notes

- **DO NOT** delete the `generated` folder yet - it has valuable reference code
- Test after each change to catch issues early
- The production components have the right structure but may lack polish
- The generated components have beautiful UI but no backend connection
- This is a merge operation, not a rewrite

---

## 🆘 If Something Breaks

If you break something during Phase 1:

1. Check browser console for import errors
2. Verify file paths are correct (relative vs absolute imports)
3. Make sure the component you're importing from actually exists
4. Compare with the working version in `generated` folder
5. Revert the specific change and try again

**Git is your friend - commit after each task!**

---

## 📞 Questions?

Common issues:

**Q: Component not found after changing import?**
A: Check if the file exists in the target folder. Some components may need to be moved first.

**Q: Should I delete the generated folder?**
A: Not yet! Rename it to `_archived_generated_reference` so you can still reference the UI/UX.

**Q: Which component's UI is better?**
A: Usually the generated ones have better UI/UX. Merge that styling into production components.

**Q: Can I do this incrementally?**
A: Yes! Start with Phase 1, test, commit. Then do Phase 2, test, commit. Then Phase 3.
