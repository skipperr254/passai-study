# Database Schema Fix: Questions Table Column Mapping

## Issue Identified

The application code was not matching the actual database schema for the `questions` table, causing questions to not display during quiz taking.

## Schema Mismatch

### What the Database Actually Has:

```sql
- question (text)           -- not "question_text"
- options (jsonb)           -- not string
- correct_answer (jsonb)    -- not string
- points (integer)          -- was missing from code
- tags (text[])             -- was missing from code
- material_references (uuid[]) -- was missing from code
```

### What the Code Was Expecting:

```typescript
- question_text (string)
- options (string)           -- tried to parse as JSON string
- correct_answer (string)
- points (hardcoded to 10)
```

## Changes Made

### 1. Updated `QuestionDbRow` Interface

**File**: `src/services/quiz.service.ts`

**Before**:

```typescript
interface QuestionDbRow {
  id: string;
  quiz_id: string;
  question_text: string; // ❌ Wrong column name
  type: string;
  options: string | null; // ❌ Wrong type
  correct_answer: string; // ❌ Wrong type
  explanation: string;
  topic: string;
  difficulty: string;
  // Missing: points, tags, material_references
}
```

**After**:

```typescript
interface QuestionDbRow {
  id: string;
  quiz_id: string;
  question: string; // ✅ Correct column name
  type: string;
  options: unknown; // ✅ Handles jsonb
  correct_answer: unknown; // ✅ Handles jsonb
  explanation: string | null;
  topic: string | null;
  difficulty: string;
  points: number; // ✅ Added
  order_index: number;
  tags: string[] | null; // ✅ Added
  material_references: string[] | null; // ✅ Added
  source_material_id: string | null;
  source_page: string | null; // ✅ Changed from number
  source_excerpt: string | null;
  created_at: string;
  updated_at: string; // ✅ Added
}
```

### 2. Updated `mapQuestionFromDb()` Function

Added proper handling for jsonb fields:

```typescript
function mapQuestionFromDb(row: QuestionDbRow): Question {
  // Handle correct_answer (jsonb - can be string or array)
  let correctAnswer: string | string[];
  if (typeof row.correct_answer === 'string') {
    correctAnswer = row.correct_answer;
  } else if (Array.isArray(row.correct_answer)) {
    correctAnswer = row.correct_answer;
  } else {
    correctAnswer = JSON.stringify(row.correct_answer);
  }

  // Handle options (jsonb array)
  let options: string[] | undefined;
  if (Array.isArray(row.options)) {
    options = row.options.map(opt => String(opt));
  } else if (row.options) {
    try {
      const parsed = typeof row.options === 'string' ? JSON.parse(row.options) : row.options;
      options = Array.isArray(parsed) ? parsed : undefined;
    } catch {
      options = undefined;
    }
  }

  return {
    id: row.id,
    quizId: row.quiz_id,
    type: row.type as QuestionType,
    difficulty: row.difficulty as DifficultyLevel,
    question: row.question, // ✅ Fixed column name
    options: options, // ✅ Proper jsonb handling
    correctAnswer: correctAnswer, // ✅ Proper jsonb handling
    explanation: row.explanation || '',
    points: row.points || 1, // ✅ Use actual points from DB
    order: row.order_index,
    tags: row.tags || (row.topic ? [row.topic] : undefined),
    materialReferences:
      row.material_references || (row.source_material_id ? [row.source_material_id] : undefined),
  };
}
```

### 3. Fixed Template Question Generation

**Before** (using wrong structure):

```typescript
questions.push({
  question_text: `Question ${i + 1}...`,  // ❌ Wrong column
  options: JSON.stringify([...]),          // ❌ Stringifying array
  // Missing points, tags
});

// Then mapping to different names
question: q.question_text,  // ❌ Confusing
options: q.options,         // ❌ Already stringified
```

**After** (direct insert format):

```typescript
questionsToInsert.push({
  quiz_id: quizId,
  question: `Question ${i + 1}...`, // ✅ Correct column
  type: 'multiple-choice',
  options: ['A', 'B', 'C', 'D'], // ✅ Array (Supabase handles jsonb)
  correct_answer: 'A', // ✅ String/Array (Supabase handles jsonb)
  points: 1, // ✅ Included
  tags: [topic], // ✅ Included
  // ...rest
});

// Direct insert without remapping
await supabase.from('questions').insert(questionsToInsert);
```

### 4. Fixed AI Question Generation

Updated to use proper jsonb fields:

```typescript
const questionsToInsert = aiQuestions.map((q, index) => ({
  quiz_id: quizId,
  question: q.question,
  type: q.type,
  options: q.options || null, // ✅ Let Supabase handle jsonb
  correct_answer: q.correctAnswer, // ✅ Let Supabase handle jsonb
  explanation: q.explanation,
  topic: q.tags[0] || null,
  tags: q.tags, // ✅ Array field
  difficulty: q.difficulty,
  points: q.points, // ✅ From AI generation
  order_index: index,
  // ...rest
}));
```

## Why This Matters

### The Root Cause

When fetching questions from the database, the code was looking for `question_text` column, but the database has `question` column. This caused:

- Questions returned as `undefined`
- Quiz session showing loading state indefinitely
- Empty question displays

### JSONB Benefits

Using proper jsonb types allows:

- **Arrays stored natively**: `options: ["A", "B", "C"]`
- **Flexible correct_answer**: Can be string OR array for multiple correct answers
- **Automatic type conversion**: Supabase handles JSON serialization
- **Better queries**: Can use jsonb operators in SQL

## Testing Checklist

After these changes, verify:

- [x] Questions display correctly in QuizSession
- [x] Multiple choice options appear as array
- [x] Correct answer is properly compared
- [x] Points are shown accurately
- [x] AI-generated questions save correctly
- [x] Template questions save correctly
- [x] Tags array is populated
- [x] Material references work

## No Database Migration Needed! ✅

**Good news**: The database schema was already correct! We only needed to fix the TypeScript code to match it.

The database already has:

- ✅ `question` column (not `question_text`)
- ✅ `options` as jsonb
- ✅ `correct_answer` as jsonb
- ✅ `points` as integer
- ✅ `tags` as text[]
- ✅ `material_references` as uuid[]

## Related Files Modified

1. ✅ `src/services/quiz.service.ts`
   - Updated `QuestionDbRow` interface
   - Fixed `mapQuestionFromDb()` function
   - Fixed `generateTemplateQuestions()` function
   - Fixed AI question insert format

## Impact

- **Before**: Questions wouldn't load, quiz session stuck on loading
- **After**: Questions load correctly, quiz functions properly
- **Performance**: Better - using native jsonb instead of string parsing
- **Maintainability**: Clearer - code matches actual schema
- **Flexibility**: More - can handle multiple correct answers, complex option types

## Future Improvements

Consider:

1. **Type Safety**: Create a strict insert type from Supabase generated types
2. **Validation**: Add runtime validation for question data before insert
3. **Migration**: If needed, add `material_references` population from `source_material_id`
4. **Indexing**: Consider adding indexes on `tags` and `material_references` for faster queries
