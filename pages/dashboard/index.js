// pages/dashboard/index.js
import Layout from '../../components/Layout';
import TopicOverview from '../../components/TopicOverview';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import clientPromise from '../../utils/mongodb';

export default function Dashboard({ strategies }) {
  const router = useRouter();

  useEffect(() => {
    const authToken = document.cookie.includes('auth-token');
    if (!authToken) {
      router.push('/');
    }
  }, []);

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold mb-6">Content Strategy Dashboard</h1>
        <TopicOverview strategies={strategies} />
      </div>
    </Layout>
  );
}

export async function getServerSideProps() {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);
    
    const strategies = await db
      .collection("seo_topic_content_strategies")
      .find({}, {
        projection: {
          'clientData.contentStrategy.items.mainFeature': 1,
          'clientData.contentStrategy.items.category': 1,
          'clientData.contentStrategy.items.selectedItem': 1,
          'clientData.contentStrategy.items.status': 1,
          'clientData.contentStrategy.items._id': 1,
          'clientData.contentStrategy.items.metrics': 1,
          'clientData.contentStrategy.items.contentGuidelines.focus': 1,
          'clientData.contentStrategy.items.contentGuidelines.targetAudience': 1
        }
      })
      .toArray();

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
      },
    };
  }
} 