// import { NextResponse } from 'next/server';
// import dbConnect from '@/lib/dbConnect';
// import Certificate from '@/models/Certificate';

// export async function POST(request) {
//   await dbConnect();

//   try {
//     const { certificateId } = await request.json();

//     if (!certificateId) {
//       return NextResponse.json({ message: 'Certificate ID is required' }, { status: 400 });
//     }

//     const certificate = await Certificate.findOne({ certificateID: certificateId });

//     if (!certificate) {
//       return NextResponse.json({ message: 'Wrong ID' }, { status: 404 });
//     }

//     const responseData = {
//       wipingHostOS: certificate.wipingHostOS,
//       wipingHostName: certificate.wipingHostName,
//       targetDeviceSerial: certificate.targetDeviceSerial,
//       wipeMethod: certificate.wipeMethod,
//       issueDate: certificate.issueDate,
//       certificateID: certificate.certificateID,
//       complianceStandard: "Aligns with NIST SP 800-88 'Purge' principles"
//     };

//     return NextResponse.json(responseData, { status: 200 });
//   } catch (error) {
//     return NextResponse.json({ message: 'An error occurred during verification', error }, { status: 500 });
//   }
// }

import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Certificate from "@/models/Certificate";
// FIX 1: Import the User model to prevent the MissingSchemaError during populate.
import User from "@/models/User";

// FIX 2: Destructure certificateId directly from params in the function signature.
export async function GET(request, { params: { certificateId } }) {
  try {
    await dbConnect();

    // Validate param
    if (!certificateId || typeof certificateId !== "string") {
      return NextResponse.json(
        { success: false, error: "Valid Certificate ID is required" },
        { status: 400 }
      );
    }

    // Find certificate and populate user details
    const certificate = await Certificate.findOne({ certificateID: certificateId }).populate("user");

    if (!certificate) {
      return NextResponse.json(
        { success: false, error: "Certificate not found" },
        { status: 404 }
      );
    }

    // Build response
    const responseData = {
      certificateID: certificate.certificateID,
      wipingHostOS: certificate.wipingHostOS,
      wipingHostName: certificate.wipingHostName,
      targetDeviceSerial: certificate.targetDeviceSerial,
      wipeMethod: certificate.wipeMethod,
      issueDate: certificate.issueDate,
      complianceStandard: "Aligns with NIST SP 800-88 'Purge' principles",
      user: certificate.user
        ? {
            id: certificate.user._id,
            name: certificate.user.name || null,
            email: certificate.user.email || null,
          }
        : null,
    };

    return NextResponse.json({ success: true, data: responseData }, { status: 200 });
  } catch (error) {
    console.error("Verification API error:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

