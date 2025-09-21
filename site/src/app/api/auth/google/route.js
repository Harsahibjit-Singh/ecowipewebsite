import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import jwt from 'jsonwebtoken';

// Environment variables from your .env.local file
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const JWT_SECRET = process.env.JWT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI || 'http://localhost:3000/api/auth/google';

export async function GET(request) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');

  // --- Step 1: Redirect to Google's Consent Screen (No change) ---
  if (!code) {
    const googleAuthUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
    googleAuthUrl.searchParams.set('client_id', GOOGLE_CLIENT_ID);
    googleAuthUrl.searchParams.set('redirect_uri', REDIRECT_URI);
    googleAuthUrl.searchParams.set('response_type', 'code');
    googleAuthUrl.searchParams.set('scope', 'openid profile email');
    googleAuthUrl.searchParams.set('access_type', 'offline');
    return NextResponse.redirect(googleAuthUrl.toString());
  }

  try {
    // --- Step 2 & 3: Exchange Code and Get User Info (No change) ---
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        redirect_uri: REDIRECT_URI,
        grant_type: 'authorization_code',
      }).toString(),
    });

    if (!tokenResponse.ok) throw new Error('Failed to exchange authorization code.');
    const tokenData = await tokenResponse.json();

    const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { 'Authorization': `Bearer ${tokenData.access_token}` },
    });

    if (!userResponse.ok) throw new Error('Failed to fetch user info.');
    const userData = await userResponse.json();

    // --- Step 4: Robust Find, Link, or Create User Logic ---
    await dbConnect();

    // Find user by email, as it's the common identifier.
    let user = await User.findOne({ email: userData.email });

    if (user) {
      // CASE 1: USER EXISTS
      // If they don't have a googleId, it means they have a manual account.
      // We link their Google account by adding the googleId.
      if (!user.googleId) {
        user.googleId = userData.id;
        await user.save();
      }
      // If they already had a googleId, we don't need to do anything.
    } else {
      // CASE 2: NEW USER
      // Create a new user since one doesn't exist with this email.
      user = new User({
        email: userData.email,
        googleId: userData.id,
        authMethod: 'google',
        // You can add other fields from userData here, e.g., name, picture
      });
      await user.save();
    }

    // --- Step 5: Create Session (JWT) and Redirect (No change) ---
    const payload = { userId: user._id };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' });

    const redirectUrl = new URL('/', request.url);
    const response = NextResponse.redirect(redirectUrl.toString());
    
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60 * 24, // 1 day
    });

    return response;

  } catch (error) {
    console.error('Google OAuth Error:', error.message);
    const errorUrl = new URL('/error', request.url);
    errorUrl.searchParams.set('message', 'Authentication failed. Please try again.');
    return NextResponse.redirect(errorUrl.toString());
  }
}

