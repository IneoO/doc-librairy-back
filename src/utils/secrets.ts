import * as process from 'process';
import * as fs from 'fs';
import * as dotenv from 'dotenv';

if (fs.existsSync('.env')) {
  console.debug('Using .env file to supply config environment variables');
  dotenv.config({ path: '.env' });
} else {
  console.error('No .enf file to supply config.');
  process.exit(1);
}

export const MONGODB_URI = process.env['MONGODB_URI'];

if (!MONGODB_URI) {
  console.error('No mongo connection string. Set MONGODB_URI environment variable.');
  process.exit(1);
}
