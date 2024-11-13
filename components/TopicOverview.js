import React, { useState } from 'react';
import Link from 'next/link';

// Volume indicator component
const VolumeIndicator = ({ volume }) => {
  const volumeValue = parseFloat(volume?.$numberDouble || volume || 0);
  
  if (volumeValue <= 0) return null;
  
  return (
    <span 
      className="inline-flex items-center ml-2 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800"
      title={`Search Volume: ${volumeValue}`}
    >
      <svg 
        className="w-3 h-3 mr-1" 
        fill="currentColor" 
        viewBox="0 0 20 20"
      >
        <path d="M15.795 13.015l-.574-.574a6.75 6.75 0 10-1.208 1.208l.574.574 3.285 3.285a.75.75 0 001.06-1.06l-3.285-3.285a.75.75 0 00-1.06 0zM3.75 9.5a5.25 5.25 0 1110.5 0 5.25 5.25 0 01-10.5 0z" />
      </svg>
      {volumeValue}
    </span>
  );
};

const TopicOverview = ({ strategies }) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Group and filter strategies based on search
  const groupedStrategies = strategies.reduce((acc, strategy) => {
    if (!strategy.clientData?.contentStrategy?.items) return acc;

    strategy.clientData.contentStrategy.items.forEach(item => {
      // Search across multiple fields
      const searchFields = [
        item.selectedItem,
        item.mainFeature,
        item.category,
        item.contentGuidelines?.focus,
        item.contentGuidelines?.targetAudience,
        item.contentGuidelines?.contentType,
        ...(item.longTerms || []),
        ...(item.relatedTerms || []),
      ].map(field => field?.toLowerCase() || '');

      // Check if any field contains the search term
      if (searchTerm && !searchFields.some(field => field.includes(searchTerm.toLowerCase()))) {
        return;
      }

      if (!acc[item.category]) {
        acc[item.category] = {};
      }
      if (!acc[item.category][item.mainFeature]) {
        acc[item.category][item.mainFeature] = [];
      }
      acc[item.category][item.mainFeature].push(item);
    });
    return acc;
  }, {});

  return (
    <div className="p-6">
      {/* Search Section */}
      <div className="mb-8 p-4 bg-white rounded-lg shadow">
        <div className="max-w-2xl mx-auto">
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search for content, features, keywords..."
              className="w-full px-4 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            )}
          </div>
          {searchTerm && (
            <div className="mt-2 text-sm text-gray-500">
              Searching across titles, features, categories, and keywords
            </div>
          )}
        </div>
      </div>

      {/* Results Section */}
      {Object.keys(groupedStrategies).length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          {searchTerm ? (
            <div>
              <p className="text-lg">No results found for "{searchTerm}"</p>
              <p className="mt-2 text-sm">Try different keywords or check the spelling</p>
            </div>
          ) : (
            <p className="text-lg">No content available</p>
          )}
        </div>
      ) : (
        Object.entries(groupedStrategies).map(([category, features]) => (
          <div key={category} className="mb-8">
            <h2 className="text-2xl font-bold mb-4">{category}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(features).map(([feature, items]) => (
                <div key={feature} className="border rounded-lg p-4 bg-white shadow">
                  <h3 className="text-xl font-semibold mb-3">{feature}</h3>
                  <ul className="space-y-2">
                    {items.map((item) => (
                      <li key={item._id} className="hover:bg-gray-50 p-2 rounded">
                        <div className="flex items-center justify-between">
                          <Link 
                            href={`/topic/${item._id}`}
                            className="text-blue-600 hover:underline block flex-grow"
                          >
                            {item.selectedItem}
                            <VolumeIndicator volume={item.metrics?.volume} />
                          </Link>
                        </div>
                        <div className="text-sm text-gray-500 mt-1">
                          {item.contentGuidelines?.focus && (
                            <span className="mr-2">Focus: {item.contentGuidelines.focus}</span>
                          )}
                          {item.contentGuidelines?.targetAudience && (
                            <span className="mr-2">• Audience: {item.contentGuidelines.targetAudience}</span>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        ))
      )}

      {/* Legend for the volume indicator */}
      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Legend:</h4>
        <div className="flex items-center">
          <VolumeIndicator volume={10} />
          <span className="ml-2 text-sm text-gray-600">Indicates search volume</span>
        </div>
      </div>
    </div>
  );
};

export default TopicOverview; 