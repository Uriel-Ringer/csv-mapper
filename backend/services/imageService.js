import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import AdmZip from 'adm-zip';
import os from 'os';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// תיקיית Downloads של המשתמש
const DOWNLOADS_DIR = path.join(os.homedir(), 'Downloads', 'product-images');

/**
 * Download and extract images from Dropbox link
 * @param {string} dropboxLink - Dropbox share link
 * @param {string} reference - Product reference (e.g., "8785.1")
 * @returns {Promise<string>} - Full path to the first image
 */
export async function downloadAndExtractImages(dropboxLink, reference) {
  if (!dropboxLink || typeof dropboxLink !== 'string') {
    console.log(`⚠️  No valid link for ${reference}`);
    return '';
  }

  try {
    // Convert Dropbox share link to direct download
    // Option 1: Change dl=0 to dl=1
    let directLink = dropboxLink.replace('?dl=0', '?dl=1').replace('&dl=0', '&dl=1');
    
    // Option 2: If it's a /sh/ link, try alternative format
    if (dropboxLink.includes('/sh/')) {
      directLink = dropboxLink.replace('?dl=0', '?raw=1');
    }
    
    console.log(`📥 Downloading from: ${directLink.substring(0, 50)}...`);
    console.log(`   For product: ${reference}`);
    
    // Create product folder
    const productFolder = path.join(DOWNLOADS_DIR, reference.replace('.', '_'));
    if (!fs.existsSync(productFolder)) {
      fs.mkdirSync(productFolder, { recursive: true });
    }

    // Download file
    const response = await axios({
      method: 'GET',
      url: directLink,
      responseType: 'arraybuffer',
      timeout: 30000
    });

    const contentType = response.headers['content-type'];
    
    // Check if it's a ZIP file
    if (contentType?.includes('zip') || directLink.endsWith('.zip')) {
      console.log(`📦 Extracting ZIP for ${reference}...`);
      
      const zipPath = path.join(productFolder, 'temp.zip');
      fs.writeFileSync(zipPath, response.data);
      
      // Extract ZIP
      const zip = new AdmZip(zipPath);
      zip.extractAllTo(productFolder, true);
      
      // Delete temp ZIP
      fs.unlinkSync(zipPath);
      
      console.log(`✅ Extracted images for ${reference}`);
    } else {
      // Single image file
      const extension = path.extname(new URL(directLink).pathname) || '.jpg';
      const imagePath = path.join(productFolder, `image${extension}`);
      fs.writeFileSync(imagePath, response.data);
      
      console.log(`✅ Downloaded image for ${reference}`);
    }

    // Find all images in folder
    const files = fs.readdirSync(productFolder);
    const imageFiles = files.filter(f => /\.(jpg|jpeg|png|gif|webp)$/i.test(f));
    
    // Return array of full paths (up to 3 images)
    const imagePaths = imageFiles.slice(0, 3).map(f => path.join(productFolder, f));
    
    if (imagePaths.length > 0) {
      console.log(`📸 Found ${imagePaths.length} image(s) for ${reference}`);
      return imagePaths;
    }
    
    return [];
    
  } catch (error) {
    console.error(`❌ Error downloading images for ${reference}:`);
    console.error(`   URL: ${dropboxLink}`);
    console.error(`   Status: ${error.response?.status || 'N/A'}`);
    console.error(`   Message: ${error.message}`);
    return [];
  }
}

/**
 * Process image link - download if Dropbox, return paths if local
 * @param {string} link - Image link (Dropbox or local)
 * @param {string} reference - Product reference
 * @returns {Promise<Array<string>>} - Array of full local paths
 */
export async function processImageDownload(link, reference) {
  if (!link) return [];
  
  // Check if it's a Dropbox link
  if (link.includes('dropbox.com')) {
    return await downloadAndExtractImages(link, reference);
  }
  
  // Already a local path - return as array
  return [link];
}
