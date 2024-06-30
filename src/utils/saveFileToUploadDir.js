import path from 'node:path';
import fs from 'node:fs/promises';
import { TEMP_UPLOAD_DIR, UPLOAD_DIR } from '../constants/index.js';
import { env } from './env.js';

export const saveFileToUploadDir = async (file) => {
  try {
    await fs.rename(
      path.join(TEMP_UPLOAD_DIR, file.filename),
      path.join(UPLOAD_DIR, file.filename)
    );

    
    // await fs.unlink(path.join(TEMP_UPLOAD_DIR, file.filename));

    return `${env('APP_DOMAIN')}/uploads/${file.filename}`;
  } catch (error) {
    console.error('Error in saveFileToUploadDir:', error);
    throw new Error(`Failed to save file: ${error.message}`);
  }
};