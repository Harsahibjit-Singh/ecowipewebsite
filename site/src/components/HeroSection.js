// src/components/HeroSection.js
import Link from 'next/link';

export default function HeroSection() {
  return (
    <section className="relative flex items-center justify-center min-h-screen overflow-hidden px-4 md:px-8">
      {/* Background glowing elements for futuristic feel */}
      <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-orange-500 rounded-full mix-blend-lighten filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-red-600 rounded-full mix-blend-lighten filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>

      {/* Main Content Container with Glassmorphism */}
      <div className="relative z-10 p-8 md:p-12 lg:p-16 text-center max-w-4xl mx-auto backdrop-filter backdrop-blur-3xl bg-white/5 border border-white/20 rounded-3xl shadow-2xl transition-all duration-500 hover:scale-105">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600 drop-shadow-lg">
          EcoWipe
        </h1>
        <p className="mt-4 text-xl md:text-2xl text-gray-300 font-light max-w-2xl mx-auto">
          Securely and irrevocably wipe data from any device, protecting your privacy and ensuring compliance with industry standards.
        </p>

        {/* Buttons with Glass and Hover Effects */}
        <div className="mt-8 flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-4">
          <Link href="/downloads">
            <span className="relative inline-block px-8 py-3 text-lg font-semibold rounded-full overflow-hidden group transition-all duration-500">
              <span className="absolute inset-0 bg-orange-600 transition-all duration-500 group-hover:bg-orange-700"></span>
              <span className="relative z-20 transition-all duration-500 group-hover:text-white">
                Download Now
              </span>
            </span>
          </Link>
          <Link href="/verify-certificate">
            <span className="relative inline-block px-8 py-3 text-lg font-semibold rounded-full backdrop-filter backdrop-blur-md bg-white/10 border border-white/20 shadow-lg transition-all duration-500 hover:bg-white/20">
              <span className="text-white">Verify Certificate</span>
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}