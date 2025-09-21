import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';

export async function POST(request) {
  // 1. Connect to the database
  await dbConnect();

  try {
    // 2. Extract email and newPassword from the request body
    const { email, newPassword } = await request.json();

    // 3. Validate the input
    if (!email || !newPassword) {
      return NextResponse.json(
        { message: 'Email and new password are required' },
        { status: 400 }
      );
    }
    
    // 4. Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // You might want to add a check here to ensure the user is not a Google OAuth user
    if (user.authMethod === 'google') {
        return NextResponse.json(
            { message: 'Password cannot be reset for Google accounts' },
            { status: 400 }
        );
    }

    // 5. Set the new password and save the user
    // The 'pre-save' middleware in your User model will automatically hash the password.
    user.password = newPassword;
    await user.save();

    // 6. Return a success response
    return NextResponse.json(
      { message: 'Password has been reset successfully' },
      { status: 200 }
    );
  } catch (error) {
    // 7. Handle any errors
    console.error('Password reset error:', error);
    return NextResponse.json(
      { message: 'Failed to reset password', error: error.message },
      { status: 500 }
    );
  }
}