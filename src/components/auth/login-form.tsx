
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Loader2, Download } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import Link from 'next/link';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 48 48"
    width="24px"
    height="24px"
    {...props}
  >
    <path
      fill="#FFC107"
      d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
    />
    <path
      fill="#FF3D00"
      d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
    />
    <path
      fill="#4CAF50"
      d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
    / >
    <path
      fill="#1976D2"
      d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571l6.19,5.238C41.371,34.221,44,29.561,44,24C44,22.659,43.862,21.35,43.611,20.083z"
    />
  </svg>
);

export function LoginPageContent() {
  const { signInWithGoogle, loading } = useAuth();
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleSignIn = async () => {
    setIsSigningIn(true);
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error(error);
      setIsSigningIn(false);
    }
  };
  
  const handleInstallClick = () => {
    if (installPrompt) {
      installPrompt.prompt();
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-background to-secondary">
        <main className="flex-1 flex flex-col items-center justify-center p-8">
          <Card className="w-full max-w-sm">
            <CardHeader className="text-center">
              <Image src="/icons/logo.svg" alt="Loksewa Prep Logo" width={64} height={64} className="w-16 h-16 mx-auto text-primary" />
              <CardTitle className="mt-4 text-2xl">Loksewa Prep</CardTitle>
              <CardDescription>Sign in to start your preparation journey.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="flex items-start space-x-2.5 px-1">
                  <Checkbox 
                      id="terms" 
                      checked={agreedToTerms} 
                      onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
                      aria-label="Agree to terms and conditions"
                  />
                  <div className="grid gap-1.5 leading-none">
                      <Label htmlFor="terms" className="text-sm font-normal text-muted-foreground">
                          I agree to the{" "}
                          <Link href="/terms-of-service" className="underline hover:text-primary" target="_blank" rel="noopener noreferrer">
                              Terms of Service
                          </Link>{" "}
                          and{" "}
                          <Link href="/privacy-policy" className="underline hover:text-primary" target="_blank" rel="noopener noreferrer">
                              Privacy Policy
                          </Link>
                          .
                      </Label>
                  </div>
              </div>

              <Button onClick={handleSignIn} variant="outline" className="w-full" disabled={isSigningIn || loading || !agreedToTerms}>
                {isSigningIn ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <GoogleIcon className="mr-2" />
                    Sign in with Google
                  </>
                )}
              </Button>

              {installPrompt && (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="secondary" className="w-full">
                      <Download className="mr-2 h-4 w-4" />
                      Install App
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Install Loksewa Prep</DialogTitle>
                      <DialogDescription>
                        For the best experience, install the app on your device. This allows for offline access and a native app feel.
                      </DialogDescription>
                    </DialogHeader>
                    <Button onClick={handleInstallClick}>Install Now</Button>
                  </DialogContent>
                </Dialog>
              )}
            </CardContent>
          </Card>
        </main>
         <footer className="py-4 px-8 text-center">
            <div className="flex justify-center items-center gap-x-4 gap-y-2 flex-wrap text-sm text-muted-foreground">
                <span>Developed by Raymond Maharjan</span>
                <span className="hidden sm:inline">|</span>
                <span>&copy; {new Date().getFullYear()} Loksewa Prep</span>
                <span className="hidden sm:inline">|</span>
                <Link href="/terms-of-service" className="hover:text-primary hover:underline">
                    Terms of Service
                </Link>
                <span className="hidden sm:inline">|</span>
                <Link href="/privacy-policy" className="hover:text-primary hover:underline">
                    Privacy Policy
                </Link>
            </div>
        </footer>
    </div>
  );
}
