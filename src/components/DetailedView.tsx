import React, { useState } from 'react';
import { AnalysisResult, HeadingStructure, ThirdPartyScript } from '../types';
import Badge from './Badge';
import TechnologyList from './TechnologyList';

interface DetailedViewProps {
  result: AnalysisResult;
  onClose: () => void;
  activeTab?: string;
}

const DetailedView: React.FC<DetailedViewProps> = ({ result, onClose, activeTab = 'overview' }) => {
  // State for section tabs
  const [seoTab, setSeoTab] = useState<'meta' | 'social' | 'headings' | 'technical' | 'advanced' | 'search-engines'>('meta');
  const [perfTab, setPerfTab] = useState<'resources' | 'scripts'>('resources');
  const [a11yTab, setA11yTab] = useState<'metrics' | 'tips'>('metrics');

  // Helper function to determine status colors
  const getStatusColor = (status: 'good' | 'warning' | 'error') => {
    switch (status) {
      case 'good': return 'bg-success';
      case 'warning': return 'bg-warning';
      case 'error': return 'bg-error';
      default: return 'bg-info';
    }
  };

  // Helper function to determine SEO meta description status
  const getMetaDescriptionStatus = () => {
    if (!result.seoData.metaDescription) return 'error';
    if (result.seoData.metaDescription.length < 50) return 'error';
    if (result.seoData.metaDescription.length > 160) return 'warning';
    return 'good';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[95vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-lg font-semibold text-text flex items-center">
            <img
              src={result.pageInfo.favicon}
              alt="Site favicon"
              className="w-5 h-5 mr-2"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
            {result.pageInfo.title}
          </h2>
          <button
            onClick={onClose}
            className="text-text-light hover:text-text p-1 rounded-full hover:bg-background-dark transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="overflow-y-auto p-4 flex-grow">
          {/* Only show the overview grid for the overview tab */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <h3 className="text-sm font-medium text-text-light mb-2">Page Information</h3>
                <div className="bg-background-dark p-3 rounded-lg">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-text-light">URL:</span>
                      <a
                        href={result.pageInfo.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline truncate max-w-[250px]"
                      >
                        {result.pageInfo.url}
                      </a>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-light">Domain:</span>
                      <span className="font-medium">{result.pageInfo.domain}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-light">Protocol:</span>
                      <span className="font-medium">{result.pageInfo.protocol}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-light">Path:</span>
                      <span className="font-medium truncate max-w-[250px]">{result.pageInfo.path}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-text-light mb-2">Technologies</h3>
                <div className="bg-background-dark p-3 rounded-lg h-[calc(100%-28px)] overflow-auto">
                  <TechnologyList
                    technologies={result.technologies}
                    technologyCategories={result.technologyCategories}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Show specific content for the technologies tab */}
          {activeTab === 'technologies' && (
            <div className="mb-6">
              <h3 className="text-md font-semibold text-text mb-3">Technology Stack</h3>
              <div className="bg-background-dark p-4 rounded-lg">
                <TechnologyList
                  technologies={result.technologies}
                  technologyCategories={result.technologyCategories}
                  showDetails={true}
                />
              </div>
            </div>
          )}

          <div className="space-y-6">
            {/* SEO Section - Show for overview and seo tabs */}
            {(activeTab === 'overview' || activeTab === 'seo') && (
            <section className="bg-white rounded-lg shadow-sm border border-border overflow-hidden">
              <div className="flex items-center justify-between p-3 bg-background-dark">
                <h3 className="text-md font-semibold text-text flex items-center">
                  <svg className="w-5 h-5 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                  SEO Analysis
                </h3>
                <div className="flex space-x-1">
                  <Badge
                    variant={
                      result.seoData.h1Tags === 1 &&
                      result.seoData.metaDescription &&
                      result.seoData.metaDescription.length >= 50 &&
                      result.seoData.metaDescription.length <= 160 ?
                      'success' : 'warning'
                    }
                    size="sm"
                  >
                    {result.seoData.h1Tags === 1 &&
                     result.seoData.metaDescription &&
                     result.seoData.metaDescription.length >= 50 &&
                     result.seoData.metaDescription.length <= 160 ?
                     'Good' : 'Needs Improvement'}
                  </Badge>
                </div>
              </div>

              {/* SEO Tabs */}
              <div className="flex flex-wrap border-b border-border">
                <button
                  className={`px-4 py-2 text-sm font-medium ${seoTab === 'meta' ? 'text-primary border-b-2 border-primary' : 'text-text-light hover:text-text'}`}
                  onClick={() => setSeoTab('meta')}
                >
                  Meta Tags
                </button>
                <button
                  className={`px-4 py-2 text-sm font-medium ${seoTab === 'social' ? 'text-primary border-b-2 border-primary' : 'text-text-light hover:text-text'}`}
                  onClick={() => setSeoTab('social')}
                >
                  Social Media
                </button>
                <button
                  className={`px-4 py-2 text-sm font-medium ${seoTab === 'headings' ? 'text-primary border-b-2 border-primary' : 'text-text-light hover:text-text'}`}
                  onClick={() => setSeoTab('headings')}
                >
                  Headings
                </button>
                <button
                  className={`px-4 py-2 text-sm font-medium ${seoTab === 'technical' ? 'text-primary border-b-2 border-primary' : 'text-text-light hover:text-text'}`}
                  onClick={() => setSeoTab('technical')}
                >
                  Technical
                </button>
                <button
                  className={`px-4 py-2 text-sm font-medium ${seoTab === 'advanced' ? 'text-primary border-b-2 border-primary' : 'text-text-light hover:text-text'}`}
                  onClick={() => setSeoTab('advanced')}
                >
                  Advanced
                </button>
                <button
                  className={`px-4 py-2 text-sm font-medium ${seoTab === 'search-engines' ? 'text-primary border-b-2 border-primary' : 'text-text-light hover:text-text'}`}
                  onClick={() => setSeoTab('search-engines')}
                >
                  Search Engines
                </button>
              </div>

              <div className="p-4">
                {/* Meta Tags Tab */}
                {seoTab === 'meta' && (
                  <div className="space-y-4">
                    <div className="bg-background p-4 rounded-lg border border-border">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-medium">Meta Description</h4>
                        <Badge
                          variant={getMetaDescriptionStatus() === 'good' ? 'success' : getMetaDescriptionStatus() === 'warning' ? 'warning' : 'error'}
                          size="sm"
                        >
                          {getMetaDescriptionStatus() === 'good' ? 'Good' : getMetaDescriptionStatus() === 'warning' ? 'Too Long' : 'Missing/Too Short'}
                        </Badge>
                      </div>
                      <div className="bg-background-dark p-3 rounded text-sm">
                        {result.seoData.metaDescription || 'Not found'}
                      </div>
                      {result.seoData.metaDescription && (
                        <div className="flex items-center mt-2">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${
                                result.seoData.metaDescription.length < 50 ? 'bg-error' :
                                result.seoData.metaDescription.length > 160 ? 'bg-warning' : 'bg-success'
                              }`}
                              style={{ width: `${Math.min(100, (result.seoData.metaDescription.length / 160) * 100)}%` }}
                            ></div>
                          </div>
                          <span className="ml-2 text-xs text-text-light">{result.seoData.metaDescription.length}/160</span>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-background p-4 rounded-lg border border-border">
                        <h4 className="text-sm font-medium mb-2">Meta Keywords</h4>
                        <div className="bg-background-dark p-3 rounded text-sm">
                          {result.seoData.metaKeywords || 'Not found'}
                        </div>
                      </div>

                      <div className="bg-background p-4 rounded-lg border border-border">
                        <h4 className="text-sm font-medium mb-2">Canonical URL</h4>
                        <div className="bg-background-dark p-3 rounded text-sm">
                          {result.seoData.canonicalUrl || 'Not found'}
                        </div>
                      </div>
                    </div>

                    <div className="bg-background p-4 rounded-lg border border-border">
                      <h4 className="text-sm font-medium mb-2">Robots Directive</h4>
                      <div className="bg-background-dark p-3 rounded text-sm">
                        {result.seoData.robotsTxt || 'Not specified'}
                      </div>
                    </div>
                  </div>
                )}

                {/* Social Media Tab */}
                {seoTab === 'social' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-background p-4 rounded-lg border border-border">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-sm font-medium">Open Graph Tags</h4>
                          <Badge
                            variant={result.seoData.ogTags && Object.keys(result.seoData.ogTags).length > 0 ? 'success' : 'warning'}
                            size="sm"
                          >
                            {result.seoData.ogTags && Object.keys(result.seoData.ogTags).length > 0 ? 'Present' : 'Missing'}
                          </Badge>
                        </div>

                        {result.seoData.ogTags && Object.keys(result.seoData.ogTags).length > 0 ? (
                          <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1">
                            {Object.entries(result.seoData.ogTags).map(([key, value]) => (
                              <div key={key} className="bg-background-dark p-2 rounded">
                                <div className="text-xs font-medium text-primary">og:{key}</div>
                                <div className="text-sm mt-1 break-words">{value}</div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="bg-background-dark p-3 rounded text-sm text-text-light">
                            No Open Graph tags found
                          </div>
                        )}
                      </div>

                      <div className="bg-background p-4 rounded-lg border border-border">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-sm font-medium">Twitter Card Tags</h4>
                          <Badge
                            variant={result.seoData.twitterTags && Object.keys(result.seoData.twitterTags).length > 0 ? 'success' : 'warning'}
                            size="sm"
                          >
                            {result.seoData.twitterTags && Object.keys(result.seoData.twitterTags).length > 0 ? 'Present' : 'Missing'}
                          </Badge>
                        </div>

                        {result.seoData.twitterTags && Object.keys(result.seoData.twitterTags).length > 0 ? (
                          <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1">
                            {Object.entries(result.seoData.twitterTags).map(([key, value]) => (
                              <div key={key} className="bg-background-dark p-2 rounded">
                                <div className="text-xs font-medium text-primary">twitter:{key}</div>
                                <div className="text-sm mt-1 break-words">{value}</div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="bg-background-dark p-3 rounded text-sm text-text-light">
                            No Twitter Card tags found
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="bg-background p-4 rounded-lg border border-border">
                      <h4 className="text-sm font-medium mb-2">Authorship & Publisher Information</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-background-dark p-3 rounded">
                          <div className="text-xs font-medium text-text-light mb-1">Author</div>
                          <div className="text-sm">
                            {result.seoData.authorInfo}
                          </div>
                        </div>
                        <div className="bg-background-dark p-3 rounded">
                          <div className="text-xs font-medium text-text-light mb-1">Publisher</div>
                          <div className="text-sm">
                            {result.seoData.publisherInfo}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-info bg-opacity-10 p-3 rounded-lg border border-info">
                      <h4 className="text-sm font-medium text-info mb-1">Why Social Tags Matter</h4>
                      <p className="text-xs text-text-light">
                        Social media tags control how your content appears when shared on platforms like Facebook, Twitter, and LinkedIn.
                        They can significantly improve click-through rates and engagement.
                      </p>
                    </div>
                  </div>
                )}

                {/* Headings Tab */}
                {seoTab === 'headings' && (
                  <div className="space-y-4">
                    <div className="bg-background p-4 rounded-lg border border-border">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-sm font-medium">Heading Structure</h4>
                        <Badge
                          variant={result.seoData.h1Tags === 1 ? 'success' : 'warning'}
                          size="sm"
                        >
                          {result.seoData.h1Tags === 1 ? 'Good' : result.seoData.h1Tags === 0 ? 'Missing H1' : 'Multiple H1s'}
                        </Badge>
                      </div>

                      <div className="flex items-center mb-3">
                        <div className="w-16 text-xs font-medium">H1 Tags:</div>
                        <div className="flex-1 flex items-center">
                          <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                            <div
                              className={`h-2 rounded-full ${result.seoData.h1Tags === 1 ? 'bg-success' : 'bg-error'}`}
                              style={{ width: `${Math.min(100, result.seoData.h1Tags * 100)}%` }}
                            ></div>
                          </div>
                          <span className="text-xs font-medium">{result.seoData.h1Tags}</span>
                        </div>
                      </div>

                      <div className="flex items-center mb-3">
                        <div className="w-16 text-xs font-medium">H2 Tags:</div>
                        <div className="flex-1 flex items-center">
                          <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                            <div
                              className="h-2 rounded-full bg-info"
                              style={{ width: `${Math.min(100, ((result.seoData.h2Tags || 0) / 10) * 100)}%` }}
                            ></div>
                          </div>
                          <span className="text-xs font-medium">{result.seoData.h2Tags || 0}</span>
                        </div>
                      </div>

                      <div className="flex items-center">
                        <div className="w-16 text-xs font-medium">H3 Tags:</div>
                        <div className="flex-1 flex items-center">
                          <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                            <div
                              className="h-2 rounded-full bg-secondary"
                              style={{ width: `${Math.min(100, ((result.seoData.h3Tags || 0) / 15) * 100)}%` }}
                            ></div>
                          </div>
                          <span className="text-xs font-medium">{result.seoData.h3Tags || 0}</span>
                        </div>
                      </div>
                    </div>

                    {result.seoData.headingStructure && result.seoData.headingStructure.length > 0 ? (
                      <div className="bg-background p-4 rounded-lg border border-border">
                        <h4 className="text-sm font-medium mb-3">Heading Content</h4>
                        <div className="space-y-2 max-h-[250px] overflow-y-auto pr-1">
                          {result.seoData.headingStructure.map((heading, index) => (
                            <div key={index} className="flex items-start bg-background-dark p-2 rounded">
                              <Badge
                                variant={heading.level === 1 ? 'primary' :
                                        heading.level === 2 ? 'info' :
                                        heading.level === 3 ? 'secondary' : 'default'}
                                size="sm"
                                className="mt-0.5 mr-2 flex-shrink-0"
                              >
                                H{heading.level}
                              </Badge>
                              <span
                                className={`text-sm ${
                                  heading.level === 1 ? 'font-bold' :
                                  heading.level === 2 ? 'font-semibold' :
                                  heading.level === 3 ? 'font-medium' : ''
                                }`}
                              >
                                {heading.text}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="bg-background p-4 rounded-lg border border-border">
                        <p className="text-sm text-text-light">No headings found on this page</p>
                      </div>
                    )}

                    <div className="bg-background-dark p-3 rounded-lg">
                      <h4 className="text-sm font-medium mb-2">Heading Best Practices</h4>
                      <ul className="list-disc pl-5 text-xs space-y-1 text-text-light">
                        <li>Use exactly one H1 tag that describes the main topic of your page</li>
                        <li>Structure your content with H2 tags for main sections</li>
                        <li>Use H3-H6 tags for subsections in a hierarchical manner</li>
                        <li>Include keywords in your headings, but keep them natural and readable</li>
                      </ul>
                    </div>
                  </div>
                )}

                {/* Technical Tab */}
                {seoTab === 'technical' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-background p-4 rounded-lg border border-border">
                        <h4 className="text-sm font-medium mb-2">Internal Links</h4>
                        <div className="flex items-center">
                          <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                            <div
                              className="h-2.5 rounded-full bg-primary"
                              style={{ width: `${Math.min(100, ((result.seoData.internalLinks || 0) / 30) * 100)}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium">{result.seoData.internalLinks || 0}</span>
                        </div>
                        <p className="text-xs text-text-light mt-2">
                          Internal links help search engines discover and understand your site structure
                        </p>
                      </div>

                      <div className="bg-background p-4 rounded-lg border border-border">
                        <h4 className="text-sm font-medium mb-2">External Links</h4>
                        <div className="flex items-center">
                          <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                            <div
                              className="h-2.5 rounded-full bg-secondary"
                              style={{ width: `${Math.min(100, ((result.seoData.externalLinks || 0) / 15) * 100)}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium">{result.seoData.externalLinks || 0}</span>
                        </div>
                        <p className="text-xs text-text-light mt-2">
                          External links to reputable sources can improve your site's credibility
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-background p-4 rounded-lg border border-border">
                        <h4 className="text-sm font-medium mb-2">Schema.org Markup</h4>
                        <div className="flex items-center">
                          <Badge
                            variant={result.seoData.hasSchema ? 'success' : 'warning'}
                            size="md"
                          >
                            {result.seoData.hasSchema ? 'Present' : 'Missing'}
                          </Badge>
                        </div>
                        <p className="text-xs text-text-light mt-2">
                          Schema markup helps search engines understand your content and can enable rich results
                        </p>
                      </div>

                      <div className="bg-background p-4 rounded-lg border border-border">
                        <h4 className="text-sm font-medium mb-2">Language</h4>
                        <div className="flex items-center">
                          <Badge
                            variant={result.seoData.langAttribute ? 'success' : 'warning'}
                            size="md"
                          >
                            {result.seoData.langAttribute || 'Not specified'}
                          </Badge>
                        </div>
                        <p className="text-xs text-text-light mt-2">
                          The HTML lang attribute helps search engines understand your content's language
                        </p>
                      </div>
                    </div>

                    <div className="bg-background p-4 rounded-lg border border-border">
                      <h4 className="text-sm font-medium mb-2">Mobile Optimization</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-background-dark p-3 rounded">
                          <div className="text-xs font-medium text-text-light mb-1">Viewport Meta Tag</div>
                          <div className="text-sm">
                            {result.seoData.metaViewport || 'Not specified'}
                          </div>
                          <Badge
                            variant={result.seoData.metaViewport && result.seoData.metaViewport.includes('width=device-width') ? 'success' : 'warning'}
                            size="sm"
                            className="mt-2"
                          >
                            {result.seoData.metaViewport && result.seoData.metaViewport.includes('width=device-width') ? 'Responsive' : 'Not Responsive'}
                          </Badge>
                        </div>
                        <div className="bg-background-dark p-3 rounded">
                          <div className="text-xs font-medium text-text-light mb-1">AMP Support</div>
                          <div className="text-sm">
                            {result.seoData.hasAmpLink ? 'AMP version available' : 'No AMP version detected'}
                          </div>
                          <Badge
                            variant={result.seoData.hasAmpLink ? 'success' : 'default'}
                            size="sm"
                            className="mt-2"
                          >
                            {result.seoData.hasAmpLink ? 'Present' : 'Not Used'}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <div className="bg-background-dark p-3 rounded-lg">
                      <h4 className="text-sm font-medium mb-2">Technical SEO Tips</h4>
                      <ul className="list-disc pl-5 text-xs space-y-1 text-text-light">
                        <li>Ensure your site has a valid SSL certificate (HTTPS)</li>
                        <li>Optimize page load speed for better rankings</li>
                        <li>Make sure your site is mobile-friendly</li>
                        <li>Create and submit an XML sitemap to search engines</li>
                        <li>Implement proper URL structure with keywords</li>
                        <li>Fix broken links and implement proper redirects</li>
                      </ul>
                    </div>
                  </div>
                )}

                {/* Advanced Tab */}
                {seoTab === 'advanced' && (
                  <div className="space-y-4">
                    <div className="bg-background p-4 rounded-lg border border-border">
                      <h4 className="text-sm font-medium mb-3">Content Quality Indicators</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-background-dark p-3 rounded">
                          <div className="text-xs font-medium text-text-light mb-1">Title Length</div>
                          <div className="flex items-center">
                            <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                              <div
                                className={`h-2 rounded-full ${
                                  !result.seoData.titleLength ? 'bg-warning' :
                                  result.seoData.titleLength < 30 ? 'bg-warning' :
                                  result.seoData.titleLength > 60 ? 'bg-warning' : 'bg-success'
                                }`}
                                style={{ width: `${Math.min(100, ((result.seoData.titleLength || 0) / 70) * 100)}%` }}
                              ></div>
                            </div>
                            <span className="text-xs">{result.seoData.titleLength || 0} chars</span>
                          </div>
                          <p className="text-xs text-text-light mt-1">
                            Optimal title length: 30-60 characters
                          </p>
                        </div>

                        <div className="bg-background-dark p-3 rounded">
                          <div className="text-xs font-medium text-text-light mb-1">URL Length</div>
                          <div className="flex items-center">
                            <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                              <div
                                className={`h-2 rounded-full ${
                                  result.seoData.urlLength && result.seoData.urlLength > 100 ? 'bg-warning' : 'bg-success'
                                }`}
                                style={{ width: `${Math.min(100, ((result.seoData.urlLength || 0) / 120) * 100)}%` }}
                              ></div>
                            </div>
                            <span className="text-xs">{result.seoData.urlLength || 0} chars</span>
                          </div>
                          <p className="text-xs text-text-light mt-1">
                            Shorter URLs tend to rank better
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-background p-4 rounded-lg border border-border">
                      <h4 className="text-sm font-medium mb-3">Keyword Analysis</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-background-dark p-3 rounded">
                          <div className="text-xs font-medium text-text-light mb-1">Title Keyword Match</div>
                          <Badge
                            variant={result.seoData.pageTitleKeywordMatch ? 'success' : 'warning'}
                            size="md"
                          >
                            {result.seoData.pageTitleKeywordMatch ? 'Keywords Present' : 'No Keyword Match'}
                          </Badge>
                          <p className="text-xs text-text-light mt-2">
                            Title contains keywords from meta tags
                          </p>
                        </div>

                        <div className="bg-background-dark p-3 rounded">
                          <div className="text-xs font-medium text-text-light mb-1">URL Keyword Match</div>
                          <Badge
                            variant={result.seoData.urlHasKeywords ? 'success' : 'warning'}
                            size="md"
                          >
                            {result.seoData.urlHasKeywords ? 'Keywords Present' : 'No Keyword Match'}
                          </Badge>
                          <p className="text-xs text-text-light mt-2">
                            URL contains keywords from meta tags
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-background p-4 rounded-lg border border-border">
                      <h4 className="text-sm font-medium mb-3">Internationalization</h4>
                      {result.seoData.hreflangTags && Object.keys(result.seoData.hreflangTags).length > 0 ? (
                        <div className="space-y-2 max-h-[150px] overflow-y-auto pr-1">
                          {Object.entries(result.seoData.hreflangTags).map(([lang, url]) => (
                            <div key={lang} className="bg-background-dark p-2 rounded flex justify-between">
                              <div className="text-xs font-medium">{lang}</div>
                              <div className="text-xs text-primary truncate max-w-[250px]">{url}</div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="bg-background-dark p-3 rounded text-sm">
                          No hreflang tags found. These tags help search engines understand which language you are using on a specific page.
                        </div>
                      )}
                    </div>

                    <div className="bg-background p-4 rounded-lg border border-border">
                      <h4 className="text-sm font-medium mb-3">Content Quality Metrics</h4>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="bg-background-dark p-3 rounded">
                          <div className="text-xs font-medium text-text-light mb-1">Word Count</div>
                          <div className="text-lg font-semibold">
                            {result.seoData.wordCount?.toLocaleString() || 'N/A'}
                          </div>
                          <Badge
                            variant={(result.seoData.wordCount || 0) > 300 ? 'success' : 'warning'}
                            size="sm"
                            className="mt-2"
                          >
                            {(result.seoData.wordCount || 0) > 1000 ? 'Excellent' :
                             (result.seoData.wordCount || 0) > 600 ? 'Good' :
                             (result.seoData.wordCount || 0) > 300 ? 'Acceptable' : 'Too Short'}
                          </Badge>
                        </div>

                        <div className="bg-background-dark p-3 rounded">
                          <div className="text-xs font-medium text-text-light mb-1">Readability Score</div>
                          <div className="text-lg font-semibold">
                            {result.seoData.readabilityScore || 'N/A'}
                          </div>
                          <Badge
                            variant={
                              (result.seoData.readabilityScore || 0) >= 60 && (result.seoData.readabilityScore || 0) <= 80 ? 'success' :
                              (result.seoData.readabilityScore || 0) > 80 ? 'warning' : 'error'
                            }
                            size="sm"
                            className="mt-2"
                          >
                            {(result.seoData.readabilityScore || 0) >= 90 ? 'Very Easy' :
                             (result.seoData.readabilityScore || 0) >= 80 ? 'Easy' :
                             (result.seoData.readabilityScore || 0) >= 70 ? 'Fairly Easy' :
                             (result.seoData.readabilityScore || 0) >= 60 ? 'Standard' :
                             (result.seoData.readabilityScore || 0) >= 50 ? 'Fairly Difficult' :
                             (result.seoData.readabilityScore || 0) >= 30 ? 'Difficult' : 'Very Difficult'}
                          </Badge>
                        </div>

                        <div className="bg-background-dark p-3 rounded">
                          <div className="text-xs font-medium text-text-light mb-1">Text/HTML Ratio</div>
                          <div className="text-lg font-semibold">
                            {result.seoData.textToHtmlRatio ? `${(result.seoData.textToHtmlRatio * 100).toFixed(1)}%` : 'N/A'}
                          </div>
                          <Badge
                            variant={(result.seoData.textToHtmlRatio || 0) > 0.15 ? 'success' : 'warning'}
                            size="sm"
                            className="mt-2"
                          >
                            {(result.seoData.textToHtmlRatio || 0) > 0.25 ? 'Excellent' :
                             (result.seoData.textToHtmlRatio || 0) > 0.15 ? 'Good' :
                             (result.seoData.textToHtmlRatio || 0) > 0.1 ? 'Acceptable' : 'Poor'}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    {result.seoData.keywordDensity && Object.keys(result.seoData.keywordDensity).length > 0 && (
                      <div className="bg-background p-4 rounded-lg border border-border">
                        <h4 className="text-sm font-medium mb-3">Keyword Density</h4>
                        <div className="space-y-2 max-h-[150px] overflow-y-auto pr-1">
                          {Object.entries(result.seoData.keywordDensity).map(([keyword, density]) => (
                            <div key={keyword} className="bg-background-dark p-2 rounded flex justify-between items-center">
                              <div className="text-sm font-medium">{keyword}</div>
                              <div className="flex items-center">
                                <div className="w-24 bg-gray-200 rounded-full h-2 mr-2">
                                  <div
                                    className={`h-2 rounded-full ${
                                      density > 3 ? 'bg-warning' :
                                      density < 0.5 ? 'bg-warning' : 'bg-success'
                                    }`}
                                    style={{ width: `${Math.min(100, density * 20)}%` }}
                                  ></div>
                                </div>
                                <span className="text-xs">{density}%</span>
                              </div>
                            </div>
                          ))}
                        </div>
                        <p className="text-xs text-text-light mt-2">
                          Optimal keyword density is typically between 0.5% and 3%
                        </p>
                      </div>
                    )}

                    <div className="bg-info bg-opacity-10 p-3 rounded-lg border border-info">
                      <h4 className="text-sm font-medium text-info mb-1">Advanced SEO Tips</h4>
                      <p className="text-xs text-text-light">
                        Advanced SEO goes beyond basic optimization to include semantic markup, entity relationships,
                        and content relevance signals that help search engines better understand your content.
                      </p>
                    </div>
                  </div>
                )}

                {/* Search Engines Tab */}
                {seoTab === 'search-engines' && (
                  <div className="space-y-4">
                    <div className="bg-background p-4 rounded-lg border border-border">
                      <h4 className="text-sm font-medium mb-3">Search Engine Directives</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-background-dark p-3 rounded">
                          <div className="text-xs font-medium text-text-light mb-1">Robots Directive</div>
                          <div className="text-sm font-medium">
                            {result.seoData.robotsTxt || 'Not specified'}
                          </div>
                          <Badge
                            variant={
                              result.seoData.robotsTxt &&
                              (result.seoData.robotsTxt.includes('noindex') ||
                               result.seoData.robotsTxt.includes('nofollow')) ?
                              'warning' : 'success'
                            }
                            size="sm"
                            className="mt-2"
                          >
                            {result.seoData.robotsTxt &&
                             (result.seoData.robotsTxt.includes('noindex') ||
                              result.seoData.robotsTxt.includes('nofollow')) ?
                             'Restricted' : 'Indexable'}
                          </Badge>
                        </div>

                        <div className="bg-background-dark p-3 rounded">
                          <div className="text-xs font-medium text-text-light mb-1">Canonical URL</div>
                          <div className="text-sm truncate" title={result.seoData.canonicalUrl}>
                            {result.seoData.canonicalUrl || 'Not specified'}
                          </div>
                          <Badge
                            variant={result.seoData.canonicalUrl ? 'success' : 'warning'}
                            size="sm"
                            className="mt-2"
                          >
                            {result.seoData.canonicalUrl ? 'Present' : 'Missing'}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <div className="bg-background p-4 rounded-lg border border-border">
                      <h4 className="text-sm font-medium mb-3">Indexing Status</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-background-dark p-3 rounded">
                          <div className="text-xs font-medium text-text-light mb-1">Sitemap</div>
                          <Badge
                            variant={result.seoData.hasSitemap ? 'success' : 'warning'}
                            size="md"
                          >
                            {result.seoData.hasSitemap ? 'Referenced' : 'Not Referenced'}
                          </Badge>
                          <p className="text-xs text-text-light mt-2">
                            XML sitemaps help search engines discover and index your content
                          </p>
                        </div>

                        <div className="bg-background-dark p-3 rounded">
                          <div className="text-xs font-medium text-text-light mb-1">Content Type</div>
                          <Badge
                            variant={result.seoData.hasTextHtml ? 'success' : 'default'}
                            size="md"
                          >
                            {result.seoData.hasTextHtml ? 'text/html' : 'Not Specified'}
                          </Badge>
                          <p className="text-xs text-text-light mt-2">
                            Proper content type helps search engines process your page correctly
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-background p-4 rounded-lg border border-border">
                      <h4 className="text-sm font-medium mb-3">Search Engine Features</h4>
                      <div className="grid grid-cols-3 gap-3">
                        <div className="bg-background-dark p-3 rounded flex flex-col items-center">
                          <div className="text-xs font-medium text-text-light mb-1">Rich Results</div>
                          <Badge
                            variant={result.seoData.hasSchema ? 'success' : 'warning'}
                            size="sm"
                          >
                            {result.seoData.hasSchema ? 'Eligible' : 'Not Eligible'}
                          </Badge>
                        </div>

                        <div className="bg-background-dark p-3 rounded flex flex-col items-center">
                          <div className="text-xs font-medium text-text-light mb-1">Social Cards</div>
                          <Badge
                            variant={
                              (result.seoData.hasOpenGraph || result.seoData.hasTwitterCards) ?
                              'success' : 'warning'
                            }
                            size="sm"
                          >
                            {(result.seoData.hasOpenGraph || result.seoData.hasTwitterCards) ?
                             'Enabled' : 'Not Enabled'}
                          </Badge>
                        </div>

                        <div className="bg-background-dark p-3 rounded flex flex-col items-center">
                          <div className="text-xs font-medium text-text-light mb-1">Mobile</div>
                          <Badge
                            variant={result.seoData.metaViewport ? 'success' : 'warning'}
                            size="sm"
                          >
                            {result.seoData.metaViewport ? 'Optimized' : 'Not Optimized'}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <div className="bg-background p-4 rounded-lg border border-border">
                      <h4 className="text-sm font-medium mb-3">Security Headers</h4>
                      <div className="space-y-2">
                        {result.seoData.securityHeaders && Object.entries(result.seoData.securityHeaders).map(([header, present]) => (
                          <div key={header} className="bg-background-dark p-2 rounded flex justify-between items-center">
                            <div className="text-sm font-medium">{header}</div>
                            <Badge
                              variant={present ? 'success' : 'warning'}
                              size="sm"
                            >
                              {present ? 'Present' : 'Missing'}
                            </Badge>
                          </div>
                        ))}
                      </div>
                      <p className="text-xs text-text-light mt-2">
                        Security headers help protect your site from common web vulnerabilities and can improve your security posture.
                      </p>
                    </div>

                    <div className="bg-background p-4 rounded-lg border border-border">
                      <h4 className="text-sm font-medium mb-3">Publication Information</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-background-dark p-3 rounded">
                          <div className="text-xs font-medium text-text-light mb-1">Published Date</div>
                          <div className="text-sm">
                            {result.seoData.articlePublishedTime && result.seoData.articlePublishedTime !== 'Not specified' ?
                              new Date(result.seoData.articlePublishedTime).toLocaleDateString() :
                              'Not specified'}
                          </div>
                        </div>
                        <div className="bg-background-dark p-3 rounded">
                          <div className="text-xs font-medium text-text-light mb-1">Last Modified</div>
                          <div className="text-sm">
                            {result.seoData.articleModifiedTime && result.seoData.articleModifiedTime !== 'Not specified' ?
                              new Date(result.seoData.articleModifiedTime).toLocaleDateString() :
                              'Not specified'}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-warning bg-opacity-10 p-3 rounded-lg border border-warning">
                      <h4 className="text-sm font-medium text-warning mb-1">Search Engine Guidelines</h4>
                      <p className="text-xs text-text-light">
                        Follow search engine guidelines to avoid penalties. Ensure your content is original,
                        valuable to users, and doesn't employ deceptive practices. Focus on creating high-quality
                        content that naturally attracts links and engagement.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </section>
            )}

            {/* Performance Section - Show for overview and performance tabs */}
            {(activeTab === 'overview' || activeTab === 'performance') && (
            <section className="bg-white rounded-lg shadow-sm border border-border overflow-hidden">
              <div className="flex items-center justify-between p-3 bg-background-dark">
                <h3 className="text-md font-semibold text-text flex items-center">
                  <svg className="w-5 h-5 mr-2 text-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Performance Analysis
                </h3>
                <div className="flex space-x-1">
                  <Badge
                    variant={
                      result.performanceData.domNodes < 1000 &&
                      result.performanceData.scripts < 10 &&
                      result.performanceData.stylesheets < 5 ?
                      'success' : 'warning'
                    }
                    size="sm"
                  >
                    {result.performanceData.domNodes < 1000 &&
                     result.performanceData.scripts < 10 &&
                     result.performanceData.stylesheets < 5 ?
                     'Fast' : 'Average'}
                  </Badge>
                </div>
              </div>

              {/* Performance Tabs */}
              <div className="flex border-b border-border">
                <button
                  className={`px-4 py-2 text-sm font-medium ${perfTab === 'resources' ? 'text-primary border-b-2 border-primary' : 'text-text-light hover:text-text'}`}
                  onClick={() => setPerfTab('resources')}
                >
                  Resources
                </button>
                <button
                  className={`px-4 py-2 text-sm font-medium ${perfTab === 'scripts' ? 'text-primary border-b-2 border-primary' : 'text-text-light hover:text-text'}`}
                  onClick={() => setPerfTab('scripts')}
                >
                  Scripts
                </button>
              </div>

              <div className="p-4">
                {/* Resources Tab */}
                {perfTab === 'resources' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-background p-4 rounded-lg border border-border flex flex-col items-center">
                        <div className="text-xs text-text-light mb-1">DOM Nodes</div>
                        <div className={`text-lg font-bold ${
                          (result.performanceData.domNodes || 0) < 1000 ? 'text-success' :
                          (result.performanceData.domNodes || 0) < 2000 ? 'text-warning' : 'text-error'
                        }`}>
                          {result.performanceData.domNodes || 0}
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                          <div
                            className={`h-1.5 rounded-full ${
                              (result.performanceData.domNodes || 0) < 1000 ? 'bg-success' :
                              (result.performanceData.domNodes || 0) < 2000 ? 'bg-warning' : 'bg-error'
                            }`}
                            style={{ width: `${Math.min(100, ((result.performanceData.domNodes || 0) / 3000) * 100)}%` }}
                          ></div>
                        </div>
                      </div>

                      <div className="bg-background p-4 rounded-lg border border-border flex flex-col items-center">
                        <div className="text-xs text-text-light mb-1">Scripts</div>
                        <div className={`text-lg font-bold ${
                          (result.performanceData.scripts || 0) < 10 ? 'text-success' :
                          (result.performanceData.scripts || 0) < 20 ? 'text-warning' : 'text-error'
                        }`}>
                          {result.performanceData.scripts || 0}
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                          <div
                            className={`h-1.5 rounded-full ${
                              (result.performanceData.scripts || 0) < 10 ? 'bg-success' :
                              (result.performanceData.scripts || 0) < 20 ? 'bg-warning' : 'bg-error'
                            }`}
                            style={{ width: `${Math.min(100, ((result.performanceData.scripts || 0) / 30) * 100)}%` }}
                          ></div>
                        </div>
                      </div>

                      <div className="bg-background p-4 rounded-lg border border-border flex flex-col items-center">
                        <div className="text-xs text-text-light mb-1">Stylesheets</div>
                        <div className={`text-lg font-bold ${
                          (result.performanceData.stylesheets || 0) < 5 ? 'text-success' :
                          (result.performanceData.stylesheets || 0) < 10 ? 'text-warning' : 'text-error'
                        }`}>
                          {result.performanceData.stylesheets || 0}
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                          <div
                            className={`h-1.5 rounded-full ${
                              (result.performanceData.stylesheets || 0) < 5 ? 'bg-success' :
                              (result.performanceData.stylesheets || 0) < 10 ? 'bg-warning' : 'bg-error'
                            }`}
                            style={{ width: `${Math.min(100, ((result.performanceData.stylesheets || 0) / 15) * 100)}%` }}
                          ></div>
                        </div>
                      </div>

                      <div className="bg-background p-4 rounded-lg border border-border flex flex-col items-center">
                        <div className="text-xs text-text-light mb-1">Images</div>
                        <div className="text-lg font-bold text-info">
                          {result.performanceData.images || 0}
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                          <div
                            className="h-1.5 rounded-full bg-info"
                            style={{ width: `${Math.min(100, ((result.performanceData.images || 0) / 50) * 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-background p-4 rounded-lg border border-border">
                      <h4 className="text-sm font-medium mb-3">Resource Optimization</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs text-text-light">iFrames</span>
                            <Badge
                              variant={(result.performanceData.iframes || 0) === 0 ? 'success' : 'warning'}
                              size="sm"
                            >
                              {result.performanceData.iframes || 0}
                            </Badge>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-1.5">
                            <div
                              className={`h-1.5 rounded-full ${
                                (result.performanceData.iframes || 0) === 0 ? 'bg-success' : 'bg-warning'
                              }`}
                              style={{ width: `${Math.min(100, (result.performanceData.iframes || 0) * 50)}%` }}
                            ></div>
                          </div>
                          <p className="text-xs text-text-light mt-1">
                            iFrames can slow down page loading and affect performance
                          </p>
                        </div>

                        {result.performanceData.lazyLoadedImages !== undefined && (
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs text-text-light">Lazy Loaded Images</span>
                              <Badge
                                variant={
                                  result.performanceData.lazyLoadedImages / Math.max(1, result.performanceData.images) > 0.7 ?
                                  'success' : 'warning'
                                }
                                size="sm"
                              >
                                {result.performanceData.lazyLoadedImages}/{result.performanceData.images}
                              </Badge>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-1.5">
                              <div
                                className="h-1.5 rounded-full bg-success"
                                style={{
                                  width: `${Math.min(100, (result.performanceData.lazyLoadedImages / Math.max(1, result.performanceData.images)) * 100)}%`
                                }}
                              ></div>
                            </div>
                            <p className="text-xs text-text-light mt-1">
                              Lazy loading defers loading of off-screen images until needed
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="bg-background-dark p-3 rounded-lg">
                      <h4 className="text-sm font-medium mb-2">Performance Tips</h4>
                      <ul className="list-disc pl-5 text-xs space-y-1 text-text-light">
                        <li>Minimize DOM size (ideally under 1,500 nodes)</li>
                        <li>Reduce the number of scripts and stylesheets</li>
                        <li>Optimize and compress images</li>
                        <li>Use lazy loading for images below the fold</li>
                        <li>Minimize third-party scripts that can block rendering</li>
                      </ul>
                    </div>
                  </div>
                )}

                {/* Scripts Tab */}
                {perfTab === 'scripts' && (
                  <div className="space-y-4">
                    {result.performanceData.thirdPartyScripts && result.performanceData.thirdPartyScripts.length > 0 ? (
                      <div className="bg-background p-4 rounded-lg border border-border">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-sm font-medium">Third-Party Scripts</h4>
                          <Badge
                            variant={
                              result.performanceData.thirdPartyScripts.filter(s => !s.async && !s.defer).length === 0 ?
                              'success' : 'warning'
                            }
                            size="sm"
                          >
                            {result.performanceData.thirdPartyScripts.length} scripts
                          </Badge>
                        </div>

                        <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                          {result.performanceData.thirdPartyScripts.map((script, index) => (
                            <div key={index} className="bg-background-dark p-3 rounded text-sm">
                              <div className="flex items-center justify-between">
                                <span className="font-medium">{script.domain}</span>
                                <div className="flex space-x-1">
                                  {script.async && <Badge variant="success" size="sm">async</Badge>}
                                  {script.defer && <Badge variant="info" size="sm">defer</Badge>}
                                  {!script.async && !script.defer && <Badge variant="warning" size="sm">blocking</Badge>}
                                </div>
                              </div>
                              <div className="text-xs text-text-light mt-1 truncate" title={script.url}>
                                {script.url}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="bg-background p-4 rounded-lg border border-border">
                        <p className="text-sm text-text-light">No third-party scripts detected</p>
                      </div>
                    )}

                    <div className="bg-background p-4 rounded-lg border border-border">
                      <h4 className="text-sm font-medium mb-2">Script Loading</h4>
                      <div className="grid grid-cols-3 gap-3">
                        <div className="bg-background-dark p-3 rounded flex flex-col items-center">
                          <div className="text-xs text-text-light mb-1">Async</div>
                          <div className="text-lg font-bold text-success">
                            {result.performanceData.thirdPartyScripts ?
                              result.performanceData.thirdPartyScripts.filter(s => s.async).length : 0}
                          </div>
                        </div>
                        <div className="bg-background-dark p-3 rounded flex flex-col items-center">
                          <div className="text-xs text-text-light mb-1">Defer</div>
                          <div className="text-lg font-bold text-info">
                            {result.performanceData.thirdPartyScripts ?
                              result.performanceData.thirdPartyScripts.filter(s => s.defer).length : 0}
                          </div>
                        </div>
                        <div className="bg-background-dark p-3 rounded flex flex-col items-center">
                          <div className="text-xs text-text-light mb-1">Blocking</div>
                          <div className="text-lg font-bold text-warning">
                            {result.performanceData.thirdPartyScripts ?
                              result.performanceData.thirdPartyScripts.filter(s => !s.async && !s.defer).length : 0}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-info bg-opacity-10 p-3 rounded-lg border border-info">
                      <h4 className="text-sm font-medium text-info mb-1">Script Loading Best Practices</h4>
                      <p className="text-xs text-text-light mb-2">
                        Use async or defer attributes to prevent scripts from blocking page rendering:
                      </p>
                      <ul className="list-disc pl-5 text-xs space-y-1 text-text-light">
                        <li><strong>async</strong>: Script downloads in parallel and executes as soon as it's available</li>
                        <li><strong>defer</strong>: Script downloads in parallel but executes after HTML parsing is complete</li>
                        <li><strong>blocking</strong>: Script blocks HTML parsing until it downloads and executes</li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </section>
            )}

            {/* Accessibility Section - Show for overview and accessibility tabs */}
            {(activeTab === 'overview' || activeTab === 'accessibility') && (
            <section className="bg-white rounded-lg shadow-sm border border-border overflow-hidden">
              <div className="flex items-center justify-between p-3 bg-background-dark">
                <h3 className="text-md font-semibold text-text flex items-center">
                  <svg className="w-5 h-5 mr-2 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  Accessibility Analysis
                </h3>
                <div className="flex space-x-1">
                  <Badge
                    variant={
                      (result.accessibilityData.imagesWithoutAlt || 0) === 0 &&
                      (result.accessibilityData.formInputsWithoutLabels || 0) === 0 ?
                      'success' : 'warning'
                    }
                    size="sm"
                  >
                    {(result.accessibilityData.imagesWithoutAlt || 0) === 0 &&
                     (result.accessibilityData.formInputsWithoutLabels || 0) === 0 ?
                     'Good' : 'Needs Improvement'}
                  </Badge>
                </div>
              </div>

              {/* Accessibility Tabs */}
              <div className="flex border-b border-border">
                <button
                  className={`px-4 py-2 text-sm font-medium ${a11yTab === 'metrics' ? 'text-primary border-b-2 border-primary' : 'text-text-light hover:text-text'}`}
                  onClick={() => setA11yTab('metrics')}
                >
                  Metrics
                </button>
                <button
                  className={`px-4 py-2 text-sm font-medium ${a11yTab === 'tips' ? 'text-primary border-b-2 border-primary' : 'text-text-light hover:text-text'}`}
                  onClick={() => setA11yTab('tips')}
                >
                  Best Practices
                </button>
              </div>

              <div className="p-4">
                {/* Metrics Tab */}
                {a11yTab === 'metrics' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div className="bg-background p-4 rounded-lg border border-border flex flex-col items-center">
                        <div className="text-xs text-text-light mb-1">Images without Alt</div>
                        <div className={`text-lg font-bold ${
                          (result.accessibilityData.imagesWithoutAlt || 0) === 0 ? 'text-success' :
                          (result.accessibilityData.imagesWithoutAlt || 0) < 5 ? 'text-warning' : 'text-error'
                        }`}>
                          {result.accessibilityData.imagesWithoutAlt || 0}
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                          <div
                            className={`h-1.5 rounded-full ${
                              (result.accessibilityData.imagesWithoutAlt || 0) === 0 ? 'bg-success' :
                              (result.accessibilityData.imagesWithoutAlt || 0) < 5 ? 'bg-warning' : 'bg-error'
                            }`}
                            style={{ width: `${Math.min(100, ((result.accessibilityData.imagesWithoutAlt || 0) / 10) * 100)}%` }}
                          ></div>
                        </div>
                      </div>

                      <div className="bg-background p-4 rounded-lg border border-border flex flex-col items-center">
                        <div className="text-xs text-text-light mb-1">Inputs without Labels</div>
                        <div className={`text-lg font-bold ${
                          (result.accessibilityData.formInputsWithoutLabels || 0) === 0 ? 'text-success' :
                          (result.accessibilityData.formInputsWithoutLabels || 0) < 3 ? 'text-warning' : 'text-error'
                        }`}>
                          {result.accessibilityData.formInputsWithoutLabels || 0}
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                          <div
                            className={`h-1.5 rounded-full ${
                              (result.accessibilityData.formInputsWithoutLabels || 0) === 0 ? 'bg-success' :
                              (result.accessibilityData.formInputsWithoutLabels || 0) < 3 ? 'bg-warning' : 'bg-error'
                            }`}
                            style={{ width: `${Math.min(100, ((result.accessibilityData.formInputsWithoutLabels || 0) / 5) * 100)}%` }}
                          ></div>
                        </div>
                      </div>

                      {result.accessibilityData.lowContrastElements !== undefined && (
                        <div className="bg-background p-4 rounded-lg border border-border flex flex-col items-center">
                          <div className="text-xs text-text-light mb-1">Low Contrast Elements</div>
                          <div className={`text-lg font-bold ${
                            (result.accessibilityData.lowContrastElements || 0) === 0 ? 'text-success' :
                            (result.accessibilityData.lowContrastElements || 0) < 5 ? 'text-warning' : 'text-error'
                          }`}>
                            {result.accessibilityData.lowContrastElements || 0}
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                            <div
                              className={`h-1.5 rounded-full ${
                                (result.accessibilityData.lowContrastElements || 0) === 0 ? 'bg-success' :
                                (result.accessibilityData.lowContrastElements || 0) < 5 ? 'bg-warning' : 'bg-error'
                              }`}
                              style={{ width: `${Math.min(100, ((result.accessibilityData.lowContrastElements || 0) / 10) * 100)}%` }}
                            ></div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="bg-background p-4 rounded-lg border border-border">
                      <h4 className="text-sm font-medium mb-3">Additional Metrics</h4>
                      <div className="grid grid-cols-2 gap-4">
                        {result.accessibilityData.ariaAttributes !== undefined && (
                          <div className="bg-background-dark p-3 rounded">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs text-text-light">ARIA Attributes</span>
                              <Badge
                                variant={
                                  result.accessibilityData.ariaAttributes > 10 ? 'success' :
                                  result.accessibilityData.ariaAttributes > 0 ? 'warning' : 'error'
                                }
                                size="sm"
                              >
                                {result.accessibilityData.ariaAttributes}
                              </Badge>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-1.5">
                              <div
                                className={`h-1.5 rounded-full ${
                                  result.accessibilityData.ariaAttributes > 10 ? 'bg-success' :
                                  result.accessibilityData.ariaAttributes > 0 ? 'bg-warning' : 'bg-error'
                                }`}
                                style={{ width: `${Math.min(100, (result.accessibilityData.ariaAttributes / 30) * 100)}%` }}
                              ></div>
                            </div>
                          </div>
                        )}

                        {result.accessibilityData.languageSpecified !== undefined && (
                          <div className="bg-background-dark p-3 rounded">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs text-text-light">Language Specified</span>
                              <Badge
                                variant={result.accessibilityData.languageSpecified ? 'success' : 'error'}
                                size="sm"
                              >
                                {result.accessibilityData.languageSpecified ? 'Yes' : 'No'}
                              </Badge>
                            </div>
                            <p className="text-xs text-text-light mt-1">
                              The HTML lang attribute helps screen readers use the correct pronunciation
                            </p>
                          </div>
                        )}

                        {result.accessibilityData.skipLinks !== undefined && (
                          <div className="bg-background-dark p-3 rounded">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs text-text-light">Skip Links</span>
                              <Badge
                                variant={result.accessibilityData.skipLinks > 0 ? 'success' : 'warning'}
                                size="sm"
                              >
                                {result.accessibilityData.skipLinks}
                              </Badge>
                            </div>
                            <p className="text-xs text-text-light mt-1">
                              Skip links allow keyboard users to bypass navigation
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Best Practices Tab */}
                {a11yTab === 'tips' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-background p-4 rounded-lg border border-border">
                        <div className="flex items-center mb-2">
                          <svg className="w-5 h-5 mr-2 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <h4 className="text-sm font-medium">Images</h4>
                        </div>
                        <p className="text-xs text-text-light">
                          All images should have descriptive alt text to help screen reader users understand the content.
                          Decorative images should use empty alt attributes (alt="").
                        </p>
                        <div className={`mt-2 p-2 rounded text-xs ${
                          result.accessibilityData.imagesWithoutAlt === 0 ? 'bg-success bg-opacity-10 text-success' : 'bg-warning bg-opacity-10 text-warning'
                        }`}>
                          {result.accessibilityData.imagesWithoutAlt === 0 ?
                            'Great! All images have alt text.' :
                            `Found ${result.accessibilityData.imagesWithoutAlt} images without alt text.`}
                        </div>
                      </div>

                      <div className="bg-background p-4 rounded-lg border border-border">
                        <div className="flex items-center mb-2">
                          <svg className="w-5 h-5 mr-2 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                          </svg>
                          <h4 className="text-sm font-medium">Form Inputs</h4>
                        </div>
                        <p className="text-xs text-text-light">
                          All form inputs should have associated labels or aria-label attributes for screen reader accessibility.
                          This ensures users understand what information is expected.
                        </p>
                        <div className={`mt-2 p-2 rounded text-xs ${
                          result.accessibilityData.formInputsWithoutLabels === 0 ? 'bg-success bg-opacity-10 text-success' : 'bg-warning bg-opacity-10 text-warning'
                        }`}>
                          {result.accessibilityData.formInputsWithoutLabels === 0 ?
                            'Great! All form inputs have labels.' :
                            `Found ${result.accessibilityData.formInputsWithoutLabels} inputs without labels.`}
                        </div>
                      </div>
                    </div>

                    <div className="bg-background p-4 rounded-lg border border-border">
                      <h4 className="text-sm font-medium mb-2">WCAG Compliance Tips</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-text-light">
                        <div>
                          <h5 className="font-medium text-primary mb-1">Perceivable</h5>
                          <ul className="list-disc pl-4 space-y-1">
                            <li>Provide text alternatives for non-text content</li>
                            <li>Provide captions and alternatives for multimedia</li>
                            <li>Create content that can be presented in different ways</li>
                            <li>Make it easy for users to see and hear content</li>
                          </ul>
                        </div>
                        <div>
                          <h5 className="font-medium text-primary mb-1">Operable</h5>
                          <ul className="list-disc pl-4 space-y-1">
                            <li>Make all functionality available from a keyboard</li>
                            <li>Give users enough time to read and use content</li>
                            <li>Do not use content that causes seizures</li>
                            <li>Help users navigate and find content</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="bg-info bg-opacity-10 p-3 rounded-lg border border-info">
                      <h4 className="text-sm font-medium text-info mb-1">Why Accessibility Matters</h4>
                      <p className="text-xs text-text-light">
                        Accessible websites can be used by everyone, including people with disabilities.
                        Implementing accessibility best practices improves usability for all users,
                        helps with SEO, and ensures compliance with legal requirements in many jurisdictions.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </section>
            )}
          </div>
        </div>

        <div className="border-t border-border p-4 flex justify-between items-center">
          <div className="text-xs text-text-light">
            Analyzed on: {new Date(result.timestamp).toLocaleString()}
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-600 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetailedView;