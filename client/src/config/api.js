let envUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Auto-fix URL if the user forgot to add /api at the end in their deployment settings
if (!envUrl.endsWith('/api') && !envUrl.includes('/api/')) {
  envUrl = envUrl.replace(/\/$/, '') + '/api';
}

const API_BASE_URL = envUrl;

export default API_BASE_URL;
