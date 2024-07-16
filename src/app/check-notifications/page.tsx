'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { CheckCircleIcon } from '@heroicons/react/solid'; // Import CheckCircleIcon from Heroicons

interface Verifikasi {
  id_permohonan: number;
  status: string;
  tanggal_verifikasi: string;
}

interface Notifikasi {
  id_permohonan: number;
  status: string;
  tanggal_masuk: string;
}

interface JawabanPermohonan {
  id_permohonan: number;
  status_balasan: string;
  tanggal_jawaban: string;
}

function CheckNotifications() {
  const searchParams = useSearchParams();
  const registrationNumber = searchParams?.get('registration_number');
  const [verifikasi, setVerifikasi] = useState<Verifikasi[]>([]);
  const [notifikasi, setNotifikasi] = useState<Notifikasi[]>([]);
  const [jawabanPermohonan, setJawabanPermohonan] = useState<JawabanPermohonan[]>([]);
  const [isInSurvey, setIsInSurvey] = useState<boolean>(false);
  const [surveyDate, setSurveyDate] = useState<string | null>(null);

  useEffect(() => {
    if (registrationNumber) {
      const fetchNotifications = async () => {
        try {
          const response = await axios.get('/api/notifications', {
            params: { registration_number: registrationNumber }
          });
          setVerifikasi(response.data.verifikasi);
          setNotifikasi(response.data.notifikasi);
          setJawabanPermohonan(response.data.jawabanPermohonan);
          setIsInSurvey(response.data.isInSurvey);
          setSurveyDate(response.data.surveyDate);
        } catch (error) {
          console.error('Error fetching notifications:', error);
        }
      };

      fetchNotifications();
    }
  }, [registrationNumber]);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '';
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZone: 'Asia/Jakarta',
      timeZoneName: 'short'
    };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-xl mx-auto">
          <h1 className="text-2xl font-bold mb-4 text-center animate-fade-in-down text-red-600">Status Permohonan</h1>

          {verifikasi.length > 0 && (
            <div className="space-y-8">
              {verifikasi.map((item) => (
                <div key={item.id_permohonan} className="border border-gray-200 rounded-lg p-4 animate-fade-in-left bg-blue-400">
                  <div className="flex items-start space-x-4">    
                    <div className="flex items-center justify-center w-10 h-10 bg-green-500 text-white rounded-full">
                      <CheckCircleIcon className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold">Verifikasi Permohonan</h2>
                      <p className="text-lg">{item.status}</p>
                      <p className="text-sm text-white">{formatDate(item.tanggal_verifikasi)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {notifikasi.length > 0 && (
            <div className="space-y-8 mt-8 animate-fade-in-right">
              {notifikasi.map((item) => (
                <div key={item.id_permohonan} className="border border-gray-200 rounded-lg p-4 bg-purple-400">
                  <div className="flex items-start space-x-4">
                    <div className="flex items-center justify-center w-10 h-10 bg-green-500 text-white rounded-full">
                      <CheckCircleIcon className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold">Notifikasi Pengiriman</h2>
                      <p className="text-lg">{item.status}</p>
                      <p className="text-sm text-white">{formatDate(item.tanggal_masuk)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {jawabanPermohonan.length > 0 && (
            <div className="space-y-8 mt-8 animate-fade-in-left">
              {jawabanPermohonan.map((item) => (
                <div key={item.id_permohonan} className="border border-gray-200 rounded-lg p-4 bg-orange-400">
                  <div className="flex items-start space-x-4 ">
                    <div className="flex items-center justify-center w-10 h-10 bg-green-500 text-white rounded-full">
                      <CheckCircleIcon className="w-20 h-6" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold">Jawaban Permohonan</h2>
                      <p className="text-lg">{item.status_balasan}</p>
                      <p className="text-sm text-white">{formatDate(item.tanggal_jawaban)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {isInSurvey && (
            <div className="space-y-8 mt-8 animate-fade-in-right">
              <div className="border border-gray-200 rounded-lg p-4 bg-green-400">
                <div className="flex items-start space-x-4">
                  <div className="flex items-center justify-center w-10 h-10 bg-green-500 text-white rounded-full">
                    <CheckCircleIcon className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">Permohonan selesai</h2>
                    <p className="text-sm text-white">{formatDate(surveyDate)}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {!verifikasi.length && !notifikasi.length && !jawabanPermohonan.length && !isInSurvey && (
            <p className="mt-8 text-gray-500 animate-fade-in-down">No notifications found for registration number {registrationNumber}.</p>
          )}

        </div>
      </main>
      <Footer />
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CheckNotifications />
    </Suspense>
  );
}
