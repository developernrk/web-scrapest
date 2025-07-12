
import React, { useState, useEffect } from 'react';
import ResultTabs from './ResultTabs';
import ResultContent from './ResultContent';
import LoadingSpinner from './LoadingSpinner';
import { AnalysisResult } from '../types';
import { getCachedResults, saveResultsToCache, getActiveTab, saveActiveTab, checkCachedResults } from '../utils/cache';

// Mock data for development mode
const mockData: AnalysisResult = {
  pageInfo: {
    title: "Development Mode - Web Pulse",
    url: "http://localhost:9000",
    domain: "localhost",
    protocol: "http:",
    path: "/",
  },
  seoData: {
    metaDescription: "This is a mock result for development",
    metaKeywords: "web, analysis, development, testing",
    h1Tags: 2,
    h2Tags: 5,
    h3Tags: 8,
    canonicalUrl: "http://localhost:9000",
    robotsTxt: "index, follow",
    titleLength: 35,
    metaViewport: "width=device-width, initial-scale=1",
    langAttribute: "en",
    internalLinks: 12,
    externalLinks: 5,
    imageCount: 8,
    imagesWithAlt: 6,
    structuredData: true,
    pageTitleKeywordMatch: true,
    urlLength: 22,
    urlHasKeywords: true,
    hasAmpLink: false,
    hasSitemap: true,
    hasTextHtml: true,
    hasSchema: true,
    hasOpenGraph: true,
    hasTwitterCards: true,
    ogTags: {
      "title": "Development Mode - Web Pulse",
      "description": "This is a mock result for development",
      "image": "https://example.com/image.jpg",
      "url": "http://localhost:9000"
    },
    twitterTags: {
      "card": "summary",
      "title": "Development Mode - Web Pulse",
      "description": "This is a mock result for development"
    },
    hreflangTags: {
      "en": "http://localhost:9000/en",
      "fr": "http://localhost:9000/fr"
    },
    headingStructure: [
      { level: 1, text: "Main Heading" },
      { level: 2, text: "Subheading 1" },
      { level: 2, text: "Subheading 2" },
      { level: 3, text: "Section 1" },
      { level: 3, text: "Section 2" }
    ]
  },
  performanceData: {
    domNodes: 120,
    images: 5,
    scripts: 8,
    stylesheets: 3,
    iframes: 0,
    totalResourceSize: 0,
  },
  technologies: [
    { name: "React", category: "javascript-framework", icon: "https://cdn.worldvectorlogo.com/logos/react-2.svg" },
    { name: "TypeScript", category: "javascript-library", icon: "https://cdn.worldvectorlogo.com/logos/typescript.svg" },
    { name: "Webpack", category: "javascript-library", icon: "https://cdn.worldvectorlogo.com/logos/webpack-icon.svg" },
    { name: "Tailwind CSS", category: "css-framework", icon: "https://cdn.worldvectorlogo.com/logos/tailwind-css-2.svg" }
  ],
  technologyCategories: {
    'javascript-framework': [
      { name: "React", category: "javascript-framework", icon: "https://cdn.worldvectorlogo.com/logos/react-2.svg" }
    ],
    'javascript-library': [
      { name: "TypeScript", category: "javascript-library", icon: "https://cdn.worldvectorlogo.com/logos/typescript.svg" },
      { name: "Webpack", category: "javascript-library", icon: "https://cdn.worldvectorlogo.com/logos/webpack-icon.svg" }
    ],
    'css-framework': [
      { name: "Tailwind CSS", category: "css-framework", icon: "https://cdn.worldvectorlogo.com/logos/tailwind-css-2.svg" }
    ],
    'ui-framework': [],
    'analytics': [],
    'marketing': [],
    'cms': [],
    'ecommerce': [],
    'payment': [],
    'hosting': [],
    'cdn': [],
    'search': [],
    'security': [],
    'database': [],
    'backend': [],
    'server': [],
    'font': [],
    'map': [],
    'accessibility': [],
    'other': []
  },
  accessibilityData: {
    imagesWithoutAlt: 2,
    formInputsWithoutLabels: 1,
    lowContrastElements: 0,
  },
  timestamp: new Date().toISOString(),
};



