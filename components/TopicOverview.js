import React, { useState, useRef, useEffect } from 'react';
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

// New Status Icon component
const StatusIcon = ({ status }) => {
  if (status !== 'selected') return null;
  
  return (
    <span 
      className="inline-flex items-center ml-2 px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
      title="Selected for review"
    >
      <svg 
        className="w-4 h-4" 
        fill="currentColor" 
        viewBox="0 0 20 20"
      >
        <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
        <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm9.707 5.707a1 1 0 00-1.414-1.414L9 12.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
      </svg>
    </span>
  );
};

const TopicOverview = ({ strategies }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedFocus, setSelectedFocus] = useState([]);
  const [selectedAudience, setSelectedAudience] = useState([]);
  const filterRef = useRef(null);

  // Close filters when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setShowFilters(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Toggle filter selection (multiple selection)
  const toggleFocus = (focus) => {
    setSelectedFocus(prev => 
      prev.includes(focus)
        ? prev.filter(f => f !== focus)
        : [...prev, focus]
    );
  };

  const toggleAudience = (audience) => {
    setSelectedAudience(prev => 
      prev.includes(audience)
        ? prev.filter(a => a !== audience)
        : [...prev, audience]
    );
  };

  // Get filter options with counts
  const getFilterOptions = () => {
    const focus = new Map();
    const audience = new Map();

    strategies.forEach(strategy => {
      strategy.clientData?.contentStrategy?.items?.forEach(item => {
        if (item.contentGuidelines?.focus) {
          const focusValue = item.contentGuidelines.focus;
          focus.set(focusValue, (focus.get(focusValue) || 0) + 1);
        }
        if (item.contentGuidelines?.targetAudience) {
          const audienceValue = item.contentGuidelines.targetAudience;
          audience.set(audienceValue, (audience.get(audienceValue) || 0) + 1);
        }
      });
    });

    return {
      focus: Array.from(focus.entries()),
      audience: Array.from(audience.entries())
    };
  };

  const filterOptions = getFilterOptions();

  // Filter strategies with OR logic
  const groupedStrategies = strategies.reduce((acc, strategy) => {
    if (!strategy.clientData?.contentStrategy?.items) return acc;

    strategy.clientData.contentStrategy.items.forEach(item => {
      // Apply OR logic for filters
      const matchesFocus = selectedFocus.length === 0 || 
        selectedFocus.includes(item.contentGuidelines?.focus);
      const matchesAudience = selectedAudience.length === 0 || 
        selectedAudience.includes(item.contentGuidelines?.targetAudience);
      
      if (!matchesFocus && !matchesAudience) return;

      // Apply search
      const searchFields = [
        item.selectedItem,
        item.mainFeature,
        item.category,
        ...(item.longTerms || []),
        ...(item.relatedTerms || []),
      ].map(field => field?.toLowerCase() || '');

      if (searchTerm && !searchFields.some(field => field.includes(searchTerm.toLowerCase()))) {
        return;
      }

      // Group items
      if (!acc[item.category]) acc[item.category] = {};
      if (!acc[item.category][item.mainFeature]) {
        acc[item.category][item.mainFeature] = [];
      }
      acc[item.category][item.mainFeature].push(item);
    });
    return acc;
  }, {});

  return (
    <div className="p-6">
      {/* Fixed Search and Filter Section */}
      <div className="sticky top-0 z-10 bg-white shadow-md rounded-lg mb-6">
        <div className="p-4 max-w-2xl mx-auto">
          {/* Search Bar */}
          <div className="relative mb-2">
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

          {/* Filter Dropdown Button */}
          <div className="relative" ref={filterRef}>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="w-full flex items-center justify-between px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50"
            >
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
                <span>Filters</span>
                {(selectedFocus.length > 0 || selectedAudience.length > 0) && (
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded-full">
                    {selectedFocus.length + selectedAudience.length}
                  </span>
                )}
              </div>
              <svg 
                className={`w-5 h-5 transform transition-transform ${showFilters ? 'rotate-180' : ''}`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Filter Dropdown Panel */}
            {showFilters && (
              <div className="absolute left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border">
                <div className="max-h-[600px] overflow-y-auto">
                  {/* Focus Filters */}
                  <div className="p-4 border-b">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-medium text-gray-700">Focus</h3>
                      {selectedFocus.length > 0 && (
                        <button
                          onClick={() => setSelectedFocus([])}
                          className="text-xs text-blue-600 hover:text-blue-800"
                        >
                          Clear Focus
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      {filterOptions.focus.map(([focus, count]) => (
                        <label 
                          key={focus} 
                          className="flex items-start p-2 rounded hover:bg-gray-50 border cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={selectedFocus.includes(focus)}
                            onChange={() => toggleFocus(focus)}
                            className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <div className="ml-2">
                            <span className="text-sm text-gray-800 block">{focus}</span>
                            <span className="text-xs text-gray-500">({count} items)</span>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Audience Filters */}
                  <div className="p-4 border-b">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-medium text-gray-700">Target Audience</h3>
                      {selectedAudience.length > 0 && (
                        <button
                          onClick={() => setSelectedAudience([])}
                          className="text-xs text-blue-600 hover:text-blue-800"
                        >
                          Clear Audience
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      {filterOptions.audience.map(([audience, count]) => (
                        <label 
                          key={audience} 
                          className="flex items-start p-2 rounded hover:bg-gray-50 border cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={selectedAudience.includes(audience)}
                            onChange={() => toggleAudience(audience)}
                            className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <div className="ml-2">
                            <span className="text-sm text-gray-800 block">{audience}</span>
                            <span className="text-xs text-gray-500">({count} items)</span>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Footer with Clear All */}
                  {(selectedFocus.length > 0 || selectedAudience.length > 0) && (
                    <div className="p-3 bg-gray-50 text-center border-t">
                      <button
                        onClick={() => {
                          setSelectedFocus([]);
                          setSelectedAudience([]);
                        }}
                        className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                      >
                        Clear all filters
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Results Section */}
      {Object.keys(groupedStrategies).length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p className="text-lg">No results found</p>
          {(searchTerm || selectedFocus.length > 0 || selectedAudience.length > 0) && (
            <p className="mt-2 text-sm">Try adjusting your search or filters</p>
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
                          <div className="flex items-center flex-grow">
                            <Link 
                              href={`/topic/${item._id}`}
                              className="text-blue-600 hover:underline flex-grow"
                            >
                              {item.selectedItem}
                            </Link>
                            <div className="flex items-center">
                              <VolumeIndicator volume={item.metrics?.volume} />
                              <StatusIcon status={item.status} />
                            </div>
                          </div>
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

      {/* Legend */}
      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Legend:</h4>
        <div className="flex items-center space-x-6">
          <div className="flex items-center">
            <VolumeIndicator volume={10} />
            <span className="ml-2 text-sm text-gray-600">Indicates search volume</span>
          </div>
          <div className="flex items-center">
            <StatusIcon status="selected" />
            <span className="ml-2 text-sm text-gray-600">Selected for review</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopicOverview; 