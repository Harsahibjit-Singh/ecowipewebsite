import HeroSection from '@/components/HeroSection';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';


export default function Home() {
  return (
    <main className="bg-black text-white min-h-screen">
      <Navbar />
      <HeroSection />
      {/* Additional sections for features, testimonials, etc., will go here */}
      <Footer />
    </main>
  );
}