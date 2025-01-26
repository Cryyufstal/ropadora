"use client";

import BottomNavigation from '@/components/BottomNavigation';
import ReferralSystem from '@/components/ReferralSystem';
import { useEffect, useState } from 'react';

export default function Home() {
  const [initData, setInitData] = useState(''); 
  const [userId, setUserId] = useState('');
  const [startParam, setStartParam] = useState('');
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const initWebApp = async () => {
      if (typeof window !== 'undefined') {
        const WebApp = (await import('@twa-dev/sdk')).default;
        WebApp.ready();
        setInitData(WebApp.initData);
        setUserId(WebApp.initDataUnsafe.user?.id.toString() || '');
        setStartParam(WebApp.initDataUnsafe.start_param || '');
      }
    };

    initWebApp();
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      if (userId) {
        try {
          const response = await fetch(`/api/users/${userId}`);
          if (response.ok) {
            const data = await response.json();
            setUserData(data);
          } else {
            console.error('Failed to fetch user data');
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    };

    fetchUserData();
  }, [userId]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-900 p-6 text-white">
      <div className="bg-gray-800 shadow-lg rounded-2xl w-full max-w-3xl p-6 text-center">
        <h1 className="text-4xl font-bold mb-6 text-blue-400">
          Telegram Referral 
        </h1>
        <p className="text-gray-300 text-lg mb-8">
          Welcome to the referral system. Connect with your audience and share referral links seamlessly!
        </p>
        {userData ? (
          <ReferralSystem 
            initData={initData} 
            userId={userId} 
            startParam={startParam} 
            userData={userData} 
          />
        ) : (
          <p>Loading user data...</p>
        )}
      </div>
      <BottomNavigation />
    </main>
  );
}
