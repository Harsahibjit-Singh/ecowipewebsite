import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Certificate from '@/models/Certificate';

export async function GET(request, { params }) {
  await dbConnect();

  try {
    const { certificateId } = params;

    const certificate = await Certificate.findOne({ certificateID: certificateId });
    if (!certificate) {
      return NextResponse.json({ message: 'Certificate not found' }, { status: 404 });
    }

    return NextResponse.json(certificate, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to fetch certificate', error }, { status: 500 });
  }
}