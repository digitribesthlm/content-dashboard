import Layout from '../components/Layout.js';
import TopicOverview from '../components/TopicOverview';
import clientPromise from '../utils/mongodb';

export default function Home({ strategies }) {
  return (
    <Layout>
      <div className="content-container">
        <h1>Content Strategy Dashboard</h1>
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

