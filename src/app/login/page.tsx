
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { LoginForm } from '@/components/auth/login-form';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

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
        <header className="absolute top-0 left-0 p-4">
             <Button variant="ghost" asChild>
                <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground">
                    <ArrowLeft className="h-4 w-4" />
                    Back to Home
                </Link>
             </Button>
        </header>
        <main className="flex-1 flex flex-col items-center justify-center p-8">
            <div className="w-full max-w-sm">
                <LoginForm />
            </div>
        </main>
    </div>
  );
}
