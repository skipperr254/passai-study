# Text Extraction Setup

This script helps set up the PDF.js worker file for text extraction.

## Manual Setup

Copy the PDF.js worker file to the public folder:

```bash
cp node_modules/pdfjs-dist/build/pdf.worker.min.js public/pdf.worker.min.js
```

## Verify

After copying, you should have:

- `public/pdf.worker.min.js` (the worker file)

The file will be automatically served by Vite at `/pdf.worker.min.js`.
