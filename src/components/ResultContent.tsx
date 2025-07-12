import React, { useState } from 'react';
import { AnalysisResult } from '../types';
import ExpandableDetail from './ExpandableDetail';
import Badge from './Badge';
import MetricCard from './MetricCard';
import ExportButton from './ExportButton';
import DetailedView from './DetailedView';
import TechnologyList from './TechnologyList';
import Tooltip from './Tooltip'; // Assuming you have a Tooltip component, if not we'll create one

interface ResultContentProps {
  result: AnalysisResult;
  activeTab: string;
}

const ResultContent: React.FC<ResultContentProps> = ({ result, activeTab }) => {
  const [expandedDetails, setExpandedDetails] = useState<Record<string, boolean>>({});
  const [showDetailedView, setShowDetailedView] = useState(false);

  const toggleDetail = (id: string) => {
    setExpandedDetails(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const openDetailedView = () => {
    setShowDetailedView(true);
  };

  const closeDetailedView = () => {
    setShowDetailedView(false);
  };

  // Helper function to determine SEO status
  const getSeoStatus = () => {
    const {
      h1Tags,
      metaDescription,
      hasOpenGraph,
      hasTwitterCards,
      hasSchema,
      imagesWithAlt,
      imageCount
    } = result.seoData;

    // Count positive factors
    let positiveFactors = 0;
    let totalFactors = 6;

    // Check each factor
    if (h1Tags === 1) positiveFactors++;
    if (metaDescription && metaDescription.length > 50 && metaDescription.length < 160) positiveFactors++;
    if (hasOpenGraph) positiveFactors++;
    if (hasTwitterCards) positiveFactors++;
    if (hasSchema) positiveFactors++;
    if (imagesWithAlt && imageCount && imagesWithAlt === imageCount) positiveFactors++;

    // Calculate score percentage
    const scorePercentage = (positiveFactors / totalFactors) * 100;

    if (scorePercentage >= 80) {
      return 'good';
    } else if (scorePercentage >= 50) {
      return 'warning';
    } else {
      return 'critical';
    }
  };

  // Helper function to determine performance status
  const getPerformanceStatus = () => {
    const { domNodes, scripts, stylesheets } = result.performanceData;

    if (domNodes < 1000 && scripts < 10 && stylesheets < 5) {
      return 'good';
    } else if (domNodes < 2000 && scripts < 20 && stylesheets < 10) {
      return 'warning';
    } else {
      return 'critical';
    }
  };

  // Helper function to determine accessibility status
  const getAccessibilityStatus = () => {
    const { imagesWithoutAlt, formInputsWithoutLabels } = result.accessibilityData;

    if (imagesWithoutAlt === 0 && formInputsWithoutLabels === 0) {
      return 'good';
    } else if (imagesWithoutAlt < 5 && formInputsWithoutLabels < 3) {
      return 'warning';
    } else {
      return 'critical';
    }
  };

  const renderOverview = () => {
    // Calculate overall health score (average of SEO, Performance, Accessibility)
    const seoScore = getSeoStatus();
    const perfScore = getPerformanceStatus();
    const a11yScore = getAccessibilityStatus();

    const scoreValues = {
      'good': 100,
      'warning': 50,
      'critical': 0
    };

    const overallScore = Math.round(
      (scoreValues[seoScore] + scoreValues[perfScore] + scoreValues[a11yScore]) / 3
    );

    const getScoreColor = (score:any) => {
      if (score >= 80) return 'text-success';
      if (score >= 50) return 'text-warning';
      return 'text-error';
    };

    return (
      <div className="p-4">
        {/* Header with page info and export button */}
        <div className="mb-6 flex justify-between items-start">
          <div>
            <h2 className="text-lg font-semibold text-text mb-2">{result.pageInfo.title}</h2>
            <a
              href={result.pageInfo.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-primary hover:underline"
            >
              {result.pageInfo.url}
            </a>
          </div>
          <ExportButton result={result} />
        </div>

        {/* Overall health score */}
        <div className="mb-6 bg-background-dark p-4 rounded-lg">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-medium">Overall Health Score</h3>
            <div className={`text-xl font-bold ${getScoreColor(overallScore)}`}>
              {overallScore}/100
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5 mb-3">
            <div
              className={`h-2.5 rounded-full ${
                overallScore >= 80 ? 'bg-success' :
                overallScore >= 50 ? 'bg-warning' : 'bg-error'
              }`}
              style={{ width: `${overallScore}%` }}
            ></div>
          </div>
          <p className="text-xs text-text-light">
            This score is based on SEO, performance, and accessibility metrics.
            Click on individual categories below to see detailed analysis.
          </p>
        </div>

        {/* Key metrics cards */}
        <h3 className="text-sm font-medium text-text mb-3">Key Metrics</h3>
        <div className="grid grid-cols-3 gap-4 mb-6">
          <MetricCard
            title={
              <div className="flex items-center">
                SEO Score
                <Tooltip content="Search Engine Optimization score based on meta tags, headings, and content structure">
                  <svg className="w-4 h-4 ml-1 text-text-light" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </Tooltip>
              </div>
            }
            value={seoScore === 'good' ? 'Good' : seoScore === 'warning' ? 'Needs Improvement' : 'Poor'}
            status={seoScore}
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            }
          />
          <MetricCard
            title={
              <div className="flex items-center">
                Performance
                <Tooltip content="Page performance based on DOM size, scripts, and resource usage">
                  <svg className="w-4 h-4 ml-1 text-text-light" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </Tooltip>
              </div>
            }
            value={perfScore === 'good' ? 'Fast' : perfScore === 'warning' ? 'Average' : 'Slow'}
            status={perfScore}
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            }
          />
          <MetricCard
            title={
              <div className="flex items-center">
                Accessibility
                <Tooltip content="How accessible your page is for users with disabilities">
                  <svg className="w-4 h-4 ml-1 text-text-light" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </Tooltip>
              </div>
            }
            value={a11yScore === 'good' ? 'Good' : a11yScore === 'warning' ? 'Needs Improvement' : 'Poor'}
            status={a11yScore}
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            }
          />
        </div>

        {/* Quick stats with improved visual */}
        <div className="mb-6 bg-background-dark p-4 rounded-lg">
          <h3 className="text-sm font-medium text-text mb-3">Quick Stats</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-background p-3 rounded-md flex flex-col items-center justify-center">
              <span className="text-xs text-text-light mb-1">Technologies</span>
              <span className="text-lg font-semibold text-primary">{result.technologies.length}</span>
            </div>
            <div className="bg-background p-3 rounded-md flex flex-col items-center justify-center">
              <span className="text-xs text-text-light mb-1">H1 Tags</span>
              <span className={`text-lg font-semibold ${result.seoData.h1Tags === 1 ? 'text-success' : 'text-warning'}`}>
                {result.seoData.h1Tags}
              </span>
            </div>
            <div className="bg-background p-3 rounded-md flex flex-col items-center justify-center">
              <span className="text-xs text-text-light mb-1">DOM Nodes</span>
              <span className={`text-lg font-semibold ${result.performanceData.domNodes < 1000 ? 'text-success' : 'text-warning'}`}>
                {result.performanceData.domNodes}
              </span>
            </div>
            <div className="bg-background p-3 rounded-md flex flex-col items-center justify-center">
              <span className="text-xs text-text-light mb-1">Images without Alt</span>
              <span className={`text-lg font-semibold ${result.accessibilityData.imagesWithoutAlt === 0 ? 'text-success' : 'text-error'}`}>
                {result.accessibilityData.imagesWithoutAlt}
              </span>
            </div>
          </div>
        </div>

        {/* Page Information */}
        <ExpandableDetail
          title="Page Information"
          initialExpanded={true}
          icon={
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        >
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="bg-background-dark p-3 rounded">
              <span className="block text-text-light mb-1">Domain</span>
              <span className="font-medium">{result.pageInfo.domain}</span>
            </div>
            <div className="bg-background-dark p-3 rounded">
              <span className="block text-text-light mb-1">Protocol</span>
              <span className="font-medium">{result.pageInfo.protocol}</span>
            </div>
            <div className="bg-background-dark p-3 rounded">
              <span className="block text-text-light mb-1">Path</span>
              <span className="font-medium">{result.pageInfo.path}</span>
            </div>
            <div className="bg-background-dark p-3 rounded">
              <span className="block text-text-light mb-1">Analyzed</span>
              <span className="font-medium">{new Date(result.timestamp).toLocaleString()}</span>
            </div>
          </div>
        </ExpandableDetail>

        {/* Technologies */}
        <ExpandableDetail
          title="Technologies"
          icon={
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
            </svg>
          }
        >
          <TechnologyList
            technologies={result.technologies}
            technologyCategories={result.technologyCategories}
          />
        </ExpandableDetail>
      </div>
    );
  };

  const renderSEO = () => {
    const seoScore = getSeoStatus();

    // Calculate SEO score percentage
    const {
      h1Tags,
      metaDescription,
      hasOpenGraph,
      hasTwitterCards,
      hasSchema,
      imagesWithAlt,
      imageCount
    } = result.seoData;

    // Count positive factors
    let positiveFactors = 0;
    let totalFactors = 6;

    // Check each factor
    if (h1Tags === 1) positiveFactors++;
    if (metaDescription && metaDescription.length > 50 && metaDescription.length < 160) positiveFactors++;
    if (hasOpenGraph) positiveFactors++;
    if (hasTwitterCards) positiveFactors++;
    if (hasSchema) positiveFactors++;
    if (imagesWithAlt && imageCount && imagesWithAlt === imageCount) positiveFactors++;

    // Calculate score percentage
    const scorePercentage = Math.round((positiveFactors / totalFactors) * 100);

    return (
      <div className="p-4">
        {/* SEO Score Header */}
        <div className="mb-6 bg-background-dark p-4 rounded-lg">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-semibold text-text">SEO Analysis</h2>
            <Badge
              variant={seoScore === 'good' ? 'success' : seoScore === 'warning' ? 'warning' : 'error'}
              size="md"
            >
              {seoScore === 'good' ? 'Good' : seoScore === 'warning' ? 'Needs Improvement' : 'Poor'}
            </Badge>
          </div>

          <div className="flex items-center mb-3">
            <div className="w-full bg-gray-200 rounded-full h-2.5 mr-3">
              <div
                className={`h-2.5 rounded-full ${
                  scorePercentage >= 80 ? 'bg-success' :
                  scorePercentage >= 50 ? 'bg-warning' : 'bg-error'
                }`}
                style={{ width: `${scorePercentage}%` }}
              ></div>
            </div>
            <span className="text-sm font-medium">{scorePercentage}%</span>
          </div>

          <p className="text-sm text-text-light">
            Your SEO score is based on 6 key factors: proper H1 usage, meta description quality,
            Open Graph tags, Twitter Cards, Schema.org markup, and image alt text.
          </p>
        </div>

        {/* SEO Improvement Suggestions */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-text mb-3">Improvement Suggestions</h3>
          <div className="bg-background-dark p-4 rounded-lg">
            <ul className="space-y-2">
              {h1Tags !== 1 && (
                <li className="flex items-start">
                  <span className="text-warning mr-2">⚠️</span>
                  <span className="text-sm">
                    <strong>Fix H1 Tag:</strong> Your page has {h1Tags} H1 tags. Best practice is to have exactly one H1 tag.
                  </span>
                </li>
              )}

              {(!metaDescription || metaDescription.length < 50 || metaDescription.length > 160) && (
                <li className="flex items-start">
                  <span className="text-warning mr-2">⚠️</span>
                  <span className="text-sm">
                    <strong>Improve Meta Description:</strong> {!metaDescription ? 'Add a meta description.' :
                      metaDescription.length < 50 ? 'Your meta description is too short.' :
                      'Your meta description is too long.'} Aim for 50-160 characters.
                  </span>
                </li>
              )}

              {!hasOpenGraph && (
                <li className="flex items-start">
                  <span className="text-warning mr-2">⚠️</span>
                  <span className="text-sm">
                    <strong>Add Open Graph Tags:</strong> These help control how your content appears when shared on social media.
                  </span>
                </li>
              )}

              {!hasTwitterCards && (
                <li className="flex items-start">
                  <span className="text-warning mr-2">⚠️</span>
                  <span className="text-sm">
                    <strong>Add Twitter Card Tags:</strong> These control how your content appears when shared on Twitter.
                  </span>
                </li>
              )}

              {!hasSchema && (
                <li className="flex items-start">
                  <span className="text-warning mr-2">⚠️</span>
                  <span className="text-sm">
                    <strong>Add Schema.org Markup:</strong> This helps search engines understand your content better.
                  </span>
                </li>
              )}

              {(imagesWithAlt !== imageCount) && (
                <li className="flex items-start">
                  <span className="text-warning mr-2">⚠️</span>
                  <span className="text-sm">
                    <strong>Add Alt Text to Images:</strong> {imageCount && imagesWithAlt && imageCount - imagesWithAlt} of your images are missing alt text.
                  </span>
                </li>
              )}

              {positiveFactors === totalFactors && (
                <li className="flex items-start">
                  <span className="text-success mr-2">✓</span>
                  <span className="text-sm">
                    <strong>Great job!</strong> Your page meets all the basic SEO requirements.
                  </span>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Key Metrics */}
        <h3 className="text-sm font-medium text-text mb-3">Key Metrics</h3>
        <div className="grid grid-cols-3 gap-4 mb-6">
          <MetricCard
            title={
              <div className="flex items-center">
                Meta Description
                <Tooltip content="A concise summary of your page's content. Important for search results.">
                  <svg className="w-4 h-4 ml-1 text-text-light" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </Tooltip>
              </div>
            }
            value={result.seoData.metaDescription ? `${result.seoData.metaDescription.length} chars` : 'Missing'}
            status={result.seoData.metaDescription && result.seoData.metaDescription.length > 50 && result.seoData.metaDescription.length < 160 ? 'good' : 'warning'}
          />
          <MetricCard
            title={
              <div className="flex items-center">
                Heading Structure
                <Tooltip content="Proper heading hierarchy helps both users and search engines understand your content">
                  <svg className="w-4 h-4 ml-1 text-text-light" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </Tooltip>
              </div>
            }
            value={`${result.seoData.h1Tags} H1, ${result.seoData.h2Tags} H2`}
            status={result.seoData.h1Tags === 1 ? 'good' : 'warning'}
          />
          <MetricCard
            title={
              <div className="flex items-center">
                Page Title
                <Tooltip content="The title that appears in search results and browser tabs">
                  <svg className="w-4 h-4 ml-1 text-text-light" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </Tooltip>
              </div>
            }
            value={result.seoData.titleLength ? `${result.seoData.titleLength} chars` : 'Unknown'}
            status={result.seoData.titleLength && result.seoData.titleLength > 10 && result.seoData.titleLength < 60 ? 'good' : 'warning'}
          />
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <MetricCard
            title={
              <div className="flex items-center">
                Links
                <Tooltip content="Internal links help search engines discover your content. External links add credibility.">
                  <svg className="w-4 h-4 ml-1 text-text-light" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </Tooltip>
              </div>
            }
            value={`${result.seoData.internalLinks || 0} int, ${result.seoData.externalLinks || 0} ext`}
            status={(result.seoData.internalLinks || 0) > 0 ? 'good' : 'warning'}
          />
          <MetricCard
            title={
              <div className="flex items-center">
                Images with Alt
                <Tooltip content="Alt text helps search engines understand images and improves accessibility">
                  <svg className="w-4 h-4 ml-1 text-text-light" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </Tooltip>
              </div>
            }
            value={result.seoData.imagesWithAlt !== undefined && result.seoData.imageCount !== undefined ?
              `${result.seoData.imagesWithAlt}/${result.seoData.imageCount}` : 'Unknown'}
            status={result.seoData.imagesWithAlt === result.seoData.imageCount ? 'good' : 'warning'}
          />
          <MetricCard
            title={
              <div className="flex items-center">
                Canonical URL
                <Tooltip content="Helps prevent duplicate content issues by specifying the preferred version of a page">
                  <svg className="w-4 h-4 ml-1 text-text-light" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </Tooltip>
              </div>
            }
            value={result.seoData.canonicalUrl !== 'Not found' ? 'Present' : 'Missing'}
            status={result.seoData.canonicalUrl !== 'Not found' ? 'good' : 'warning'}
          />
        </div>

        {/* Meta Description */}
        <ExpandableDetail
          title="Meta Description"
          initialExpanded={true}
          icon={
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
            </svg>
          }
        >
          <div className="space-y-2">
            <div className="bg-background p-3 rounded-md border border-border">
              <p className="text-sm text-text-light">
                {result.seoData.metaDescription || 'No meta description found'}
              </p>
            </div>

            {result.seoData.metaDescription && (
              <div className="mt-3">
                <div className="flex justify-between text-xs mb-1">
                  <span>0</span>
                  <span className="text-warning">50</span>
                  <span className="text-success">160</span>
                </div>
                <div className="flex items-center">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className={`h-2.5 rounded-full ${
                        result.seoData.metaDescription.length < 50 ? 'bg-error' :
                        result.seoData.metaDescription.length > 160 ? 'bg-warning' : 'bg-success'
                      }`}
                      style={{ width: `${Math.min(100, (result.seoData.metaDescription.length / 160) * 100)}%` }}
                    ></div>
                  </div>
                  <span className="ml-2 text-xs text-text-light">{result.seoData.metaDescription.length}/160</span>
                </div>
                <p className="text-xs text-text-muted mt-2">
                  <strong>Tip:</strong> A good meta description should be between 50-160 characters and accurately summarize your page content.
                  It appears in search results and affects click-through rates.
                </p>
              </div>
            )}

            {!result.seoData.metaDescription && (
              <div className="bg-warning bg-opacity-10 p-3 rounded-md border border-warning mt-3">
                <p className="text-sm text-warning">
                  <strong>Recommendation:</strong> Add a meta description to improve your search engine visibility.
                  Without it, search engines will automatically generate a snippet from your page content.
                </p>
              </div>
            )}
          </div>
        </ExpandableDetail>

        {/* Heading Structure */}
        <ExpandableDetail
          title="Heading Structure"
          icon={
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
            </svg>
          }
        >
          <div className="space-y-4">
            <div className="bg-background p-3 rounded-md border border-border">
              <h4 className="text-sm font-medium mb-3">Heading Hierarchy</h4>
              <div className="space-y-3">
                <div className="flex items-center">
                  <div className="w-16 text-sm font-medium">H1 Tags:</div>
                  <div className="flex-1 flex items-center">
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                      <div
                        className={`h-2.5 rounded-full ${result.seoData.h1Tags === 1 ? 'bg-success' : 'bg-error'}`}
                        style={{ width: `${Math.min(100, result.seoData.h1Tags * 100)}%` }}
                      ></div>
                    </div>
                    <Badge
                      variant={result.seoData.h1Tags === 1 ? 'success' : 'error'}
                      size="sm"
                    >
                      {result.seoData.h1Tags}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-16 text-sm font-medium">H2 Tags:</div>
                  <div className="flex-1 flex items-center">
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                      <div
                        className="h-2.5 rounded-full bg-info"
                        style={{ width: `${Math.min(100, (result.seoData.h2Tags / 10) * 100)}%` }}
                      ></div>
                    </div>
                    <Badge variant="info" size="sm">{result.seoData.h2Tags}</Badge>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-16 text-sm font-medium">H3 Tags:</div>
                  <div className="flex-1 flex items-center">
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                      <div
                        className="h-2.5 rounded-full bg-secondary"
                        style={{ width: `${Math.min(100, (result.seoData.h3Tags / 15) * 100)}%` }}
                      ></div>
                    </div>
                    <Badge variant="secondary" size="sm">{result.seoData.h3Tags}</Badge>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-background-dark p-3 rounded-md">
              <h4 className="text-sm font-medium mb-2">Heading Best Practices</h4>
              <ul className="list-disc pl-5 text-xs space-y-1 text-text-light">
                <li>Use exactly one H1 tag that describes the main topic of your page</li>
                <li>Structure your content with H2 tags for main sections</li>
                <li>Use H3-H6 tags for subsections in a hierarchical manner</li>
                <li>Include keywords in your headings, but keep them natural and readable</li>
                <li>Ensure headings accurately describe the content that follows</li>
              </ul>
            </div>

            {result.seoData.h1Tags !== 1 && (
              <div className="bg-warning bg-opacity-10 p-3 rounded-md border border-warning">
                <p className="text-sm text-warning">
                  <strong>Recommendation:</strong> {result.seoData.h1Tags === 0 ?
                    'Add an H1 tag to your page. This is the main heading that helps search engines understand your page topic.' :
                    `Your page has ${result.seoData.h1Tags} H1 tags. Reduce to exactly one H1 tag for better SEO.`}
                </p>
              </div>
            )}
          </div>
        </ExpandableDetail>

        {/* Social Media & Structured Data */}
        <ExpandableDetail
          title="Social Media & Structured Data"
          icon={
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          }
        >
          <div className="space-y-4 text-sm">
            <div className="bg-background p-3 rounded-md border border-border">
              <h4 className="text-sm font-medium mb-3">Social Media Tags</h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-background-dark p-3 rounded flex flex-col">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-text-light">Open Graph Tags:</span>
                    <Badge
                      variant={result.seoData.hasOpenGraph ? 'success' : 'warning'}
                      size="sm"
                    >
                      {result.seoData.hasOpenGraph ? 'Present' : 'Missing'}
                    </Badge>
                  </div>
                  <p className="text-xs text-text-muted">
                    Used by Facebook, LinkedIn, and other platforms
                  </p>
                </div>
                <div className="bg-background-dark p-3 rounded flex flex-col">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-text-light">Twitter Cards:</span>
                    <Badge
                      variant={result.seoData.hasTwitterCards ? 'success' : 'warning'}
                      size="sm"
                    >
                      {result.seoData.hasTwitterCards ? 'Present' : 'Missing'}
                    </Badge>
                  </div>
                  <p className="text-xs text-text-muted">
                    Controls how your content appears on Twitter
                  </p>
                </div>
                <div className="bg-background-dark p-3 rounded flex flex-col">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-text-light">Schema.org:</span>
                    <Badge
                      variant={result.seoData.hasSchema ? 'success' : 'warning'}
                      size="sm"
                    >
                      {result.seoData.hasSchema ? 'Present' : 'Missing'}
                    </Badge>
                  </div>
                  <p className="text-xs text-text-muted">
                    Helps search engines understand your content
                  </p>
                </div>
                <div className="bg-background-dark p-3 rounded flex flex-col">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-text-light">AMP Link:</span>
                    <Badge
                      variant={result.seoData.hasAmpLink ? 'success' : 'default'}
                      size="sm"
                    >
                      {result.seoData.hasAmpLink ? 'Present' : 'Missing'}
                    </Badge>
                  </div>
                  <p className="text-xs text-text-muted">
                    Accelerated Mobile Pages for faster loading
                  </p>
                </div>
              </div>
            </div>

            {result.seoData.ogTags && Object.keys(result.seoData.ogTags).length > 0 && (
              <div className="bg-background p-3 rounded-md border border-border">
                <h4 className="font-medium mb-2">Open Graph Tags</h4>
                <div className="bg-background-dark p-3 rounded text-xs max-h-[120px] overflow-y-auto custom-scrollbar">
                  {Object.entries(result.seoData.ogTags).map(([key, value]) => (
                    <div key={key} className="mb-2 pb-2 border-b border-border last:border-0">
                      <span className="text-primary font-medium block mb-1">og:{key}</span>
                      <span className="text-text-light">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {result.seoData.twitterTags && Object.keys(result.seoData.twitterTags).length > 0 && (
              <div className="bg-background p-3 rounded-md border border-border">
                <h4 className="font-medium mb-2">Twitter Card Tags</h4>
                <div className="bg-background-dark p-3 rounded text-xs max-h-[120px] overflow-y-auto custom-scrollbar">
                  {Object.entries(result.seoData.twitterTags).map(([key, value]) => (
                    <div key={key} className="mb-2 pb-2 border-b border-border last:border-0">
                      <span className="text-primary font-medium block mb-1">twitter:{key}</span>
                      <span className="text-text-light">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {(!result.seoData.hasOpenGraph || !result.seoData.hasTwitterCards || !result.seoData.hasSchema) && (
              <div className="bg-info bg-opacity-10 p-3 rounded-md border border-info">
                <h4 className="text-sm font-medium text-info mb-2">Why These Matter</h4>
                <p className="text-xs text-text-light mb-2">
                  Social media tags and structured data help control how your content appears when shared and can improve
                  visibility in search results with rich snippets.
                </p>
                <ul className="list-disc pl-5 text-xs space-y-1 text-text-light">
                  {!result.seoData.hasOpenGraph && (
                    <li>Add Open Graph tags to improve appearance on Facebook, LinkedIn, and other platforms</li>
                  )}
                  {!result.seoData.hasTwitterCards && (
                    <li>Add Twitter Card tags to enhance how your content appears when shared on Twitter</li>
                  )}
                  {!result.seoData.hasSchema && (
                    <li>Add Schema.org markup to help search engines understand your content and potentially show rich results</li>
                  )}
                </ul>
              </div>
            )}
          </div>
        </ExpandableDetail>

        {/* Technical SEO Elements */}
        <ExpandableDetail
          title="Technical SEO Elements"
          icon={
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          }
        >
          <div className="space-y-4 text-sm">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-background p-3 rounded-md border border-border">
                <span className="block text-text-light mb-1">Meta Keywords</span>
                <span className="font-medium">{result.seoData.metaKeywords || 'Not found'}</span>
                {!result.seoData.metaKeywords && (
                  <p className="text-xs text-text-muted mt-1">
                    Note: Meta keywords are largely ignored by modern search engines
                  </p>
                )}
              </div>
              <div className="bg-background p-3 rounded-md border border-border">
                <span className="block text-text-light mb-1">Canonical URL</span>
                <span className="font-medium">{result.seoData.canonicalUrl}</span>
                {result.seoData.canonicalUrl === 'Not found' && (
                  <p className="text-xs text-warning mt-1">
                    Consider adding a canonical URL to prevent duplicate content issues
                  </p>
                )}
              </div>
              <div className="bg-background p-3 rounded-md border border-border">
                <span className="block text-text-light mb-1">Robots Directive</span>
                <span className="font-medium">{result.seoData.robotsTxt}</span>
              </div>
              <div className="bg-background p-3 rounded-md border border-border">
                <span className="block text-text-light mb-1">Language</span>
                <span className="font-medium">{result.seoData.langAttribute}</span>
              </div>
              <div className="bg-background p-3 rounded-md border border-border">
                <span className="block text-text-light mb-1">Viewport</span>
                <span className="font-medium">{result.seoData.metaViewport}</span>
              </div>
              <div className="bg-background p-3 rounded-md border border-border">
                <span className="block text-text-light mb-1">URL Length</span>
                <span className="font-medium">{result.seoData.urlLength} characters</span>
                { result?.seoData?.urlLength && result?.seoData?.urlLength > 100 && (
                  <p className="text-xs text-warning mt-1">
                    Consider using shorter URLs for better user experience and SEO
                  </p>
                )}
              </div>
            </div>

            <div className="bg-background-dark p-3 rounded-md">
              <h4 className="text-sm font-medium mb-2">Technical SEO Tips</h4>
              <ul className="list-disc pl-5 text-xs space-y-1 text-text-light">
                <li>Ensure your site has a valid SSL certificate (HTTPS)</li>
                <li>Optimize page load speed for better rankings</li>
                <li>Make sure your site is mobile-friendly</li>
                <li>Use a robots.txt file to guide search engine crawlers</li>
                <li>Create and submit an XML sitemap to search engines</li>
                <li>Fix broken links and implement proper redirects</li>
              </ul>
            </div>
          </div>
        </ExpandableDetail>

        {/* Link Analysis */}
        <ExpandableDetail
          title="Link Analysis"
          icon={
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.172 13.828a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
          }
        >
          <div className="space-y-4 text-sm">
            <div className="bg-background p-3 rounded-md border border-border">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Internal Links</h4>
                  <div className="flex items-center mb-1">
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                      <div
                        className="h-2.5 rounded-full bg-primary"
                        style={{ width: `${Math.min(100, ((result.seoData.internalLinks || 0) / 30) * 100)}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium">{result.seoData.internalLinks || 0}</span>
                  </div>
                  <p className="text-xs text-text-muted">
                    Links to pages within the same domain
                  </p>
                </div>

                <div>
                  <h4 className="font-medium mb-2">External Links</h4>
                  <div className="flex items-center mb-1">
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                      <div
                        className="h-2.5 rounded-full bg-secondary"
                        style={{ width: `${Math.min(100, ((result.seoData.externalLinks || 0) / 15) * 100)}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium">{result.seoData.externalLinks || 0}</span>
                  </div>
                  <p className="text-xs text-text-muted">
                    Links to pages on other domains
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-background-dark p-4 rounded-md">
              <h4 className="font-medium mb-3">Link Best Practices</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h5 className="text-xs font-medium mb-2 text-primary">Internal Linking</h5>
                  <ul className="list-disc pl-4 text-xs space-y-1 text-text-light">
                    <li>Link to relevant content within your site</li>
                    <li>Use descriptive anchor text with keywords</li>
                    <li>Create a logical site structure</li>
                    <li>Keep important pages within 3 clicks from homepage</li>
                  </ul>
                </div>
                <div>
                  <h5 className="text-xs font-medium mb-2 text-secondary">External Linking</h5>
                  <ul className="list-disc pl-4 text-xs space-y-1 text-text-light">
                    <li>Link to reputable, relevant sources</li>
                    <li>Use target="_blank" for external links</li>
                    <li>Add rel="noopener noreferrer" for security</li>
                    <li>Consider using rel="nofollow" for sponsored links</li>
                  </ul>
                </div>
              </div>
            </div>

            {(result.seoData.internalLinks === 0 || result.seoData.internalLinks === undefined) && (
              <div className="bg-warning bg-opacity-10 p-3 rounded-md border border-warning">
                <p className="text-sm text-warning">
                  <strong>Recommendation:</strong> Add internal links to help search engines discover and understand the
                  structure of your website. Internal links also help users navigate your site more effectively.
                </p>
              </div>
            )}
          </div>
        </ExpandableDetail>
      </div>
    );
  };

  const renderPerformance = () => {
    const performanceScore = getPerformanceStatus();

    // Check if we have detailed timing metrics
    const hasTimingMetrics = result.performanceData.pageLoadTime !== undefined ||
                            result.performanceData.domContentLoaded !== undefined ||
                            result.performanceData.firstPaint !== undefined ||
                            result.performanceData.firstContentfulPaint !== undefined;

    return (
      <div className="p-4">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-text">Performance Analysis</h2>
          <Badge
            variant={performanceScore === 'good' ? 'success' : performanceScore === 'warning' ? 'warning' : 'error'}
            size="md"
          >
            {performanceScore === 'good' ? 'Fast' : performanceScore === 'warning' ? 'Average' : 'Slow'}
          </Badge>
        </div>

        {/* Performance Summary Card */}
        {hasTimingMetrics && (
          <div className="mb-6 bg-background-dark p-4 rounded-lg">
            <h3 className="font-medium mb-3">Key Performance Metrics</h3>
            <div className="grid grid-cols-2 gap-3">
              {result.performanceData.pageLoadTime !== undefined && (
                <div className="bg-background p-3 rounded-md flex flex-col">
                  <span className="text-xs text-text-light mb-1">Page Load Time</span>
                  <span className="text-lg font-semibold">
                    {result.performanceData.pageLoadTime}
                    <span className="text-sm font-normal text-text-light ml-1">ms</span>
                  </span>
                  <span className={`text-xs mt-1 ${
                    result.performanceData.pageLoadTime < 2000 ? 'text-success' :
                    result.performanceData.pageLoadTime < 4000 ? 'text-warning' : 'text-error'
                  }`}>
                    {result.performanceData.pageLoadTime < 2000 ? 'Fast' :
                     result.performanceData.pageLoadTime < 4000 ? 'Average' : 'Slow'}
                  </span>
                </div>
              )}

              {result.performanceData.firstContentfulPaint !== undefined && (
                <div className="bg-background p-3 rounded-md flex flex-col">
                  <span className="text-xs text-text-light mb-1">First Contentful Paint</span>
                  <span className="text-lg font-semibold">
                    {result.performanceData.firstContentfulPaint}
                    <span className="text-sm font-normal text-text-light ml-1">ms</span>
                  </span>
                  <span className={`text-xs mt-1 ${
                    result.performanceData.firstContentfulPaint < 1200 ? 'text-success' :
                    result.performanceData.firstContentfulPaint < 2500 ? 'text-warning' : 'text-error'
                  }`}>
                    {result.performanceData.firstContentfulPaint < 1200 ? 'Fast' :
                     result.performanceData.firstContentfulPaint < 2500 ? 'Average' : 'Slow'}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="grid grid-cols-3 gap-3 mb-4">
          <MetricCard
            title="DOM Size"
            value={result.performanceData.domNodes}
            status={result.performanceData.domNodes < 1000 ? 'good' : result.performanceData.domNodes < 2000 ? 'warning' : 'critical'}
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
              </svg>
            }
          />
          <MetricCard
            title="Scripts"
            value={result.performanceData.scripts}
            status={result.performanceData.scripts < 10 ? 'good' : result.performanceData.scripts < 20 ? 'warning' : 'critical'}
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            }
          />
          <MetricCard
            title="Resources"
            value={result.performanceData.scripts + result.performanceData.stylesheets + result.performanceData.images}
            status={(result.performanceData.scripts + result.performanceData.stylesheets) < 15 ? 'good' : 'warning'}
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            }
          />
        </div>

        <ExpandableDetail
          title="DOM Elements"
          initialExpanded={true}
          icon={
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
            </svg>
          }
        >
          <div className="space-y-2">
            <div className="flex items-center">
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className={`h-2.5 rounded-full ${
                    result.performanceData.domNodes < 1000 ? 'bg-success' :
                    result.performanceData.domNodes < 2000 ? 'bg-warning' : 'bg-error'
                  }`}
                  style={{ width: `${Math.min(100, (result.performanceData.domNodes / 3000) * 100)}%` }}
                ></div>
              </div>
              <span className="ml-2 text-xs text-text-light">{result.performanceData.domNodes} nodes</span>
            </div>
            <p className="text-xs text-text-muted mt-1">
              Recommended: Less than 1,500 DOM elements for optimal performance
            </p>
          </div>
        </ExpandableDetail>

        <ExpandableDetail
          title="Resource Breakdown"
          icon={
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
            </svg>
          }
        >
          <div className="space-y-3">
            <div className="flex items-center">
              <span className="text-sm font-medium w-24">Scripts:</span>
              <div className="flex-1 flex items-center">
                <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                  <div
                    className={`h-2.5 rounded-full ${result.performanceData.scripts < 10 ? 'bg-success' : 'bg-warning'}`}
                    style={{ width: `${Math.min(100, (result.performanceData.scripts / 20) * 100)}%` }}
                  ></div>
                </div>
                <Badge
                  variant={result.performanceData.scripts < 10 ? 'success' : 'warning'}
                  size="sm"
                >
                  {result.performanceData.scripts}
                </Badge>
              </div>
            </div>
            <div className="flex items-center">
              <span className="text-sm font-medium w-24">Stylesheets:</span>
              <div className="flex-1 flex items-center">
                <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                  <div
                    className={`h-2.5 rounded-full ${result.performanceData.stylesheets < 5 ? 'bg-success' : 'bg-warning'}`}
                    style={{ width: `${Math.min(100, (result.performanceData.stylesheets / 10) * 100)}%` }}
                  ></div>
                </div>
                <Badge
                  variant={result.performanceData.stylesheets < 5 ? 'success' : 'warning'}
                  size="sm"
                >
                  {result.performanceData.stylesheets}
                </Badge>
              </div>
            </div>
            <div className="flex items-center">
              <span className="text-sm font-medium w-24">Images:</span>
              <div className="flex-1 flex items-center">
                <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                  <div
                    className="h-2.5 rounded-full bg-info"
                    style={{ width: `${Math.min(100, (result.performanceData.images / 30) * 100)}%` }}
                  ></div>
                </div>
                <Badge variant="info" size="sm">{result.performanceData.images}</Badge>
              </div>
            </div>
            <div className="flex items-center">
              <span className="text-sm font-medium w-24">iFrames:</span>
              <div className="flex-1 flex items-center">
                <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                  <div
                    className={`h-2.5 rounded-full ${result.performanceData.iframes === 0 ? 'bg-success' : 'bg-warning'}`}
                    style={{ width: `${Math.min(100, result.performanceData.iframes * 50)}%` }}
                  ></div>
                </div>
                <Badge
                  variant={result.performanceData.iframes === 0 ? 'success' : 'warning'}
                  size="sm"
                >
                  {result.performanceData.iframes}
                </Badge>
              </div>
            </div>
          </div>
        </ExpandableDetail>

        {/* New Performance Metrics Section */}
        {result.performanceData.pageLoadTime !== undefined && (
          <ExpandableDetail
            title="Detailed Performance Metrics"
            icon={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
            initialExpanded={true}
          >
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-1 custom-scrollbar">
              {/* Timing Metrics */}
              <div className="bg-background p-3 rounded-md border border-border">
                <h4 className="text-sm font-medium mb-3">Page Timing</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-background-dark p-3 rounded">
                    <span className="block text-xs text-text-light mb-1">Page Load Time</span>
                    <span className="font-medium text-sm">
                      {result.performanceData.pageLoadTime !== undefined ? (
                        <>
                          {result.performanceData.pageLoadTime} ms
                          <span className={`ml-2 text-xs ${result.performanceData.pageLoadTime < 2000 ? 'text-success' : result.performanceData.pageLoadTime < 4000 ? 'text-warning' : 'text-error'}`}>
                            ({result.performanceData.pageLoadTime < 2000 ? 'Fast' : result.performanceData.pageLoadTime < 4000 ? 'Average' : 'Slow'})
                          </span>
                        </>
                      ) : 'Not available'}
                    </span>
                  </div>
                  <div className="bg-background-dark p-3 rounded">
                    <span className="block text-xs text-text-light mb-1">DOM Content Loaded</span>
                    <span className="font-medium text-sm">
                      {result.performanceData.domContentLoaded !== undefined ? (
                        <>
                          {result.performanceData.domContentLoaded} ms
                          <span className={`ml-2 text-xs ${result.performanceData.domContentLoaded < 1000 ? 'text-success' : result.performanceData.domContentLoaded < 2500 ? 'text-warning' : 'text-error'}`}>
                            ({result.performanceData.domContentLoaded < 1000 ? 'Fast' : result.performanceData.domContentLoaded < 2500 ? 'Average' : 'Slow'})
                          </span>
                        </>
                      ) : 'Not available'}
                    </span>
                  </div>
                  <div className="bg-background-dark p-3 rounded">
                    <span className="block text-xs text-text-light mb-1">First Paint</span>
                    <span className="font-medium text-sm">
                      {result.performanceData.firstPaint !== undefined ? (
                        <>
                          {result.performanceData.firstPaint} ms
                          <span className={`ml-2 text-xs ${result.performanceData.firstPaint < 1000 ? 'text-success' : result.performanceData.firstPaint < 2000 ? 'text-warning' : 'text-error'}`}>
                            ({result.performanceData.firstPaint < 1000 ? 'Fast' : result.performanceData.firstPaint < 2000 ? 'Average' : 'Slow'})
                          </span>
                        </>
                      ) : 'Not available'}
                    </span>
                  </div>
                  <div className="bg-background-dark p-3 rounded">
                    <span className="block text-xs text-text-light mb-1">First Contentful Paint</span>
                    <span className="font-medium text-sm">
                      {result.performanceData.firstContentfulPaint !== undefined ? (
                        <>
                          {result.performanceData.firstContentfulPaint} ms
                          <span className={`ml-2 text-xs ${result.performanceData.firstContentfulPaint < 1200 ? 'text-success' : result.performanceData.firstContentfulPaint < 2500 ? 'text-warning' : 'text-error'}`}>
                            ({result.performanceData.firstContentfulPaint < 1200 ? 'Fast' : result.performanceData.firstContentfulPaint < 2500 ? 'Average' : 'Slow'})
                          </span>
                        </>
                      ) : 'Not available'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Resource Sizes */}
              {result.performanceData.resourceSizes && (
                <div className="bg-background p-3 rounded-md border border-border">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="text-sm font-medium">Resource Sizes (KB)</h4>
                    <div className="flex items-center">
                      <span className={`text-xs font-medium px-2 py-1 rounded ${
                        result.performanceData.resourceSizes.total < 500 ? 'bg-success bg-opacity-20 text-success' :
                        result.performanceData.resourceSizes.total < 1500 ? 'bg-warning bg-opacity-20 text-warning' :
                        'bg-error bg-opacity-20 text-error'
                      }`}>
                        {result.performanceData.resourceSizes.total < 500 ? 'Lightweight' :
                         result.performanceData.resourceSizes.total < 1500 ? 'Average' : 'Heavy'}
                      </span>
                    </div>
                  </div>

                  <div className="mb-3">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-success">0 KB</span>
                      <span className="text-warning">1000 KB</span>
                      <span className="text-error">2000+ KB</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full ${
                          result.performanceData.resourceSizes.total < 500 ? 'bg-success' :
                          result.performanceData.resourceSizes.total < 1500 ? 'bg-warning' : 'bg-error'
                        }`}
                        style={{ width: `${Math.min(100, (result.performanceData.resourceSizes.total / 2000) * 100)}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs mt-1">
                      <span className="font-medium">Total Size</span>
                      <span className="font-bold">{result.performanceData.resourceSizes.total} KB</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center">
                      <span className="text-xs font-medium w-20">JavaScript:</span>
                      <div className="flex-1 flex items-center">
                        <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                          <div
                            className="h-2.5 rounded-full bg-primary"
                            style={{ width: `${Math.min(100, (result.performanceData.resourceSizes.js / 1000) * 100)}%` }}
                          ></div>
                        </div>
                        <span className="text-xs font-medium">{result.performanceData.resourceSizes.js} KB</span>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <span className="text-xs font-medium w-20">CSS:</span>
                      <div className="flex-1 flex items-center">
                        <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                          <div
                            className="h-2.5 rounded-full bg-secondary"
                            style={{ width: `${Math.min(100, (result.performanceData.resourceSizes.css / 200) * 100)}%` }}
                          ></div>
                        </div>
                        <span className="text-xs font-medium">{result.performanceData.resourceSizes.css} KB</span>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <span className="text-xs font-medium w-20">Images:</span>
                      <div className="flex-1 flex items-center">
                        <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                          <div
                            className="h-2.5 rounded-full bg-info"
                            style={{ width: `${Math.min(100, (result.performanceData.resourceSizes.img / 1000) * 100)}%` }}
                          ></div>
                        </div>
                        <span className="text-xs font-medium">{result.performanceData.resourceSizes.img} KB</span>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <span className="text-xs font-medium w-20">Fonts:</span>
                      <div className="flex-1 flex items-center">
                        <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                          <div
                            className="h-2.5 rounded-full bg-warning"
                            style={{ width: `${Math.min(100, (result.performanceData.resourceSizes.font / 300) * 100)}%` }}
                          ></div>
                        </div>
                        <span className="text-xs font-medium">{result.performanceData.resourceSizes.font} KB</span>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <span className="text-xs font-medium w-20">Other:</span>
                      <div className="flex-1 flex items-center">
                        <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                          <div
                            className="h-2.5 rounded-full bg-error"
                            style={{ width: `${Math.min(100, (result.performanceData.resourceSizes.other / 200) * 100)}%` }}
                          ></div>
                        </div>
                        <span className="text-xs font-medium">{result.performanceData.resourceSizes.other} KB</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Cache Status */}
              {result.performanceData.cacheStatus && (
                <div className="bg-background p-3 rounded-md border border-border">
                  <h4 className="text-sm font-medium mb-3">Cache Status</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-background-dark p-3 rounded">
                      <span className="block text-xs text-text-light mb-1">Cached Resources</span>
                      <span className="font-medium text-sm">{result.performanceData.cacheStatus.cached}</span>
                    </div>
                    <div className="bg-background-dark p-3 rounded">
                      <span className="block text-xs text-text-light mb-1">Non-Cached Resources</span>
                      <span className="font-medium text-sm">{result.performanceData.cacheStatus.notCached}</span>
                    </div>
                    <div className="bg-background-dark p-3 rounded col-span-2">
                      <span className="block text-xs text-text-light mb-1">Cache Ratio</span>
                      <div className="flex items-center">
                        <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                          {result.performanceData.cacheStatus.cached + result.performanceData.cacheStatus.notCached > 0 && (
                            <div
                              className={`h-2.5 rounded-full ${
                                (result.performanceData.cacheStatus.cached / (result.performanceData.cacheStatus.cached + result.performanceData.cacheStatus.notCached)) > 0.7
                                  ? 'bg-success'
                                  : (result.performanceData.cacheStatus.cached / (result.performanceData.cacheStatus.cached + result.performanceData.cacheStatus.notCached)) > 0.4
                                    ? 'bg-warning'
                                    : 'bg-error'
                              }`}
                              style={{
                                width: `${
                                  (result.performanceData.cacheStatus.cached / (result.performanceData.cacheStatus.cached + result.performanceData.cacheStatus.notCached)) * 100
                                }%`
                              }}
                            ></div>
                          )}
                        </div>
                        <span className="text-xs font-medium">
                          {result.performanceData.cacheStatus.cached + result.performanceData.cacheStatus.notCached > 0
                            ? Math.round((result.performanceData.cacheStatus.cached / (result.performanceData.cacheStatus.cached + result.performanceData.cacheStatus.notCached)) * 100)
                            : 0
                          }%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Connection Info */}
              {result.performanceData.connectionInfo && (
                <div className="bg-background p-3 rounded-md border border-border">
                  <h4 className="text-sm font-medium mb-3">Connection Information</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-background-dark p-3 rounded">
                      <span className="block text-xs text-text-light mb-1">Connection Type</span>
                      <span className="font-medium text-sm">{result.performanceData.connectionInfo.type}</span>
                    </div>
                    <div className="bg-background-dark p-3 rounded">
                      <span className="block text-xs text-text-light mb-1">Downlink Speed</span>
                      <span className="font-medium text-sm">{result.performanceData.connectionInfo.downlink} Mbps</span>
                    </div>
                    <div className="bg-background-dark p-3 rounded">
                      <span className="block text-xs text-text-light mb-1">Round Trip Time</span>
                      <span className="font-medium text-sm">{result.performanceData.connectionInfo.rtt} ms</span>
                    </div>
                    <div className="bg-background-dark p-3 rounded">
                      <span className="block text-xs text-text-light mb-1">Data Saver</span>
                      <span className="font-medium text-sm">{result.performanceData.connectionInfo.saveData ? 'Enabled' : 'Disabled'}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Performance Tips */}
              <div className="bg-background-dark p-4 rounded-md">
                <h4 className="text-sm font-medium mb-2">Performance Optimization Tips</h4>
                <ul className="list-disc pl-5 text-xs space-y-1 text-text-light">
                  <li>Minimize HTTP requests by combining files and using CSS sprites</li>
                  <li>Enable compression (GZIP or Brotli) for text-based resources</li>
                  <li>Optimize and compress images; consider using WebP format</li>
                  <li>Implement browser caching with appropriate cache headers</li>
                  <li>Minify JavaScript, CSS, and HTML to reduce file sizes</li>
                  <li>Use asynchronous loading for non-critical JavaScript</li>
                  <li>Reduce server response time through optimization and CDN usage</li>
                  <li>Eliminate render-blocking resources in above-the-fold content</li>
                </ul>
              </div>
            </div>
          </ExpandableDetail>
        )}
      </div>
    );
  };

  const renderTechnologies = () => {
    return (
      <div className="p-4">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-text">Technology Stack</h2>
          <p className="text-sm text-text-light mt-1">
            {result.technologies.length} technologies detected on this page
          </p>
        </div>

        <TechnologyList
          technologies={result.technologies}
          technologyCategories={result.technologyCategories}
        />
      </div>
    );
  };

  const renderAccessibility = () => {
    const accessibilityScore = getAccessibilityStatus();

    return (
      <div className="p-4">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-text">Accessibility Analysis</h2>
          <Badge
            variant={accessibilityScore === 'good' ? 'success' : accessibilityScore === 'warning' ? 'warning' : 'error'}
            size="md"
          >
            {accessibilityScore === 'good' ? 'Good' : accessibilityScore === 'warning' ? 'Needs Improvement' : 'Poor'}
          </Badge>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-4">
          <MetricCard
            title="Images without Alt"
            value={result.accessibilityData.imagesWithoutAlt}
            status={result.accessibilityData.imagesWithoutAlt === 0 ? 'good' : result.accessibilityData.imagesWithoutAlt < 5 ? 'warning' : 'critical'}
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            }
          />
          <MetricCard
            title="Inputs without Labels"
            value={result.accessibilityData.formInputsWithoutLabels}
            status={result.accessibilityData.formInputsWithoutLabels === 0 ? 'good' : result.accessibilityData.formInputsWithoutLabels < 3 ? 'warning' : 'critical'}
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            }
          />
          <MetricCard
            title="Low Contrast"
            value={result.accessibilityData.lowContrastElements}
            status={result.accessibilityData.lowContrastElements === 0 ? 'good' : result.accessibilityData.lowContrastElements < 5 ? 'warning' : 'critical'}
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            }
          />
        </div>

        <ExpandableDetail
          title="Images without Alt Text"
          initialExpanded={true}
          icon={
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          }
        >
          <div className="space-y-2">
            <div className="flex items-center">
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className={`h-2.5 rounded-full ${
                    result.accessibilityData.imagesWithoutAlt === 0 ? 'bg-success' :
                    result.accessibilityData.imagesWithoutAlt < 5 ? 'bg-warning' : 'bg-error'
                  }`}
                  style={{ width: `${Math.min(100, (result.accessibilityData.imagesWithoutAlt / 10) * 100)}%` }}
                ></div>
              </div>
              <span className="ml-2 text-xs text-text-light">{result.accessibilityData.imagesWithoutAlt} images</span>
            </div>
            <p className="text-xs text-text-muted mt-1">
              All images should have alt text for screen readers and SEO
            </p>
          </div>
        </ExpandableDetail>

        <ExpandableDetail
          title="Form Inputs without Labels"
          icon={
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          }
        >
          <div className="space-y-2">
            <div className="flex items-center">
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className={`h-2.5 rounded-full ${
                    result.accessibilityData.formInputsWithoutLabels === 0 ? 'bg-success' :
                    result.accessibilityData.formInputsWithoutLabels < 3 ? 'bg-warning' : 'bg-error'
                  }`}
                  style={{ width: `${Math.min(100, (result.accessibilityData.formInputsWithoutLabels / 5) * 100)}%` }}
                ></div>
              </div>
              <span className="ml-2 text-xs text-text-light">{result.accessibilityData.formInputsWithoutLabels} inputs</span>
            </div>
            <p className="text-xs text-text-muted mt-1">
              All form inputs should have associated labels or aria-label attributes
            </p>
          </div>
        </ExpandableDetail>

        <ExpandableDetail
          title="Accessibility Tips"
          icon={
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        >
          <div className="space-y-2 text-sm">
            <p className="text-text-light">
              <strong>Images:</strong> Add descriptive alt text to all images
            </p>
            <p className="text-text-light">
              <strong>Forms:</strong> Ensure all inputs have associated labels
            </p>
            <p className="text-text-light">
              <strong>Color Contrast:</strong> Maintain sufficient contrast between text and background
            </p>
            <p className="text-text-light">
              <strong>Keyboard Navigation:</strong> Ensure all interactive elements are keyboard accessible
            </p>
          </div>
        </ExpandableDetail>
      </div>
    );
  };

  return (
    <>
      <div>
        {(() => {
          switch (activeTab) {
            case 'overview':
              return renderOverview();
            case 'seo':
              return renderSEO();
            case 'performance':
              return renderPerformance();
            case 'technologies':
              return renderTechnologies();
            case 'accessibility':
              return renderAccessibility();
            default:
              return renderOverview();
          }
        })()}
      </div>

      <div className="p-4 border-t border-border flex justify-center">
        <button
          onClick={openDetailedView}
          className="bg-primary hover:bg-primary-600 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center transition-colors shadow-sm"
        >
          {activeTab === 'overview' && (
            <>
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              View Detailed Analysis
            </>
          )}
          {activeTab === 'seo' && (
            <>
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              View Complete SEO Report
            </>
          )}
          {activeTab === 'performance' && (
            <>
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              View Full Performance Analysis
            </>
          )}
          {activeTab === 'technologies' && (
            <>
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
              </svg>
              Explore Complete Tech Stack
            </>
          )}
          {activeTab === 'accessibility' && (
            <>
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              View Full Accessibility Report
            </>
          )}
        </button>
      </div>

      {showDetailedView && (
        <DetailedView result={result} onClose={closeDetailedView} activeTab={activeTab} />
      )}
    </>
  );
};

export default ResultContent;