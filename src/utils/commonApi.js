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


export const commonService = {
    // Get all projects
    async getHomeBanner() {
        try {
            const response = await apiClient.get('/api/v1/banner');
            return response.data;
        } catch (error) {
            console.log('Error fetching banner:', error);
            throw error;
        }
    },
    async getTermsAndConditions() {
        try {
            const response = await apiClient.get('/api/v1/terms-conditions');
            return response.data;
        } catch (error) {
            console.log('Error fetching terms-conditions:', error);
            throw error;
        }
    },
    async getPrivacyPolicy() {
        try {
            const response = await apiClient.get('/api/v1/privacy-policy');
            return response.data;
        } catch (error) {
            console.log('Error fetching privacy-policy:', error);
            throw error;
        }
    },
    async getCookiePolicy() {
        try {
            const response = await apiClient.get('/api/v1/cookie-policy');
            return response.data;
        } catch (error) {
            console.log('Error fetching privacy-policy:', error);
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
