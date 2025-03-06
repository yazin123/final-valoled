// utils/api.js
import axios from 'axios';

// Base URL for your backend
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;


// Create axios instance
const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Project-related API methods
export const projectService = {
  // Get all projects
  async getAllProjects() {
    try {
      const response = await apiClient.get('/api/v1/project/all');
      return response.data;
    } catch (error) {
      console.log('Error fetching projects:', error);
      throw error;
    }
  },
  async getProjectById(id) {
    try {
      const response = await apiClient.get(`/api/v1/project/${id}`);
      return response.data;
    } catch (error) {
      console.log('Error fetching projects:', error);
      throw error;
    }
  },

};
export const productService = {
    // Get all projects
    async getAllproducts() {
      try {
        const response = await apiClient.get('/api/v1/product/all');
        return response.data;
      } catch (error) {
        console.log('Error fetching products:', error);
        throw error;
      }
    },
    async getProductById(id) {
      try {
        const response = await apiClient.get(`/api/v1/product/${id}`);
        return response.data;
      } catch (error) {
        console.log('Error fetching products:', error);
        throw error;
      }
    },
    async getProductTypes() {
        try {
          const response = await apiClient.get(`/api/v1/product-types`);
          return response.data;
        } catch (error) {
          console.log('Error fetching products type:', error);
          throw error;
        }
      },
      async getProductByType(type) {
        try {
          const response = await apiClient.get(`/api/v1/product-types/${type}`);
          return response.data;
        } catch (error) {
          console.log('Error fetching products by type:', error);
          throw error;
        }
      },
      async getProductsCategory() {
        try {
          const response = await apiClient.get(`/api/v1/product-categories`);
          return response.data;
        } catch (error) {
          console.log('Error fetching products categories:', error);
          throw error;
        }
      },
      async getProductByCategory(category) {
        try {
          const response = await apiClient.get(`/api/v1/product-categories/${category}`);
          return response.data;
        } catch (error) {
          console.log('Error fetching products by categories:', error);
          throw error;
        }
      },
      
      async getProductsGroups() {
        try {
          const response = await apiClient.get(`/api/v1/product-groups`);
          return response.data;
        } catch (error) {
          console.log('Error fetching products groups:', error);
          throw error;
        }
      },
      async getProductByGroups(groups) {
        try {
          const response = await apiClient.get(`/api/v1/product-groups/${groups}`);
          return response.data;
        } catch (error) {
          console.log('Error fetching products by groups:', error);
          throw error;
        }
      },
      
      async getProductsproductspecifications() {
        try {
          const response = await apiClient.get(`/api/v1/product-specifications`);
          return response.data;
        } catch (error) {
          console.log('Error fetching products product specifications:', error);
          throw error;
        }
      },
      async getProductByproductspecifications(productspecifications) {
        try {
          const response = await apiClient.get(`/api/v1/product-specifications/${productspecifications}`);
          return response.data;
        } catch (error) {
          console.log('Error fetching products by product specifications:', error);
          throw error;
        }
      },
  
  };
// Generic error handler
export const handleApiError = (error) => {
  if (error.response) {
    // The request was made and the server responded with a status code
    console.log('Data:', error.response.data);
    console.log('Status:', error.response.status);
    console.log('Headers:', error.response.headers);
  } else if (error.request) {
    // The request was made but no response was received
    console.log('No response received:', error.request);
  } else {
    // Something happened in setting up the request
    console.log('Error:', error.message);
  }
  throw error;
};
