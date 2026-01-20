# CSV Mapper Frontend

React frontend for AI-powered CSV mapping.

## Setup

1. **Install dependencies:**
```bash
npm install
```

2. **Start development server:**
```bash
npm run dev
```

Frontend will start on http://localhost:3000

## Features

- 📁 **File Upload**: Drag & drop CSV files
- 📊 **Source Preview**: View original supplier data
- 🤖 **AI Mapping**: Automatic field inference with OpenAI
- ✅ **Review**: Interactive table with mapped data
- 📥 **Export**: Download mapped CSV in Book111 format

## Components

- `FileUpload.jsx` - Drag & drop upload zone
- `SourceDataTable.jsx` - Display original CSV data
- `MappingProgress.jsx` - AI processing progress indicator
- `MappingReviewTable.jsx` - Review mapped data
- `ExportControls.jsx` - Download mapped CSV

## Tech Stack

- **React 18** - UI framework
- **Vite** - Build tool
- **Axios** - HTTP client
- **React Dropzone** - File upload
- **CSS** - Custom styling (no framework to keep it simple)

## Backend Connection

Configure backend URL in `src/api.js` (default: http://localhost:3001)
