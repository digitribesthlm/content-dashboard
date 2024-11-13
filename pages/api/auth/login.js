// pages/api/auth/login.js
import clientPromise from '@/src/lib/mongodb';  // Using @ alias for root

import { serialize } from 'cookie';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const { email, password } = req.body;
        const client = await clientPromise;
        const db = client.db(process.env.MONGODB_DB);

        const user = await db.collection('users').findOne({ 
            email: email,
            password: password
        });

        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Simplified cookie options
        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 24 * 60 * 60,
            path: '/'
        };

        res.setHeader('Set-Cookie', serialize('auth-token', 'authenticated', cookieOptions));

        return res.status(200).json({
            success: true,
            message: 'Login successful'
        });

    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}