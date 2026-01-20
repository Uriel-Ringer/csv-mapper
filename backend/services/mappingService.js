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
    
    const frameCategory = row.polarized === 'Yes' ? 'Sunglasses' : 'Optical';
    
    const newRowOutputFormat = {
      'Brand': ai.brand ,
      'Gender': ai.gender ,
      'Frame shape': ai.frameShape,
      'Collection': ai.collection,
      'Description': ai.description ,
      'Color description': ai.colorDescription,
      'Season': ai.season ,
      'Rim type': ai.rimType ,
      'Hinge type': ai.hingeType ,
      'Color': ai.color,
      
      'SKU': row.REFERENCE || '',
      'UPC': row.EAN || '',
      'Price': row['GoHub price'] || '',
      'Recommendaed Price': row.PVP || '',
      'Image1': imagePaths[0] || '',
      'Image2': imagePaths[1] || '',
      'Image3': imagePaths[2] || '',
      'Manufacturer model #': ai.ManufacturerModel,
      
      'Lens width': ai.lensWidth,
      'Bridge width': ai.bridgeWidth,
      'Temple length': ai.templeLength,
      'Lens height': ai.lensHeight,
      
      'Frame material': ai.frameMaterial,
      'Frame category': frameCategory,
      'Frame type': 'Full-rimmed',
      'Weight': "--",
      'Processing days': "--"
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
