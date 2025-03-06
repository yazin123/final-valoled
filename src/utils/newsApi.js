// utils/newsApi.js
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


export const newService = {
    // Get all news
    async getAllnews() {
      try {
        const response = await apiClient.get('/api/v1/news');
        return response.data;
      } catch (error) {
        console.log('Error fetching news:', error);
        throw error;
      }
    },
    async getnewsById(id) {
      try {
        const response = await apiClient.get(`/api/v1/news/${id}`);
        return response.data;
      } catch (error) {
        console.log('Error fetching news:', error);
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