const App: React.FC = () => {
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isDev, setIsDev] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>(getActiveTab());

  useEffect(() => {
    // Check if we're in development mode (Chrome API not available)
    if (typeof chrome === 'undefined' || !chrome.tabs) {
      setIsDev(true);
      // In development mode, use mock data immediately
      setIsLoading(true);
      setTimeout(() => {
        setResult(mockData);
        setIsLoading(false);
      }, 1000);
    } else {
      // Check if we have cached results
      const cachedData = getCachedResults();

      if (cachedData) {
        // Use cached results
        setResult(cachedData.data);
        setIsLoading(false);
      } else {
        // No cached results, analyze the website
        setIsLoading(true);
        analyzeWebsite();
      }
    }
  }, []);

  // Save active tab when it changes
  useEffect(() => {
    saveActiveTab(activeTab);
  }, [activeTab]);

  const analyzeWebsite = () => {
    setIsLoading(true);
    setError(null);

    if (isDev) {
      // In development mode, use mock data
      setTimeout(() => {
        setResult(mockData);
        setIsLoading(false);
        // Save to cache
        saveResultsToCache('http://localhost:9000', mockData);
      }, 1000);
      return;
    }

    // Production mode with Chrome API
    try {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (!tabs[0]?.id) {
          setError("No active tab found");
          setIsLoading(false);
          return;
        }

        // Check if we have cached results for this URL
        if (tabs[0]?.url) {
          const cachedData = checkCachedResults(tabs[0].url);
          if (cachedData) {
            setResult(cachedData.data);
            setIsLoading(false);
            return;
          }
        }

        // Send message to content script to analyze the page
        chrome.tabs.sendMessage(
          tabs[0].id,
          { action: 'analyze' },
          (response) => {
            if (chrome.runtime.lastError) {
              setError(chrome.runtime.lastError.message || "Failed to analyze page");
              setIsLoading(false);
              return;
            }

            if (!response || !response.success) {
              setError(response?.error || "Failed to analyze page");
            } else {
              setResult(response.data);
              // Save results to cache
              if (tabs[0]?.url) {
                saveResultsToCache(tabs[0].url, response.data);
              }
            }
            setIsLoading(false);
          }
        );
      });
    } catch (err) {
      setError("An error occurred while analyzing the website");
      setIsLoading(false);
      console.error(err);
    }
  };

  return (
    <div className="w-[800px] bg-background-dark shadow-xl rounded-b-lg overflow-hidden flex flex-col">
      <div className="bg-primary bg-gradient-to-r from-primary to-primary-700 p-5 text-white">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-bold flex items-center">
            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Webscrapest
          </h2>
          <div className="flex items-center space-x-2">
            {isDev && (
              <span className="bg-yellow-400 text-yellow-900 text-xs px-2 py-1 rounded-full font-medium">
                Dev Mode
              </span>
            )}
            <button
              onClick={analyzeWebsite}
              disabled={isLoading}
              className="bg-white/20 hover:bg-white/30 text-white p-1.5 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Refresh analysis"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
        </div>
        <p className="text-primary-100 text-sm">Analyze website performance, SEO, and tech stack</p>
        <p className="text-primary-100/70 text-xs mt-1">Developed by nrk navin</p>
      </div>

      <div className="p-5 flex-1 overflow-y-auto custom-scrollbar">
        {isLoading && (
          <div className="flex items-center justify-center py-3 mb-4 bg-background rounded-lg">
            <LoadingSpinner size="sm" className="mr-2" />
            <span className="text-sm font-medium text-text">Analyzing website...</span>
          </div>
        )}

        {error && (
          <div className="bg-error-light/20 border border-error-light text-error p-4 rounded-lg mb-4">
            <div className="flex items-center mb-3">
              <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm font-medium">{error}</span>
            </div>
            <button
              onClick={analyzeWebsite}
              className="w-full py-2 px-3 bg-white text-error border border-error rounded-md text-sm font-medium hover:bg-error-light/10 transition-colors"
            >
              <span className="flex items-center justify-center">
                <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Try Again
              </span>
            </button>
          </div>
        )}

        {!result && !isLoading && !error && (
          <div className="text-center py-10">
            <div className="bg-primary-50 inline-flex rounded-full p-3 mb-4">
              <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-text mb-2">Preparing Analysis</h3>
            <p className="text-text-light text-sm max-w-xs mx-auto">
              We're getting ready to analyze this website. Please wait a moment.
            </p>
          </div>
        )}

        {isLoading && !result && (
          <div className="text-center py-10">
            <LoadingSpinner size="lg" className="mb-4" />
            <h3 className="text-lg font-medium text-text mb-2">Analyzing website...</h3>
            <p className="text-text-light text-sm max-w-xs mx-auto">
              We're collecting data about this website. This will only take a moment.
            </p>
          </div>
        )}
      </div>

      {result && (
        <div className="bg-white shadow-sm rounded-lg mx-5 mb-5 overflow-hidden">
          <ResultTabs activeTab={activeTab} setActiveTab={setActiveTab} />
          <ResultContent result={result} activeTab={activeTab} />
        </div>
      )}
    </div>
  );
};

export default App;
