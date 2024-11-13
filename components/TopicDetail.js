import React, { useState } from 'react';
import { useRouter } from 'next/router';

const TopicDetail = ({ topic }) => {
  const router = useRouter();
  const [showContentResearch, setShowContentResearch] = useState(false);
  const [activeTab, setActiveTab] = useState('notes');
  const [note, setNote] = useState(topic.note || '');
  const [status, setStatus] = useState(topic.status || 'active');
  const [isStatusUpdating, setIsStatusUpdating] = useState(false);
  const [competitorUrls, setCompetitorUrls] = useState(topic.competitorUrls?.urls || [
    { id: 1, url: '', notes: '' },
    { id: 2, url: '', notes: '' },
    { id: 3, url: '', notes: '' }
  ]);
  const [youtubeUrls, setYoutubeUrls] = useState(topic.youtubeUrls?.urls || [
    { id: 1, url: '', notes: '' },
    { id: 2, url: '', notes: '' },
    { id: 3, url: '', notes: '' }
  ]);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');

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
      setIsStatusUpdating(true);
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
      router.replace(router.asPath);
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status. Please try again.');
    } finally {
      setIsStatusUpdating(false);
    }
  };

  const handleNoteSave = async () => {
    try {
      setIsSaving(true);
      setSaveStatus('');
      
      const response = await fetch('/api/topics/update-note', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topicId: topic._id,
          note: note
        }),
      });

      if (!response.ok) throw new Error('Failed to save note');

      // Show success message
      setSaveStatus('success');
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSaveStatus('');
      }, 3000);

    } catch (error) {
      console.error('Error saving note:', error);
      setSaveStatus('error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleUrlUpdate = async () => {
    try {
      setIsSaving(true);
      setSaveStatus('');
      
      const response = await fetch('/api/topics/update-urls', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topicId: topic._id,
          competitorUrls,
          youtubeUrls
        }),
      });

      if (!response.ok) throw new Error('Failed to save URLs');
      setSaveStatus('success');
      setTimeout(() => setSaveStatus(''), 3000);

    } catch (error) {
      console.error('Error saving URLs:', error);
      setSaveStatus('error');
    } finally {
      setIsSaving(false);
    }
  };

  const updateCompetitorUrl = (index, field, value) => {
    const newUrls = [...competitorUrls];
    newUrls[index] = { ...newUrls[index], [field]: value };
    setCompetitorUrls(newUrls);
  };

  const updateYoutubeUrl = (index, field, value) => {
    const newUrls = [...youtubeUrls];
    newUrls[index] = { ...newUrls[index], [field]: value };
    setYoutubeUrls(newUrls);
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
          disabled={isStatusUpdating}
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
          {isStatusUpdating ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
              </svg>
              Updating...
            </span>
          ) : (
            status === 'active' ? 'Select for Outline' : 'Mark as Active'
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

      {/* Content Research Section */}
      <div className="border rounded-lg bg-white shadow mt-6">
        {/* Section Header */}
        <button 
          onClick={() => setShowContentResearch(!showContentResearch)}
          className="w-full flex items-center justify-between p-4 text-xl font-bold"
        >
          <span>Content Research</span>
          <svg 
            className={`w-6 h-6 transform transition-transform ${showContentResearch ? 'rotate-180' : ''}`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {showContentResearch && (
          <div className="border-t">
            {/* Tabs */}
            <div className="flex border-b">
              <button
                onClick={() => setActiveTab('notes')}
                className={`px-4 py-2 font-medium ${
                  activeTab === 'notes'
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Notes
              </button>
              <button
                onClick={() => setActiveTab('competitors')}
                className={`px-4 py-2 font-medium ${
                  activeTab === 'competitors'
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Competitor URLs
              </button>
              <button
                onClick={() => setActiveTab('youtube')}
                className={`px-4 py-2 font-medium ${
                  activeTab === 'youtube'
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                YouTube URLs
              </button>
            </div>

            {/* Tab Content */}
            <div className="p-4">
              {/* Notes Tab */}
              {activeTab === 'notes' && (
                <div className="space-y-4">
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Add your notes about this topic here..."
                    className="w-full h-32 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <button
                    onClick={handleNoteSave}
                    disabled={isSaving}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    {isSaving ? 'Saving...' : 'Save Note'}
                  </button>
                </div>
              )}

              {/* Competitor URLs Tab */}
              {activeTab === 'competitors' && (
                <div className="space-y-4">
                  {competitorUrls.map((item, index) => (
                    <div key={item.id} className="space-y-2 p-4 border rounded">
                      <input
                        type="url"
                        value={item.url}
                        onChange={(e) => updateCompetitorUrl(index, 'url', e.target.value)}
                        placeholder={`Competitor URL ${index + 1}`}
                        className="w-full p-2 border rounded"
                      />
                      <textarea
                        value={item.notes}
                        onChange={(e) => updateCompetitorUrl(index, 'notes', e.target.value)}
                        placeholder="Notes about this competitor"
                        className="w-full p-2 border rounded h-20"
                      />
                    </div>
                  ))}
                  <button
                    onClick={handleUrlUpdate}
                    disabled={isSaving}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    {isSaving ? 'Saving...' : 'Save Competitor URLs'}
                  </button>
                </div>
              )}

              {/* YouTube URLs Tab */}
              {activeTab === 'youtube' && (
                <div className="space-y-4">
                  {youtubeUrls.map((item, index) => (
                    <div key={item.id} className="space-y-2 p-4 border rounded">
                      <input
                        type="url"
                        value={item.url}
                        onChange={(e) => updateYoutubeUrl(index, 'url', e.target.value)}
                        placeholder={`YouTube URL ${index + 1}`}
                        className="w-full p-2 border rounded"
                      />
                      <textarea
                        value={item.notes}
                        onChange={(e) => updateYoutubeUrl(index, 'notes', e.target.value)}
                        placeholder="Notes about this video"
                        className="w-full p-2 border rounded h-20"
                      />
                    </div>
                  ))}
                  <button
                    onClick={handleUrlUpdate}
                    disabled={isSaving}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    {isSaving ? 'Saving...' : 'Save YouTube URLs'}
                  </button>
                </div>
              )}

              {/* Save Status Messages */}
              {saveStatus === 'success' && (
                <div className="mt-2 text-green-600">✓ Saved successfully</div>
              )}
              {saveStatus === 'error' && (
                <div className="mt-2 text-red-600">Failed to save. Please try again.</div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TopicDetail; 