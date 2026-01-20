import express from 'express';
import multer from 'multer';
import path from 'path';
import { parseCSV } from '../services/parserService.js';
import { mapToOutputFormat } from '../services/mappingService.js';

const router = express.Router();

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext !== '.csv') {
      return cb(new Error('Only CSV files are allowed'));
    }
    cb(null, true);
  },
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});


router.post('/map', upload.single('file'), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Step 1: Parse CSV from buffer
    const csvContent = req.file.buffer.toString('utf-8');
    const rawRows = await parseCSV(csvContent, true);
    console.log(`Step 1: Parsed ${rawRows.length} rows`);
    
    const mappedRows = await mapToOutputFormat(rawRows);
    
    console.log('✅ Processing complete!');
    
    res.json({
      success: true,
      // supplier: supplier,
      originalFileName: req.file.originalname,
      rowCount: mappedRows.length,
      mappedRows: mappedRows
    });
    
  } catch (error) {
    console.error('❌ Processing error:', error);
    next(error);
  }
});

export default router;
