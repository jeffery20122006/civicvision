// Centralized API configuration for local dev and production deployment (Vercel)
export const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/$/, '');

export const safeFetch = async (url, options = {}) => {
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.warn(`[API Notice] Request to ${url} failed. Using demo/fallback mode:`, error.message);
    throw error;
  }
};
