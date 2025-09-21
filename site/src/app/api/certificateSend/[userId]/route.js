// app/api/certificate/send/[userId]/route.js

//veer here certificateId userI hai we can't use different slug 
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Certificate from '@/models/Certificate';
import User from '@/models/User';

// Helper function to generate unique certificate IDs
function generateCertificateId() {
  const prefix = "CERT";
  const unique = Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  return `${prefix}-${unique.toUpperCase()}`;
}

export async function POST(request, { params }) {
  await dbConnect();

  try {
    const { userId } = params;
    const body = await request.json();
    const { wipingHostOS, wipingHostName, targetDeviceSerial, wipeMethod } = body;

    // Fetch user and exclude password
    const user = await User.findById(userId).select('-password');
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Generate unique certificateID
    const certificateID = generateCertificateId();

    // Create new certificate
    const newCertificate = await Certificate.create({
      certificateID,
      user: user._id,
      wipingHostOS,
      wipingHostName,
      targetDeviceSerial,
      wipeMethod,
    });

    return NextResponse.json(newCertificate, { status: 201 });
  } catch (error) {
    console.error("❌ Error creating certificate:", error);
    return NextResponse.json({ message: 'Failed to create certificate', error: error.message }, { status: 500 });
  }
}
