
'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { onAuthStateChanged, User, signOut as firebaseSignOut, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Loader2 } from 'lucide-react';
import { LoksewaLogo } from '@/components/icons/loksewa-logo';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      // Add a small delay to prevent splash screen from flashing too quickly
      setTimeout(() => setLoading(false), 500); 
    });

    return () => unsubscribe();
  }, []);
  
  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      router.push('/dashboard');
    } catch (error) {
      console.error("Error signing in with Google", error);
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      router.push('/');
    } catch (error) {
      console.error("Error signing out", error);
    }
  };

  if (loading) {
    return (
        <div className="relative flex h-screen w-screen flex-col items-center justify-center bg-gradient-to-br from-primary/20 via-background to-background">
            <Image
                src="https://placehold.co/1920x1080.png"
                alt="Loading background"
                data-ai-hint="futuristic tech abstract"
                fill
                className="object-cover z-0 opacity-10"
                priority
            />
            <div className="relative z-20 flex flex-col items-center justify-center text-center">
                <LoksewaLogo className="h-20 w-20 text-primary mb-4" />
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
                <p className="mt-4 text-lg text-foreground">Loading your experience...</p>
            </div>
        </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
