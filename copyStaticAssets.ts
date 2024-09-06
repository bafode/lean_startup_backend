/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-console */
import { promises as fs } from 'fs';
import path from 'path';

async function copyFiles(source: string, destination: string) {
  try {
    const destinationDir = path.dirname(destination); // Ensure the directory exists
    await fs.mkdir(destinationDir, { recursive: true }); // Create the destination folder if it doesn't exist
    await fs.copyFile(source, destination); // Copy the file
    console.log(`Successfully copied ${source} to ${destination}`);
  } catch (error) {
    console.error(`Error copying file from ${source} to ${destination}:`, error);
    throw error; // Re-throw to ensure the promise chain handles this error
  }
}

// Example usage:
copyFiles('.env', './dist/.env');
