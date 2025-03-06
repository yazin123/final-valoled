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


export const projectService = {
    // Get all projects
    async getAllprojects() {
      try {
        const response = await apiClient.get('/api/v1/project/all');
        return response.data;
      } catch (error) {
        console.log('Error fetching projects:', error);
        throw error;
      }
    },
    async getprojectById(id) {
      try {
        const response = await apiClient.get(`/api/v1/project/${id}`);
        return response.data;
      } catch (error) {
        console.log('Error fetching projects:', error);
        throw error;
      }
    },

      async getprojectsCategory() {
        try {
          const response = await apiClient.get(`/api/v1/project-categories`);
          return response.data;
        } catch (error) {
          console.log('Error fetching projects categories:', error);
          throw error;
        }
      },
      async getprojectByCategory(category) {
        try {
          const response = await apiClient.get(`/api/v1/project-categories/${category}`);
          return response.data;
        } catch (error) {
          console.log('Error fetching projects by categories:', error);
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
