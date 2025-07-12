import { AnalysisResult } from '../types';

// Cache expiration time in milliseconds (5 minutes)
export const CACHE_EXPIRATION = 5 * 60 * 1000;

// Interface for cached data
export interface CachedData {
  timestamp: number;
  url: string;
  data: AnalysisResult;
}

// Function to get cached results
export const getCachedResults = (): CachedData | null => {
  try {
    // In development mode, we know the URL
    if (typeof chrome === 'undefined' || !chrome.tabs) {
      const currentUrl = 'http://localhost:9000';
      
      // Get cached data from localStorage
      const cachedDataStr = localStorage.getItem('webscrapestResults');
      if (!cachedDataStr) return null;
      
      const cachedData: CachedData = JSON.parse(cachedDataStr);
      
      // Check if cache is expired
      const now = Date.now();
      if (now - cachedData.timestamp > CACHE_EXPIRATION) {
        // Cache expired
        localStorage.removeItem('webscrapestResults');
        return null;
      }
      
      // Check if URL matches
      if (cachedData.url !== currentUrl) {
        return null;
      }
      
      return cachedData;
    } else {
      // In Chrome extension, we can't get the URL synchronously
      // We'll return null and handle caching in the analyzeWebsite function
      return null;
    }
  } catch (error) {
    console.error('Error getting cached results:', error);
    return null;
  }
};

// Function to save results to cache
export const saveResultsToCache = (url: string, data: AnalysisResult): void => {
  try {
    const cachedData: CachedData = {
      timestamp: Date.now(),
      url,
      data
    };
    localStorage.setItem('webscrapestResults', JSON.stringify(cachedData));
  } catch (error) {
    console.error('Error saving results to cache:', error);
  }
};

// Function to check if there are cached results for a specific URL
export const checkCachedResults = (url: string): CachedData | null => {
  try {
    // Get cached data from localStorage
    const cachedDataStr = localStorage.getItem('webscrapestResults');
    if (!cachedDataStr) return null;
    
    const cachedData: CachedData = JSON.parse(cachedDataStr);
    
    // Check if cache is expired
    const now = Date.now();
    if (now - cachedData.timestamp > CACHE_EXPIRATION) {
      // Cache expired
      localStorage.removeItem('webscrapestResults');
      return null;
    }
    
    // Check if URL matches
    if (cachedData.url !== url) {
      return null;
    }
    
    return cachedData;
  } catch (error) {
    console.error('Error checking cached results:', error);
    return null;
  }
};

// Function to save active tab
export const saveActiveTab = (tab: string): void => {
  try {
    localStorage.setItem('webscrapestActiveTab', tab);
  } catch (error) {
    console.error('Error saving active tab:', error);
  }
};

// Function to get active tab
export const getActiveTab = (): string => {
  try {
    const savedTab = localStorage.getItem('webscrapestActiveTab');
    return savedTab || 'overview';
  } catch (error) {
    console.error('Error getting active tab:', error);
    return 'overview';
  }
};