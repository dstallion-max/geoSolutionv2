// auth.js 
import dotenv from 'dotenv';
dotenv.config();

export const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-key-change-this-in-production';
export const JWT_EXPIRES_IN = '1h';
export const SESSION_TIMEOUT = parseInt(process.env.SESSION_TIMEOUT) || 600000;
export const COOKIE_MAX_AGE = 60 * 60 * 1000; // 1 hour
export const COOKIE_NAME = 'geo_session';