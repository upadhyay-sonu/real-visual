let envUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Auto-fix URL if the user forgot to add /api at the end in their deployment settings
if (!envUrl.endsWith('/api') && !envUrl.includes('/api/')) {
  envUrl = envUrl.replace(/\/$/, '') + '/api';
}

const API_BASE_URL = envUrl;

// Extract the base server URL by removing the /api suffix
export const SERVER_URL = API_BASE_URL.replace(/\/api$/, '');

// Utility to ensure model URLs are absolute (works for both local /uploads and absolute S3 urls)
export const getFileUrl = (path) => {
  if (!path) return '';
  // If it's already an absolute URL (like S3), return as is
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  // Guarantee absolute URL for local files in production
  return `${SERVER_URL}${path.startsWith('/') ? '' : '/'}${path}`;
};

export default API_BASE_URL;
