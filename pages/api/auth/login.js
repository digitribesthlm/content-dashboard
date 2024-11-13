// pages/api/auth/login.js
import clientPromise from '../../../utils/mongodb';
import { serialize } from 'cookie';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        // Add timeout to MongoDB connection
        const client = await Promise.race([
            clientPromise,
            new Promise((_, reject) => 
                setTimeout(() => reject(new Error('Database connection timeout')), 10000)
            )
        ]);

        const db = client.db(process.env.MONGODB_DB);

        // Add timeout to database query
        const user = await Promise.race([
            db.collection('users').findOne({ email: email.toLowerCase() }),
            new Promise((_, reject) => 
                setTimeout(() => reject(new Error('Database query timeout')), 5000)
            )
        ]);

        if (!user || password !== user.password) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Create a more meaningful token
        const token = Buffer.from(JSON.stringify({
            userId: user._id.toString(),
            email: user.email,
            timestamp: Date.now()
        })).toString('base64');

        // Set cookie with improved settings
        res.setHeader('Set-Cookie', serialize('auth-token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 8 * 60 * 60, // 8 hours
            path: '/'
        }));

        return res.status(200).json({ 
            success: true,
            user: { email: user.email }
        });
    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ 
            message: error.message || 'Internal server error',
            type: error.name
        });
    }
}