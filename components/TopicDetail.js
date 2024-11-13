import React, { useState } from 'react';
import { useRouter } from 'next/router';

const TopicDetail = ({ topic }) => {
  const router = useRouter();
  const [status, setStatus] = useState(topic.status || 'active');
  const [isUpdating, setIsUpdating] = useState(false);

  const getStatusColor = (currentStatus) => {
    switch (currentStatus) {
      case 'selected':
        return 'bg-blue-100 text-blue-800';
      case 'active':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleStatusUpdate = async () => {
    try {
      setIsUpdating(true);
      const newStatus = status === 'active' ? 'selected' : 'active';
      
      const response = await fetch('/api/topics/update-status', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topicId: topic._id,
          newStatus: newStatus
        }),
      });

      if (!response.ok) throw new Error('Failed to update status');

      setStatus(newStatus);
      // Refresh the page data
      router.replace(router.asPath);
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(status)}`}>
            Status: {status}
          </span>
        </div>
        <button
          onClick={handleStatusUpdate}
          disabled={isUpdating}
          className={`
            px-4 py-2 rounded-lg font-medium
            ${status === 'active' 
              ? 'bg-blue-600 text-white hover:bg-blue-700' 
              : 'bg-gray-600 text-white hover:bg-gray-700'
            }
            disabled:opacity-50 disabled:cursor-not-allowed
            transition-colors duration-200
          `}
        >
          {isUpdating ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
              </svg>
              Updating...
            </span>
          ) : (
            status === 'active' ? 'Select for Review' : 'Mark as Active'
          )}
        </button>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{topic.mainFeature}</h1>
        <p className="text-gray-600">Category: {topic.category}</p>
        <p className="text-lg mt-2">{topic.selectedItem}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border rounded-lg p-4 bg-white shadow">
          <h2 className="text-xl font-bold mb-4">Metrics</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-gray-50 rounded">
              <p className="text-sm text-gray-600">Volume</p>
              <p className="text-lg font-semibold">
                {topic.metrics.volume?.$numberDouble || topic.metrics.volume || 'N/A'}
              </p>
            </div>
            <div className="p-3 bg-gray-50 rounded">
              <p className="text-sm text-gray-600">Keyword Difficulty</p>
              <p className="text-lg font-semibold">
                {topic.metrics.kd?.$numberDouble || topic.metrics.kd || 'N/A'}
              </p>
            </div>
            <div className="p-3 bg-gray-50 rounded">
              <p className="text-sm text-gray-600">Difficulty</p>
              <p className="text-lg font-semibold capitalize">
                {topic.metrics.difficulty || 'N/A'}
              </p>
            </div>
            <div className="p-3 bg-gray-50 rounded">
              <p className="text-sm text-gray-600">Priority</p>
              <p className="text-lg font-semibold capitalize">
                {topic.metrics.priority || 'N/A'}
              </p>
            </div>
          </div>
        </div>

        <div className="border rounded-lg p-4">
          <h2 className="text-xl font-bold mb-4">Keywords</h2>
          <div>
            <h3 className="font-semibold">Primary Keyword:</h3>
            <p className="mb-2">{topic.primaryKeyword}</p>
            
            <h3 className="font-semibold">Long Terms:</h3>
            <ul className="list-disc pl-5 mb-2">
              {topic.longTerms.map((term, index) => (
                <li key={index}>{term}</li>
              ))}
            </ul>

            <h3 className="font-semibold">Related Terms:</h3>
            <ul className="list-disc pl-5">
              {topic.relatedTerms.map((term, index) => (
                <li key={index}>{term}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border rounded-lg p-4">
          <h2 className="text-xl font-bold mb-4">Content Guidelines</h2>
          <p><strong>Focus:</strong> {topic.contentGuidelines.focus}</p>
          <p><strong>Target Audience:</strong> {topic.contentGuidelines.targetAudience}</p>
          <p><strong>Content Type:</strong> {topic.contentGuidelines.contentType}</p>
          <h3 className="font-semibold mt-2">Includes:</h3>
          <ul className="list-disc pl-5">
            {topic.contentGuidelines.includes.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>

        <div className="border rounded-lg p-4">
          <h2 className="text-xl font-bold mb-4">FAQs</h2>
          <ul className="space-y-2">
            {topic.faqs.map((faq, index) => (
              <li key={index}>{faq}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TopicDetail; 