
'use client';

import { useState, FormEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { motion } from 'framer-motion';

export default function Home() {
  const [registrationNumber, setRegistrationNumber] = useState('');
  const router = useRouter();

  useEffect(() => {
    const input = document.getElementById('registrationNumber');
    if (input) {
      input.style.transition = 'all 0.2s ease-in-out';
    }
  }, []);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (registrationNumber) {
      router.push(`/check-notifications?registration_number=${registrationNumber}`);
    }
  };

  return (
    <>
      <Navbar />
      
      <div className="min-h-screen flex items-center justify-center bg-gray">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="bg-white p-8 rounded-lg shadow-lg"
        >
          <h1 className="text-2xl font-bold mb-4">Submit Registration Number</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="registrationNumber" className="block text-sm font-medium text-gray-700">
                Registration Number
              </label>
              <input
                type="text"
                id="registrationNumber"
                value={registrationNumber}
                onChange={(e) => setRegistrationNumber(e.target.value)}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              />
            </div>
            <div>
              <button
                type="submit"
                className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-200 ease-in-out"
              >
                Submit
              </button>
            </div>
          </form>
        </motion.div>
      </div>
      <Footer />
    </>
  );
}
