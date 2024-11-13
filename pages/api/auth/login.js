// pages/api/auth/login.js
import clientPromise from '../../../src/lib/mongodb';
import { serialize } from 'cookie';

export default async function handler(req, res) {
    console.log('Login request received');

    if (req.method !== 'POST') {
        console.log('Invalid method:', req.method);
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const { email, password } = req.body;
        console.log('Attempting login for email:', email);
        
        if (!email || !password) {
            console.log('Missing email or password');
            return res.status(400).json({ message: 'Email and password are required' });
        }

        console.log('Connecting to MongoDB...');
        const client = await clientPromise;
        const db = client.db(process.env.MONGODB_DB);
        console.log('Connected to MongoDB');

        console.log('Searching for user...');
        const user = await db.collection('users').findOne({ email });
        console.log('User search completed');

        if (!user) {
            console.log('User not found');
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        if (password !== user.password) {
            console.log('Invalid password');
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        console.log('Login successful, setting cookie...');
        res.setHeader('Set-Cookie', serialize('auth-token', 'authenticated', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 3600,
            path: '/'
        }));

        console.log('Sending success response');
        return res.status(200).json({ 
            success: true,
            user: { email: user.email }
        });
    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}