// src/app/user/[userId]/page.js
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';

// Mock function to simulate fetching data from your API
// In a real application, you would make an API call here.
async function getUserData(userId) {
  // Replace this with a real API call to your backend
  // For example: const res = await fetch(`/api/user/${userId}`);
  // const data = await res.json();
  // return data;

  // Mock data for demonstration purposes
  return {
    name: 'John Doe',
    email: 'johndoe@example.com',
    devicesWiped: [
      { id: 'cert_12345', deviceName: 'Laptop-PC' },
      { id: 'cert_67890', deviceName: 'Mobile-Device' },
      { id: 'cert_abcde', deviceName: 'External-HDD' },
    ],
  };
}

export default async function UserDashboard({ params }) {
  const { userId } = params;
  const userData = await getUserData(userId);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto p-4 md:p-8">
        <div className="mt-20 backdrop-filter backdrop-blur-3xl bg-white/5 border border-white/20 rounded-3xl p-8 shadow-2xl">
          <h1 className="text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">
            Welcome, {userData.name}
          </h1>
          <p className="text-gray-300 mb-8">
            This is your personal dashboard.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* User Profile Info */}
            <div className="bg-white/5 p-6 rounded-xl border border-white/20">
              <h2 className="text-2xl font-semibold mb-4 text-orange-400">Your Profile</h2>
              <p><strong>Email:</strong> {userData.email}</p>
              <p className="mt-2"><strong>Total Devices Wiped:</strong> {userData.devicesWiped.length}</p>
            </div>

            {/* List of Wiped Devices */}
            <div className="bg-white/5 p-6 rounded-xl border border-white/20">
              <h2 className="text-2xl font-semibold mb-4 text-orange-400">Wipe History</h2>
              <ul className="space-y-2">
                {userData.devicesWiped.map((device) => (
                  <li key={device.id} className="border-b border-gray-700 pb-2">
                    <Link href={`/certificate/${device.id}`} className="flex justify-between items-center text-gray-200 hover:text-orange-500 transition-colors">
                      <span>{device.deviceName}</span>
                      <span className="text-sm text-gray-400 hover:underline">View Certificate</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}