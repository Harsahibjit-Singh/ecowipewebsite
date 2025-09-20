import { NextResponse } from 'next/server';

// This is the Client ID and Client Secret from your Google Cloud Console.
// It is critical to store these in environment variables and never hard-code them.
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

// The Redirect URI must be registered in your Google Cloud Console.
// It should match the URL of this API route on your production server.
const REDIRECT_URI = process.env.REDIRECT_URI || 'http://localhost:3000/api/auth/google';

// This API route handles the entire Google OAuth flow in a single file.
export async function GET(request) {
  // Parse the request URL to get query parameters
  const url = new URL(request.url);
  const code = url.searchParams.get('code');

  // --- Step 1: Redirect to Google's Consent Screen ---
  // If there's no 'code' in the URL, it means this is the initial sign-in request.
  // We construct the Google OAuth URL and redirect the user's browser to it.
  if (!code) {
    const googleAuthUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
    googleAuthUrl.searchParams.set('client_id', GOOGLE_CLIENT_ID);
    googleAuthUrl.searchParams.set('redirect_uri', REDIRECT_URI);
    googleAuthUrl.searchParams.set('response_type', 'code');
    googleAuthUrl.searchParams.set('scope', 'openid profile email');
    googleAuthUrl.searchParams.set('access_type', 'offline'); // To get a refresh token

    // Redirect the user to Google
    return NextResponse.redirect(googleAuthUrl.toString());
  }

  // --- Step 2: Handle the Callback and Exchange the Code ---
  // If a 'code' is present, Google has redirected the user back to our app.
  // We need to exchange this temporary code for a permanent access token.
  try {
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        code: code,
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        redirect_uri: REDIRECT_URI,
        grant_type: 'authorization_code',
      }).toString(),
    });

    if (!tokenResponse.ok) {
      throw new Error(`Failed to exchange code: ${tokenResponse.statusText}`);
    }

    const tokenData = await tokenResponse.json();
    const { access_token, id_token } = tokenData;

    // --- Step 3: Get User Information ---
    // Use the access token to get the user's profile information from Google.
    const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        'Authorization': `Bearer ${access_token}`,
      },
    });

    if (!userResponse.ok) {
      throw new Error(`Failed to fetch user info: ${userResponse.statusText}`);
    }

    const userData = await userResponse.json();
    const userId = userData.id; // Or another unique identifier

    // --- Step 4: Redirect the user to their dashboard ---
    // At this point, you would typically create a session (e.g., using a cookie)
    // and redirect the user to a protected route.
    // We'll redirect to a mock user dashboard.
    // In a real application, you would manage the session here.
    const redirectUrl = new URL(`/user/${userId}`, request.url);
    return NextResponse.redirect(redirectUrl.toString());

  } catch (error) {
    console.error('Google OAuth failed:', error);
    // Redirect to a user-friendly error page
    const errorUrl = new URL('/error', request.url);
    errorUrl.searchParams.set('message', 'Authentication failed.');
    return NextResponse.redirect(errorUrl.toString());
  }
}
