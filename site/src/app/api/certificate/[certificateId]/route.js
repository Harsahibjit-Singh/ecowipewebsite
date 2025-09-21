// import { NextResponse } from 'next/server';
// import dbConnect from '@/lib/dbConnect';
// import Certificate from '@/models/Certificate';

// export async function GET(request, { params }) {
//   await dbConnect();

//   try {
//     const { certificateId } = params;

//     const certificate = await Certificate.findOne({ certificateID: certificateId });
//     if (!certificate) {
//       return NextResponse.json({ message: 'Certificate not found' }, { status: 404 });
//     }

//     return NextResponse.json(certificate, { status: 200 });
//   } catch (error) {
//     return NextResponse.json({ message: 'Failed to fetch certificate', error }, { status: 500 });
//   }
// }

import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Certificate from '@/models/Certificate';
import User from '@/models/User'; // IMPORTANT: Import the User model

export async function GET(request, { params }) {
  // Destructure for cleaner code and to avoid Next.js sync issues
  const { certificateId } = params;

  if (!certificateId) {
      return NextResponse.json({ message: 'Certificate ID is required' }, { status: 400 });
  }

  try {
    await dbConnect();

    // --- FIX APPLIED HERE ---
    // Chain .populate('user') to the query.
    // This tells Mongoose to replace the user's ObjectId with the full user document.
    const certificate = await Certificate.findOne({ certificateID: certificateId }).populate('user');

    if (!certificate) {
      return NextResponse.json({ message: 'Certificate not found' }, { status: 404 });
    }

    // You can optionally select which user fields to return for security
    // For example: .populate('user', 'name email') would only return name and email

    return NextResponse.json(certificate, { status: 200 });

  } catch (error) {
    console.error("API Error fetching certificate:", error);
    return NextResponse.json({ message: 'Failed to fetch certificate', error: error.message }, { status: 500 });
  }
}

