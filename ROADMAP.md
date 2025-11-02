# PassAI - Production Readiness Roadmap

**Project**: PassAI - AI-Powered Study Platform  
**Start Date**: November 2, 2025  
**Target MVP**: 6-8 weeks  
**Status**: 🟡 Planning Phase

---

## 📊 Project Overview

### Current State
- ✅ Complete UI/UX design with Tailwind CSS
- ✅ All features implemented with mock data
- ✅ TypeScript + React + Vite setup
- ✅ Mobile-responsive design
- ❌ No backend integration
- ❌ No routing (manual view switching)
- ❌ No real authentication
- ❌ No data persistence beyond localStorage

### Target State
- ✅ Production-ready web application
- ✅ Supabase backend (database + auth + storage)
- ✅ React Router for proper navigation
- ✅ Real-time data synchronization
- ✅ Secure user authentication
- ✅ File upload and processing
- ✅ Deployed and monitored

---

## 🗂️ Phase Tracking

### Legend
- ⬜ Not Started
- 🟡 In Progress
- ✅ Completed
- ⏸️ Blocked/On Hold

---

## PHASE 1: Foundation & Project Structure
**Timeline**: Week 1 (5-7 days)  
**Status**: ⬜ Not Started

### 1.1 Add React Router for Navigation ⭐⭐⭐
**Priority**: CRITICAL  
**Estimated Time**: 4-6 hours

#### Tasks
- [ ] Install `react-router-dom`
- [ ] Create route configuration file
- [ ] Define all application routes:
  - [ ] `/` - Landing page
  - [ ] `/auth/signin` - Sign in
  - [ ] `/auth/signup` - Sign up
  - [ ] `/auth/forgot-password` - Password reset
  - [ ] `/app/dashboard` - Main dashboard
  - [ ] `/app/subjects` - Subjects list
  - [ ] `/app/subjects/:id` - Subject detail
  - [ ] `/app/quizzes` - Quizzes list
  - [ ] `/app/quizzes/:id` - Quiz detail
  - [ ] `/app/quiz/:id/session` - Take quiz
  - [ ] `/app/quiz/:id/results` - Quiz results
  - [ ] `/app/materials` - Materials upload
  - [ ] `/app/study-plan` - Study plan
  - [ ] `/app/profile` - User profile
  - [ ] `/app/settings` - Settings
- [ ] Create `ProtectedRoute` wrapper component
- [ ] Update `App.tsx` with router
- [ ] Replace manual view state in `AuthenticatedApp.tsx` with routing
- [ ] Update `AppShell` navigation to use router links
- [ ] Test all navigation flows

#### Success Criteria
- ✅ All pages accessible via URL
- ✅ Browser back/forward buttons work correctly
- ✅ Protected routes redirect to login when not authenticated
- ✅ Navigation between pages is smooth

---

### 1.2 Code Organization & Cleanup ⭐⭐⭐
**Priority**: HIGH  
**Estimated Time**: 6-8 hours

#### Tasks
- [ ] Create new folder structure:
  ```
  src/
    ├── components/
    │   ├── auth/          # SignIn, SignUp, ForgotPassword
    │   ├── dashboard/     # Dashboard components
    │   ├── quiz/          # Quiz-related components
    │   ├── subject/       # Subject components
    │   ├── material/      # Material upload components
    │   ├── common/        # Shared components
    │   └── layout/        # AppShell, navigation
    ├── pages/             # Page-level route components
    ├── hooks/             # Custom React hooks
    ├── services/          # API/Supabase service layer
    ├── store/             # State management
    ├── types/             # TypeScript interfaces
    ├── utils/             # Helper functions
    ├── constants/         # App constants
    └── data/
        └── mocks/         # Mock data (temporary)
  ```
- [ ] Move components from `generated/` to appropriate folders
- [ ] Extract all mock data to `data/mocks/`
- [ ] Create TypeScript interfaces in `types/`:
  - [ ] `types/user.ts`
  - [ ] `types/subject.ts`
  - [ ] `types/quiz.ts`
  - [ ] `types/material.ts`
  - [ ] `types/question.ts`
  - [ ] `types/progress.ts`
- [ ] Extract reusable components (buttons, modals, cards)
- [ ] Create barrel exports (index.ts files)
- [ ] Update all imports
- [ ] Remove unused code

#### Success Criteria
- ✅ Clean, organized folder structure
- ✅ All TypeScript types defined
- ✅ No import errors
- ✅ Mock data centralized and easy to replace

---

## PHASE 2: Supabase Setup & Database Design
**Timeline**: Week 1-2 (3-5 days)  
**Status**: ⬜ Not Started

### 2.1 Supabase Project Setup ⭐⭐⭐
**Priority**: CRITICAL  
**Estimated Time**: 1-2 hours

#### Tasks
- [ ] Create Supabase account/project
- [ ] Note project URL and anon key
- [ ] Install dependencies:
  ```bash
  npm install @supabase/supabase-js
  ```
- [ ] Create `.env.local` file:
  ```
  VITE_SUPABASE_URL=your-project-url
  VITE_SUPABASE_ANON_KEY=your-anon-key
  ```
- [ ] Add `.env.local` to `.gitignore`
- [ ] Create `.env.example` template
- [ ] Create `src/lib/supabase.ts` client singleton
- [ ] Test connection

