import { inferFieldsInBatches } from './openaiService.js';
import { processImageDownload } from './imageService.js';

export async function mapToOutputFormat(standardizedRows) {
  console.log(`Mapping ${standardizedRows.length} products to final format...`);
  
  const groups = groupByBaseReference(standardizedRows);

  console.log('Step 1: Getting AI enrichment...');
  const aiData = await inferFieldsInBatches(groups);
  console.log('AI enrichment complete!');
  
  console.log('Step 2: Mapping fields...');

  const mappedRows = [];
  const flatProducts = groups.flat();
  
  for (let i = 0; i < flatProducts.length; i++) {
    const row = flatProducts[i];
    const ai = aiData[i] || {};
    
    // Download images from Dropbox and get local paths (array)
    const imagePaths = await processImageDownload(row.LINKS, row.REFERENCE);
    
    const frameCategory = row.POLARIZED === 'Yes' ? 'Sunglasses' : 'Optical';
    
    const newRowOutputFormat = {
      'Brand': ai.brand ,
      'Frame category': frameCategory,
      'SKU': row.REFERENCE || '',
      'Description': ai.description ,
      'Collection': ai.collection,
      'Gender': ai.gender ,
      'Frame shape': ai.frameShape,
      'Frame material': ai.frameMaterial,
      'Frame type': 'Full-rimmed',
      'Color': ai.color,
      'Color description': ai.colorDescription,
      'Lens width': ai.lensWidth,
      'Bridge width': ai.bridgeWidth,
      'Temple length': ai.templeLength,
      'Lens height': ai.lensHeight,
      'Rim type': ai.rimType ,
      'Hinge type': ai.hingeType ,
      'Manufacturer model #': ai.ManufacturerModel,
      'UPC': row.EAN || '',
      'Season': ai.season ,
      'Weight': "--",
      'Price': row['GoHub price'] || '',
      'Recommendaed Price': row.PVP || '',
      'Processing days': "--",
      'Image1': imagePaths[0] || '',
      'Image2': imagePaths[1] || '',
      'Image3': imagePaths[2] || ''
    };
    
    mappedRows.push(newRowOutputFormat);
  }
  
  console.log('Mapping complete!');
  return mappedRows;
}

function groupByBaseReference(products) {
  const groups = {};
  
  for (const product of products) {
    if (!product.REFERENCE) continue;
    
    const baseRef = product.REFERENCE.split('.')[0];
    
    if (!groups[baseRef]) {
      groups[baseRef] = [];
    }
    
    groups[baseRef].push(product);
  }
  
  return Object.values(groups);
}
