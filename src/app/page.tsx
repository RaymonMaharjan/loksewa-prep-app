
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { LoginForm } from '@/components/auth/login-form';
import Link from 'next/link';

export default function LoginPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Wait until the loading is complete before checking for a user
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  // If loading is finished and there's no user, show the login form.
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-background to-secondary">
        <main className="flex-1 flex flex-col items-center justify-center p-8">
            <div className="w-full max-w-sm">
                <LoginForm />
            </div>
        </main>
        <footer className="py-4 px-8 text-center text-xs text-muted-foreground">
             <div className="flex justify-center gap-4">
                <Link href="/terms-of-service" className="hover:text-primary hover:underline">
                    Terms of Service
                </Link>
                <Link href="/privacy-policy" className="hover:text-primary hover:underline">
                    Privacy Policy
                </Link>
            </div>
        </footer>
    </div>
  );
}
