import React from 'react';
import { Technology, TechnologyCategories } from '../types';
import Badge from './Badge';

interface TechnologyListProps {
  technologies: Technology[];
  technologyCategories?: TechnologyCategories;
  showDetails?: boolean;
}

const categoryLabels: Record<string, string> = {
  'javascript-framework': 'JavaScript Frameworks',
  'ui-framework': 'UI Frameworks',
  'javascript-library': 'JavaScript Libraries',
  'css-framework': 'CSS Frameworks',
  'analytics': 'Analytics',
  'marketing': 'Marketing',
  'cms': 'Content Management',
  'ecommerce': 'E-commerce',
  'payment': 'Payment Systems',
  'hosting': 'Hosting',
  'cdn': 'CDN',
  'security': 'Security',
  'database': 'Databases',
  'backend': 'Backend',
  'server': 'Web Servers',
  'font': 'Fonts',
  'map': 'Maps',
  'accessibility': 'Accessibility',
  'other': 'Other'
};

const categoryIcons: Record<string, string> = {
  'javascript-framework': '🧩',
  'ui-framework': '🎨',
  'javascript-library': '📚',
  'css-framework': '🎭',
  'analytics': '📊',
  'marketing': '📢',
  'cms': '📝',
  'ecommerce': '🛒',
  'payment': '💳',
  'hosting': '☁️',
  'cdn': '🌐',
  'security': '🔒',
  'database': '💾',
  'backend': '⚙️',
  'server': '🖥️',
  'font': '🔤',
  'map': '🗺️',
  'accessibility': '♿',
  'other': '🧰'
};

const TechnologyList: React.FC<TechnologyListProps> = ({ technologies, technologyCategories, showDetails = false }) => {
  // If we have categories, display them
  if (technologyCategories) {
    // Filter out empty categories
    const nonEmptyCategories = Object.entries(technologyCategories)
      .filter(([_, techs]) => techs.length > 0)
      .sort(([a], [b]) => {
        // Sort categories by their display names
        return categoryLabels[a].localeCompare(categoryLabels[b]);
      });

    if (nonEmptyCategories.length === 0) {
      return (
        <div className="text-center py-6 text-text-light bg-background-dark rounded-lg">
          <div className="text-4xl mb-2">🔍</div>
          <p className="font-medium">No technologies detected</p>
          <p className="text-xs mt-1">We couldn't identify any common technologies on this page</p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {nonEmptyCategories.map(([category, techs]) => (
          <div key={category} className="bg-white rounded-lg border border-border p-3 hover:border-primary/30 transition-colors">
            <h3 className="text-sm font-medium mb-3 flex items-center text-primary-700">
              <span className="mr-2 text-lg">{categoryIcons[category]}</span>
              {categoryLabels[category]}
            </h3>
            <div className={showDetails ? "flex flex-wrap gap-4" : "flex flex-wrap gap-2"}>
              {techs.map((tech:any) => (
                <TechBadge key={tech.name} technology={tech} showDetails={showDetails} />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Fallback to flat list if no categories
  return (
    <div className="p-3">
      {technologies.length > 0 ? (
        <div className={showDetails ? "flex flex-wrap gap-4" : "flex flex-wrap gap-2"}>
          {technologies.map((tech) => (
            <TechBadge key={tech.name} technology={tech} showDetails={showDetails} />
          ))}
        </div>
      ) : (
        <div className="text-center py-6 text-text-light bg-background-dark rounded-lg">
          <div className="text-4xl mb-2">🔍</div>
          <p className="font-medium">No technologies detected</p>
          <p className="text-xs mt-1">We couldn't identify any common technologies on this page</p>
        </div>
      )}
    </div>
  );
};

const TechBadge: React.FC<{ technology: Technology, showDetails?: boolean }> = ({ technology, showDetails = false }) => {
  if (showDetails) {
    return (
      <div className="bg-background rounded-lg px-4 py-3 text-sm border border-border hover:shadow-sm transition-shadow mb-3 w-full md:w-[calc(50%-0.5rem)]">
        <div className="flex items-center mb-2">
          {technology.icon ? (
            <img
              src={technology.icon}
              alt={`${technology.name} icon`}
              className="w-6 h-6 mr-2 object-contain"
              onError={(e) => {
                // If image fails to load, replace with category emoji
                (e.target as HTMLImageElement).style.display = 'none';
                const parent = (e.target as HTMLImageElement).parentElement;
                if (parent) {
                  const emojiSpan = document.createElement('span');
                  emojiSpan.className = 'mr-2 text-xl';
                  emojiSpan.textContent = categoryIcons[technology.category] || '🔌';
                  parent.insertBefore(emojiSpan, (e.target as HTMLImageElement).nextSibling);
                }
              }}
            />
          ) : (
            <span className="mr-2 text-xl">{categoryIcons[technology.category] || '🔌'}</span>
          )}
          <span className="font-medium text-base">{technology.name}</span>
          {technology.version && (
            <Badge variant="secondary" size="sm" className="ml-2">v{technology.version}</Badge>
          )}
        </div>

        {technology.description && (
          <p className="text-text-light text-xs mb-2">{technology.description}</p>
        )}

        <div className="flex flex-wrap gap-2 mt-2">
          {technology.website && (
            <a
              href={technology.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline text-xs flex items-center"
            >
              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              Website
            </a>
          )}
          {technology.category && (
            <span className="text-xs text-text-light bg-background-dark px-2 py-1 rounded">
              {categoryLabels[technology.category] || technology.category}
            </span>
          )}
        </div>
      </div>
    );
  }

  // Simple badge for non-detailed view
  return (
    <div className="flex items-center bg-background rounded-full px-3 py-1.5 text-xs border border-border hover:shadow-sm transition-shadow">
      {technology.icon ? (
        <img
          src={technology.icon}
          alt={`${technology.name} icon`}
          className="w-5 h-5 mr-2 object-contain"
          onError={(e) => {
            // If image fails to load, replace with category emoji
            (e.target as HTMLImageElement).style.display = 'none';
            const parent = (e.target as HTMLImageElement).parentElement;
            if (parent) {
              const emojiSpan = document.createElement('span');
              emojiSpan.className = 'mr-2 text-base';
              emojiSpan.textContent = categoryIcons[technology.category] || '🔌';
              parent.insertBefore(emojiSpan, (e.target as HTMLImageElement).nextSibling);
            }
          }}
        />
      ) : (
        <span className="mr-2 text-base">{categoryIcons[technology.category] || '🔌'}</span>
      )}
      <span className="font-medium">{technology.name}</span>
      {technology.version && (
        <Badge variant="secondary" size="sm" className="ml-1">v{technology.version}</Badge>
      )}
    </div>
  );
};

export default TechnologyList;