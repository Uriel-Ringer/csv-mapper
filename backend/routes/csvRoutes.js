import express from 'express';
import multer from 'multer';
import path from 'path';
import { parseCSV, excelToCSV } from '../services/parserService.js';
import { mapToOutputFormat } from '../services/mappingService.js';

const router = express.Router();

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (!['.csv', '.xlsx', '.xls'].includes(ext)) {
      return cb(new Error('Only CSV and Excel files are allowed'));
    }
    cb(null, true);
  },
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB limit
});


router.post('/map', upload.single('file'), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Step 1: Parse file (CSV or Excel)
    const ext = path.extname(req.file.originalname).toLowerCase();
    let csvContent;
    
    if (ext === '.csv') {
      csvContent = req.file.buffer.toString('utf-8');
    } else if (['.xlsx', '.xls'].includes(ext)) {
      console.log('📊 Converting Excel to CSV...');
      csvContent = excelToCSV(req.file.buffer);
    }
    
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
