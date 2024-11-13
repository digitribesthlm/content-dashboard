// pages/dashboard/index.js
import Layout from '../../components/Layout';
import TopicOverview from '../../components/TopicOverview';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import clientPromise from '../../src/lib/mongodb';

export default function Dashboard({ strategies }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const authToken = document.cookie.includes('auth-token');
      if (!authToken) {
        router.push('/');
      } else {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (isLoading) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            Loading...
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold mb-6">Content Strategy Dashboard</h1>
        <TopicOverview strategies={strategies} />
      </div>
    </Layout>
  );
}

export async function getServerSideProps(context) {
  // Check auth on server side
  const authToken = context.req.cookies['auth-token'];
  if (!authToken) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);
    
    const strategies = await db
      .collection("seo_topic_content_strategies")
      .find({})
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