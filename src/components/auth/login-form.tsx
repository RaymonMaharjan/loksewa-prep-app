
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Loader2, Download, Share, MoreVertical } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import { useState, useEffect } from 'react';
import { LoksewaLogo } from '../icons/loksewa-logo';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

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
    />
    <path
      fill="#1976D2"
      d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571l6.19,5.238C42.01,35.638,44,30.138,44,24C44,22.659,43.862,21.35,43.611,20.083z"
    />
  </svg>
);

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export function LoginForm() {
  const { signInWithGoogle, loading } = useAuth();
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleLogin = async () => {
    setIsLoggingIn(true);
    await signInWithGoogle();
    setIsLoggingIn(false);
  };
  
  const handleInstallClick = async () => {
    if (!installPrompt) return;
    await installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
    } else {
      console.log('User dismissed the install prompt');
    }
    setInstallPrompt(null);
  };

  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="text-center">
        <div className="flex justify-center items-center mb-4">
            <LoksewaLogo className="h-14 w-14 text-primary" />
        </div>
        <CardTitle className="text-2xl font-bold">Loksewa Prep</CardTitle>
        <CardDescription>Sign in to start your preparation journey.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Button variant="outline" className="w-full" onClick={handleLogin} disabled={loading || isLoggingIn}>
            {loading || isLoggingIn ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <GoogleIcon className="mr-2" />
            )}
            Sign in with Google
          </Button>

          {installPrompt && (
            <Dialog>
              <DialogTrigger asChild>
                  <Button variant="secondary" className="w-full">
                      <Download className="mr-2 h-4 w-4" /> Install App
                  </Button>
              </DialogTrigger>
              <DialogContent>
                  <DialogHeader>
                  <DialogTitle>Install Loksewa Prep App</DialogTitle>
                  <DialogDescription>
                      Follow the instructions for your device to install the app for the best experience.
                  </DialogDescription>
                  </DialogHeader>
                  <div className='space-y-4'>
                      <div>
                          <h3 className='font-semibold mb-2'>On Android/Desktop (Chrome)</h3>
                          <ol className='list-decimal list-inside text-sm text-muted-foreground space-y-1'>
                              <li>Click the <Download className='inline h-4 w-4' /> button in the address bar.</li>
                              <li>Select <strong>Install</strong>.</li>
                          </ol>
                      </div>
                      <div>
                          <h3 className='font-semibold mb-2'>On iOS (Safari)</h3>
                          <ol className='list-decimal list-inside text-sm text-muted-foreground space-y-1'>
                              <li>Tap the <Share className='inline h-4 w-4' /> Share button.</li>
                              <li>Scroll down and tap <strong>Add to Home Screen</strong>.</li>
                              <li>Confirm by tapping <strong>Add</strong>.</li>
                          </ol>
                      </div>
                      {installPrompt && (
                          <Button onClick={handleInstallClick} className='w-full'>
                              <Download className="mr-2 h-4 w-4" /> Install Now
                          </Button>
                      )}
                  </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <p className="text-xs text-muted-foreground text-center w-full">
          Developed by Raymond Maharjan
        </p>
        <p className="text-xs text-muted-foreground text-center w-full">
            &copy; {new Date().getFullYear()} Loksewa Prep. All rights reserved.
        </p>
      </CardFooter>
    </Card>
  );
}
