// pages/dashboard/index.js
import Layout from '../../components/Layout';
import TopicOverview from '../../components/TopicOverview';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import clientPromise from '@/src/lib/mongodb';  // Using @ alias for root


export default function Dashboard({ strategies, error }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if we have data or error
    if (strategies || error) {
      setIsLoading(false);
    }
  }, [strategies, error]);

  // Add error handling
  if (error) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-red-500">
            Error loading dashboard: {error}
          </div>
        </div>
      </Layout>
    );
  }

  // Show loading state
  if (isLoading) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2">Loading dashboard...</span>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold mb-6">Content Strategy Dashboard</h1>
        {strategies && strategies.length > 0 ? (
          <TopicOverview strategies={strategies} />
        ) : (
          <div className="text-center py-10 bg-white rounded-lg shadow">
            <p className="text-gray-500">No strategies found.</p>
          </div>
        )}
      </div>
    </Layout>
  );
}

export async function getServerSideProps(context) {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);
    
    console.log('Fetching strategies...');
    const strategies = await db
      .collection("seo_topic_content_strategies")
      .find({})
      .toArray();

    console.log(`Found ${strategies.length} strategies`);

    return {
      props: {
        strategies: JSON.parse(JSON.stringify(strategies)),
      },
    };
  } catch (error) {
    console.error('Error fetching strategies:', error);
    return {
      props: {
        strategies: [],
        error: 'Failed to load strategies'
      },
    };
  }
} 