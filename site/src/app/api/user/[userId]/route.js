
// /user/[userId]/route.js
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import Certificate from '@/models/Certificate';

export async function GET(request, { params }) {
  await dbConnect();

  try {
    const { userId } = params;

    const user = await User.findById(userId).select('-password'); // Exclude password from the response
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Fetch the count and list of certificates for this user
    const certificates = await Certificate.find({ user: userId }).select('certificateID');
    const deviceCount = certificates.length;

    const certificateList = certificates.map(cert => ({
      certificateID: cert.certificateID,
      // You can add more fields if needed, like a custom name from the user
    }));

    const responseData = {
      user,
      deviceCount,
      certificateList,
    };

    return NextResponse.json(responseData, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to fetch user data', error }, { status: 500 });
  }
}