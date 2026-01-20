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

## 📝 Adding New Suppliers

Create config file in `backend/config/suppliers/{supplier}.json`:

```json
{
  "name": "Supplier Name",
  "columns": {
    "REFERENCE": "reference",
    "NAME": "name",
    "PRICE": "wholesalePrice"
  }
}
```

## 🤖 AI Fields

The system uses AI to infer:
- Brand
- Gender (Men/Women/Unisex/Kids)
- Frame Shape (Rectangle/Aviator/etc.)
- Collection
- Description (condensed)
- Color & Color Description
- Season
- Rim Type
- Hinge Type
- Frame Material
- Dimensions (lens/bridge/temple)

## 📦 Product Grouping

Products with consecutive references (8785.1, 8785.2, 8785.3) are treated as one family. 
Missing data in variants is inherited from the first product in the group.

## 📸 Image Handling

- Downloads from Dropbox share links
- Extracts ZIP archives automatically
- Stores in `Downloads/product-images/{reference}/`
- Returns full local paths in output

## 📄 License

Private project

## 👤 Author

Uriel R.
