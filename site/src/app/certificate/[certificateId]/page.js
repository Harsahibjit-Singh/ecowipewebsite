// src/app/certificate/[certificateId]/page.js
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

// Mock function to simulate fetching a specific certificate from your API
async function getCertificateDetails(certificateId) {
  // Replace this with a real API call to your backend
  // For example: const res = await fetch(`/api/certificate/${certificateId}`);
  // const data = await res.json();
  // return data;

  // Mock data for demonstration purposes
  const mockCertificates = {
    'cert_12345': {
      id: 'cert_12345',
      wipingHostOS: 'Windows 11',
      wipingHostName: 'PC-2023',
      targetDeviceSerial: '1A2B3C4D5E',
      wipeMethod: 'NIST SP 800-88 Purge',
      issueDate: '2023-10-26T10:00:00Z',
    },
    'cert_67890': {
      id: 'cert_67890',
      wipingHostOS: 'Android 13',
      wipingHostName: 'Galaxy-S22',
      targetDeviceSerial: 'F6E7D8C9B',
      wipeMethod: 'Secure Erase',
      issueDate: '2023-10-25T14:30:00Z',
    },
    'cert_abcde': {
      id: 'cert_abcde',
      wipingHostOS: 'Ubuntu 22.04',
      wipingHostName: 'Dev-Machine',
      targetDeviceSerial: 'Z9Y8X7W6',
      wipeMethod: 'NIST SP 800-88 Clear',
      issueDate: '2023-10-24T09:15:00Z',
    },
  };

  return mockCertificates[certificateId] || null;
}

export default async function CertificateDetails({ params }) {
  const { certificateId } = params;
  const certificateData = await getCertificateDetails(certificateId);

  if (!certificateData) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center p-4">
          <div className="w-full max-w-2xl text-center backdrop-filter backdrop-blur-3xl bg-white/5 border border-white/20 rounded-3xl p-8 shadow-2xl">
            <h1 className="text-4xl font-bold mb-4 text-red-500">Certificate Not Found</h1>
            <p className="text-gray-300">The certificate ID you are looking for does not exist.</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Navbar />
      <main className="flex-grow flex items-center justify-center p-4">
        <div className="w-full max-w-2xl text-center backdrop-filter backdrop-blur-3xl bg-white/5 border border-white/20 rounded-3xl p-8 shadow-2xl">
          <h1 className="text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">
            Certificate Details
          </h1>
          <p className="text-gray-300 mb-6">
            Details for certificate ID: {certificateData.id}
          </p>

          <div className="mt-8 text-left bg-white/5 p-6 rounded-xl border border-white/20">
            <h2 className="text-2xl font-semibold text-orange-400 mb-4">Verification Successful</h2>
            <div className="space-y-2 text-gray-200">
              <p><strong>Wiping Host OS:</strong> {certificateData.wipingHostOS}</p>
              <p><strong>Wiping Host Name:</strong> {certificateData.wipingHostName}</p>
              <p><strong>Target Device Serial:</strong> {certificateData.targetDeviceSerial}</p>
              <p><strong>Wipe Method:</strong> {certificateData.wipeMethod}</p>
              <p><strong>Issue Date:</strong> {new Date(certificateData.issueDate).toLocaleDateString()}</p>
              <p><strong>Certificate ID:</strong> {certificateData.id}</p>
            </div>
            <p className="mt-6 text-sm text-green-400 font-medium">
              Compliance Standard: Aligns with NIST SP 800-88 'Purge' principles
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}