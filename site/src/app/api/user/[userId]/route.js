
// // /user/[userId]/route.js
// import { NextResponse } from 'next/server';
// import dbConnect from '@/lib/dbConnect';
// import User from '@/models/User';
// import Certificate from '@/models/Certificate';

// export async function GET(request, { params }) {
//   await dbConnect();

//   try {
//     const { userId } = params;

//     const user = await User.findById(userId).select('-password'); // Exclude password from the response
//     if (!user) {
//       return NextResponse.json({ message: 'User not found' }, { status: 404 });
//     }

//     // Fetch the count and list of certificates for this user
//     const certificates = await Certificate.find({ user: userId }).select('certificateID');
//     const deviceCount = certificates.length;

//     const certificateList = certificates.map(cert => ({
//       certificateID: cert.certificateID,
//       // You can add more fields if needed, like a custom name from the user
//     }));

//     const responseData = {
//       user,
//       deviceCount,
//       certificateList,
//     };

//     return NextResponse.json(responseData, { status: 200 });
//   } catch (error) {
//     return NextResponse.json({ message: 'Failed to fetch user data', error }, { status: 500 });
//   }
// }


import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import Certificate from '@/models/Certificate';

export async function GET(request, { params }) {
  await dbConnect();

  try {
    const { userId } = params;

    const user = await User.findById(userId).select('-password'); // Exclude password
    if (!user) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }

    // --- FIX APPLIED HERE ---
    // 1. Remove .select('certificateID') to fetch the FULL certificate documents.
    const certificates = await Certificate.find({ user: userId });

    // 2. Construct the response. The 'certificates' variable now holds the complete data.
    const responseData = {
      user,
      deviceCount: certificates.length, // Get count from the array
      certificateList: certificates, // Assign the full array directly
    };

    return NextResponse.json(responseData, { status: 200 });

  } catch (error) {
    console.error("API Error fetching user profile:", error);
    return NextResponse.json({ success: false, message: 'Failed to fetch user data', error: error.message }, { status: 500 });
  }
}
