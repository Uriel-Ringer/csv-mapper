import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Load supplier configuration
 * @param {string} supplierName - Name of supplier (e.g., 'ocean')
 * @returns {Object} - Supplier configuration
 */
export function loadSupplierConfig(supplierName) {
  const configPath = path.join(__dirname, '..', 'config', 'suppliers', `${supplierName.toLowerCase()}.json`);
  
  if (!fs.existsSync(configPath)) {
    throw new Error(`Configuration not found for supplier: ${supplierName}`);
  }
  
  const configData = fs.readFileSync(configPath, 'utf-8');
  return JSON.parse(configData);
}

/**
 * Parse SIZE field into lens and temple dimensions
 * Handles formats like:
 * "Lens Width: 49  Lens Height: 34  Bridge:24  Arms: 142"
 * "54-19-145"
 * 
 * @param {string} sizeString - Raw size string
 * @returns {Object} - { lensDimensions: {...}, templeDimensions: {...} }
 */
export function parseDimensions(sizeString) {
  if (!sizeString || sizeString.trim() === '') {
    return {
      lensDimensions: { width: '', height: '', bridge: '' },
      templeDimensions: { length: '' }
    };
  }

  const result = {
    lensDimensions: { width: '', height: '', bridge: '' },
    templeDimensions: { length: '' }
  };

  const str = sizeString.toLowerCase();

  // Try to extract lens width
  const lensWidthMatch = str.match(/lens\s*width[:\s]*(\d+)/i);
  if (lensWidthMatch) result.lensDimensions.width = lensWidthMatch[1];

  // Try to extract lens height
  const lensHeightMatch = str.match(/lens\s*height[:\s]*(\d+)/i);
  if (lensHeightMatch) result.lensDimensions.height = lensHeightMatch[1];

  // Try to extract bridge
  const bridgeMatch = str.match(/bridge[:\s]*(\d+)/i);
  if (bridgeMatch) result.lensDimensions.bridge = bridgeMatch[1];

  // Try to extract temple/arms length
  const templeMatch = str.match(/(arms?|temple)[:\s]*(\d+)/i);
  if (templeMatch) result.templeDimensions.length = templeMatch[2];

  // Fallback: try standard format "54-19-145"
  if (!result.lensDimensions.width) {
    const standardMatch = sizeString.match(/(\d+)-(\d+)-(\d+)/);
    if (standardMatch) {
      result.lensDimensions.width = standardMatch[1];
      result.lensDimensions.bridge = standardMatch[2];
      result.templeDimensions.length = standardMatch[3];
    }
  }

  return result;
}

export function standardizeData(rawRows, supplierName = 'ocean') {
  const config = loadSupplierConfig(supplierName);
  const mapping = config;

  return rawRows.map((rawRow, index) => {
    const standardized = {};

    // Apply mapping from config
    for (const [sourceField, targetField] of Object.entries(mapping)) {
      const sourceValue = rawRow[sourceField];

      // Special handling for SIZE field (needs to be split)
      if (sourceField === 'SIZE' && typeof targetField === 'object') {
        const dimensions = parseDimensions(sourceValue || '');
        standardized[targetField.lens] = dimensions.lensDimensions;
        standardized[targetField.temple] = dimensions.templeDimensions;
      } else if (typeof targetField === 'string') {
        // Direct mapping
        standardized[targetField] = sourceValue || '';
      }
    }

    // Add index for tracking
    standardized._index = index;

    return standardized;
  });
}

/**
 * Detect supplier from CSV headers
 * @param {Array} rows - Parsed CSV rows
 * @returns {string} - Detected supplier name
 */
export function detectSupplier(rows) {
  if (rows.length === 0) return 'unknown';

  const headers = Object.keys(rows[0]).map(h => h.toLowerCase());

  // Check for OCEAN-specific headers
  const oceanHeaders = ['reference', 'gohub price', 'frame color', 'polarized'];
  const hasOceanHeaders = oceanHeaders.filter(h => 
    headers.some(header => header.includes(h))
  ).length;

  if (hasOceanHeaders >= 3) return 'ocean';

  return 'unknown';
}
