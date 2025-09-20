import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';

// Assuming a single release for now
const currentRelease = {
  version: '1.0.0',
  files: {
    windows: { name: 'EcoWipe-win.exe', size: '15MB', url: '/downloads/EcoWipe-win-1.0.0.exe' },
    linux: { name: 'EcoWipe-linux.deb', size: '20MB', url: '/downloads/EcoWipe-linux-1.0.0.deb' },
    android: { name: 'EcoWipe-android.apk', size: '10MB', url: '/downloads/EcoWipe-android-1.0.0.apk' },
  },
};

export default function Downloads() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto p-4 md:p-8">
        <div className="mt-20 text-center">
          <h1 className="text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">
            Download EcoWipe
          </h1>
          <p className="text-gray-300 mb-12">
            The final wipe. The ultimate security.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Windows Download */}
            <div className="backdrop-filter backdrop-blur-3xl bg-white/5 border border-white/20 rounded-3xl p-8 shadow-2xl transition-transform transform hover:scale-105">
              <h2 className="text-3xl font-bold mb-4">Windows</h2>
              <p className="text-lg text-gray-300 mb-6">Version {currentRelease.version}</p>
              <Link 
                href={currentRelease.files.windows.url}
                className="inline-block px-8 py-3 text-lg font-semibold rounded-full bg-orange-600 hover:bg-orange-700 transition-colors"
                download
              >
                Download
              </Link>
            </div>
            
            {/* Linux Download */}
            <div className="backdrop-filter backdrop-blur-3xl bg-white/5 border border-white/20 rounded-3xl p-8 shadow-2xl transition-transform transform hover:scale-105">
              <h2 className="text-3xl font-bold mb-4">Linux</h2>
              <p className="text-lg text-gray-300 mb-6">Version {currentRelease.version}</p>
              <Link 
                href={currentRelease.files.linux.url}
                className="inline-block px-8 py-3 text-lg font-semibold rounded-full bg-orange-600 hover:bg-orange-700 transition-colors"
                download
              >
                Download
              </Link>
            </div>

            {/* Android Download */}
            <div className="backdrop-filter backdrop-blur-3xl bg-white/5 border border-white/20 rounded-3xl p-8 shadow-2xl transition-transform transform hover:scale-105">
              <h2 className="text-3xl font-bold mb-4">Android</h2>
              <p className="text-lg text-gray-300 mb-6">Version {currentRelease.version}</p>
              <Link 
                href={currentRelease.files.android.url}
                className="inline-block px-8 py-3 text-lg font-semibold rounded-full bg-orange-600 hover:bg-orange-700 transition-colors"
                download
              >
                Download
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}