import React, { useState } from 'react';
import { AnalysisResult } from '../types';

interface ExportButtonProps {
  result: AnalysisResult;
}

const ExportButton: React.FC<ExportButtonProps> = ({ result }) => {
  const [showDropdown, setShowDropdown] = useState(false);

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const exportAsJSON = () => {
    const dataStr = JSON.stringify(result, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
    
    const exportFileDefaultName = `web-pulse-${result.pageInfo.domain}-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    setShowDropdown(false);
  };

  const exportAsCSV = () => {
    // Flatten the result object for CSV
    const flatData: Record<string, string> = {
      'URL': result.pageInfo.url,
      'Title': result.pageInfo.title,
      'Domain': result.pageInfo.domain,
      'Protocol': result.pageInfo.protocol,
      'Path': result.pageInfo.path,
      'Meta Description': result.seoData.metaDescription,
      'Meta Keywords': result.seoData.metaKeywords,
      'H1 Tags': result.seoData.h1Tags.toString(),
      'H2 Tags': result.seoData.h2Tags.toString(),
      'H3 Tags': result.seoData.h3Tags.toString(),
      'Canonical URL': result.seoData.canonicalUrl,
      'Robots Directive': result.seoData.robotsTxt,
      'DOM Nodes': result.performanceData.domNodes.toString(),
      'Images': result.performanceData.images.toString(),
      'Scripts': result.performanceData.scripts.toString(),
      'Stylesheets': result.performanceData.stylesheets.toString(),
      'iFrames': result.performanceData.iframes.toString(),
      'Technologies': result.technologies.join(', '),
      'Images without Alt': result.accessibilityData.imagesWithoutAlt.toString(),
      'Form Inputs without Labels': result.accessibilityData.formInputsWithoutLabels.toString(),
      'Timestamp': result.timestamp
    };
    
    // Add optional fields if they exist
    if (result.accessibilityData.ariaAttributes !== undefined) {
      flatData['ARIA Attributes'] = result.accessibilityData.ariaAttributes.toString();
    }
    
    if (result.accessibilityData.languageSpecified !== undefined) {
      flatData['Language Specified'] = result.accessibilityData.languageSpecified ? 'Yes' : 'No';
    }
    
    if (result.performanceData.lazyLoadedImages !== undefined) {
      flatData['Lazy Loaded Images'] = result.performanceData.lazyLoadedImages.toString();
    }

    // Add new performance metrics if they exist
    if (result.performanceData.pageLoadTime !== undefined) {
      flatData['Page Load Time (ms)'] = result.performanceData.pageLoadTime.toString();
    }

    if (result.performanceData.domContentLoaded !== undefined) {
      flatData['DOM Content Loaded (ms)'] = result.performanceData.domContentLoaded.toString();
    }

    if (result.performanceData.firstPaint !== undefined) {
      flatData['First Paint (ms)'] = result.performanceData.firstPaint.toString();
    }

    if (result.performanceData.firstContentfulPaint !== undefined) {
      flatData['First Contentful Paint (ms)'] = result.performanceData.firstContentfulPaint.toString();
    }

    if (result.performanceData.resourceSizes) {
      flatData['Total Resource Size (KB)'] = result.performanceData.resourceSizes.total.toString();
      flatData['JavaScript Size (KB)'] = result.performanceData.resourceSizes.js.toString();
      flatData['CSS Size (KB)'] = result.performanceData.resourceSizes.css.toString();
      flatData['Images Size (KB)'] = result.performanceData.resourceSizes.img.toString();
      flatData['Fonts Size (KB)'] = result.performanceData.resourceSizes.font.toString();
    }

    if (result.performanceData.cacheStatus) {
      flatData['Cached Resources'] = result.performanceData.cacheStatus.cached.toString();
      flatData['Non-Cached Resources'] = result.performanceData.cacheStatus.notCached.toString();

      const total = result.performanceData.cacheStatus.cached + result.performanceData.cacheStatus.notCached;
      if (total > 0) {
        const cacheRatio = Math.round((result.performanceData.cacheStatus.cached / total) * 100);
        flatData['Cache Ratio (%)'] = cacheRatio.toString();
      }
    }

    if (result.performanceData.connectionInfo) {
      flatData['Connection Type'] = result.performanceData.connectionInfo.type;
      flatData['Downlink Speed (Mbps)'] = result.performanceData.connectionInfo.downlink.toString();
      flatData['Round Trip Time (ms)'] = result.performanceData.connectionInfo.rtt.toString();
      flatData['Data Saver'] = result.performanceData.connectionInfo.saveData ? 'Enabled' : 'Disabled';
    }
    
    // Convert to CSV
    const headers = Object.keys(flatData);
    const csvRows = [
      headers.join(','),
      headers.map(header => {
        const value = flatData[header] || '';
        // Escape quotes and wrap in quotes if contains comma
        return value.includes(',') ? `"${value.replace(/"/g, '""')}"` : value;
      }).join(',')
    ];
    
    const csvString = csvRows.join('\n');
    const dataUri = `data:text/csv;charset=utf-8,${encodeURIComponent(csvString)}`;
    
    const exportFileDefaultName = `web-pulse-${result.pageInfo.domain}-${new Date().toISOString().split('T')[0]}.csv`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    setShowDropdown(false);
  };

  const exportAsHTML = () => {
    // Create a simple HTML report
    const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Web Pulse Report - ${result.pageInfo.domain}</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif; line-height: 1.6; color: #333; max-width: 1200px; margin: 0 auto; padding: 20px; }
          h1, h2, h3 { color: #2563eb; }
          .report-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; border-bottom: 1px solid #e5e7eb; padding-bottom: 20px; }
          .section { margin-bottom: 30px; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; background-color: #f9fafb; }
          .metrics { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 15px; }
          .metric { background-color: white; padding: 15px; border-radius: 6px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
          .metric-title { font-weight: 600; color: #6b7280; font-size: 0.875rem; margin-bottom: 5px; }
          .metric-value { font-weight: 700; font-size: 1.25rem; color: #111827; }
          .tech-list { display: flex; flex-wrap: wrap; gap: 8px; }
          .tech-item { background-color: #e0e7ff; color: #4338ca; padding: 5px 10px; border-radius: 4px; font-size: 0.875rem; }
          .timestamp { font-size: 0.75rem; color: #6b7280; text-align: right; margin-top: 40px; }
          table { width: 100%; border-collapse: collapse; }
          th, td { text-align: left; padding: 8px; border-bottom: 1px solid #e5e7eb; }
          th { background-color: #f3f4f6; }
        </style>
      </head>
      <body>
        <div class="report-header">
          <div>
            <h1>Web Pulse Analysis Report</h1>
            <p>Analysis of <a href="${result.pageInfo.url}" target="_blank">${result.pageInfo.title}</a></p>
          </div>
          <div>
            <img src="${result.pageInfo.favicon || ''}" alt="Site favicon" style="width: 32px; height: 32px;">
          </div>
        </div>
        
        <div class="section">
          <h2>Page Information</h2>
          <div class="metrics">
            <div class="metric">
              <div class="metric-title">Domain</div>
              <div class="metric-value">${result.pageInfo.domain}</div>
            </div>
            <div class="metric">
              <div class="metric-title">Protocol</div>
              <div class="metric-value">${result.pageInfo.protocol.replace(':', '')}</div>
            </div>
            <div class="metric">
              <div class="metric-title">Path</div>
              <div class="metric-value">${result.pageInfo.path}</div>
            </div>
          </div>
        </div>
        
        <div class="section">
          <h2>SEO Analysis</h2>
          <div class="metrics">
            <div class="metric">
              <div class="metric-title">Meta Description</div>
              <div class="metric-value" style="font-size: 0.875rem;">${result.seoData.metaDescription}</div>
            </div>
            <div class="metric">
              <div class="metric-title">H1 Tags</div>
              <div class="metric-value">${result.seoData.h1Tags}</div>
            </div>
            <div class="metric">
              <div class="metric-title">H2 Tags</div>
              <div class="metric-value">${result.seoData.h2Tags}</div>
            </div>
            <div class="metric">
              <div class="metric-title">H3 Tags</div>
              <div class="metric-value">${result.seoData.h3Tags}</div>
            </div>
            <div class="metric">
              <div class="metric-title">Canonical URL</div>
              <div class="metric-value" style="font-size: 0.875rem; word-break: break-all;">${result.seoData.canonicalUrl}</div>
            </div>
            <div class="metric">
              <div class="metric-title">Robots Directive</div>
              <div class="metric-value">${result.seoData.robotsTxt}</div>
            </div>
          </div>
        </div>
        
        <div class="section">
          <h2>Performance Analysis</h2>
          <div class="metrics">
            <div class="metric">
              <div class="metric-title">DOM Nodes</div>
              <div class="metric-value">${result.performanceData.domNodes}</div>
            </div>
            <div class="metric">
              <div class="metric-title">Images</div>
              <div class="metric-value">${result.performanceData.images}</div>
            </div>
            <div class="metric">
              <div class="metric-title">Scripts</div>
              <div class="metric-value">${result.performanceData.scripts}</div>
            </div>
            <div class="metric">
              <div class="metric-title">Stylesheets</div>
              <div class="metric-value">${result.performanceData.stylesheets}</div>
            </div>
            <div class="metric">
              <div class="metric-title">iFrames</div>
              <div class="metric-value">${result.performanceData.iframes}</div>
            </div>
            ${result.performanceData.lazyLoadedImages !== undefined ? `
            <div class="metric">
              <div class="metric-title">Lazy Loaded Images</div>
              <div class="metric-value">${result.performanceData.lazyLoadedImages}</div>
            </div>
            ` : ''}
            ${result.performanceData.pageLoadTime !== undefined ? `
            <div class="metric">
              <div class="metric-title">Page Load Time</div>
              <div class="metric-value">${result.performanceData.pageLoadTime} ms</div>
            </div>
            ` : ''}
            ${result.performanceData.firstContentfulPaint !== undefined ? `
            <div class="metric">
              <div class="metric-title">First Contentful Paint</div>
              <div class="metric-value">${result.performanceData.firstContentfulPaint} ms</div>
            </div>
            ` : ''}
            ${result.performanceData.resourceSizes ? `
            <div class="metric">
              <div class="metric-title">Total Resource Size</div>
              <div class="metric-value">${result.performanceData.resourceSizes.total} KB</div>
            </div>
            ` : ''}
          </div>

          ${result.performanceData.resourceSizes ? `
          <h3 style="margin-top: 20px; margin-bottom: 10px; font-size: 1rem;">Resource Breakdown</h3>
          <table>
            <thead>
              <tr>
                <th>Resource Type</th>
                <th>Size (KB)</th>
                <th>Count</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>JavaScript</td>
                <td>${result.performanceData.resourceSizes.js}</td>
                <td>${result.performanceData.resourceCounts?.js || 'N/A'}</td>
              </tr>
              <tr>
                <td>CSS</td>
                <td>${result.performanceData.resourceSizes.css}</td>
                <td>${result.performanceData.resourceCounts?.css || 'N/A'}</td>
              </tr>
              <tr>
                <td>Images</td>
                <td>${result.performanceData.resourceSizes.img}</td>
                <td>${result.performanceData.resourceCounts?.img || 'N/A'}</td>
              </tr>
              <tr>
                <td>Fonts</td>
                <td>${result.performanceData.resourceSizes.font}</td>
                <td>${result.performanceData.resourceCounts?.font || 'N/A'}</td>
              </tr>
              <tr>
                <td>Other</td>
                <td>${result.performanceData.resourceSizes.other}</td>
                <td>${result.performanceData.resourceCounts?.other || 'N/A'}</td>
              </tr>
            </tbody>
          </table>
          ` : ''}

          ${result.performanceData.cacheStatus ? `
          <h3 style="margin-top: 20px; margin-bottom: 10px; font-size: 1rem;">Cache Status</h3>
          <div class="metrics">
            <div class="metric">
              <div class="metric-title">Cached Resources</div>
              <div class="metric-value">${result.performanceData.cacheStatus.cached}</div>
            </div>
            <div class="metric">
              <div class="metric-title">Non-Cached Resources</div>
              <div class="metric-value">${result.performanceData.cacheStatus.notCached}</div>
            </div>
            <div class="metric">
              <div class="metric-title">Cache Ratio</div>
              <div class="metric-value">
                ${Math.round((result.performanceData.cacheStatus.cached /
                  (result.performanceData.cacheStatus.cached + result.performanceData.cacheStatus.notCached || 1)) * 100)}%
              </div>
            </div>
          </div>
          ` : ''}
        </div>
        
        <div class="section">
          <h2>Technologies Detected</h2>
          <div class="tech-list">
            ${result.technologies.map(tech => `<div class="tech-item">${tech}</div>`).join('')}
          </div>
        </div>
        
        <div class="section">
          <h2>Accessibility Analysis</h2>
          <div class="metrics">
            <div class="metric">
              <div class="metric-title">Images without Alt</div>
              <div class="metric-value">${result.accessibilityData.imagesWithoutAlt}</div>
            </div>
            <div class="metric">
              <div class="metric-title">Form Inputs without Labels</div>
              <div class="metric-value">${result.accessibilityData.formInputsWithoutLabels}</div>
            </div>
            ${result.accessibilityData.ariaAttributes !== undefined ? `
            <div class="metric">
              <div class="metric-title">ARIA Attributes</div>
              <div class="metric-value">${result.accessibilityData.ariaAttributes}</div>
            </div>
            ` : ''}
            ${result.accessibilityData.languageSpecified !== undefined ? `
            <div class="metric">
              <div class="metric-title">Language Specified</div>
              <div class="metric-value">${result.accessibilityData.languageSpecified ? 'Yes' : 'No'}</div>
            </div>
            ` : ''}
          </div>
        </div>
        
        <div class="timestamp">
          Report generated on ${new Date(result.timestamp).toLocaleString()} by Web Pulse
        </div>
      </body>
      </html>
    `;
    
    const dataUri = `data:text/html;charset=utf-8,${encodeURIComponent(htmlContent)}`;
    
    const exportFileDefaultName = `web-pulse-${result.pageInfo.domain}-${new Date().toISOString().split('T')[0]}.html`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    setShowDropdown(false);
  };

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="flex items-center text-sm text-primary hover:text-primary-600 font-medium transition-colors"
      >
        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
        Export
      </button>
      
      {showDropdown && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-border">
          <div className="py-1">
            <button
              onClick={exportAsJSON}
              className="block w-full text-left px-4 py-2 text-sm text-text hover:bg-background-dark transition-colors"
            >
              Export as JSON
            </button>
            <button
              onClick={exportAsCSV}
              className="block w-full text-left px-4 py-2 text-sm text-text hover:bg-background-dark transition-colors"
            >
              Export as CSV
            </button>
            <button
              onClick={exportAsHTML}
              className="block w-full text-left px-4 py-2 text-sm text-text hover:bg-background-dark transition-colors"
            >
              Export as HTML Report
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExportButton;