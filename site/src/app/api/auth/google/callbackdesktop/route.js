import { NextResponse } from 'next/server';
import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User'; // Ensure your User model is correctly imported

// Initialize the Google Auth client with your credentials from .env.local
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export async function POST(request) {
  await dbConnect();
  try {
    // 1. Receive the one-time authorization code from the JavaFX app
    const { code } = await request.json();

    if (!code) {
      return NextResponse.json({ success: false, message: 'Authorization code is required.' }, { status: 400 });
    }

    // 2. Exchange the code for Google tokens
    const { tokens } = await client.getToken({
      code,
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: 'postmessage' // Special value for non-web clients
    });

    if (!tokens.id_token) {
        throw new Error("Failed to retrieve ID token from Google.");
    }
    
    // 3. Verify the token and get the user's profile information
    const ticket = await client.verifyIdToken({
        idToken: tokens.id_token,
        audience: process.env.GOOGLE_CLIENT_ID,
    });
    
    const payload = ticket.getPayload();
    // 'sub' is Google's unique ID for the user.
    const { email, name, picture, sub: googleId } = payload;

    // 4. Find an existing user or create a new one (UPDATED LOGIC)
    let user = await User.findOne({ email: email });

    if (!user) {
      // User does not exist, create a new one with the 'google' auth method
      user = new User({
        email,
        name, // Assuming your User schema has a 'name' field
        googleId,
        authMethod: 'google',
        // Note: Password will be null and is not required because authMethod is 'google'
      });
      await user.save();
    } else {
      // User exists, ensure their googleId is stored if they are linking accounts
      if (!user.googleId) {
        user.googleId = googleId;
        await user.save();
      }
    }

    // 5. Create your own application's session token (JWT)
    const sessionToken = jwt.sign(
        { userId: user._id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '7d' } 
    );

    // 6. Return the session token and user details as a JSON response
    return NextResponse.json({
      success: true,
      token: sessionToken,
      userId: user._id,
      email: user.email,
      name: user.name
    }, { status: 200 });

  } catch (error) {
    console.error('Google Auth Error:', error);
    return NextResponse.json({ success: false, message: 'Authentication failed.', error: error.message }, { status: 500 });
  }
}

