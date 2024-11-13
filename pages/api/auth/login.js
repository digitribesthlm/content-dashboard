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

        const client = await clientPromise;
        const db = client.db(process.env.MONGODB_DB);

        const user = await db.collection('users').findOne({ email });

        if (!user || password !== user.password) {
            console.log('Login failed for email:', email);
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Create session token
        const token = Buffer.from(JSON.stringify({
            userId: user._id.toString(),
            email: user.email
        })).toString('base64');

        // Set cookie
        res.setHeader('Set-Cookie', serialize('auth-token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 3600,
            path: '/'
        }));

        // Return success
        return res.status(200).json({
            user: {
                email: user.email
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}