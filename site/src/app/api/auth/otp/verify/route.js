import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import OTP from '@/models/OTP';

export async function POST(request) {
  await dbConnect();

  try {
    const { email, otp } = await request.json();

    if (!email || !otp) {
      return NextResponse.json({ message: 'Email and OTP are required' }, { status: 400 });
    }

    const storedOtp = await OTP.findOne({ email, otp });

    if (!storedOtp) {
      return NextResponse.json({ message: 'Invalid or expired OTP' }, { status: 401 });
    }

    // OTP is valid, but we need to delete it to prevent reuse
    await OTP.deleteOne({ _id: storedOtp._id });

    return NextResponse.json({ message: 'OTP verified successfully' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to verify OTP', error }, { status: 500 });
  }
}