//src/lib/api-client.js
import axios from 'axios';

// Logger configuration
const logger = {
  debug: (message, data) => console.debug(`[API Client] ${message}`, data || ''),
  info: (message, data) => console.info(`[API Client] ${message}`, data || ''),
  warn: (message, data) => console.warn(`[API Client] ${message}`, data || ''),
  error: (message, error) => console.log(`[API Client] ${message}`, error || '')
};

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// API request tracking
const pendingRequests = new Set();
const trackRequest = (config) => {
  const requestId = Math.random().toString(36).substring(7);
  config.requestId = requestId;
  pendingRequests.add(requestId);
  return config;
};

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 second timeout
});

// Request interceptor for adding auth token and logging
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    config = trackRequest(config);

    logger.info(`Request started: ${config.method?.toUpperCase()} ${config.url}`, {
      requestId: config.requestId,
      headers: config.headers,
      data: config.data
    });

    return config;
  },
  (error) => {
    logger.error('Request configuration failed', error);
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors and logging
apiClient.interceptors.response.use(
  (response) => {
    pendingRequests.delete(response.config.requestId);

    logger.info(`Request completed: ${response.config.method?.toUpperCase()} ${response.config.url}`, {
      requestId: response.config.requestId,
      status: response.status,
      data: response.data
    });

    return response.data;
  },
  (error) => {
    if (error.config) {
      pendingRequests.delete(error.config.requestId);
    }

    logger.error(`Request failed: ${error.config?.method?.toUpperCase()} ${error.config?.url}`, {
      requestId: error.config?.requestId,
      status: error.response?.status,
      data: error.response?.data,
      error: error.message
    });

    if (error.response?.status === 401) {
      logger.warn('Authentication token expired or invalid');
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

// Helper to check if there are pending requests
export const hasPendingRequests = () => pendingRequests.size > 0;

// Auth APIs
export const authAPI = {
  login: async (credentials) => {
    try {
      const response = await apiClient.post('/api/v1/auth/login', credentials);
      logger.info('Login successful', { username: credentials.username });
      return response;
    } catch (error) {
      logger.error('Login failed', error);
      throw error;
    }
  },
  changePassword: async (data) => {
    try {
      const response = await apiClient.post('/api/v1/auth/change-password', data);
      logger.info('Password change successful');
      return response;
    } catch (error) {
      logger.error('Password change failed', error);
      throw error;
    }
  },
};


export const companyAPI = {
  getSettings: async () => {
    try {
      const response = await apiClient.get('/api/v1/company-settings');
      console.log("retreieved social medddia data ", response)
      logger.debug('Retrieved company settings');
      return response;
    } catch (error) {
      logger.error('Failed to fetch company settings', error);
      throw error;
    }
  },
};


// Banner APIs with error handling and logging
export const catalogueAPI = {
  getAll: async () => {
    try {
      const response = await apiClient.get('/api/v1/catalogue');
      logger.debug('Retrieved all cataglogue', { count: response.length });
      console.log("banner data fetched ", response)
      return response;
    } catch (error) {
      console.log("error fetching banner ", error)
      logger.error('Failed to fetch catalogue', error);
      throw error;
    }
  },
}
  export const bannerAPI = {
    getAll: async () => {
      try {
        const response = await apiClient.get('/api/v1/banner');
        logger.debug('Retrieved all banners', { count: response.length });
        console.log("banner data fetched ", response)
        return response;
      } catch (error) {
        console.log("error fetching banner ", error)
        logger.error('Failed to fetch banners', error);
        throw error;
      }
    },
  getById: async (id) => {
    try {
      const response = await apiClient.get(`/api/v1/banner/${id}`);
      logger.debug('Retrieved banner', { id });
      return response;
    } catch (error) {
      logger.error('Failed to fetch banner', { id, error });
      throw error;
    }
  },
};

// News APIs with error handling and logging
export const newsAPI = {
  getAll: async () => {
    try {
      const response = await apiClient.get('/api/v1/news');
      logger.debug('Retrieved all news', { count: response.length });
      return response;
    } catch (error) {
      logger.error('Failed to fetch news', error);
      throw error;
    }
  },
  getById: async (id) => {
    try {
      const response = await apiClient.get(`/api/v1/news/${id}`);
      logger.debug('Retrieved news item', { id });
      return response;
    } catch (error) {
      logger.error('Failed to fetch news item', { id, error });
      throw error;
    }
  },
};

// About Us APIs with error handling and logging
export const aboutAPI = {
  getAll: async () => {
    try {
      const response = await apiClient.get('/api/v1/about');
      logger.debug('Retrieved about content', { count: response.length });
      return response;
    } catch (error) {
      logger.error('Failed to fetch about content', error);
      throw error;
    }
  },
  getById: async (id) => {
    try {
      const response = await apiClient.get(`/api/v1/about/${id}`);
      logger.debug('Retrieved about section', { id });
      return response;
    } catch (error) {
      logger.error('Failed to fetch about section', { id, error });
      throw error;
    }
  },
};
export const termsAPI = {
  get: async () => {
    try {
      const response = await apiClient.get('/api/v1/terms-conditions');
      logger.debug('Retrieved terms content', { count: response.length });
      return response;
    } catch (error) {
      logger.error('Failed to fetch terms content', error);
      throw error;
    }
  },

};
export const cookieAPI = {
  get: async () => {
    try {
      const response = await apiClient.get('/api/v1/cookie-policy');
      logger.debug('Retrieved cookie-policy content', { count: response.length });
      return response;
    } catch (error) {
      logger.error('Failed to fetch cookie-policy content', error);
      throw error;
    }
  },

};
export const privacyAPI = {
  get: async () => {
    try {
      const response = await apiClient.get('/api/v1/privacy-policy');
      logger.debug('Retrieved privacy-policy content', { count: response.length });
      return response;
    } catch (error) {
      logger.error('Failed to fetch privacy-policy content', error);
      throw error;
    }
  },

};


// Research & Development APIs with error handling and logging
export const researchAPI = {
  getAll: async () => {
    try {
      const response = await apiClient.get('/api/v1/research-development');
      logger.debug('Retrieved R&D items', { count: response.length });
      return response;
    } catch (error) {
      logger.error('Failed to fetch R&D items', error);
      throw error;
    }
  },
  getById: async (id) => {
    try {
      const response = await apiClient.get(`/api/v1/research-development/${id}`);
      logger.debug('Retrieved R&D item', { id });
      return response;
    } catch (error) {
      logger.error('Failed to fetch R&D item', { id, error });
      throw error;
    }
  },
  getPage: async () => {
    try {
      const response = await apiClient.get('/api/v1/research-development-page');
      logger.debug('Retrieved R&D page content');
      return response;
    } catch (error) {
      logger.error('Failed to fetch R&D page content', error);
      throw error;
    }
  },
};



// Project APIs with error handling and logging


  export const projectAPI = {
    getAll: async (filters) => {
      try {
        const response = await apiClient.post('/api/v1/project/all', filters);
        logger.debug('Retrieved projects', { filters, count: response.length });
        return response;
      } catch (error) {
        logger.error('Failed to fetch projects', { filters, error });
        throw error;
      }
    },
  getById: async (id) => {
    try {
      const response = await apiClient.get(`/api/v1/project/${id}`);
      logger.debug('Retrieved project', { id });
      return response;
    } catch (error) {
      logger.error('Failed to fetch project', { id, error });
      throw error;
    }
  },
  getCategories: async () => {
    try {
      const response = await apiClient.get('/api/v1/project-categories');
      logger.debug('Retrieved project categories', { count: response.length });
      return response;
    } catch (error) {
      logger.error('Failed to fetch project categories', error);
      throw error;
    }
  },
};



// Product APIs with error handling and logging
export const productAPI = {
  searchByName: async (productName) => {
    try {
      const response = await apiClient.get(`/api/v1/product/${encodeURIComponent(productName)}`);
      return response;
    } catch (error) {
      logger.error('Failed to search product by name', error);
      throw error;
    }
  },

  getSpecifications: async () => {
    try {
      const response = await apiClient.get('/api/v1/product-specifications');
      return response;
    } catch (error) {
      logger.error('Failed to fetch specifications', error);
      throw error;
    }
  },
  // Keep existing methods
  getTypes: async () => {
    try {
      const response = await apiClient.get('/api/v1/product-types');
      logger.debug('Retrieved product types', { count: response.length });
      return response;
    } catch (error) {
      logger.error('Failed to fetch product types', error);
      throw error;
    }
  },
  getCategories: async (productTypeId) => {
    try {
      const url = productTypeId 
        ? `/api/v1/product-categories?productTypeId=${productTypeId}` 
        : '/api/v1/product-categories';
      
      const response = await apiClient.get(url);
      logger.debug('Retrieved product categories', { 
        count: response.length, 
        productTypeId 
      });
      return response;
    } catch (error) {
      logger.error('Failed to fetch product categories', { productTypeId, error });
      throw error;
    }
  },
  getGroups: async () => {
    try {
      const response = await apiClient.get('/api/v1/product-groups');
      logger.debug('Retrieved product groups', { count: response.length });
      return response;
    } catch (error) {
      logger.error('Failed to fetch product groups', error);
      throw error;
    }
  },
  getProducts: async (filters) => {
    try {
      console.log("response for filtered =================", filters)
      const response = await apiClient.post('/api/v1/product/all', filters);
      logger.debug('Retrieved products', { filters, count: response.length });
      return response;
    } catch (error) {
      logger.error('Failed to fetch products', { filters, error });
      throw error;
    }
  },
  getById: async (id) => {
    try {
      const response = await apiClient.get(`/api/v1/product/client/${id}`);
      logger.debug('Retrieved product', { id });
      return response;
    } catch (error) {
      logger.error('Failed to fetch product', { id, error });
      throw error;
    }
  },

  // New methods for enhanced functionality
  getShowcaseCategories: async (type) => {
    try {
      const response = await apiClient.get(`/api/v1/product-showcase/${type}`);
      logger.debug('Retrieved showcase categories', { type, count: response.length });
      return response;
    } catch (error) {
      logger.error('Failed to fetch showcase categories', { type, error });
      throw error;
    }
  },

  getFilteredProducts: async (filters) => {
    try {
      const response = await apiClient.post('/api/v1/product/filtered', filters);
      logger.debug('Retrieved filtered products', { filters, count: response.length });
      return response;
    } catch (error) {
      logger.error('Failed to fetch filtered products', { filters, error });
      throw error;
    }
  },

  getApplications: async () => {
    try {
      const response = await apiClient.get('/api/v1/product/applications');
      logger.debug('Retrieved product applications', { count: response.length });
      return response;
    } catch (error) {
      logger.error('Failed to fetch product applications=====', error);
      throw error;
    }
  },

  getNewProducts: async () => {
    try {
      const response = await apiClient.get('/api/v1/product/new');
      logger.debug('Retrieved new products', { count: response.length });
      return response;
    } catch (error) {
      logger.error('Failed to fetch new products', error);
      throw error;
    }
  }
};

export const specificationAPI = {
  getAll: async () => {
    try {
      const response = await apiClient.get('/api/v1/product-specifications');
      logger.debug('Retrieved specifications', { count: response.length });
      return response;
    } catch (error) {
      logger.error('Failed to fetch specifications', error);
      throw error;
    }
  },

  getById: async (id) => {
    try {
      const response = await apiClient.get(`/api/v1/product-specifications/${id}`);
      logger.debug('Retrieved specification', { id });
      return response;
    } catch (error) {
      logger.error('Failed to fetch specification', error);
      throw error;
    }
  },

  getItemValues: async () => {
    try {
      const response = await apiClient.get('/api/v1/specsheet-item-value');
      logger.debug('Retrieved specification item values');
      return response;
    } catch (error) {
      logger.error('Failed to fetch specification item values', error);
      throw error;
    }
  },

  getCategories: async () => {
    try {
      const response = await apiClient.get('/api/v1/specsheet-categories');
      logger.debug('Retrieved specification categories');
      return response;
    } catch (error) {
      logger.error('Failed to fetch specification categories', error);
      throw error;
    }
  }
};

export default apiClient;