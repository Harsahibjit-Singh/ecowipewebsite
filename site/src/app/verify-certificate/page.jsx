"use client";

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function VerifyCertificate() {
  const [certificateId, setCertificateId] = useState('');
  const [certificateData, setCertificateData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setCertificateData(null);
    setError('');

    if (!certificateId) {
      setError('Please enter a Certificate ID.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/certificate/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ certificateId }),
      });

      const data = await response.json();

      if (response.ok) {
        setCertificateData(data);
      } else {
        setError(data.message || 'Verification failed. Please try again.');
      }
    } catch (err) {
      setError('An error occurred. Please check your network connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Navbar />
      <main className="flex-grow flex items-center justify-center p-4">
        <div className="w-full max-w-2xl text-center backdrop-filter backdrop-blur-3xl bg-white/5 border border-white/20 rounded-3xl p-8 shadow-2xl">
          <h1 className="text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">
            Verify Certificate
          </h1>
          <p className="text-gray-300 mb-6">
            Enter the unique certificate ID to verify the data wiping process.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col items-center">
            <input
              type="text"
              value={certificateId}
              onChange={(e) => setCertificateId(e.target.value)}
              placeholder="Enter Certificate ID"
              className="w-full md:w-2/3 p-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors"
            />
            <button
              type="submit"
              disabled={loading}
              className="mt-4 px-8 py-3 text-lg font-semibold rounded-full bg-orange-600 hover:bg-orange-700 transition-colors duration-300 disabled:bg-gray-500 disabled:cursor-not-allowed"
            >
              {loading ? 'Verifying...' : 'Verify'}
            </button>
          </form>

          {certificateData && (
            <div className="mt-8 text-left bg-white/5 p-6 rounded-xl border border-white/20">
              <h2 className="text-2xl font-semibold text-orange-400 mb-4">Verification Successful</h2>
              <div className="space-y-2 text-gray-200">
                <p><strong>Wiping Host OS:</strong> {certificateData.wipingHostOS}</p>
                <p><strong>Wiping Host Name:</strong> {certificateData.wipingHostName}</p>
                <p><strong>Target Device Serial:</strong> {certificateData.targetDeviceSerial}</p>
                <p><strong>Wipe Method:</strong> {certificateData.wipeMethod}</p>
                <p><strong>Issue Date:</strong> {new Date(certificateData.issueDate).toLocaleDateString()}</p>
                <p><strong>Certificate ID:</strong> {certificateData.certificateID}</p>
              </div>
              <p className="mt-6 text-sm text-green-400 font-medium">
                Compliance Standard: Aligns with NIST SP 800-88 'Purge' principles
              </p>
            </div>
          )}

          {error && <p className="mt-4 text-red-500 font-semibold">{error}</p>}
        </div>
      </main>
      <Footer />
    </div>
  );
}