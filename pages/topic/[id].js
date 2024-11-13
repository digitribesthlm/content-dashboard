import { useRouter } from 'next/router';
import TopicDetail from '../../components/TopicDetail';
import Layout from '../../components/Layout';
import clientPromise from '../../src/lib/mongodb';
import { ObjectId } from 'mongodb';

export default function TopicPage({ topic }) {
  const router = useRouter();

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  if (!topic) {
    return <div>Topic not found</div>;
  }

  return (
    <Layout>
      <TopicDetail topic={topic} />
    </Layout>
  );
}

export async function getServerSideProps({ params }) {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);
    
    // Find the strategy containing the topic
    const strategy = await db
      .collection("seo_topic_content_strategies")
      .findOne({
        "clientData.contentStrategy.items._id": new ObjectId(params.id)
      });

    if (!strategy) {
      return {
        notFound: true
      };
    }

    // Find the specific topic within the items array
    const topic = strategy.clientData.contentStrategy.items.find(
      item => item._id.toString() === params.id
    );

    if (!topic) {
      return {
        notFound: true
      };
    }

    return {
      props: {
        topic: JSON.parse(JSON.stringify(topic))
      }
    };
  } catch (error) {
    console.error('Error fetching topic:', error);
    return {
      notFound: true
    };
  }
} 