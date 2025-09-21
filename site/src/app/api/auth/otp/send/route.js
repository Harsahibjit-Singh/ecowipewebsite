import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import OTP from '@/models/Otp';
import nodemailer from 'nodemailer';
import { customAlphabet } from 'nanoid';

const nanoid = customAlphabet('0123456789', 6);

export async function POST(request) {
  await dbConnect();

  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ message: 'Email is required' }, { status: 400 });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Generate a new OTP and save it
    const otpCode = nanoid();
    await OTP.findOneAndUpdate(
      { email },
      { otp: otpCode },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    // Send the email
    const transporter = nodemailer.createTransport({
      service: 'gmail', // You can use any service
      auth: {
        user: process.env.NODEMAILER_EMAIL,
        pass: process.env.NODEMAILER_APP_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.NODEMAILER_EMAIL,
      to: email,
      subject: 'EcoWipe: Your Password Reset OTP',
      html: `<p>Your One-Time Password (OTP) for password reset is: <strong>${otpCode}</strong></p><p>This code will expire in 5 minutes.</p>`,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ message: 'OTP sent successfully' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to send OTP', error }, { status: 500 });
  }
}