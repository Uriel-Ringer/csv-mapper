# CSV Mapper

Full-stack application for mapping supplier CSV files to standardized Book111 format with AI-powered data enrichment.

## 🎯 Features

- **Multi-supplier Support**: Config-based parsing for different supplier formats (OCEAN, etc.)
- **AI Enrichment**: Uses OpenAI GPT-4 to infer missing fields (brand, gender, frame shape, etc.)
- **Product Grouping**: Automatically groups product variants (8785.1, 8785.2, 8785.3)
- **Image Download**: Downloads and extracts product images from Dropbox links
- **Standardized Output**: Maps to Book111 format with 50+ fields

## 📁 Project Structure

```
csv-mapper/
├── backend/          # Node.js + Express API
│   ├── config/       # Supplier configurations
│   ├── services/     # Business logic
│   ├── routes/       # API endpoints
│   └── utils/        # Helper functions
├── frontend/         # React + Vite UI
│   └── src/
│       ├── components/
│       └── api.js
└── README.md
```

## 🚀 Setup

### Backend

```bash
cd backend
npm install
```

Create `.env` file:
```env
OPENAI_API_KEY=your_openai_key_here
PORT=3001
```

Start server:
```bash
npm start
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on http://localhost:3000  
Backend runs on http://localhost:3001

## 🔄 Workflow

1. Upload CSV file (supplier format)
2. System detects supplier automatically
3. Standardizes data to intermediate format
4. Groups products by reference number
5. AI enriches missing fields
6. Downloads images from Dropbox
7. Maps to Book111 format
8. Returns enriched CSV

## 🛠️ Tech Stack

**Backend:**
- Node.js + Express
- OpenAI GPT-4-turbo
- Papa Parse (CSV)
- Axios + AdmZip (images)

**Frontend:**
- React 18
- Vite
- AG-Grid (table)

## Future Enhancements

## Testing

Unit tests infrastructure have been prepared using Vitest framework to ensure code quality and maintainability.

The test suite includes:
- Unit tests for core mapping functionality
- Product grouping and AI enrichment validation
- Image processing and error handling
- Integration tests for complete workflows

### Image Analysis with OpenAI Vision

The system can be extended to use **OpenAI Vision API (GPT-4o with OCR capabilities)** to extract product information directly from images.


Private project

## 👤 Author

Uriel R.
