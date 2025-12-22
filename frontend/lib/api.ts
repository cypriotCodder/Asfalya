// API configuration
// In Vercel, set NEXT_PUBLIC_API_URL to your Railway backend URL
/**
 * @brief The base URL for the backend API.
 * @details Defaults to localhost for development if not provided in environment variables.
 */
export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
