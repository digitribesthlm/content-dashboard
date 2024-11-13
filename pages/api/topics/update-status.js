import clientPromise from '@/src/lib/mongodb';  // Using @ alias for root

import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { topicId, newStatus } = req.body;
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);

    const result = await db.collection("seo_topic_content_strategies").updateOne(
      { "clientData.contentStrategy.items._id": new ObjectId(topicId) },
      { 
        $set: { 
          "clientData.contentStrategy.items.$.status": newStatus 
        } 
      }
    );

    if (result.modifiedCount === 0) {
      return res.status(404).json({ message: 'Topic not found' });
    }

    res.status(200).json({ message: 'Status updated successfully', status: newStatus });
  } catch (error) {
    console.error('Error updating topic status:', error);
    res.status(500).json({ message: 'Error updating status' });
  }
} 