export interface HeadingStructure {
  level: number;
  text: string;
}

export interface ThirdPartyScript {
  domain: string;
  url: string;
  async: boolean;
  defer: boolean;
}

export interface Technology {
  name: string;
  category: TechnologyCategory;
  icon?: string;
  version?: string;
  description?: string;
  website?: string;
}

export type TechnologyCategory =
  | 'javascript-framework'
  | 'ui-framework'
  | 'javascript-library'
  | 'css-framework'
  | 'analytics'
  | 'marketing'
  | 'cms'
  | 'ecommerce'
  | 'payment'
  | 'hosting'
  | 'cdn'
  | 'search'
  | 'security'
  | 'database'
  | 'backend'
  | 'server'
  | 'font'
  | 'map'
  | 'accessibility'
  | 'other';

export interface TechnologyCategories {
  'javascript-framework': Technology[];
  'ui-framework': Technology[];
  'javascript-library': Technology[];
  'css-framework': Technology[];
  'analytics': Technology[];
  'marketing': Technology[];
  'cms': Technology[];
  'ecommerce': Technology[];
  'payment': Technology[];
  'hosting': Technology[];
  'cdn': Technology[];
  'search': Technology[];
  'security': Technology[];
  'database': Technology[];
  'backend': Technology[];
  'server': Technology[];
  'font': Technology[];
  'map': Technology[];
  'accessibility': Technology[];
  'other': Technology[];
}

export interface ResourceMetrics {
  total: number;
  js: number;
  css: number;
  img: number;
  font: number;
  other: number;
}

export interface ConnectionInfo {
  type: string;
  downlink: number;
  rtt: number;
  saveData: boolean;
}

export interface CacheStatus {
  cached: number;
  notCached: number;
}

export interface PerformanceMetrics {
  pageLoadTime: number;
  domContentLoaded: number;
  firstPaint: number;
  firstContentfulPaint: number;
  resourceLoadTimes: ResourceMetrics;
  resourceCounts: ResourceMetrics;
  resourceSizes: ResourceMetrics;
  cacheStatus: CacheStatus;
  connectionInfo: ConnectionInfo;
}

export interface AnalysisResult {
  pageInfo: {
    title: string;
    url: string;
    domain: string;
    protocol: string;
    path: string;
    favicon?: string;
  };
  seoData: {
    metaDescription: string;
    metaKeywords: string;
    h1Tags: number;
    h2Tags: number;
    h3Tags: number;
    canonicalUrl: string;
    robotsTxt: string;
    ogTags?: Record<string, string>;
    twitterTags?: Record<string, string>;
    headingStructure?: HeadingStructure[];
    titleLength?: number;
    metaViewport?: string;
    langAttribute?: string;
    internalLinks?: number;
    externalLinks?: number;
    imageCount?: number;
    imagesWithAlt?: number;
    structuredData?: boolean;
    hreflangTags?: Record<string, string>;
    pageTitleKeywordMatch?: boolean;
    urlLength?: number;
    urlHasKeywords?: boolean;
    hasAmpLink?: boolean;
    hasSitemap?: boolean;
    hasTextHtml?: boolean;
    hasSchema?: boolean;
    hasOpenGraph?: boolean;
    hasTwitterCards?: boolean;
    authorInfo?: string;
    publisherInfo?: string;
    articlePublishedTime?: string;
    articleModifiedTime?: string;
    contentType?: string;
    keywordDensity?: Record<string, number>;
    readabilityScore?: number;
    wordCount?: number;
    textToHtmlRatio?: number;
    pageSpeed?: {
      score?: number;
      firstContentfulPaint?: number;
      largestContentfulPaint?: number;
    };
    securityHeaders?: Record<string, boolean>;
  };
  performanceData: {
    domNodes: number;
    images: number;
    scripts: number;
    stylesheets: number;
    iframes: number;
    totalResourceSize: number;
    lazyLoadedImages?: number;
    fontResources?: number;
    thirdPartyScripts?: ThirdPartyScript[];
    // New performance metrics
    pageLoadTime?: number;
    domContentLoaded?: number;
    firstPaint?: number;
    firstContentfulPaint?: number;
    resourceLoadTimes?: ResourceMetrics;
    resourceCounts?: ResourceMetrics;
    resourceSizes?: ResourceMetrics;
    cacheStatus?: CacheStatus;
    connectionInfo?: ConnectionInfo;
  };
  technologies: Technology[];
  technologyCategories?: TechnologyCategories;
  accessibilityData: {
    imagesWithoutAlt: number;
    formInputsWithoutLabels: number;
    lowContrastElements: number;
    ariaAttributes?: number;
    skipLinks?: number;
    languageSpecified?: boolean;
  };
  timestamp: string;
}