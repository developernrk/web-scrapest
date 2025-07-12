import React from 'react';
import classNames from 'classnames';

interface TabProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const ResultTabs: React.FC<TabProps> = ({ activeTab, setActiveTab }) => {
  const tabs = [
    {
      id: 'overview',
      label: 'Overview',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    },
    {
      id: 'seo',
      label: 'SEO',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      )
    },
    {
      id: 'performance',
      label: 'Performance',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    },
    {
      id: 'technologies',
      label: 'Tech',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
        </svg>
      )
    },
    {
      id: 'accessibility',
      label: 'A11y',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      )
    },
  ];

  return (
    <div className="flex bg-white border-b border-border">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={classNames(
            'flex-1 py-2.5 px-1 border-none cursor-pointer text-xs font-medium transition-all duration-200 relative',
            {
              'text-primary': activeTab === tab.id,
              'text-secondary hover:text-primary-600': activeTab !== tab.id,
            }
          )}
          onClick={() => setActiveTab(tab.id)}
        >
          <div className="flex flex-col items-center justify-center">
            <div className={classNames(
              'mb-1 p-1.5 rounded-full transition-all duration-200',
              {
                'bg-primary-100': activeTab === tab.id,
                'bg-transparent': activeTab !== tab.id,
              }
            )}>
              {tab.icon}
            </div>
            <span>{tab.label}</span>
          </div>
          {activeTab === tab.id && (
            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary"></div>
          )}
        </button>
      ))}
    </div>
  );
};

export default ResultTabs;