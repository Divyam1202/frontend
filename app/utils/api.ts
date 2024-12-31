// utils/api.ts
import axios from "axios";

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export const getPortfolios = async () => {
  try {
    const response = await axios.get(`${apiUrl}/portfolio`);
    return response.data;
  } catch (error) {
    console.error("Error fetching portfolios:", error);
    return [];
  }
};

export const createPortfolio = async (portfolioData: any) => {
  try {
    const response = await axios.post(`${apiUrl}/portfolio`, portfolioData);
    return response.data;
  } catch (error) {
    console.error("Error creating portfolio:", error);
    return null;
  }
};

// Add other API methods as needed
export const getAllProfiles = async () => {
  try {
    const response = await axios.get(`${apiUrl}/profile`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
};

export const updateProfile = async (profileData: any) => {
  try {
    const response = await axios.put(`${apiUrl}/profile`, profileData);
    return response.data;
  } catch (error) {
    console.error("Error updating profile:", error);
    throw error;
  }
};
