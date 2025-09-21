import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
// Helper function to fetch certificate details from your API
async function getCertificateDetails(certificateId) {
  // It's a good practice to use environment variables for your base URL
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const apiUrl = `${baseUrl}/api/certificate/verify/${certificateId}`;

  try {
    const res = await fetch(apiUrl, {
      // Use 'no-store' to ensure you always get the latest data, which is good for verification
      cache: 'no-store',
    });

    // If the response is not successful (e.g., 404), return null
    if (!res.ok) {
      return null;
    }

    const jsonResponse = await res.json();
    return jsonResponse.success ? jsonResponse.data : null;
  } catch (error) {
    console.error("Failed to fetch certificate:", error);
    return null; // Return null on network error
  }
}



// --- Main Page Component ---

// FIX: Destructure certificateId directly from params in the function signature
export default async function CertificateDetails({ params: { certificateId } }) {
  const certificateData = await getCertificateDetails(certificateId);

  // Render a "Not Found" state if certificateData is null
  if (!certificateData) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center p-4">
          <div className="w-full max-w-2xl text-center backdrop-filter backdrop-blur-3xl bg-white/5 border border-white/20 rounded-3xl p-8 shadow-2xl">
            <h1 className="text-4xl font-bold mb-4 text-red-500">Certificate Not Found</h1>
            <p className="text-gray-300">The certificate ID you provided could not be found or is invalid.</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Render the certificate details if found
  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-sans">
      <Navbar />
      <main className="flex-grow flex items-center justify-center p-4">
        <div className="w-full max-w-2xl backdrop-filter backdrop-blur-3xl bg-white/5 border border-white/20 rounded-3xl p-8 shadow-2xl">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">
              Certificate of Wiping
            </h1>
            <p className="text-gray-300 mb-6">
              Successfully verified certificate: <strong>{certificateData.certificateID}</strong>
            </p>
          </div>

          <div className="mt-8 text-left bg-white/5 p-6 rounded-xl border border-white/20">
            <h2 className="text-2xl font-semibold text-green-400 mb-4 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Verification Successful
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-200">
              <p><strong>Wiping Host OS:</strong> {certificateData.wipingHostOS}</p>
              <p><strong>Wiping Host Name:</strong> {certificateData.wipingHostName}</p>
              <p><strong>Target Device Serial:</strong> {certificateData.targetDeviceSerial}</p>
              <p><strong>Wipe Method:</strong> {certificateData.wipeMethod}</p>
              <p><strong>Issue Date:</strong> {new Date(certificateData.issueDate).toLocaleDateString()}</p>
            </div>
             {certificateData.user && (
              <div className="mt-6 pt-4 border-t border-white/10">
                <h3 className="text-lg font-semibold text-orange-400 mb-2">Issued To:</h3>
                <div className="space-y-1 text-gray-200">
                    <p><strong>Name:</strong> {certificateData.user.name || 'N/A'}</p>
                    <p><strong>Email:</strong> {certificateData.user.email || 'N/A'}</p>
                </div>
              </div>
            )}
            <p className="mt-6 text-sm text-gray-300 font-medium">
              <strong>Compliance Standard:</strong> {certificateData.complianceStandard}
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

