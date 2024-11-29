'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import RegistrationForm from '@/components/RegistrationForm';

export default function Home() {
  const searchParams = useSearchParams();
  const deviceId = searchParams?.get('deviceId');
  
  console.log('[Home] Rendering with deviceId:', deviceId);
  console.log('[Home] Full searchParams:', Object.fromEntries(searchParams?.entries() ?? []));

  if (!searchParams) {
    console.error('[Home] searchParams is null or undefined');
    return (
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto text-center">
          <h1 className="text-3xl font-bold mb-4">Device Registration</h1>
          <p className="mb-4">No query parameters found. Please use a valid registration link.</p>
          <Link 
            href="/device-management" 
            className="text-indigo-600 hover:text-indigo-800 underline"
          >
            Go to Device Management
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold mb-8">Device Registration</h1>
        
        {deviceId ? (
          <>
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6">
              <p className="text-blue-700">Device ID: {deviceId}</p>
            </div>
            <RegistrationForm deviceId={deviceId} />
          </>
        ) : (
          <div className="text-center">
            <p className="mb-4">No device ID provided. Please use a valid registration link.</p>
            <Link 
              href="/device-management" 
              className="text-indigo-600 hover:text-indigo-800 underline"
            >
              Go to Device Management
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
