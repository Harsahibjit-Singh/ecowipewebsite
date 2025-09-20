"use client";

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [step, setStep] = useState(1); // 1: Send OTP, 2: Reset Password
  const [loading, setLoading] = useState(false);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/otp/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage('OTP sent! Check your email.');
        setStep(2); // Move to the next step
      } else {
        setMessage(data.message || 'Failed to send OTP.');
      }
    } catch (error) {
      setMessage('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/password/reset', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp, newPassword }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage('Password reset successful! You can now sign in.');
        setStep(1); // Reset form for next use
      } else {
        setMessage(data.message || 'Password reset failed.');
      }
    } catch (error) {
      setMessage('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Navbar />
      <main className="flex-grow flex items-center justify-center p-4">
        <div className="w-full max-w-lg text-center backdrop-filter backdrop-blur-3xl bg-white/5 border border-white/20 rounded-3xl p-8 shadow-2xl">
          <h1 className="text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">
            Forgot Password
          </h1>
          <p className="text-gray-300 mb-6">
            {step === 1 ? 'Enter your email to receive a password reset code.' : 'Enter the code from your email and a new password.'}
          </p>

          <form onSubmit={step === 1 ? handleSendOtp : handleResetPassword} className="flex flex-col gap-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors"
              required
              disabled={step === 2}
            />

            {step === 2 && (
              <>
                <input
                  type="text"
                  placeholder="OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full p-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors"
                  required
                />
                <input
                  type="password"
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full p-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors"
                  required
                />
              </>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full px-8 py-3 text-lg font-semibold rounded-full bg-orange-600 hover:bg-orange-700 transition-colors duration-300 disabled:bg-gray-500 disabled:cursor-not-allowed"
            >
              {loading ? 'Processing...' : (step === 1 ? 'Send OTP' : 'Reset Password')}
            </button>
          </form>

          {message && <p className={`mt-4 ${message.includes('successful') ? 'text-green-400' : 'text-red-500'}`}>{message}</p>}

          <p className="mt-6 text-gray-400">
            Remembered your password?{' '}
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