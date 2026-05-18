import api from './axios';

export const authService = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data) => api.put('/auth/profile', data),
};

export const analysisService = {
  uploadEmail: (formData) => api.post('/analysis/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  getHistory: (page = 1, limit = 10) => api.get(`/analysis/history?page=${page}&limit=${limit}`),
  getAnalysis: (id) => api.get(`/analysis/${id}`),
  deleteAnalysis: (id) => api.delete(`/analysis/${id}`),
};

export const threatService = {
  getStats: () => api.get('/threats/stats'),
  checkUrl: (url) => api.post('/threats/check-url', { url }),
  checkIp: (ip) => api.post('/threats/check-ip', { ip }),
};

export const reportService = {
  generateReport: (analysisId) => api.post('/reports/generate', { analysis_id: analysisId }),
  getReports: (page = 1, limit = 10) => api.get(`/reports?page=${page}&limit=${limit}`),
  downloadReport: (reportId) => api.get(`/reports/${reportId}/pdf`, { responseType: 'blob' }),
};

export const toolsService = {
  sslCheck: (domain) => api.post('/tools/ssl-check', { domain }),
  dnsLookup: (domain) => api.post('/tools/dns-lookup', { domain }),
  expandLink: (url) => api.post('/tools/expand-link', { url }),
  whoisLookup: (domain) => api.post('/tools/whois', { domain }),
  passwordCheck: (password) => api.post('/tools/password-check', { password }),
};
