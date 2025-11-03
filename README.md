# PassAI - AI-Powered Learning Platform

An intelligent study platform that helps students learn through personalized quizzes, study plans, and material management with AI-powered text extraction.

## 🚀 Tech Stack

- **Frontend**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS + shadcn/ui
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **Text Extraction**: PDF.js, Mammoth, PizZip, Tesseract.js (OCR)
- **AI**: OpenAI GPT (planned for quiz generation)

## ✨ Features

### ✅ Completed (Phase 4.2)

- 🔐 **Authentication**: Sign up, sign in, email verification, password reset
- 📚 **Subject Management**: Create, edit, delete subjects with color coding
- 📄 **Material Upload**: Upload PDFs, DOCX, PPTX, images, and text files
- 🔍 **Text Extraction**: Automatic text extraction from all supported formats
  - PDF text extraction with metadata
  - Word document parsing
  - PowerPoint slide text extraction
  - OCR for images (100+ languages)
  - Plain text file support
- 📊 **Progress Tracking**: Real-time upload and extraction progress
- 🎯 **Batch Processing**: Upload up to 10 files simultaneously

### 🚧 In Progress

- 🎨 **Materials UI**: Connecting MaterialsPage to backend
- 👁️ **File Preview**: Modal for viewing uploaded materials
- 🧪 **Testing**: End-to-end upload and extraction testing

### 📅 Planned

- 🤖 **AI Quiz Generation**: Generate questions from uploaded materials
- 📝 **Quiz Taking**: Interactive quiz sessions with instant feedback
- 📈 **Study Plans**: Personalized study schedules
- 🌱 **Gamification**: Points, streaks, achievements
- 🔗 **Source Snippets**: Link questions to material excerpts

## 🛠️ Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup Text Extraction

```powershell
./setup-text-extraction.ps1
```

This will:

- Install text extraction libraries (pdfjs-dist, mammoth, pizzip, tesseract.js)
- Copy PDF.js worker file to public folder
- Verify setup is complete

### 3. Configure Environment

Create `.env.local`:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Start Development Server

```bash
npm run dev
```

## 📖 Documentation

- **[PHASE_4.2_INTEGRATION_SUMMARY.md](./PHASE_4.2_INTEGRATION_SUMMARY.md)** - Complete Phase 4.2 overview
- **[TEXT_EXTRACTION_SETUP.md](./TEXT_EXTRACTION_SETUP.md)** - Detailed text extraction guide
- **[QUICK_START_UPLOAD.md](./QUICK_START_UPLOAD.md)** - Quick reference for upload implementation
- **[ROADMAP.md](./ROADMAP.md)** - Full project roadmap

## 🏗️ Architecture

```
src/
  components/generated/    - UI components
  hooks/                   - React hooks (useMaterials, useMaterialUpload)
  services/                - Business logic (materials.service, materials-with-extraction.service)
  lib/                     - Utilities and extractors
    extractors/           - Text extraction modules (pdf, docx, pptx, image, text)
    upload.utils.ts       - Upload validation and helpers
```

## 🔧 Key Technologies

### Text Extraction

- **PDF.js**: PDF text extraction with local worker (no CDN)
- **Mammoth**: Word document (.docx) parsing
- **PizZip**: PowerPoint (.pptx) XML parsing
- **Tesseract.js**: OCR for images with 100+ language support

### Backend

- **Supabase**: PostgreSQL database with real-time capabilities
- **Row Level Security**: User data isolation
- **Storage**: Organized file storage with automatic cleanup

## 📝 Current Status

**Phase 4.2 - Materials Upload & Processing**: 95% Complete

✅ **Completed:**

- Backend infrastructure (2,500+ lines)
- Text extraction for all file types
- Progress tracking and error handling
- Batch processing with concurrency control

🚧 **Remaining:**

- UI integration (MaterialsPage)
- File preview modal
- End-to-end testing

**Next Phase**: Quiz Creation Flow with AI-powered question generation

## 🤝 Contributing

This is a learning project. Key principles:

- **Clean Code**: Modular, type-safe, well-documented
- **Scalable**: Easy to extend and maintain
- **Production-Ready**: Error handling, validation, security

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
});
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x';
import reactDom from 'eslint-plugin-react-dom';

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
});
```
