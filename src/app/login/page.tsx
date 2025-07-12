
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { LoginPageContent } from '@/components/auth/login-form';
import { Loader2 } from 'lucide-react';
import LoksewaLogo from '@/components/icons/loksewa-logo';

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
              backgroundImage: "url('/login-background.jpg')",
            }}
            data-ai-hint="futuristic tech abstract"
        >
            <div className="absolute inset-0 bg-background/80 z-10" />
            <div className="relative z-20 flex flex-col items-center justify-center text-center">
                <LoksewaLogo className="h-20 w-20 text-primary mb-4" />
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
                <p className="mt-4 text-lg text-foreground">Loading your experience...</p>
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
