import Layout from '../components/Layout';
import Link from 'next/link';
import clientPromise from '../utils/mongodb';

export default function SelectedTopics({ selectedTopics }) {
  return (
    <Layout>
      <div className="p-6">
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold">Selected Topics for Review</h1>
          <Link 
            href="/"
            className="text-blue-600 hover:text-blue-800"
          >
            ← Back to Overview
          </Link>
        </div>

        {selectedTopics.length === 0 ? (
          <div className="text-center py-10 bg-white rounded-lg shadow">
            <p className="text-gray-500 text-lg">No topics have been selected for review yet.</p>
            <Link 
              href="/"
              className="mt-4 inline-block text-blue-600 hover:text-blue-800"
            >
              Go select some topics
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {selectedTopics.map((topic) => (
              <div 
                key={topic._id} 
                className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-semibold">{topic.mainFeature}</h2>
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    Selected
                  </span>
                </div>

                <p className="text-gray-600 mb-4">{topic.selectedItem}</p>

                <div className="mb-4">
                  <h3 className="font-medium text-gray-700 mb-2">Metrics:</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="bg-gray-50 p-2 rounded">
                      Volume: {topic.metrics?.volume?.$numberDouble || topic.metrics?.volume || 'N/A'}
                    </div>
                    <div className="bg-gray-50 p-2 rounded">
                      KD: {topic.metrics?.kd?.$numberDouble || topic.metrics?.kd || 'N/A'}
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <h3 className="font-medium text-gray-700 mb-2">Content Guidelines:</h3>
                  <div className="text-sm text-gray-600">
                    <p>Focus: {topic.contentGuidelines?.focus}</p>
                    <p>Audience: {topic.contentGuidelines?.targetAudience}</p>
                  </div>
                </div>

                <div className="flex justify-between items-center mt-4 pt-4 border-t">
                  <Link 
                    href={`/topic/${topic._id}`}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    View Details →
                  </Link>
                  <span className="text-sm text-gray-500">
                    Category: {topic.category}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}

export async function getServerSideProps() {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);
    
    // Find all strategies with selected items
    const strategies = await db
      .collection("seo_topic_content_strategies")
      .find({
        "clientData.contentStrategy.items.status": "selected"
      })
      .toArray();

    // Extract selected topics from strategies
    const selectedTopics = strategies.reduce((acc, strategy) => {
      const selected = strategy.clientData.contentStrategy.items
        .filter(item => item.status === "selected");
      return [...acc, ...selected];
    }, []);

    return {
      props: {
        selectedTopics: JSON.parse(JSON.stringify(selectedTopics)),
      },
    };
  } catch (error) {
    console.error('Error fetching selected topics:', error);
    return {
      props: {
        selectedTopics: [],
      },
    };
  }
} 