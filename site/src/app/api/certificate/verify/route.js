import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Certificate from '@/models/Certificate';

export async function POST(request) {
  await dbConnect();

  try {
    const { certificateId } = await request.json();

    if (!certificateId) {
      return NextResponse.json({ message: 'Certificate ID is required' }, { status: 400 });
    }

    const certificate = await Certificate.findOne({ certificateID: certificateId });

    if (!certificate) {
      return NextResponse.json({ message: 'Wrong ID' }, { status: 404 });
    }

    const responseData = {
      wipingHostOS: certificate.wipingHostOS,
      wipingHostName: certificate.wipingHostName,
      targetDeviceSerial: certificate.targetDeviceSerial,
      wipeMethod: certificate.wipeMethod,
      issueDate: certificate.issueDate,
      certificateID: certificate.certificateID,
      complianceStandard: "Aligns with NIST SP 800-88 'Purge' principles"
    };

    return NextResponse.json(responseData, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'An error occurred during verification', error }, { status: 500 });
  }
}