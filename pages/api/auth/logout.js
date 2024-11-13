// pages/api/auth/logout.js
import { serialize } from 'cookie';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        // Clear the auth cookie with multiple options to ensure it's removed
        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 0,
            expires: new Date(0)
        };

        res.setHeader('Set-Cookie', [
            serialize('auth-token', '', cookieOptions),
            serialize('auth-token', '', { ...cookieOptions, path: '/dashboard' }),
            serialize('auth-token', '', { ...cookieOptions, path: '/selected-topics' })
        ]);

        res.status(200).json({ success: true, message: 'Logged out successfully' });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({ success: false, message: 'Logout failed' });
    }
}