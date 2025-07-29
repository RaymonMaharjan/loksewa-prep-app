
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { LoginPageContent } from '@/components/auth/login-form';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';

export default function LoginPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  if (loading || (!loading && user)) {
    return (
        <div 
            className="relative flex h-screen w-screen flex-col items-center justify-center bg-cover bg-center"
            style={{ 
              backgroundImage: "url('/landscape_1.jpg')",
            }}
            data-ai-hint="futuristic tech abstract"
        >
            <div className="absolute inset-0 bg-background/60 z-10" />
            <div className="relative z-20 flex flex-col items-center justify-center text-center">
                <Image src="/icons/512x512.jpg" alt="Loksewa Prep Logo" width={80} height={80} className="mb-4" />
                <h1 className="text-2xl font-bold text-foreground">Loksewa Prep</h1>
                <Loader2 className="mt-4 h-8 w-8 animate-spin text-primary" />
            </div>
        </div>
    );
  }

  // If loading is finished and there's no user, show the login form.
  if (!loading && !user) {
    return <LoginPageContent />;
  }

  return null;
}
