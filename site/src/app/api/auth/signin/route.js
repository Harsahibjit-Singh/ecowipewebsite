import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import bcrypt from 'bcrypt';

export async function POST(request) {
  await dbConnect();

  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ message: 'Email and password are required' }, { status: 400 });
    }

    const user = await User.findOne({ email, authMethod: 'manual' });
    if (!user) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    // In a real app, you would generate a session token or JWT here
    // For this example, we'll just return a success message
    return NextResponse.json({ message: 'Signed in successfully', userId: user._id }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'An error occurred during sign-in', error }, { status: 500 });
  }
}