#### Success Criteria
- ✅ Supabase project created
- ✅ Environment variables configured
- ✅ Client can connect to Supabase

---

### 2.2 Database Schema Design ⭐⭐⭐
**Priority**: CRITICAL  
**Estimated Time**: 4-6 hours

#### Tasks
- [ ] Create SQL migration file: `00001_initial_schema.sql`
- [ ] Design and create tables:
  - [ ] `users` (extends auth.users)
  - [ ] `subjects`
  - [ ] `materials`
  - [ ] `quizzes`
  - [ ] `quiz_materials` (junction)
  - [ ] `questions`
  - [ ] `quiz_attempts`
  - [ ] `question_responses`
  - [ ] `study_sessions`
  - [ ] `subject_progress`
- [ ] Add indexes for performance
- [ ] Create database functions/triggers:
  - [ ] Auto-update `updated_at` timestamps
  - [ ] Calculate subject progress on quiz completion
  - [ ] Update average scores
- [ ] Add database constraints
- [ ] Test schema with sample data

#### Database Schema Details

**Table: users**
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Table: subjects**
```sql
CREATE TABLE subjects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  color TEXT NOT NULL,
  description TEXT,
  test_date DATE,
  teacher_emphasis TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Table: materials**
```sql
CREATE TABLE materials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  subject_id UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('pdf', 'video', 'image', 'document', 'notes')),
  file_path TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  page_count INTEGER,
  duration INTEGER, -- seconds for videos
  extracted_text TEXT,
  status TEXT NOT NULL DEFAULT 'processing' CHECK (status IN ('processing', 'ready', 'error')),
  tags TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Table: quizzes**
```sql
CREATE TABLE quizzes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  subject_id UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  question_count INTEGER NOT NULL,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard', 'adaptive')),
  time_limit INTEGER NOT NULL, -- minutes
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'active', 'completed')),
  scheduled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  settings JSONB DEFAULT '{}'::jsonb
);
```

**Table: quiz_materials**
```sql
CREATE TABLE quiz_materials (
  quiz_id UUID NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
  material_id UUID NOT NULL REFERENCES materials(id) ON DELETE CASCADE,
  PRIMARY KEY (quiz_id, material_id)
);
```

