
/**
 * Web Pulse - Content Script
 *
 * This script is injected into web pages and can access the DOM.
 * It's used to collect information about the page for analysis.
 */

import { Technology, TechnologyCategory, TechnologyCategories, ConnectionInfo, ResourceMetrics, CacheStatus } from './types';

// Listen for messages from the popup or background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'analyze') {
    try {
      const analysisData = analyzeWebsite();
      sendResponse({ success: true, data: analysisData });
    } catch (error) {
      console.error('Analysis error:', error);
      sendResponse({ success: false, error: String(error) });
    }
    return true; // Required for async sendResponse
  }
});

/**
 * Analyzes the current website and collects various metrics
 */
function analyzeWebsite() {
  // Basic page info
  const pageInfo = {
    title: document.title,
    url: ((window as any) as any).location.href,
    domain: ((window as any) as any).location.hostname,
    protocol: ((window as any) as any).location.protocol,
    path: ((window as any) as any).location.pathname,
    favicon: getFaviconUrl(),
  };

  // SEO data
  const allLinks = document.querySelectorAll('a');
  const internalLinks = Array.from(allLinks).filter(link => {
    try {
      const href = link.getAttribute('href');
      if (!href) return false;
      if (href.startsWith('#') || href.startsWith('/')) return true;
      const url = new URL(href, window.location.href);
      return url.hostname === window.location.hostname;
    } catch (e) {
      return false;
    }
  }).length;

  const externalLinks = Array.from(allLinks).filter(link => {
    try {
      const href = link.getAttribute('href');
      if (!href || href.startsWith('#') || href.startsWith('/')) return false;
      const url = new URL(href, window.location.href);
      return url.hostname !== window.location.hostname;
    } catch (e) {
      return false;
    }
  }).length;

  const allImages = document.querySelectorAll('img');
  const imagesWithAlt = Array.from(allImages).filter(img => img.hasAttribute('alt') && img.getAttribute('alt')?.trim() !== '').length;

  const ogData = getOpenGraphData();
  const twitterData = getTwitterCardData();
  const hreflangTags = getHreflangData();

  // Check for structured data
  const hasSchema = document.querySelectorAll('script[type="application/ld+json"]').length > 0;

  // Check for AMP link
  const hasAmpLink = document.querySelector('link[rel="amphtml"]') !== null;

  // Check for sitemap link in robots.txt
  const hasSitemap = document.querySelector('meta[name="robots"]')?.getAttribute('content')?.includes('sitemap') || false;

  // Check for text/html content type
  const hasTextHtml = document.querySelector('meta[http-equiv="Content-Type"][content="text/html"]') !== null;
  const contentType = document.querySelector('meta[http-equiv="Content-Type"]')?.getAttribute('content') || 'Not specified';

  // Get language attribute
  const langAttribute = document.documentElement.getAttribute('lang') || 'Not specified';

  // Get viewport meta tag
  const metaViewport = document.querySelector('meta[name="viewport"]')?.getAttribute('content') || 'Not specified';

  // Get author and publisher information
  const authorInfo = document.querySelector('meta[name="author"]')?.getAttribute('content') ||
                     document.querySelector('meta[property="article:author"]')?.getAttribute('content') ||
                     'Not specified';

  const publisherInfo = document.querySelector('meta[property="article:publisher"]')?.getAttribute('content') ||
                        document.querySelector('meta[property="og:site_name"]')?.getAttribute('content') ||
                        'Not specified';

  // Get article published and modified times
  const articlePublishedTime = document.querySelector('meta[property="article:published_time"]')?.getAttribute('content') ||
                              'Not specified';

  const articleModifiedTime = document.querySelector('meta[property="article:modified_time"]')?.getAttribute('content') ||
                             'Not specified';

  // Calculate text to HTML ratio
  const htmlContent = document.documentElement.innerHTML;
  const textContent = document.body.textContent || '';
  const textToHtmlRatio = Math.round((textContent.length / htmlContent.length) * 100) / 100;

  // Calculate word count
  const wordCount = textContent.split(/\s+/).filter(word => word.length > 0).length;

  // Simple readability score (Flesch-Kincaid) - simplified version
  const sentences = textContent.split(/[.!?]+/).filter(sentence => sentence.trim().length > 0).length;
  const words = wordCount;
  const syllables = estimateSyllables(textContent);
  const readabilityScore = sentences > 0 && words > 0 ?
                          Math.round(206.835 - 1.015 * (words / sentences) - 84.6 * (syllables / words)) : 0;

  // Security headers check (simplified - we can only check meta equivalents)
  const securityHeaders = {
    'Content-Security-Policy': document.querySelector('meta[http-equiv="Content-Security-Policy"]') !== null,
    'X-Frame-Options': document.querySelector('meta[http-equiv="X-Frame-Options"]') !== null,
    'X-XSS-Protection': document.querySelector('meta[http-equiv="X-XSS-Protection"]') !== null,
    'Strict-Transport-Security': false, // Can't check from client side
    'Referrer-Policy': document.querySelector('meta[name="referrer"]') !== null,
  };

  // Check if title contains keywords from meta description or keywords
  const pageTitle = document.title;
  const titleLength = pageTitle.length;
  const metaDescription = document.querySelector('meta[name="description"]')?.getAttribute('content') || '';
  const metaKeywords = document.querySelector('meta[name="keywords"]')?.getAttribute('content') || '';

  // Simple check if title contains any keywords
  const pageTitleKeywordMatch = metaKeywords.split(',').some(keyword =>
    pageTitle.toLowerCase().includes(keyword.toLowerCase().trim())
  ) || metaDescription.split(' ').some(word =>
    word.length > 4 && pageTitle.toLowerCase().includes(word.toLowerCase())
  );

  // URL analysis
  const urlLength = window.location.href.length;
  const urlHasKeywords = metaKeywords.split(',').some(keyword =>
    window.location.href.toLowerCase().includes(keyword.toLowerCase().trim())
  );

  // Calculate keyword density
  const keywordDensity: Record<string, number> = {};
  if (metaKeywords) {
    const keywords = metaKeywords.split(',').map(k => k.trim().toLowerCase()).filter(k => k.length > 0);
    const words = textContent.toLowerCase().split(/\s+/).filter(w => w.length > 0);
    const totalWords = words.length;

    keywords.forEach(keyword => {
      const keywordCount = words.filter(word => word === keyword).length;
      keywordDensity[keyword] = Math.round((keywordCount / totalWords) * 1000) / 10; // Percentage with 1 decimal
    });
  }

  const seoData = {
    metaDescription: metaDescription || 'Not found',
    metaKeywords: metaKeywords || 'Not found',
    h1Tags: document.querySelectorAll('h1').length,
    h2Tags: document.querySelectorAll('h2').length,
    h3Tags: document.querySelectorAll('h3').length,
    canonicalUrl: document.querySelector('link[rel="canonical"]')?.getAttribute('href') || 'Not found',
    robotsTxt: document.querySelector('meta[name="robots"]')?.getAttribute('content') || 'Not specified',
    ogTags: ogData,
    twitterTags: twitterData,
    headingStructure: analyzeHeadingStructure(),
    titleLength: titleLength,
    metaViewport: metaViewport,
    langAttribute: langAttribute,
    internalLinks: internalLinks,
    externalLinks: externalLinks,
    imageCount: allImages.length,
    imagesWithAlt: imagesWithAlt,
    structuredData: hasSchema,
    hreflangTags: hreflangTags,
    pageTitleKeywordMatch: pageTitleKeywordMatch,
    urlLength: urlLength,
    urlHasKeywords: urlHasKeywords,
    hasAmpLink: hasAmpLink,
    hasSitemap: hasSitemap,
    hasTextHtml: hasTextHtml,
    hasSchema: hasSchema,
    hasOpenGraph: Object.keys(ogData).length > 0,
    hasTwitterCards: Object.keys(twitterData).length > 0,
    // New fields
    authorInfo: authorInfo,
    publisherInfo: publisherInfo,
    articlePublishedTime: articlePublishedTime,
    articleModifiedTime: articleModifiedTime,
    contentType: contentType,
    keywordDensity: keywordDensity,
    readabilityScore: readabilityScore,
    wordCount: wordCount,
    textToHtmlRatio: textToHtmlRatio,
    securityHeaders: securityHeaders,
    pageSpeed: {
      score: null, // Can't measure from client side
      firstContentfulPaint: null,
      largestContentfulPaint: null
    }
  };

  // Performance metrics
  const performanceData = {
    domNodes: document.querySelectorAll('*').length,
    images: document.querySelectorAll('img').length,
    scripts: document.querySelectorAll('script').length,
    stylesheets: document.querySelectorAll('link[rel="stylesheet"]').length,
    iframes: document.querySelectorAll('iframe').length,
    totalResourceSize: 0,
    lazyLoadedImages: document.querySelectorAll('img[loading="lazy"]').length,
    fontResources: document.querySelectorAll('link[rel="preload"][as="font"], link[href*=".woff"], link[href*=".ttf"]').length,
    thirdPartyScripts: analyzeThirdPartyScripts(),
    // New performance metrics
    ...collectPerformanceMetrics(),
  };

  // Technology detection
  const techResult = detectTechnologies();

  // Accessibility checks (basic)
  const accessibilityData = {
    imagesWithoutAlt: document.querySelectorAll('img:not([alt])').length,
    formInputsWithoutLabels: document.querySelectorAll('input:not([type="hidden"]):not([aria-label]):not([aria-labelledby])').length,
    lowContrastElements: 0, // Would require more complex analysis
    ariaAttributes: countAriaAttributes(),
    skipLinks: document.querySelectorAll('a[href^="#"]:not([href="#"])').length,
    languageSpecified: !!document.documentElement.getAttribute('lang'),
  };

  return {
    pageInfo,
    seoData,
    performanceData,
    technologies: techResult.technologies,
    technologyCategories: techResult.technologyCategories,
    accessibilityData,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Gets the favicon URL
 */
function getFaviconUrl() {
  // Try to get the favicon from the link tag
  const faviconLink = document.querySelector('link[rel="icon"], link[rel="shortcut icon"]');
  if (faviconLink) {
    const href = faviconLink.getAttribute('href');
    if (href) {
      // Handle relative URLs
      try {
        return new URL(href, (window as any).location.href).href;
      } catch (e) {
        // Invalid URL
      }
    }
  }

  // Default to the standard favicon location
  return `${(window as any).location.protocol}//${(window as any).location.host}/favicon.ico`;
}

/**
 * Gets Open Graph metadata
 */
function getOpenGraphData() {
  const ogTags = document.querySelectorAll('meta[property^="og:"]');
  const ogData: Record<string, string> = {};

  ogTags.forEach(tag => {
    const property = tag.getAttribute('property');
    const content = tag.getAttribute('content');
    if (property && content) {
      ogData[property.replace('og:', '')] = content;
    }
  });

  return ogData;
}

/**
 * Gets Twitter Card metadata
 */
function getTwitterCardData() {
  const twitterTags = document.querySelectorAll('meta[name^="twitter:"]');
  const twitterData: Record<string, string> = {};

  twitterTags.forEach(tag => {
    const name = tag.getAttribute('name');
    const content = tag.getAttribute('content');
    if (name && content) {
      twitterData[name.replace('twitter:', '')] = content;
    }
  });

  return twitterData;
}

/**
 * Gets hreflang metadata for internationalization
 */
function getHreflangData() {
  const hreflangTags = document.querySelectorAll('link[rel="alternate"][hreflang]');
  const hreflangData: Record<string, string> = {};

  hreflangTags.forEach(tag => {
    const hreflang = tag.getAttribute('hreflang');
    const href = tag.getAttribute('href');
    if (hreflang && href) {
      hreflangData[hreflang] = href;
    }
  });

  return hreflangData;
}

/**
 * Analyzes the heading structure of the page
 */
function analyzeHeadingStructure() {
  const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
  const headingStructure = [];

  for (const heading of headings) {
    headingStructure.push({
      level: parseInt(heading.tagName.substring(1)),
      text: heading.textContent?.trim() || '',
    });
  }

  return headingStructure;
}

/**
 * Analyzes third-party scripts
 */
function analyzeThirdPartyScripts() {
  const scripts = document.querySelectorAll('script[src]');
  const thirdPartyScripts = [];
  const currentDomain = (window as any).location.hostname;

  for (const script of scripts) {
    const src = script.getAttribute('src') || '';
    try {
      const scriptUrl = new URL(src, (window as any).location.href);
      const scriptDomain = scriptUrl.hostname;

      if (scriptDomain !== currentDomain) {
        thirdPartyScripts.push({
          domain: scriptDomain,
          url: scriptUrl.href,
          async: script.hasAttribute('async'),
          defer: script.hasAttribute('defer'),
        });
      }
    } catch (e) {
      // Skip invalid URLs
    }
  }

  return thirdPartyScripts;
}

/**
 * Counts ARIA attributes on the page
 */
function countAriaAttributes() {
  const allElements = document.querySelectorAll('*');
  let ariaCount = 0;

  for (const element of allElements) {
    for (const attr of element.attributes) {
      if (attr.name.startsWith('aria-') || attr.name === 'role') {
        ariaCount++;
      }
    }
  }

  return ariaCount;
}

/**
 * Collects detailed performance metrics using the Performance API
 */
function collectPerformanceMetrics() {
  const metrics = {
    pageLoadTime: 0,
    domContentLoaded: 0,
    firstPaint: 0,
    firstContentfulPaint: 0,
    resourceLoadTimes: {
      total: 0,
      js: 0,
      css: 0,
      img: 0,
      font: 0,
      other: 0
    } as ResourceMetrics,
    resourceCounts: {
      total: 0,
      js: 0,
      css: 0,
      img: 0,
      font: 0,
      other: 0
    } as ResourceMetrics,
    resourceSizes: {
      total: 0,
      js: 0,
      css: 0,
      img: 0,
      font: 0,
      other: 0
    } as ResourceMetrics,
    cacheStatus: {
      cached: 0,
      notCached: 0
    } as CacheStatus,
    connectionInfo: {
      type: navigator.connection ? navigator.connection.effectiveType : 'unknown',
      downlink: navigator.connection ? navigator.connection.downlink : 0,
      rtt: navigator.connection ? navigator.connection.rtt : 0,
      saveData: navigator.connection ? navigator.connection.saveData : false
    } as ConnectionInfo
  };

  // Check if Performance API is available
  if (window.performance) {
    try {
      const perfData = window.performance;
      const navStart = perfData.timing ? perfData.timing.navigationStart : 0;

      // Basic timing metrics
      if (perfData.timing) {
        metrics.pageLoadTime = perfData.timing.loadEventEnd - perfData.timing.navigationStart;
        metrics.domContentLoaded = perfData.timing.domContentLoadedEventEnd - perfData.timing.navigationStart;
      }

      // Paint timing metrics
      if (perfData.getEntriesByType) {
        const paintMetrics = perfData.getEntriesByType('paint');
        for (const paint of paintMetrics) {
          if (paint.name === 'first-paint') {
            metrics.firstPaint = Math.round(paint.startTime);
          }
          if (paint.name === 'first-contentful-paint') {
            metrics.firstContentfulPaint = Math.round(paint.startTime);
          }
        }

        // Resource timing metrics
        const resources = perfData.getEntriesByType('resource') as PerformanceResourceTiming[];
        metrics.resourceCounts.total = resources.length;

        for (const resource of resources) {
          const size = resource.encodedBodySize || 0;
          const duration = resource.duration;
          const initiatorType = resource.initiatorType;
          const cachedResource = resource.transferSize === 0 && resource.decodedBodySize > 0;

          metrics.resourceSizes.total += size;
          metrics.resourceLoadTimes.total += duration;

          if (cachedResource) {
            metrics.cacheStatus.cached++;
          } else {
            metrics.cacheStatus.notCached++;
          }

          // Categorize by resource type
          switch (initiatorType) {
            case 'script':
              metrics.resourceCounts.js++;
              metrics.resourceSizes.js += size;
              metrics.resourceLoadTimes.js += duration;
              break;
            case 'css':
            case 'link':
              if (resource.name.includes('.css')) {
                metrics.resourceCounts.css++;
                metrics.resourceSizes.css += size;
                metrics.resourceLoadTimes.css += duration;
              } else if (resource.name.match(/\.(woff|woff2|ttf|otf|eot)/i)) {
                metrics.resourceCounts.font++;
                metrics.resourceSizes.font += size;
                metrics.resourceLoadTimes.font += duration;
              } else {
                metrics.resourceCounts.other++;
                metrics.resourceSizes.other += size;
                metrics.resourceLoadTimes.other += duration;
              }
              break;
            case 'img':
              metrics.resourceCounts.img++;
              metrics.resourceSizes.img += size;
              metrics.resourceLoadTimes.img += duration;
              break;
            case 'font':
              metrics.resourceCounts.font++;
              metrics.resourceSizes.font += size;
              metrics.resourceLoadTimes.font += duration;
              break;
            default:
              metrics.resourceCounts.other++;
              metrics.resourceSizes.other += size;
              metrics.resourceLoadTimes.other += duration;
          }
        }
      }
    } catch (e) {
      console.error('Error collecting performance metrics:', e);
    }
  }

  // Convert byte sizes to KB and round to 2 decimal places
  const resourceSizeKeys: Array<keyof ResourceMetrics> = ['total', 'js', 'css', 'img', 'font', 'other'];
  resourceSizeKeys.forEach(key => {
    metrics.resourceSizes[key] = Math.round(metrics.resourceSizes[key] / 1024 * 100) / 100;
  });

  // Round load times to integers (milliseconds)
  const resourceLoadTimeKeys: Array<keyof ResourceMetrics> = ['total', 'js', 'css', 'img', 'font', 'other'];
  resourceLoadTimeKeys.forEach(key => {
    metrics.resourceLoadTimes[key] = Math.round(metrics.resourceLoadTimes[key]);
  });

  return metrics;
}

/**
 * Estimates the number of syllables in a text
 * This is a simplified algorithm and not 100% accurate
 */
function estimateSyllables(text: string): number {
  // Remove non-alphanumeric characters and convert to lowercase
  const cleanText = text.toLowerCase().replace(/[^a-z0-9 ]/g, '');
  const words = cleanText.split(/\s+/).filter(word => word.length > 0);

  let syllableCount = 0;

  for (const word of words) {
    // Count vowel groups as syllables
    let count = word.match(/[aeiouy]{1,2}/g)?.length || 0;

    // Adjust for common patterns
    if (word.length > 3 && word.endsWith('e')) {
      count--; // Silent e at the end
    }

    if (word.endsWith('le') && word.length > 2 && !['a', 'e', 'i', 'o', 'u', 'y'].includes(word[word.length - 3])) {
      count++; // Words ending in -le with consonant before
    }

    if (word.endsWith('es') || word.endsWith('ed')) {
      count--; // Common endings that don't add syllables
    }

    // Every word has at least one syllable
    syllableCount += Math.max(1, count);
  }

  return syllableCount;
}

/**
 * Detects technologies used on the website with enhanced version detection
 */
function detectTechnologies() {
  const technologies: Technology[] = [];
  // Get all scripts and their content
  const scriptElements = Array.from(document.querySelectorAll('script'));
  const scriptSrcs = scriptElements.map(s => s.src || '').filter(Boolean);

  // Only sample a small portion of inline scripts to avoid performance issues
  const inlineScripts = scriptElements
    .filter(s => !s.src && s.innerHTML)
    .slice(0, 10)
    .map(s => s.innerHTML.substring(0, 500))
    .join(' ');

  const scripts = [...scriptSrcs, inlineScripts];
  const links = Array.from(document.querySelectorAll('link')).map(l => l.href || '');
  const metas = Array.from(document.querySelectorAll('meta')).map(m => m.getAttribute('content') || '');
  const htmlContent = document.documentElement.innerHTML.toLowerCase();
  const allClasses = Array.from(document.querySelectorAll('[class]')).map(el => el.className).join(' ');

  // Helper function to extract version from various sources
  const extractVersion = (patterns: RegExp[], sources: string[]): string | undefined => {
    for (const pattern of patterns) {
      for (const source of sources) {
        const match = source.match(pattern);
        if (match && match[1]) {
          return match[1].trim();
        }
      }
    }
    return undefined;
  };

  // JavaScript frameworks - check both global objects and DOM patterns
  try {
    // React
    if (
      ((window as any).React) ||
      document.querySelector('[data-reactroot], [data-reactid]') ||
      htmlContent.includes('_reactrootcontainer') ||
      scripts.some(s => s.includes('react'))
    ) {
      // Try to detect React version
      let reactVersion: string | undefined;

      if ((window as any).React && (window as any).React.version) {
        reactVersion = (window as any).React.version;
      } else {
        reactVersion = extractVersion(
          [/react@([0-9.]+)/, /react\/([0-9.]+)/, /react[.-]([0-9.]+)/],
          scripts
        );
      }

      technologies.push({
        name: 'React',
        category: 'javascript-framework',
        icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg',
        version: reactVersion,
        description: 'A JavaScript library for building user interfaces',
        website: 'https://reactjs.org/'
      });

      // Check for React-based frameworks
      if ((window as any).__NEXT_DATA__ || scripts.some(s => s.includes('/_next/') || s.includes('next.js'))) {
        const nextVersion = extractVersion(
          [/next@([0-9.]+)/, /next\/([0-9.]+)/, /next[.-]([0-9.]+)/],
          scripts
        );

        technologies.push({
          name: 'Next.js',
          category: 'javascript-framework',
          icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg',
          version: nextVersion,
          description: 'The React framework for production',
          website: 'https://nextjs.org/'
        });
      }

      if (document.querySelector('#__gatsby') || scripts.some(s => s.includes('gatsby'))) {
        const gatsbyVersion = extractVersion(
          [/gatsby@([0-9.]+)/, /gatsby\/([0-9.]+)/, /gatsby[.-]([0-9.]+)/],
          scripts
        );

        technologies.push({
          name: 'Gatsby',
          category: 'javascript-framework',
          icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/gatsby/gatsby-plain.svg',
          version: gatsbyVersion,
          description: 'A React-based open source framework for creating websites and apps',
          website: 'https://www.gatsbyjs.com/'
        });
      }
    }

    // Angular
    if (
      ((window as any).angular) ||
      document.querySelector('[ng-app], [ng-controller], [ng-model], [data-ng-app], [x-ng-app], [ng-version]') ||
      scripts.some(s => s.includes('angular'))
    ) {
      let angularVersion: string | undefined;

      // Try to get Angular version
      const ngVersionEl = document.querySelector('[ng-version]');
      if (ngVersionEl) {
        angularVersion = ngVersionEl.getAttribute('ng-version') || undefined;
      } else if ((window as any).angular && (window as any).angular.version) {
        angularVersion = (window as any).angular.version.full || (window as any).angular.version;
      } else {
        angularVersion = extractVersion(
          [/angular@([0-9.]+)/, /angular\/([0-9.]+)/, /angular[.-]([0-9.]+)/],
          scripts
        );
      }

      technologies.push({
        name: 'Angular',
        category: 'javascript-framework',
        icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angularjs/angularjs-original.svg',
        version: angularVersion,
        description: 'Platform for building mobile and desktop web applications',
        website: 'https://angular.io/'
      });
    }

    // Vue
    if (
      ((window as any).Vue) ||
      document.querySelector('[v-app], [v-bind], [v-model], [v-if], [v-for], [v-cloak], [v-on]') ||
      scripts.some(s => s.includes('vue.js') || s.includes('vue.min.js'))
    ) {
      let vueVersion: string | undefined;

      if ((window as any).Vue && (window as any).Vue.version) {
        vueVersion = (window as any).Vue.version;
      } else {
        vueVersion = extractVersion(
          [/vue@([0-9.]+)/, /vue\/([0-9.]+)/, /vue[.-]([0-9.]+)/],
          scripts
        );
      }

      technologies.push({
        name: 'Vue.js',
        category: 'javascript-framework',
        icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg',
        version: vueVersion,
        description: 'Progressive JavaScript framework for building user interfaces',
        website: 'https://vuejs.org/'
      });

      // Check for Nuxt.js
      if ((window as any).__NUXT__ || scripts.some(s => s.includes('nuxt'))) {
        const nuxtVersion = extractVersion(
          [/nuxt@([0-9.]+)/, /nuxt\/([0-9.]+)/, /nuxt[.-]([0-9.]+)/],
          scripts
        );

        technologies.push({
          name: 'Nuxt.js',
          category: 'javascript-framework',
          icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nuxtjs/nuxtjs-original.svg',
          version: nuxtVersion,
          description: 'The intuitive Vue framework',
          website: 'https://nuxtjs.org/'
        });
      }
    }

    // jQuery
    if (
      ((window as any).jQuery) ||
      ((window as any).$) ||
      scripts.some(s => s.includes('jquery'))
    ) {
      let jqueryVersion: string | undefined;

      if ((window as any).jQuery && (window as any).jQuery.fn && (window as any).jQuery.fn.jquery) {
        jqueryVersion = (window as any).jQuery.fn.jquery;
      } else if ((window as any).$ && (window as any).$.fn && (window as any).$.fn.jquery) {
        jqueryVersion = (window as any).$.fn.jquery;
      } else {
        jqueryVersion = extractVersion(
          [/jquery[.-]([0-9.]+)/, /jquery@([0-9.]+)/, /jquery\/([0-9.]+)/],
          scripts
        );
      }

      technologies.push({
        name: 'jQuery',
        category: 'javascript-library',
        icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jquery/jquery-original.svg',
        version: jqueryVersion,
        description: 'Fast, small, and feature-rich JavaScript library',
        website: 'https://jquery.com/'
      });
    }

    // Svelte
    if (
      document.querySelector('[data-svelte], [class*="svelte-"]') ||
      scripts.some(s => s.includes('svelte'))
    ) {
      const svelteVersion = extractVersion(
        [/svelte@([0-9.]+)/, /svelte\/([0-9.]+)/, /svelte[.-]([0-9.]+)/],
        scripts
      );

      technologies.push({
        name: 'Svelte',
        category: 'javascript-framework',
        icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/svelte/svelte-original.svg',
        version: svelteVersion,
        description: 'Cybernetically enhanced web apps',
        website: 'https://svelte.dev/'
      });
    }

    // Preact
    if (
      scripts.some(s => s.includes('preact')) ||
      htmlContent.includes('preact')
    ) {
      const preactVersion = extractVersion(
        [/preact@([0-9.]+)/, /preact\/([0-9.]+)/, /preact[.-]([0-9.]+)/],
        scripts
      );

      technologies.push({
        name: 'Preact',
        category: 'javascript-framework',
        icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/preact/preact-original.svg',
        version: preactVersion,
        description: 'Fast 3kB alternative to React with the same modern API',
        website: 'https://preactjs.com/'
      });
    }

    // Ember.js
    if (
      ((window as any).Ember) ||
      scripts.some(s => s.includes('ember')) ||
      document.querySelector('.ember-view')
    ) {
      let emberVersion: string | undefined;

      if ((window as any).Ember && (window as any).Ember.VERSION) {
        emberVersion = (window as any).Ember.VERSION;
      } else {
        emberVersion = extractVersion(
          [/ember@([0-9.]+)/, /ember\/([0-9.]+)/, /ember[.-]([0-9.]+)/],
          scripts
        );
      }

      technologies.push({
        name: 'Ember.js',
        category: 'javascript-framework',
        icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/ember/ember-original-wordmark.svg',
        version: emberVersion,
        description: 'A framework for ambitious web developers',
        website: 'https://emberjs.com/'
      });
    }

    // Alpine.js
    if (
      scripts.some(s => s.includes('alpine.js') || s.includes('alpinejs')) ||
      document.querySelector('[x-data], [x-bind], [x-on]')
    ) {
      const alpineVersion = extractVersion(
        [/alpine@([0-9.]+)/, /alpine\/([0-9.]+)/, /alpine[.-]([0-9.]+)/],
        scripts
      );

      technologies.push({
        name: 'Alpine.js',
        category: 'javascript-library',
        icon: 'https://alpinejs.dev/favicon.png',
        version: alpineVersion,
        description: 'A rugged, minimal framework for composing JavaScript behavior in your markup',
        website: 'https://alpinejs.dev/'
      });
    }
  } catch (e) {
    // Ignore errors in framework detection
  }

  // CSS frameworks - check for class patterns and stylesheets
  try {
    // Bootstrap
    if (
      document.querySelector('[class*="navbar-"], [class*="btn-"], [class*="modal-"]') ||
      links.some(l => l.includes('bootstrap')) ||
      scripts.some(s => s.includes('bootstrap'))
    ) {
      let bootstrapVersion: string | undefined;

      // Try to detect Bootstrap version
      if ((window as any).bootstrap && (window as any).bootstrap.Tooltip && (window as any).bootstrap.Tooltip.VERSION) {
        bootstrapVersion = (window as any).bootstrap.Tooltip.VERSION;
      } else if ((window as any).jQuery && (window as any).jQuery.fn && (window as any).jQuery.fn.tooltip && (window as any).jQuery.fn.tooltip.Constructor && (window as any).jQuery.fn.tooltip.Constructor.VERSION) {
        bootstrapVersion = (window as any).jQuery.fn.tooltip.Constructor.VERSION;
      } else {
        bootstrapVersion = extractVersion(
          [/bootstrap@([0-9.]+)/, /bootstrap\/([0-9.]+)/, /bootstrap[.-]([0-9.]+)/],
          [...scripts, ...links]
        );
      }

      technologies.push({
        name: 'Bootstrap',
        category: 'css-framework',
        icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bootstrap/bootstrap-original.svg',
        version: bootstrapVersion,
        description: 'The most popular HTML, CSS, and JavaScript framework for developing responsive, mobile-first websites',
        website: 'https://getbootstrap.com/'
      });
    }

    // Tailwind
    if (
      allClasses.match(/\b(md|lg|xl):[\w-]+\b/) ||
      document.querySelector('[class*="text-"], [class*="bg-"], [class*="border-"], [class*="rounded-"], [class*="flex-"], [class*="grid-"], [class*="p-"], [class*="m-"]') ||
      links.some(l => l.includes('tailwind'))
    ) {
      const tailwindVersion = extractVersion(
        [/tailwindcss@([0-9.]+)/, /tailwindcss\/([0-9.]+)/, /tailwind[.-]([0-9.]+)/],
        [...scripts, ...links]
      );

      technologies.push({
        name: 'Tailwind CSS',
        category: 'css-framework',
        icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-plain.svg',
        version: tailwindVersion,
        description: 'A utility-first CSS framework for rapidly building custom designs',
        website: 'https://tailwindcss.com/'
      });
    }

    // Material Design
    if (
      document.querySelector('.mat-button, .mat-card, .mat-dialog-container, .mdl-button, .mdl-card, .material-icons') ||
      links.some(l => l.includes('material')) ||
      scripts.some(s => s.includes('material'))
    ) {
      const materialVersion = extractVersion(
        [/@material\/([0-9.]+)/, /material@([0-9.]+)/, /material\/([0-9.]+)/],
        [...scripts, ...links]
      );

      technologies.push({
        name: 'Material Design',
        category: 'ui-framework',
        icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/materialui/materialui-original.svg',
        version: materialVersion,
        description: 'A design system by Google that helps teams build high-quality digital experiences',
        website: 'https://material.io/'
      });
    }

    // Bulma
    if (
      document.querySelector('.columns, .column, .hero, .navbar, .button.is-') ||
      links.some(l => l.includes('bulma'))
    ) {
      const bulmaVersion = extractVersion(
        [/bulma@([0-9.]+)/, /bulma\/([0-9.]+)/, /bulma[.-]([0-9.]+)/],
        [...scripts, ...links]
      );

      technologies.push({
        name: 'Bulma',
        category: 'css-framework',
        icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bulma/bulma-plain.svg',
        version: bulmaVersion,
        description: 'Modern CSS framework based on Flexbox',
        website: 'https://bulma.io/'
      });
    }

    // Foundation
    if (
      document.querySelector('.top-bar, .callout, .orbit, .reveal, .switch') ||
      links.some(l => l.includes('foundation'))
    ) {
      const foundationVersion = extractVersion(
        [/foundation@([0-9.]+)/, /foundation\/([0-9.]+)/, /foundation[.-]([0-9.]+)/],
        [...scripts, ...links]
      );

      technologies.push({
        name: 'Foundation',
        category: 'css-framework',
        icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/foundation/foundation-original.svg',
        version: foundationVersion,
        description: 'The most advanced responsive front-end framework in the world',
        website: 'https://get.foundation/'
      });
    }

    // Chakra UI
    if (
      document.querySelector('[class*="chakra-"]') ||
      scripts.some(s => s.includes('chakra'))
    ) {
      const chakraVersion = extractVersion(
        [/chakra@([0-9.]+)/, /chakra\/([0-9.]+)/, /chakra[.-]([0-9.]+)/],
        scripts
      );

      technologies.push({
        name: 'Chakra UI',
        category: 'ui-framework',
        icon: 'https://raw.githubusercontent.com/chakra-ui/chakra-ui/main/logo/logomark-colored.svg',
        version: chakraVersion,
        description: 'Simple, modular and accessible component library for React applications',
        website: 'https://chakra-ui.com/'
      });
    }

    // Ant Design
    if (
      document.querySelector('.ant-btn, .ant-input, .ant-select, .ant-layout') ||
      scripts.some(s => s.includes('antd'))
    ) {
      const antdVersion = extractVersion(
        [/antd@([0-9.]+)/, /antd\/([0-9.]+)/, /antd[.-]([0-9.]+)/],
        scripts
      );

      technologies.push({
        name: 'Ant Design',
        category: 'ui-framework',
        icon: 'https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg',
        version: antdVersion,
        description: 'A design system for enterprise-level products',
        website: 'https://ant.design/'
      });
    }

    // Semantic UI
    if (
      document.querySelector('.ui.button, .ui.menu, .ui.grid, .ui.header') ||
      scripts.some(s => s.includes('semantic-ui'))
    ) {
      const semanticVersion = extractVersion(
        [/semantic-ui@([0-9.]+)/, /semantic-ui\/([0-9.]+)/, /semantic-ui[.-]([0-9.]+)/],
        [...scripts, ...links]
      );

      technologies.push({
        name: 'Semantic UI',
        category: 'ui-framework',
        icon: 'https://semantic-ui.com/images/logo.png',
        version: semanticVersion,
        description: 'User interface is the language of the web',
        website: 'https://semantic-ui.com/'
      });
    }
  } catch (e) {
    // Ignore errors in CSS framework detection
  }

  // Analytics and marketing
  try {
    // Google Analytics
    if (
      ((window as any).ga) ||
      ((window as any).gtag) ||
      ((window as any).dataLayer) ||
      ((window as any).google_tag_manager) ||
      scripts.some(s => s.includes('google-analytics.com') || s.includes('googletagmanager'))
    ) {
      let gaVersion = 'Universal Analytics';

      if ((window as any).gtag) {
        gaVersion = 'Google Analytics 4';
      }

      technologies.push({
        name: 'Google Analytics',
        category: 'analytics',
        icon: 'https://www.google.com/analytics/images/ga_icon_256.png',
        version: gaVersion,
        description: 'Web analytics service offered by Google',
        website: 'https://analytics.google.com/'
      });
    }

    // Facebook Pixel
    if (
      ((window as any).fbq) ||
      scripts.some(s => s.includes('connect.facebook.net') || s.includes('facebook-pixel'))
    ) {
      technologies.push({
        name: 'Facebook Pixel',
        category: 'marketing',
        icon: 'https://static.xx.fbcdn.net/rsrc.php/v3/y8/r/R_1BAhxMP5I.png',
        description: 'Analytics tool that allows you to measure the effectiveness of your advertising',
        website: 'https://www.facebook.com/business/tools/meta-pixel'
      });
    }

    // HubSpot
    if (
      ((window as any)._hsq) ||
      scripts.some(s => s.includes('js.hs-scripts.com') || s.includes('hubspot'))
    ) {
      technologies.push({
        name: 'HubSpot',
        category: 'marketing',
        icon: 'https://cdn.worldvectorlogo.com/logos/hubspot-1.svg',
        description: 'CRM platform with marketing, sales, service, and operations software',
        website: 'https://www.hubspot.com/'
      });
    }

    // Hotjar
    if (
      ((window as any).hj) ||
      scripts.some(s => s.includes('static.hotjar.com'))
    ) {
      technologies.push({
        name: 'Hotjar',
        category: 'analytics',
        icon: 'https://www.hotjar.com/images/hotjar-icon-180.png',
        description: 'Behavior analytics and user feedback data',
        website: 'https://www.hotjar.com/'
      });
    }

    // Mixpanel
    if (
      ((window as any).mixpanel) ||
      scripts.some(s => s.includes('mixpanel'))
    ) {
      technologies.push({
        name: 'Mixpanel',
        category: 'analytics',
        icon: 'https://cdn.worldvectorlogo.com/logos/mixpanel.svg',
        description: 'Product analytics for mobile, web, and beyond',
        website: 'https://mixpanel.com/'
      });
    }

    // Amplitude
    if (
      ((window as any).amplitude) ||
      scripts.some(s => s.includes('amplitude'))
    ) {
      technologies.push({
        name: 'Amplitude',
        category: 'analytics',
        icon: 'https://cdn.worldvectorlogo.com/logos/amplitude-1.svg',
        description: 'Product analytics platform',
        website: 'https://amplitude.com/'
      });
    }

    // Plausible
    if (
      scripts.some(s => s.includes('plausible.io'))
    ) {
      technologies.push({
        name: 'Plausible',
        category: 'analytics',
        icon: 'https://plausible.io/images/icon/favicon.svg',
        description: 'Simple, privacy-friendly alternative to Google Analytics',
        website: 'https://plausible.io/'
      });
    }

    // Fathom
    if (
      scripts.some(s => s.includes('fathom.'))
    ) {
      technologies.push({
        name: 'Fathom',
        category: 'analytics',
        icon: 'https://usefathom.com/assets/favicon.svg',
        description: 'Simple, privacy-focused website analytics',
        website: 'https://usefathom.com/'
      });
    }
  } catch (e) {
    // Ignore errors in analytics detection
  }

  // CMS detection
  try {
    // WordPress
    if (
      document.querySelector('link[href*="wp-content"], link[href*="wp-includes"], img[src*="wp-content"], [class*="wp-"]') ||
      metas.some(m => m && m.includes('WordPress')) ||
      scripts.some(s => s.includes('wp-content') || s.includes('wp-includes'))
    ) {
      // Try to detect WordPress version
      let wpVersion: string | undefined;

      // Look for version in meta tags
      const wpVersionMeta = document.querySelector('meta[name="generator"][content*="WordPress"]');
      if (wpVersionMeta) {
        const content = wpVersionMeta.getAttribute('content');
        if (content) {
          const match = content.match(/WordPress ([0-9.]+)/);
          if (match && match[1]) {
            wpVersion = match[1];
          }
        }
      }

      technologies.push({
        name: 'WordPress',
        category: 'cms',
        icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/wordpress/wordpress-plain.svg',
        version: wpVersion,
        description: 'Open source software you can use to create a beautiful website or blog',
        website: 'https://wordpress.org/'
      });

      // WooCommerce (WordPress e-commerce)
      if (
        document.querySelector('.woocommerce, [class*="woocommerce-"]') ||
        scripts.some(s => s.includes('woocommerce'))
      ) {
        // Try to detect WooCommerce version
        let wooVersion: string | undefined;

        const wooVersionMeta = document.querySelector('meta[name="generator"][content*="WooCommerce"]');
        if (wooVersionMeta) {
          const content = wooVersionMeta.getAttribute('content');
          if (content) {
            const match = content.match(/WooCommerce ([0-9.]+)/);
            if (match && match[1]) {
              wooVersion = match[1];
            }
          }
        }

        technologies.push({
          name: 'WooCommerce',
          category: 'ecommerce',
          icon: 'https://cdn.worldvectorlogo.com/logos/woocommerce.svg',
          version: wooVersion,
          description: 'Customizable, open-source eCommerce platform built on WordPress',
          website: 'https://woocommerce.com/'
        });
      }
    }

    // Drupal
    if (
      document.querySelector('[class*="drupal-"]') ||
      metas.some(m => m && m.includes('Drupal')) ||
      scripts.some(s => s.includes('drupal'))
    ) {
      // Try to detect Drupal version
      let drupalVersion: string | undefined;

      if ((window as any).Drupal && (window as any).Drupal.version) {
        drupalVersion = (window as any).Drupal.version;
      } else {
        const drupalVersionMeta = document.querySelector('meta[name="generator"][content*="Drupal"]');
        if (drupalVersionMeta) {
          const content = drupalVersionMeta.getAttribute('content');
          if (content) {
            const match = content.match(/Drupal ([0-9.]+)/);
            if (match && match[1]) {
              drupalVersion = match[1];
            }
          }
        }
      }

      technologies.push({
        name: 'Drupal',
        category: 'cms',
        icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/drupal/drupal-original.svg',
        version: drupalVersion,
        description: 'Open source content management platform',
        website: 'https://www.drupal.org/'
      });
    }

    // Joomla
    if (
      metas.some(m => m && m.includes('Joomla')) ||
      scripts.some(s => s.includes('joomla'))
    ) {
      // Try to detect Joomla version
      let joomlaVersion: string | undefined;

      const joomlaVersionMeta = document.querySelector('meta[name="generator"][content*="Joomla"]');
      if (joomlaVersionMeta) {
        const content = joomlaVersionMeta.getAttribute('content');
        if (content) {
          const match = content.match(/Joomla! ([0-9.]+)/);
          if (match && match[1]) {
            joomlaVersion = match[1];
          }
        }
      }

      technologies.push({
        name: 'Joomla',
        category: 'cms',
        icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/joomla/joomla-original.svg',
        version: joomlaVersion,
        description: 'Open source content management system',
        website: 'https://www.joomla.org/'
      });
    }

    // Shopify
    if (
      (window as any).Shopify ||
      metas.some(m => m && m.includes('Shopify')) ||
      scripts.some(s => s.includes('shopify'))
    ) {
      let shopifyVersion: string | undefined;

      if ((window as any).Shopify && (window as any).Shopify.version) {
        shopifyVersion = (window as any).Shopify.version;
      }

      technologies.push({
        name: 'Shopify',
        category: 'ecommerce',
        icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/shopify/shopify-original.svg',
        version: shopifyVersion,
        description: 'E-commerce platform for online stores and retail point-of-sale systems',
        website: 'https://www.shopify.com/'
      });
    }

    // Wix
    if (
      document.querySelector('html[style*="wix"], img[src*="wixstatic"]') ||
      metas.some(m => m && m.includes('Wix')) ||
      scripts.some(s => s.includes('static.wixstatic.com'))
    ) {
      technologies.push({
        name: 'Wix',
        category: 'cms',
        icon: 'https://www.wix.com/favicon.ico',
        description: 'Cloud-based web development platform',
        website: 'https://www.wix.com/'
      });
    }

    // Squarespace
    if (
      document.querySelector('[data-block-type]') ||
      metas.some(m => m && m.includes('Squarespace')) ||
      scripts.some(s => s.includes('squarespace'))
    ) {
      // Try to detect Squarespace version
      let squarespaceVersion: string | undefined;

      const squarespaceVersionMeta = document.querySelector('meta[name="generator"][content*="Squarespace"]');
      if (squarespaceVersionMeta) {
        const content = squarespaceVersionMeta.getAttribute('content');
        if (content) {
          const match = content.match(/Squarespace ([0-9.]+)/);
          if (match && match[1]) {
            squarespaceVersion = match[1];
          }
        }
      }

      technologies.push({
        name: 'Squarespace',
        category: 'cms',
        icon: 'https://static1.squarespace.com/static/ta/5134cbefe4b0c6fb04df8065/10515/assets/favicon.ico',
        version: squarespaceVersion,
        description: 'All-in-one website building and ecommerce platform',
        website: 'https://www.squarespace.com/'
      });
    }

    // Ghost
    if (
      document.querySelector('[data-ghost], [class*="gh-"]') ||
      scripts.some(s => s.includes('ghost'))
    ) {
      // Try to detect Ghost version
      let ghostVersion: string | undefined;

      const ghostVersionMeta = document.querySelector('meta[name="generator"][content*="Ghost"]');
      if (ghostVersionMeta) {
        const content = ghostVersionMeta.getAttribute('content');
        if (content) {
          const match = content.match(/Ghost ([0-9.]+)/);
          if (match && match[1]) {
            ghostVersion = match[1];
          }
        }
      }

      technologies.push({
        name: 'Ghost',
        category: 'cms',
        icon: 'https://ghost.org/images/logos/ghost-logo-orb.png',
        version: ghostVersion,
        description: 'Professional publishing platform',
        website: 'https://ghost.org/'
      });
    }

    // Contentful
    if (
      scripts.some(s => s.includes('contentful'))
    ) {
      technologies.push({
        name: 'Contentful',
        category: 'cms',
        icon: 'https://www.contentful.com/favicon.ico',
        description: 'API-first content management platform',
        website: 'https://www.contentful.com/'
      });
    }

    // Strapi
    if (
      scripts.some(s => s.includes('strapi'))
    ) {
      technologies.push({
        name: 'Strapi',
        category: 'cms',
        icon: 'https://strapi.io/assets/favicon-32x32.png',
        description: 'Open source headless CMS',
        website: 'https://strapi.io/'
      });
    }
  } catch (e) {
    // Ignore errors in CMS detection
  }

  // E-commerce platforms
  try {
    // Magento
    if (
      (window as any).Magento ||
      scripts.some(s => s.includes('magento')) ||
      metas.some(m => m && m.includes('Magento'))
    ) {
      // Try to detect Magento version
      let magentoVersion: string | undefined;

      if ((window as any).Magento && (window as any).Magento.version) {
        magentoVersion = (window as any).Magento.version;
      } else {
        const magentoVersionMeta = document.querySelector('meta[name="generator"][content*="Magento"]');
        if (magentoVersionMeta) {
          const content = magentoVersionMeta.getAttribute('content');
          if (content) {
            const match = content.match(/Magento ([0-9.]+)/);
            if (match && match[1]) {
              magentoVersion = match[1];
            }
          }
        }
      }

      technologies.push({
        name: 'Magento',
        category: 'ecommerce',
        icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/magento/magento-original.svg',
        version: magentoVersion,
        description: 'Open-source e-commerce platform',
        website: 'https://magento.com/'
      });
    }

    // PrestaShop
    if (
      scripts.some(s => s.includes('prestashop')) ||
      document.querySelector('[class*="prestashop-"]')
    ) {
      // Try to detect PrestaShop version
      let prestaVersion: string | undefined;

      const prestaVersionMeta = document.querySelector('meta[name="generator"][content*="PrestaShop"]');
      if (prestaVersionMeta) {
        const content = prestaVersionMeta.getAttribute('content');
        if (content) {
          const match = content.match(/PrestaShop ([0-9.]+)/);
          if (match && match[1]) {
            prestaVersion = match[1];
          }
        }
      }

      technologies.push({
        name: 'PrestaShop',
        category: 'ecommerce',
        icon: 'https://cdn.worldvectorlogo.com/logos/prestashop.svg',
        version: prestaVersion,
        description: 'Open source e-commerce solution',
        website: 'https://www.prestashop.com/'
      });
    }

    // BigCommerce
    if (
      scripts.some(s => s.includes('bigcommerce'))
    ) {
      technologies.push({
        name: 'BigCommerce',
        category: 'ecommerce',
        icon: 'https://cdn.worldvectorlogo.com/logos/bigcommerce.svg',
        description: 'E-commerce platform for fast-growing and established brands',
        website: 'https://www.bigcommerce.com/'
      });
    }

    // OpenCart
    if (
      scripts.some(s => s.includes('opencart'))
    ) {
      technologies.push({
        name: 'OpenCart',
        category: 'ecommerce',
        icon: 'https://cdn.worldvectorlogo.com/logos/opencart.svg',
        description: 'Open source online store management system',
        website: 'https://www.opencart.com/'
      });
    }
  } catch (e) {
    // Ignore errors in e-commerce detection
  }

  // Payment systems
  try {
    // Stripe
    if (
      (window as any).Stripe ||
      scripts.some(s => s.includes('js.stripe.com'))
    ) {
      let stripeVersion: string | undefined;

      if ((window as any).Stripe && (window as any).Stripe.version) {
        stripeVersion = (window as any).Stripe.version;
      }

      technologies.push({
        name: 'Stripe',
        category: 'payment',
        icon: 'https://cdn.worldvectorlogo.com/logos/stripe-4.svg',
        version: stripeVersion,
        description: 'Online payment processing for internet businesses',
        website: 'https://stripe.com/'
      });
    }

    // PayPal
    if (
      (window as any).paypal ||
      scripts.some(s => s.includes('paypal.com'))
    ) {
      technologies.push({
        name: 'PayPal',
        category: 'payment',
        icon: 'https://cdn.worldvectorlogo.com/logos/paypal-2.svg',
        description: 'Online payments system supporting online money transfers',
        website: 'https://www.paypal.com/'
      });
    }

    // Square
    if (
      scripts.some(s => s.includes('squareup.com'))
    ) {
      technologies.push({
        name: 'Square',
        category: 'payment',
        icon: 'https://cdn.worldvectorlogo.com/logos/square-2.svg',
        description: 'Financial services and mobile payment company',
        website: 'https://squareup.com/'
      });
    }

    // Braintree
    if (
      scripts.some(s => s.includes('braintree'))
    ) {
      technologies.push({
        name: 'Braintree',
        category: 'payment',
        icon: 'https://cdn.worldvectorlogo.com/logos/braintree.svg',
        description: 'Payment platform for accepting, processing, and splitting payments',
        website: 'https://www.braintreepayments.com/'
      });
    }
  } catch (e) {
    // Ignore errors in payment detection
  }

  // Security and infrastructure
  try {
    // Cloudflare
    if (
      scripts.some(s => s.includes('cloudflare')) ||
      document.querySelector('script[src*="cloudflare"]')
    ) {
      technologies.push({
        name: 'Cloudflare',
        category: 'cdn',
        icon: 'https://cdn.worldvectorlogo.com/logos/cloudflare.svg',
        description: 'Web infrastructure and website security company',
        website: 'https://www.cloudflare.com/'
      });
    }

    // reCAPTCHA
    if (
      document.querySelector('.g-recaptcha, .grecaptcha-badge') ||
      scripts.some(s => s.includes('recaptcha'))
    ) {
      // Try to detect reCAPTCHA version
      let recaptchaVersion = 'v2';

      if (scripts.some(s => s.includes('recaptcha/api.js?render='))) {
        recaptchaVersion = 'v3';
      }

      technologies.push({
        name: 'reCAPTCHA',
        category: 'security',
        icon: 'https://www.gstatic.com/recaptcha/api2/logo_48.png',
        version: recaptchaVersion,
        description: 'CAPTCHA system that protects websites from spam and abuse',
        website: 'https://www.google.com/recaptcha/'
      });
    }

    // Netlify
    if (
      scripts.some(s => s.includes('netlify')) ||
      document.querySelector('[data-netlify]')
    ) {
      technologies.push({
        name: 'Netlify',
        category: 'hosting',
        icon: 'https://cdn.worldvectorlogo.com/logos/netlify.svg',
        description: 'All-in-one platform for automating modern web projects',
        website: 'https://www.netlify.com/'
      });
    }

    // Vercel
    if (
      scripts.some(s => s.includes('vercel')) ||
      document.querySelector('meta[name="vercel"]')
    ) {
      technologies.push({
        name: 'Vercel',
        category: 'hosting',
        icon: 'https://cdn.worldvectorlogo.com/logos/vercel.svg',
        description: 'Platform for frontend frameworks and static sites',
        website: 'https://vercel.com/'
      });
    }

    // AWS
    if (
      scripts.some(s => s.includes('amazonaws.com'))
    ) {
      technologies.push({
        name: 'AWS',
        category: 'hosting',
        icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original.svg',
        description: 'On-demand cloud computing platforms and APIs',
        website: 'https://aws.amazon.com/'
      });
    }

    // Firebase
    if (
      scripts.some(s => s.includes('firebase')) ||
      (window as any).firebase
    ) {
      let firebaseVersion: string | undefined;

      if ((window as any).firebase && (window as any).firebase.SDK_VERSION) {
        firebaseVersion = (window as any).firebase.SDK_VERSION;
      }

      technologies.push({
        name: 'Firebase',
        category: 'backend',
        icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg',
        version: firebaseVersion,
        description: 'Platform for developing mobile and web applications',
        website: 'https://firebase.google.com/'
      });
    }
  } catch (e) {
    // Ignore errors in security detection
  }

  // UI and design elements
  try {
    // Font Awesome
    if (
      document.querySelector('.fa, .fas, .far, .fab, .fa-') ||
      links.some(l => l.includes('font-awesome'))
    ) {
      // Try to detect Font Awesome version
      let faVersion: string | undefined;

      if ((window as any).FontAwesomeConfig && (window as any).FontAwesomeConfig.version) {
        faVersion = (window as any).FontAwesomeConfig.version;
      } else {
        faVersion = extractVersion(
          [/font-awesome@([0-9.]+)/, /font-awesome\/([0-9.]+)/, /fontawesome[.-]([0-9.]+)/],
          [...scripts, ...links]
        );

        // Check for v5+ by looking for specific classes
        if (!faVersion && document.querySelector('.fab, .far')) {
          faVersion = '5+';
        }
      }

      technologies.push({
        name: 'Font Awesome',
        category: 'ui-framework',
        icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/fontawesome/fontawesome-original.svg',
        version: faVersion,
        description: 'Icon set and toolkit',
        website: 'https://fontawesome.com/'
      });
    }

    // Google Fonts
    if (
      links.some(l => l.includes('fonts.googleapis.com'))
    ) {
      technologies.push({
        name: 'Google Fonts',
        category: 'font',
        icon: 'https://www.gstatic.com/images/icons/material/apps/fonts/1x/catalog/v5/favicon.svg',
        description: 'Library of free licensed font families',
        website: 'https://fonts.google.com/'
      });
    }

    // Google Maps
    if (
      (window as any).google && (window as any).google.maps ||
      scripts.some(s => s.includes('maps.googleapis.com'))
    ) {
      let mapsVersion: string | undefined;

      if ((window as any).google && (window as any).google.maps && (window as any).google.maps.version) {
        mapsVersion = (window as any).google.maps.version;
      }

      technologies.push({
        name: 'Google Maps',
        category: 'map',
        icon: 'https://cdn.worldvectorlogo.com/logos/google-maps-2020-icon.svg',
        version: mapsVersion,
        description: 'Web mapping platform and consumer application',
        website: 'https://maps.google.com/'
      });
    }

    // Mapbox
    if (
      scripts.some(s => s.includes('mapbox')) ||
      document.querySelector('.mapboxgl-map')
    ) {
      let mapboxVersion: string | undefined;

      if ((window as any).mapboxgl && (window as any).mapboxgl.version) {
        mapboxVersion = (window as any).mapboxgl.version;
      } else {
        mapboxVersion = extractVersion(
          [/mapbox-gl@([0-9.]+)/, /mapbox-gl\/([0-9.]+)/, /mapbox[.-]gl[.-]([0-9.]+)/],
          scripts
        );
      }

      technologies.push({
        name: 'Mapbox',
        category: 'map',
        icon: 'https://cdn.worldvectorlogo.com/logos/mapbox-1.svg',
        version: mapboxVersion,
        description: 'Location data platform for mobile and web applications',
        website: 'https://www.mapbox.com/'
      });
    }
  } catch (e) {
    // Ignore errors in UI detection
  }

  // Backend technologies
  try {
    // PHP
    if (
      document.querySelector('meta[name="generator"][content*="PHP"]') ||
      scripts.some(s => s.includes('.php'))
    ) {
      // Try to detect PHP version
      let phpVersion: string | undefined;

      const phpVersionMeta = document.querySelector('meta[name="generator"][content*="PHP"]');
      if (phpVersionMeta) {
        const content = phpVersionMeta.getAttribute('content');
        if (content) {
          const match = content.match(/PHP ([0-9.]+)/);
          if (match && match[1]) {
            phpVersion = match[1];
          }
        }
      }

      technologies.push({
        name: 'PHP',
        category: 'backend',
        icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg',
        version: phpVersion,
        description: 'Popular general-purpose scripting language',
        website: 'https://www.php.net/'
      });
    }

    // Node.js
    if (
      scripts.some(s => s.includes('node_modules')) ||
      document.querySelector('meta[name="generator"][content*="Node"]')
    ) {
      // Try to detect Node.js version
      let nodeVersion: string | undefined;

      const nodeVersionMeta = document.querySelector('meta[name="generator"][content*="Node"]');
      if (nodeVersionMeta) {
        const content = nodeVersionMeta.getAttribute('content');
        if (content) {
          const match = content.match(/Node ([0-9.]+)/);
          if (match && match[1]) {
            nodeVersion = match[1];
          }
        }
      }

      technologies.push({
        name: 'Node.js',
        category: 'backend',
        icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg',
        version: nodeVersion,
        description: 'JavaScript runtime built on Chrome\'s V8 JavaScript engine',
        website: 'https://nodejs.org/'
      });
    }

    // Ruby on Rails
    if (
      document.querySelector('meta[name="csrf-param"]') ||
      scripts.some(s => s.includes('rails'))
    ) {
      // Try to detect Rails version
      let railsVersion: string | undefined;

      const railsVersionMeta = document.querySelector('meta[name="generator"][content*="Ruby on Rails"]');
      if (railsVersionMeta) {
        const content = railsVersionMeta.getAttribute('content');
        if (content) {
          const match = content.match(/Ruby on Rails ([0-9.]+)/);
          if (match && match[1]) {
            railsVersion = match[1];
          }
        }
      }

      technologies.push({
        name: 'Ruby on Rails',
        category: 'backend',
        icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/rails/rails-original-wordmark.svg',
        version: railsVersion,
        description: 'Server-side web application framework written in Ruby',
        website: 'https://rubyonrails.org/'
      });
    }

    // Django
    if (
      document.querySelector('meta[name="generator"][content*="Django"]') ||
      scripts.some(s => s.includes('django'))
    ) {
      // Try to detect Django version
      let djangoVersion: string | undefined;

      const djangoVersionMeta = document.querySelector('meta[name="generator"][content*="Django"]');
      if (djangoVersionMeta) {
        const content = djangoVersionMeta.getAttribute('content');
        if (content) {
          const match = content.match(/Django ([0-9.]+)/);
          if (match && match[1]) {
            djangoVersion = match[1];
          }
        }
      }

      technologies.push({
        name: 'Django',
        category: 'backend',
        icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/django/django-plain.svg',
        version: djangoVersion,
        description: 'High-level Python web framework',
        website: 'https://www.djangoproject.com/'
      });
    }

    // ASP.NET
    if (
      document.querySelector('meta[name="generator"][content*="ASP.NET"]') ||
      scripts.some(s => s.includes('asp.net'))
    ) {
      // Try to detect ASP.NET version
      let aspVersion: string | undefined;

      const aspVersionMeta = document.querySelector('meta[name="generator"][content*="ASP.NET"]');
      if (aspVersionMeta) {
        const content = aspVersionMeta.getAttribute('content');
        if (content) {
          const match = content.match(/ASP\.NET ([0-9.]+)/);
          if (match && match[1]) {
            aspVersion = match[1];
          }
        }
      }

      technologies.push({
        name: 'ASP.NET',
        category: 'backend',
        icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/dot-net/dot-net-original.svg',
        version: aspVersion,
        description: 'Web application framework developed by Microsoft',
        website: 'https://dotnet.microsoft.com/'
      });
    }
  } catch (e) {
    // Ignore errors in backend detection
  }

  // Database technologies
  try {
    // MongoDB
    if (
      scripts.some(s => s.includes('mongodb'))
    ) {
      technologies.push({
        name: 'MongoDB',
        category: 'database',
        icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg',
        description: 'Cross-platform document-oriented database program',
        website: 'https://www.mongodb.com/'
      });
    }

    // MySQL
    if (
      scripts.some(s => s.includes('mysql'))
    ) {
      technologies.push({
        name: 'MySQL',
        category: 'database',
        icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg',
        description: 'Open-source relational database management system',
        website: 'https://www.mysql.com/'
      });
    }

    // PostgreSQL
    if (
      scripts.some(s => s.includes('postgresql') || s.includes('postgres'))
    ) {
      technologies.push({
        name: 'PostgreSQL',
        category: 'database',
        icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg',
        description: 'Powerful, open source object-relational database system',
        website: 'https://www.postgresql.org/'
      });
    }
  } catch (e) {
    // Ignore errors in database detection
  }

  // Check for common patterns in HTML content
  try {
    const lowerHtml = htmlContent.substring(0, 50000); // Limit to first 50K chars for performance

    // Common technology patterns with categories
    const patterns = [
      {
        name: 'Elementor',
        pattern: 'elementor',
        category: 'cms' as TechnologyCategory,
        description: 'Website builder platform for WordPress',
        website: 'https://elementor.com/'
      },
      {
        name: 'Webflow',
        pattern: 'webflow',
        category: 'cms' as TechnologyCategory,
        description: 'Visual web design tool, CMS, and hosting platform',
        website: 'https://webflow.com/'
      },
      {
        name: 'Intercom',
        pattern: 'intercom',
        category: 'marketing' as TechnologyCategory,
        description: 'Customer messaging platform',
        website: 'https://www.intercom.com/'
      },
      {
        name: 'Zendesk',
        pattern: 'zendesk',
        category: 'marketing' as TechnologyCategory,
        description: 'Customer service software and support ticket system',
        website: 'https://www.zendesk.com/'
      },
      {
        name: 'Crisp',
        pattern: 'crisp',
        category: 'marketing' as TechnologyCategory,
        description: 'Live chat and customer messaging platform',
        website: 'https://crisp.chat/'
      },
      {
        name: 'Drift',
        pattern: 'drift',
        category: 'marketing' as TechnologyCategory,
        description: 'Conversational marketing platform',
        website: 'https://www.drift.com/'
      },
      {
        name: 'Tawk.to',
        pattern: 'tawk.to',
        category: 'marketing' as TechnologyCategory,
        description: 'Free live chat app for websites',
        website: 'https://www.tawk.to/'
      },
      {
        name: 'Sentry',
        pattern: 'sentry',
        category: 'security' as TechnologyCategory,
        description: 'Application monitoring and error tracking software',
        website: 'https://sentry.io/'
      },
      {
        name: 'Segment',
        pattern: 'segment',
        category: 'analytics' as TechnologyCategory,
        description: 'Customer data platform',
        website: 'https://segment.com/'
      },
      {
        name: 'Algolia',
        pattern: 'algolia',
        category: 'search' as TechnologyCategory,
        description: 'Hosted search API',
        website: 'https://www.algolia.com/'
      },
      {
        name: 'Lodash',
        pattern: 'lodash',
        category: 'javascript-library' as TechnologyCategory,
        description: 'JavaScript utility library',
        website: 'https://lodash.com/'
      },
      {
        name: 'Moment.js',
        pattern: 'moment.js',
        category: 'javascript-library' as TechnologyCategory,
        description: 'Parse, validate, manipulate, and display dates in JavaScript',
        website: 'https://momentjs.com/'
      },
      {
        name: 'Axios',
        pattern: 'axios',
        category: 'javascript-library' as TechnologyCategory,
        description: 'Promise based HTTP client for the browser and Node.js',
        website: 'https://axios-http.com/'
      },
      {
        name: 'Redux',
        pattern: 'redux',
        category: 'javascript-library' as TechnologyCategory,
        description: 'Predictable state container for JavaScript apps',
        website: 'https://redux.js.org/'
      },
      {
        name: 'GraphQL',
        pattern: 'graphql',
        category: 'backend' as TechnologyCategory,
        description: 'Query language for APIs',
        website: 'https://graphql.org/'
      },
      {
        name: 'Apollo',
        pattern: 'apollo',
        category: 'javascript-library' as TechnologyCategory,
        description: 'Platform for building a data graph',
        website: 'https://www.apollographql.com/'
      },
      {
        name: 'Express',
        pattern: 'express',
        category: 'backend' as TechnologyCategory,
        description: 'Fast, unopinionated, minimalist web framework for Node.js',
        website: 'https://expressjs.com/'
      },
      {
        name: 'Socket.io',
        pattern: 'socket.io',
        category: 'javascript-library' as TechnologyCategory,
        description: 'Enables real-time, bidirectional and event-based communication',
        website: 'https://socket.io/'
      },
      {
        name: 'D3.js',
        pattern: 'd3.js',
        category: 'javascript-library' as TechnologyCategory,
        description: 'JavaScript library for producing dynamic, interactive data visualizations',
        website: 'https://d3js.org/'
      },
      {
        name: 'Three.js',
        pattern: 'three.js',
        category: 'javascript-library' as TechnologyCategory,
        description: 'JavaScript 3D library',
        website: 'https://threejs.org/'
      },
    ];

    for (const { name, pattern, category, description, website } of patterns) {
      if (lowerHtml.includes(pattern) || scripts.some(s => s.includes(pattern))) {
        // Try to extract version
        const version = extractVersion(
          [new RegExp(`${pattern.replace('.', '\\.')}@([0-9.]+)`), new RegExp(`${pattern.replace('.', '\\.')}/([0-9.]+)`), new RegExp(`${pattern.replace('.', '\\.')}[.-]([0-9.]+)`)],
          scripts
        );

        technologies.push({
          name,
          category,
          icon: `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${name.toLowerCase().replace(/\./g, '')}/icon.svg`,
          version,
          description,
          website
        });
      }
    }
  } catch (e) {
    // Ignore errors in pattern detection
  }

  // Remove duplicates by name
  const uniqueTechMap = new Map<string, Technology>();
  technologies.forEach(tech => {
    uniqueTechMap.set(tech.name, tech);
  });

  const uniqueTechnologies = Array.from(uniqueTechMap.values());

  // Organize technologies by category
  const technologyCategories: TechnologyCategories = {
    'javascript-framework': [],
    'ui-framework': [],
    'javascript-library': [],
    'css-framework': [],
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
  };

  uniqueTechnologies.forEach(tech => {
    if (technologyCategories[tech.category]) {
      technologyCategories[tech.category].push(tech);
    } else {
      technologyCategories['other'].push(tech);
    }
  });

  return {
    technologies: uniqueTechnologies.length ? uniqueTechnologies : [{ name: 'No common technologies detected', category: 'other' }],
    technologyCategories
  };
}
