# CSV Mapper Backend

AI-powered CSV mapping service for eyewear supplier data.

## Setup

1. **Install dependencies:**
```bash
npm install
```

2. **Configure environment:**
```bash
cp .env.example .env
# Edit .env and add your OpenAI API key
```

3. **Run the server:**
```bash
npm run dev
```

Server will start on http://localhost:3001

## API Endpoints

### POST /api/csv/upload
Upload a CSV file for processing.
- **Body**: `multipart/form-data` with field `file`
- **Returns**: `{ sessionId, format, schema, rowCount, sampleRows }`

### POST /api/csv/map/:sessionId
Map uploaded CSV data using AI.
- **Returns**: `{ success, rowCount, mappedRows }`

### PUT /api/csv/update/:sessionId
Update a specific mapped row.
- **Body**: `{ rowIndex: number, updates: object }`
- **Returns**: `{ success, updatedRow }`

### GET /api/csv/download/:sessionId
Download mapped CSV file.
- **Returns**: CSV file download

### GET /api/csv/session/:sessionId
Get session information.
- **Returns**: Session metadata

## Architecture

```
services/
  ├── openaiService.js    # OpenAI API integration
  ├── parserService.js    # CSV parsing
  └── mappingService.js   # Field mapping logic

utils/
  └── transformers.js     # Data transformation functions

routes/
  └── csvRoutes.js        # Express routes
```

## Environment Variables

- `OPENAI_API_KEY` - Your OpenAI API key (required)
- `PORT` - Server port (default: 3001)
- `NODE_ENV` - Environment (development/production)