**Table: questions**
```sql
CREATE TABLE questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id UUID NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('multiple-choice', 'true-false', 'short-answer', 'matching')),
  options JSONB,
  correct_answer TEXT NOT NULL,
  explanation TEXT NOT NULL,
  topic TEXT NOT NULL,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
  source_material_id UUID REFERENCES materials(id) ON DELETE SET NULL,
  source_page INTEGER,
  source_excerpt TEXT,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Table: quiz_attempts**
```sql
CREATE TABLE quiz_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  quiz_id UUID NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  score DECIMAL(5,2),
  time_spent INTEGER, -- seconds
  status TEXT NOT NULL DEFAULT 'in-progress' CHECK (status IN ('in-progress', 'completed', 'abandoned'))
);
```

**Table: question_responses**
```sql
CREATE TABLE question_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  attempt_id UUID NOT NULL REFERENCES quiz_attempts(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  user_answer TEXT,
  is_correct BOOLEAN NOT NULL,
  time_spent INTEGER, -- seconds
  feedback TEXT CHECK (feedback IN ('thumbs-up', 'thumbs-down')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Table: study_sessions**
```sql
CREATE TABLE study_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  subject_id UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  ended_at TIMESTAMPTZ,
  duration INTEGER, -- seconds
  mood_before TEXT CHECK (mood_before IN ('stressed', 'neutral', 'confident')),
  mood_after TEXT CHECK (mood_after IN ('stressed', 'neutral', 'confident'))
);
```

**Table: subject_progress**
```sql
CREATE TABLE subject_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  subject_id UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  quizzes_taken INTEGER DEFAULT 0,
  average_score DECIMAL(5,2) DEFAULT 0,
  passing_chance DECIMAL(5,2) DEFAULT 0,
  last_studied_at TIMESTAMPTZ,
  weak_topics TEXT[],
  strong_topics TEXT[],
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, subject_id)
);
```

#### Success Criteria
- ✅ All tables created successfully
- ✅ Foreign keys and constraints working
- ✅ Can insert/query test data
- ✅ Indexes improve query performance

---

### 2.3 Supabase Storage Setup ⭐⭐⭐
**Priority**: CRITICAL  
**Estimated Time**: 1-2 hours

#### Tasks
- [ ] Create `materials` storage bucket
- [ ] Configure bucket settings:
  - [ ] Max file size: 50MB
  - [ ] Allowed MIME types: PDF, images, videos, documents
  - [ ] Public/private access
- [ ] Setup folder structure in bucket:
  - `{user_id}/{subject_id}/{filename}`
- [ ] Test file upload/download
- [ ] Setup file deletion policies

#### Success Criteria
- ✅ Storage bucket created and configured
- ✅ Can upload files successfully
- ✅ Can retrieve files via URL
- ✅ Files are organized by user/subject

---

### 2.4 Row Level Security (RLS) Policies ⭐⭐⭐
**Priority**: CRITICAL (Security)  
**Estimated Time**: 3-4 hours

#### Tasks
- [ ] Enable RLS on all tables
- [ ] Create RLS policies for `users`:
  - [ ] Users can read their own profile
  - [ ] Users can update their own profile
- [ ] Create RLS policies for `subjects`:
  - [ ] Users can CRUD their own subjects
- [ ] Create RLS policies for `materials`:
  - [ ] Users can CRUD their own materials
- [ ] Create RLS policies for `quizzes`:
  - [ ] Users can CRUD their own quizzes
- [ ] Create RLS policies for `questions`:
  - [ ] Users can read questions from their own quizzes
- [ ] Create RLS policies for `quiz_attempts`:
  - [ ] Users can CRUD their own attempts
- [ ] Create RLS policies for `question_responses`:
  - [ ] Users can CRUD their own responses
- [ ] Create RLS policies for `study_sessions`:
  - [ ] Users can CRUD their own sessions
- [ ] Create RLS policies for `subject_progress`:
  - [ ] Users can read/update their own progress
- [ ] Test RLS with different user accounts
- [ ] Document all policies

#### Success Criteria
- ✅ All tables have RLS enabled
- ✅ Users can only access their own data
- ✅ No unauthorized data access possible
- ✅ Admin access configured (if needed)

---

## PHASE 3: Authentication Integration
**Timeline**: Week 2 (3-4 days)  
**Status**: ⬜ Not Started

### 3.1 Replace Mock Auth with Supabase Auth ⭐⭐⭐
**Priority**: CRITICAL  
**Estimated Time**: 6-8 hours

#### Tasks
- [ ] Create `src/services/auth.service.ts`
- [ ] Implement authentication methods:
  - [ ] `signUp(name, email, password)` - Email/password signup
  - [ ] `signIn(email, password)` - Email/password signin
  - [ ] `signOut()` - Sign out user
  - [ ] `resetPassword(email)` - Send password reset email
  - [ ] `updatePassword(newPassword)` - Update user password
  - [ ] `getCurrentUser()` - Get current user
  - [ ] `updateProfile(data)` - Update user profile
- [ ] Update `AuthContext.tsx`:
  - [ ] Replace mock functions with real Supabase calls
  - [ ] Handle `onAuthStateChange` events
  - [ ] Persist auth state
  - [ ] Handle loading states
- [ ] Create user profile on signup:
  - [ ] Trigger or function to create `users` record
- [ ] Update authentication pages:
  - [ ] `SignInPage.tsx` - Connect to real auth
  - [ ] `SignUpPage.tsx` - Connect to real auth
  - [ ] `ForgotPasswordPage.tsx` - Connect to real auth
- [ ] Handle authentication errors properly
- [ ] Add email verification flow
- [ ] Test all authentication flows

#### Success Criteria
- ✅ Users can sign up with email/password
- ✅ Users can sign in with email/password
- ✅ Users can sign out
- ✅ Users can reset password
- ✅ User profile is created on signup
- ✅ Auth state persists across page refreshes
- ✅ Error messages are user-friendly

---

### 3.2 Protected Routes & Session Management ⭐⭐⭐
**Priority**: CRITICAL  
**Estimated Time**: 2-3 hours

#### Tasks
- [ ] Create `ProtectedRoute` component
- [ ] Implement auth state checking
- [ ] Handle redirects:
  - [ ] Redirect to `/auth/signin` if not authenticated
  - [ ] Redirect to `/app/dashboard` if already authenticated (on auth pages)
- [ ] Add loading spinner during auth check
- [ ] Handle session expiration
- [ ] Implement auto-refresh of tokens
- [ ] Test edge cases (expired session, invalid token, etc.)

#### Success Criteria
- ✅ Protected routes only accessible when authenticated
- ✅ Unauthenticated users redirected to login
- ✅ Authenticated users can't access auth pages
- ✅ Session persists correctly
- ✅ Token refresh happens automatically

---

## PHASE 4: Core Features - Backend Integration
**Timeline**: Week 2-4 (10-12 days)  
**Status**: ⬜ Not Started

### 4.1 Subjects Management ⭐⭐⭐
**Priority**: HIGH  
**Estimated Time**: 6-8 hours

#### Tasks
- [ ] Create `src/services/subject.service.ts`
- [ ] Implement CRUD operations:
  - [ ] `createSubject(data)` - Create new subject
  - [ ] `getSubjects()` - Get all user subjects
  - [ ] `getSubjectById(id)` - Get single subject
  - [ ] `updateSubject(id, data)` - Update subject
  - [ ] `deleteSubject(id)` - Delete subject
- [ ] Create custom hooks:
  - [ ] `useSubjects()` - Fetch all subjects
  - [ ] `useSubject(id)` - Fetch single subject
  - [ ] `useCreateSubject()` - Create subject mutation
  - [ ] `useUpdateSubject()` - Update subject mutation
  - [ ] `useDeleteSubject()` - Delete subject mutation
- [ ] Update `SubjectsPage.tsx`:
  - [ ] Replace mock data with real API calls
  - [ ] Handle loading states
  - [ ] Handle errors
  - [ ] Add optimistic updates
- [ ] Update `DashboardPage.tsx`:
  - [ ] Fetch real subject data
  - [ ] Calculate real progress metrics
- [ ] Test all subject operations

#### Success Criteria
- ✅ Can create subjects
- ✅ Can view all subjects
- ✅ Can update subjects
- ✅ Can delete subjects
- ✅ Changes persist in database
- ✅ Real-time updates work

---

### 4.2 Materials Upload & Processing ⭐⭐⭐
**Priority**: HIGH  
**Estimated Time**: 10-12 hours

#### Tasks
- [ ] Create `src/services/material.service.ts`
- [ ] Implement file upload flow:
  - [ ] `uploadFile(file, subjectId)` - Upload to Supabase Storage
  - [ ] `createMaterial(data)` - Create material record
  - [ ] `getMaterials(subjectId?)` - Get materials
  - [ ] `deleteMaterial(id)` - Delete material and file
- [ ] Implement text extraction:
  - [ ] Install PDF.js: `npm install pdfjs-dist`
  - [ ] Create `extractTextFromPDF(file)` utility
  - [ ] Create `processImage(file)` utility (OCR - future)
  - [ ] Store extracted text in database
- [ ] Update `MaterialsPage.tsx`:
  - [ ] Connect to real file upload
  - [ ] Show real upload progress
  - [ ] Update material status after processing
  - [ ] Handle upload errors
  - [ ] Implement file deletion
- [ ] Add file preview functionality
- [ ] Implement drag-and-drop
- [ ] Test with various file types and sizes

#### Success Criteria
- ✅ Files upload to Supabase Storage
- ✅ Material records created in database
- ✅ Text extracted from PDFs
- ✅ Upload progress tracked
- ✅ Files organized by user/subject
- ✅ Can delete files (storage + database)
- ✅ Handle upload errors gracefully

---

### 4.3 Quiz Creation Flow ⭐⭐⭐
**Priority**: HIGH  
**Estimated Time**: 8-10 hours

#### Tasks
- [ ] Create `src/services/quiz.service.ts`
- [ ] Implement quiz operations:
  - [ ] `createQuiz(data)` - Create quiz
  - [ ] `getQuizzes(subjectId?)` - Get quizzes
  - [ ] `getQuizById(id)` - Get quiz with questions
  - [ ] `updateQuiz(id, data)` - Update quiz
  - [ ] `deleteQuiz(id)` - Delete quiz
  - [ ] `generateQuestions(quizId, materials, settings)` - Generate questions (mock AI for now)
- [ ] Update `CreateQuizFlow.tsx`:
  - [ ] Save quiz to database (step by step)
  - [ ] Save selected materials to `quiz_materials`
  - [ ] Save quiz settings as JSONB
  - [ ] Generate and save questions
  - [ ] Handle scheduling
- [ ] Create mock question generation:
  - [ ] Extract text from selected materials
  - [ ] Generate simple questions (template-based for now)
  - [ ] Save questions with source attribution
- [ ] Test entire quiz creation flow

#### Success Criteria
- ✅ Can create quizzes
- ✅ Can select materials for quiz
- ✅ Quiz settings saved correctly
- ✅ Questions generated and saved
- ✅ Quiz scheduling works
- ✅ Can view created quizzes

---

### 4.4 Quiz Taking & Results ⭐⭐⭐
**Priority**: HIGH  
**Estimated Time**: 10-12 hours

#### Tasks
- [ ] Create `src/services/quiz-attempt.service.ts`
- [ ] Implement quiz session:
  - [ ] `startQuizAttempt(quizId)` - Create attempt record
  - [ ] `saveQuestionResponse(attemptId, questionId, answer)` - Save response
  - [ ] `completeQuizAttempt(attemptId)` - Mark as completed
  - [ ] `getQuizAttempt(attemptId)` - Get attempt details
  - [ ] `getQuizResults(attemptId)` - Get results
- [ ] Update `QuizSession.tsx`:
  - [ ] Create attempt on start
  - [ ] Save each response to database (real-time)
  - [ ] Track time per question
  - [ ] Calculate score
  - [ ] Save mood check-ins
- [ ] Update `QuizResultsPage.tsx`:
  - [ ] Fetch real results from database
  - [ ] Show detailed analytics
  - [ ] Update subject progress
- [ ] Implement progress calculation:
  - [ ] Update `subject_progress` after quiz completion
  - [ ] Calculate average score
  - [ ] Calculate passing chance
  - [ ] Identify weak/strong topics
- [ ] Test quiz session flow

#### Success Criteria
- ✅ Quiz attempts tracked in database
- ✅ All responses saved immediately
- ✅ Score calculated correctly
- ✅ Results persist and can be reviewed
- ✅ Subject progress updated after completion
- ✅ Can retake quizzes

---

### 4.5 Dashboard & Analytics ⭐⭐
**Priority**: MEDIUM  
**Estimated Time**: 6-8 hours

#### Tasks
- [ ] Create `src/services/analytics.service.ts`
- [ ] Implement analytics queries:
  - [ ] `getSubjectProgress(subjectId)` - Get subject metrics
  - [ ] `getRecentQuizzes()` - Get recent attempts
  - [ ] `getPerformanceTrends(subjectId)` - Get score trends
  - [ ] `getUpcomingQuizzes()` - Get scheduled quizzes
- [ ] Update `DashboardPage.tsx`:
  - [ ] Fetch real analytics data
  - [ ] Show real performance charts
  - [ ] Display actual upcoming quizzes
  - [ ] Calculate real passing chances
- [ ] Implement chart data aggregation
- [ ] Add loading states for analytics
- [ ] Test with various data scenarios

#### Success Criteria
- ✅ Dashboard shows real user data
- ✅ Performance charts accurate
- ✅ Progress metrics calculated correctly
- ✅ Upcoming quizzes displayed
- ✅ Fast loading times

---

## PHASE 5: State Management & Data Flow
**Timeline**: Week 4 (3-4 days)  
**Status**: ⬜ Not Started

### 5.1 Implement Zustand for Global State ⭐⭐
**Priority**: MEDIUM  
**Estimated Time**: 4-6 hours

#### Tasks
- [ ] Install Zustand: `npm install zustand`
- [ ] Create stores:
  - [ ] `src/store/auth.store.ts` - Auth state
  - [ ] `src/store/ui.store.ts` - UI state (modals, loading)
  - [ ] `src/store/subject.store.ts` - Active subject
  - [ ] `src/store/quiz.store.ts` - Active quiz
- [ ] Implement auth store:
  - [ ] `user` state
  - [ ] `session` state
  - [ ] `isAuthenticated` computed
  - [ ] `setUser()` action
  - [ ] `clearUser()` action
- [ ] Implement UI store:
  - [ ] `modals` state
  - [ ] `loading` state
  - [ ] `openModal()` action
  - [ ] `closeModal()` action
  - [ ] `setLoading()` action
- [ ] Replace Context API where needed
- [ ] Test state persistence

#### Success Criteria
- ✅ Global state accessible throughout app
- ✅ State updates trigger re-renders
- ✅ No prop drilling
- ✅ State persists where needed

---

### 5.2 Implement React Query for Server State ⭐⭐⭐
**Priority**: HIGH  
**Estimated Time**: 6-8 hours

#### Tasks
- [ ] Install React Query: `npm install @tanstack/react-query`
- [ ] Setup QueryClient and QueryClientProvider
- [ ] Create custom hooks for all entities:
  - [ ] `useSubjects()` - Query subjects
  - [ ] `useSubject(id)` - Query single subject
  - [ ] `useCreateSubject()` - Mutation
  - [ ] `useUpdateSubject()` - Mutation
  - [ ] `useDeleteSubject()` - Mutation
  - [ ] `useMaterials(subjectId)` - Query materials
  - [ ] `useQuizzes(subjectId)` - Query quizzes
  - [ ] `useQuiz(id)` - Query single quiz
  - [ ] `useQuizAttempt(id)` - Query attempt
- [ ] Configure cache strategies:
  - [ ] Set staleTime for different queries
  - [ ] Configure refetchOnWindowFocus
  - [ ] Setup background refetching
- [ ] Implement optimistic updates
- [ ] Add loading and error states
- [ ] Test caching behavior

#### Success Criteria
- ✅ All data fetching uses React Query
- ✅ Caching works correctly
- ✅ Automatic refetching on stale data
- ✅ Optimistic updates feel instant
- ✅ Loading/error states handled

---

## PHASE 6: AI Integration Planning
**Timeline**: Week 5 (Future Enhancement)  
**Status**: ⬜ Not Started

### 6.1 Quiz Generation AI (Future) ⭐
**Priority**: LOW (Post-MVP)  
**Estimated Time**: 16-20 hours

#### Tasks (Planning Only for Now)
- [ ] Research AI providers:
  - [ ] OpenAI GPT-4
  - [ ] Anthropic Claude
  - [ ] Open-source alternatives
- [ ] Design prompt templates
- [ ] Create Supabase Edge Function for AI calls
- [ ] Implement text extraction optimization
- [ ] Build question generation pipeline
- [ ] Add cost controls and rate limiting
- [ ] Test question quality
- [ ] Implement human review/editing

#### Notes
- Start with template-based generation for MVP
- Plan AI integration for post-launch
- Budget ~$50-100/month for AI API costs
- Consider caching generated questions

---

### 6.2 Passing Chance Calculation ⭐⭐
**Priority**: MEDIUM  
**Estimated Time**: 4-6 hours

#### Tasks
- [ ] Design passing chance algorithm:
  - [ ] Weight recent attempts more
  - [ ] Factor in difficulty levels
  - [ ] Consider time spent vs scores
  - [ ] Use simple linear regression
- [ ] Implement calculation function
- [ ] Create database function to update on quiz completion
- [ ] Test with various score patterns
- [ ] Fine-tune weights

#### Success Criteria
- ✅ Passing chance updates after each quiz
- ✅ Algorithm gives reasonable predictions
- ✅ Takes into account recent performance
- ✅ Motivates continued practice

---

## PHASE 7: Error Handling & Edge Cases
**Timeline**: Week 5-6 (4-5 days)  
**Status**: ⬜ Not Started

### 7.1 Comprehensive Error Handling ⭐⭐⭐
**Priority**: HIGH  
**Estimated Time**: 6-8 hours

#### Tasks
- [ ] Create error boundary components:
  - [ ] Global error boundary
  - [ ] Route-level error boundaries
- [ ] Implement toast notifications:
  - [ ] Success messages
  - [ ] Error messages
  - [ ] Warning messages
  - [ ] Info messages
- [ ] Add retry logic for failed requests:
  - [ ] Network errors
  - [ ] Timeout errors
  - [ ] Server errors
- [ ] Handle offline scenarios:
  - [ ] Detect offline state
  - [ ] Show offline indicator
  - [ ] Queue actions for when online
- [ ] Setup error logging:
  - [ ] Install Sentry: `npm install @sentry/react`
  - [ ] Configure Sentry
  - [ ] Add error tracking
- [ ] Create user-friendly error messages
- [ ] Test all error scenarios

#### Success Criteria
- ✅ App doesn't crash on errors
- ✅ Users see helpful error messages
- ✅ Failed requests retry automatically
- ✅ Offline state handled gracefully
- ✅ Errors logged for debugging

---

### 7.2 Loading & Skeleton States ⭐⭐
**Priority**: MEDIUM  
**Estimated Time**: 4-6 hours

#### Tasks
- [ ] Create skeleton components:
  - [ ] Subject card skeleton
  - [ ] Quiz card skeleton
  - [ ] Material card skeleton
  - [ ] Dashboard skeleton
- [ ] Add loading states to all data fetching
- [ ] Implement optimistic UI updates:
  - [ ] Create subject (instant feedback)
  - [ ] Submit quiz answer (instant feedback)
  - [ ] Upload file (progress bar)
- [ ] Add progress indicators:
  - [ ] File upload progress
  - [ ] Quiz generation progress
  - [ ] Material processing progress
- [ ] Handle empty states:
  - [ ] No subjects yet
  - [ ] No quizzes yet
  - [ ] No materials yet
- [ ] Test loading performance

#### Success Criteria
- ✅ No blank screens during loading
- ✅ Skeleton states match final content
- ✅ Progress indicators accurate
- ✅ Empty states guide user actions
- ✅ App feels fast and responsive

---

### 7.3 Validation & Data Integrity ⭐⭐⭐
**Priority**: HIGH  
**Estimated Time**: 4-6 hours

#### Tasks
- [ ] Implement form validation:
  - [ ] Zod schemas for all forms
  - [ ] Real-time validation
  - [ ] Server-side validation
- [ ] Add file upload validation:
  - [ ] File size limits
  - [ ] File type restrictions
  - [ ] Malware scanning (future)
- [ ] Sanitize user inputs:
  - [ ] XSS prevention
  - [ ] SQL injection prevention (via Supabase)
  - [ ] HTML sanitization
- [ ] Prevent duplicate submissions:
  - [ ] Disable buttons on submit
  - [ ] Debounce form submissions
- [ ] Handle edge cases:
  - [ ] Deleted materials in quiz
  - [ ] Orphaned questions
  - [ ] Incomplete quiz attempts
- [ ] Test validation thoroughly

#### Success Criteria
- ✅ Invalid data rejected
- ✅ Clear validation error messages
- ✅ Can't upload dangerous files
- ✅ No duplicate submissions
- ✅ Data integrity maintained

---

## PHASE 8: Production Readiness
**Timeline**: Week 6-7 (5-7 days)  
**Status**: ⬜ Not Started

### 8.1 Performance Optimization ⭐⭐
**Priority**: MEDIUM  
**Estimated Time**: 6-8 hours

#### Tasks
- [ ] Implement code splitting:
  - [ ] Use React.lazy for routes
  - [ ] Split large components
  - [ ] Lazy load modals
- [ ] Optimize images:
  - [ ] Convert to WebP
  - [ ] Add lazy loading
  - [ ] Implement blur placeholders
- [ ] Add virtual scrolling:
  - [ ] Long lists of materials
  - [ ] Long lists of quizzes
- [ ] Minimize bundle size:
  - [ ] Analyze bundle with vite-bundle-visualizer
  - [ ] Remove unused dependencies
  - [ ] Tree-shake libraries
- [ ] Implement service worker:
  - [ ] Cache static assets
  - [ ] Offline fallback page
- [ ] Add CDN for assets (Vercel handles this)
- [ ] Run Lighthouse audit
- [ ] Fix performance issues

#### Success Criteria
- ✅ Lighthouse score > 90
- ✅ First Contentful Paint < 1.5s
- ✅ Time to Interactive < 3s
- ✅ Bundle size < 500KB (gzipped)
- ✅ Works offline (basic functionality)

---

### 8.2 Testing ⭐⭐
**Priority**: MEDIUM  
**Estimated Time**: 8-10 hours

#### Tasks
- [ ] Setup testing infrastructure:
  - [ ] Install Vitest: `npm install -D vitest`
  - [ ] Install React Testing Library
  - [ ] Configure test environment
- [ ] Write unit tests:
  - [ ] Utility functions
  - [ ] Hooks
  - [ ] Service functions
- [ ] Write integration tests:
  - [ ] Auth flow
  - [ ] Subject CRUD
  - [ ] Quiz creation
  - [ ] Quiz taking
- [ ] Setup E2E tests:
  - [ ] Install Playwright: `npm install -D @playwright/test`
  - [ ] Configure Playwright
- [ ] Write E2E tests:
  - [ ] Sign up → Create subject → Upload material → Create quiz → Take quiz
  - [ ] Sign in → View dashboard → Take quiz → View results
- [ ] Add test to CI/CD
- [ ] Achieve >70% code coverage

#### Success Criteria
- ✅ Critical paths tested
- ✅ Tests run in CI/CD
- ✅ E2E tests pass
- ✅ Good code coverage
- ✅ Tests are maintainable

---

### 8.3 Security Hardening ⭐⭐⭐
**Priority**: CRITICAL  
**Estimated Time**: 4-6 hours

#### Tasks
- [ ] Review all RLS policies
- [ ] Implement rate limiting:
  - [ ] Auth endpoints
  - [ ] File uploads
  - [ ] Quiz generation
- [ ] Add CSRF protection (Supabase handles this)
- [ ] Sanitize all user inputs
- [ ] Review and fix security vulnerabilities:
  - [ ] Run `npm audit`
  - [ ] Update vulnerable packages
- [ ] Setup security headers:
  - [ ] Content-Security-Policy
  - [ ] X-Frame-Options
  - [ ] X-Content-Type-Options
- [ ] Conduct security audit
- [ ] Document security measures

#### Success Criteria
- ✅ No critical vulnerabilities
- ✅ All data access controlled by RLS
- ✅ Rate limiting prevents abuse
- ✅ Security headers configured
- ✅ Inputs sanitized
- ✅ Audit log maintained

---

### 8.4 Monitoring & Analytics ⭐⭐
**Priority**: MEDIUM  
**Estimated Time**: 4-6 hours

#### Tasks
- [ ] Setup error tracking:
  - [ ] Configure Sentry
  - [ ] Add source maps
  - [ ] Test error reporting
- [ ] Add performance monitoring:
  - [ ] Track page load times
  - [ ] Monitor API response times
  - [ ] Track user interactions
- [ ] Implement user analytics:
  - [ ] Install Plausible or PostHog
  - [ ] Track key events
  - [ ] Privacy-friendly analytics
- [ ] Setup uptime monitoring:
  - [ ] Use UptimeRobot or similar
  - [ ] Alert on downtime
- [ ] Create admin dashboard (optional):
  - [ ] User count
  - [ ] Quiz count
  - [ ] Error rate
  - [ ] Performance metrics

#### Success Criteria
- ✅ Errors tracked and alerted
- ✅ Performance monitored
- ✅ User analytics collected
- ✅ Uptime monitored
- ✅ Actionable insights available

---

## PHASE 9: Deployment & DevOps
**Timeline**: Week 7 (2-3 days)  
**Status**: ⬜ Not Started

### 9.1 Environment Setup ⭐⭐⭐
**Priority**: HIGH  
**Estimated Time**: 2-3 hours

#### Tasks
- [ ] Setup environments:
  - [ ] **Development**: Local Supabase + Vite dev server
  - [ ] **Staging**: Supabase staging project + Vercel preview
  - [ ] **Production**: Supabase production + Vercel
- [ ] Configure environment variables:
  - [ ] Create `.env.development`
  - [ ] Create `.env.staging`
  - [ ] Create `.env.production`
- [ ] Setup Vercel project:
  - [ ] Connect GitHub repository
  - [ ] Configure build settings
  - [ ] Add environment variables
- [ ] Test all environments

#### Success Criteria
- ✅ Three separate environments
- ✅ Each environment isolated
- ✅ Environment variables configured
- ✅ Can deploy to each environment

---

### 9.2 CI/CD Pipeline ⭐⭐⭐
**Priority**: HIGH  
**Estimated Time**: 3-4 hours

#### Tasks
- [ ] Create GitHub Actions workflow:
  - [ ] `.github/workflows/ci.yml`
- [ ] Configure CI pipeline:
  - [ ] Run linting
  - [ ] Run type checking
  - [ ] Run tests
  - [ ] Build project
- [ ] Configure CD pipeline:
  - [ ] Auto-deploy to staging on PR
  - [ ] Auto-deploy to production on merge to main
- [ ] Setup database migrations:
  - [ ] Version migration files
  - [ ] Run migrations on deploy
- [ ] Add rollback procedures
- [ ] Test entire pipeline

#### Success Criteria
- ✅ Tests run on every PR
- ✅ Staging deploys on PR
- ✅ Production deploys on merge
- ✅ Migrations run automatically
- ✅ Can rollback if needed

---

### 9.3 Production Deployment ⭐⭐⭐
**Priority**: CRITICAL  
**Estimated Time**: 2-4 hours

#### Tasks
- [ ] Pre-deployment checklist:
  - [ ] All tests passing
  - [ ] Performance optimized
  - [ ] Security hardened
  - [ ] Error monitoring setup
  - [ ] Analytics configured
- [ ] Deploy to production:
  - [ ] Run final tests
  - [ ] Deploy via CI/CD
  - [ ] Verify deployment
- [ ] Setup custom domain:
  - [ ] Purchase domain (if needed)
  - [ ] Configure DNS
  - [ ] Setup SSL certificate
  - [ ] Test custom domain
- [ ] Post-deployment verification:
  - [ ] Test critical flows
  - [ ] Check error logs
  - [ ] Monitor performance
  - [ ] Verify analytics

#### Success Criteria
- ✅ App deployed to production
- ✅ Custom domain working
- ✅ SSL certificate active
- ✅ All features working
- ✅ No critical errors

---

## PHASE 10: Post-Launch Features
**Timeline**: Week 8+ (Ongoing)  
**Status**: ⬜ Not Started

### 10.1 User Feedback & Iteration ⭐⭐⭐
**Priority**: HIGH  
**Estimated Time**: Ongoing

#### Tasks
- [ ] Add feedback mechanism:
  - [ ] Feedback form
  - [ ] Bug reporting
  - [ ] Feature requests
- [ ] Monitor user behavior:
  - [ ] Track feature usage
  - [ ] Identify pain points
  - [ ] Analyze drop-off points
- [ ] Iterate based on feedback:
  - [ ] Fix critical bugs
  - [ ] Improve UX
  - [ ] Add requested features
- [ ] Regular updates and improvements

---

### 10.2 Advanced Features (Future) ⭐
**Priority**: LOW  
**Estimated Time**: TBD

#### Potential Features
- [ ] Collaborative features:
  - [ ] Share quizzes with friends
  - [ ] Study groups
  - [ ] Leaderboards
- [ ] Advanced analytics:
  - [ ] Detailed performance insights
  - [ ] Topic mastery tracking
  - [ ] Study habit recommendations
  - [ ] Predictive analytics
- [ ] Gamification:
  - [ ] Achievements/badges
  - [ ] Streaks
  - [ ] XP/leveling system
  - [ ] Daily challenges
- [ ] Mobile apps:
  - [ ] React Native app
  - [ ] Better PWA support
  - [ ] Offline mode
- [ ] AI enhancements:
  - [ ] AI tutor assistant
  - [ ] Personalized study plans
  - [ ] Smart scheduling
  - [ ] Adaptive difficulty
- [ ] Integration features:
  - [ ] Google Classroom
  - [ ] Canvas LMS
  - [ ] Calendar integration
  - [ ] Note-taking apps

---

## 📊 Progress Tracking

### Overall Progress: 0%

| Phase | Status | Progress | ETA |
|-------|--------|----------|-----|
| Phase 1: Foundation | ⬜ Not Started | 0% | Week 1 |
| Phase 2: Supabase Setup | ⬜ Not Started | 0% | Week 1-2 |
| Phase 3: Authentication | ⬜ Not Started | 0% | Week 2 |
| Phase 4: Core Features | ⬜ Not Started | 0% | Week 2-4 |
| Phase 5: State Management | ⬜ Not Started | 0% | Week 4 |
| Phase 6: AI Planning | ⬜ Not Started | 0% | Week 5 |
| Phase 7: Error Handling | ⬜ Not Started | 0% | Week 5-6 |
| Phase 8: Production Ready | ⬜ Not Started | 0% | Week 6-7 |
| Phase 9: Deployment | ⬜ Not Started | 0% | Week 7 |
| Phase 10: Post-Launch | ⬜ Not Started | 0% | Week 8+ |

---

## 🎯 Key Milestones

- [ ] **Milestone 1**: React Router + Code Organization (End of Week 1)
- [ ] **Milestone 2**: Supabase + Auth Working (End of Week 2)
- [ ] **Milestone 3**: Core CRUD Features (End of Week 4)
- [ ] **Milestone 4**: State Management + Error Handling (End of Week 5)
- [ ] **Milestone 5**: Testing + Performance (End of Week 6)
- [ ] **Milestone 6**: Production Deployment (End of Week 7)
- [ ] **Milestone 7**: First Users + Feedback (Week 8)

---

## 📝 Notes & Decisions

### Technology Stack
- **Frontend**: React 19 + TypeScript + Vite + Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **State Management**: Zustand + React Query
- **Routing**: React Router v6
- **Testing**: Vitest + React Testing Library + Playwright
- **Deployment**: Vercel
- **Monitoring**: Sentry + Plausible
- **Future AI**: OpenAI GPT-4 or Anthropic Claude

### Architecture Decisions
1. **Why Supabase?**: All-in-one backend (auth, database, storage, real-time)
2. **Why Zustand?**: Lightweight, easy to use, no boilerplate
3. **Why React Query?**: Best-in-class server state management
4. **Why Vercel?**: Easy deployment, great DX, automatic previews
5. **Why Mock AI Initially?**: Focus on core features first, add AI later

### Risk Management
- **Risk**: AI costs too high → **Mitigation**: Start with templates, add AI later
- **Risk**: Performance issues with large files → **Mitigation**: Implement streaming, chunking
- **Risk**: Database costs → **Mitigation**: Start with free tier, optimize queries
- **Risk**: Time estimation off → **Mitigation**: Start with MVP, iterate

---

## 🔗 Resources

### Documentation
- [React Router Docs](https://reactrouter.com/)
- [Supabase Docs](https://supabase.com/docs)
- [Zustand Docs](https://docs.pmnd.rs/zustand/)
- [React Query Docs](https://tanstack.com/query/latest)
- [Vercel Docs](https://vercel.com/docs)

### Tutorials
- [Supabase Auth with React](https://supabase.com/docs/guides/auth/auth-helpers/react)
- [React Query Best Practices](https://tkdodo.eu/blog/practical-react-query)
- [Vercel Deployment Guide](https://vercel.com/docs/deployments/overview)

### Tools
- [Supabase Studio](https://supabase.com/docs/guides/platform/studio)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)
- [Sentry](https://sentry.io/)
- [Plausible Analytics](https://plausible.io/)

---

## 📅 Timeline Summary

```
Week 1: Foundation & Supabase Setup
Week 2: Authentication & Start Core Features
Week 3-4: Complete Core Features
Week 5: State Management & Error Handling
Week 6: Testing & Performance
Week 7: Deployment & Production
Week 8+: Post-Launch & Iteration
```

---

## ✅ Next Steps

1. Review this roadmap
2. Adjust timelines if needed
3. Start with Phase 1.1: Add React Router
4. Check off tasks as completed
5. Update progress regularly
6. Celebrate milestones! 🎉

---

**Last Updated**: November 2, 2025  
**Next Review**: End of Week 1
