"use client";

import { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleManualSignUp = async (e) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage('Registration successful! Please sign in.');
      } else {
        setMessage(data.message || 'Registration failed.');
      }
    } catch (error) {
      setMessage('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    // This will redirect to the Google OAuth flow.
    // In a real app, this would be handled by NextAuth.js.
    window.location.href = '/api/auth/google'; 
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Navbar />
      <main className="flex-grow flex items-center justify-center p-4">
        <div className="w-full max-w-lg text-center backdrop-filter backdrop-blur-3xl bg-white/5 border border-white/20 rounded-3xl p-8 shadow-2xl">
          <h1 className="text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">
            Create an Account
          </h1>
          <p className="text-gray-300 mb-6">
            Sign up to securely manage your device wipe certificates.
          </p>

          <button
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center py-3 px-4 rounded-full text-black font-semibold bg-white hover:bg-gray-200 transition-colors mb-4"
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.0001 4.75001C14.0721 4.75001 15.836 5.46741 17.2008 6.78651L21.0558 2.93151C18.6756 0.730311 15.5358 -0.250004 12.0001 -0.250004C7.09849 -0.250004 2.81261 2.76868 0.778811 7.21481L4.85108 9.94751C6.27361 6.37681 8.94821 4.75001 12.0001 4.75001Z" fill="#EA4335" />
              <path d="M23.0001 12.0001C23.0001 11.2351 22.9211 10.4901 22.7751 9.77511H12.0001V14.2251H18.2941C17.9651 15.9171 16.8921 17.3481 15.3941 18.2831L19.4671 21.0151C21.9361 18.7881 23.0001 15.6701 23.0001 12.0001Z" fill="#4285F4" />
              <path d="M4.85108 9.94751L0.778811 7.21481C0.280146 8.35623 0 9.63001 0 11.0001C0 12.3701 0.280146 13.644 0.778811 14.7854L4.85108 12.0527C4.66598 11.4552 4.56616 10.7416 4.56616 10.0001C4.56616 9.25852 4.66598 8.54483 4.85108 7.94738V9.94751Z" fill="#FBBC04" />
              <path d="M12.0001 23.9999C15.5358 23.9999 18.6756 22.7314 21.0558 20.5298L17.2008 16.6748C15.836 17.994 14.0721 18.7501 12.0001 18.7501C8.94821 18.7501 6.27361 17.1233 4.85108 13.5526L0.778811 16.2853C2.81261 20.7314 7.09849 23.7501 12.0001 23.7501C12.0001 23.7501 12.0001 23.7501 12.0001 23.7501Z" fill="#34A853" />
            </svg>
            Sign up with Google
          </button>

          <div className="flex items-center my-4">
            <div className="flex-grow border-t border-gray-700"></div>
            <span className="mx-4 text-gray-500">or</span>
            <div className="flex-grow border-t border-gray-700"></div>
          </div>

          <form onSubmit={handleManualSignUp} className="flex flex-col gap-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full px-8 py-3 text-lg font-semibold rounded-full bg-orange-600 hover:bg-orange-700 transition-colors duration-300 disabled:bg-gray-500 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating...' : 'Sign Up'}
            </button>
          </form>

          {message && <p className={`mt-4 ${message.includes('successful') ? 'text-green-400' : 'text-red-500'}`}>{message}</p>}

          <p className="mt-6 text-gray-400">
            Already have an account?{' '}
            <Link href="/auth/signin" className="text-orange-400 hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}