
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (user) {
        router.push('/dashboard');
      } else {
        router.push('/login');
      }
    }
  }, [user, loading, router]);

  return (
    <div
      className="relative flex h-screen w-screen flex-col items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage: "url('/login-background.jpg')",
      }}
      data-ai-hint="futuristic tech abstract"
    >
      <div className="absolute inset-0 bg-background/60 z-10" />
      <div className="relative z-20 flex flex-col items-center justify-center text-center">
        <Image src="/icons/logo.svg" alt="Loksewa Prep Logo" width={80} height={80} className="mb-4" />
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="mt-4 text-lg text-foreground">Loading your experience...</p>
      </div>
    </div>
  );
}
