
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';

export default function PrivacyPolicyPage() {
  return (
    <main className="flex min-h-screen flex-col items-center bg-background p-4 sm:p-8">
       <div className="w-full max-w-4xl">
         <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
        </Link>
        <Card>
            <CardHeader>
            <CardTitle className="text-2xl md:text-3xl">Privacy Policy</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground space-y-4">
                <p>Last updated: {new Date().toLocaleDateString()}</p>
                <h2 className="text-xl font-semibold text-card-foreground">Introduction</h2>
                <p>
                    Welcome to Loksewa Prep. We are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our application. Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the application.
                </p>
                <h2 className="text-xl font-semibold text-card-foreground">Collection of Your Information</h2>
                <p>
                    We may collect information about you in a variety of ways. The information we may collect via the Application includes personal data, such as your name, email address, and profile picture, which you voluntarily give to us when you register with the Application through your Google account.
                </p>
                <h2 className="text-xl font-semibold text-card-foreground">Use of Your Information</h2>
                <p>
                    Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the Application to create and manage your account, personalize your user experience, and monitor usage and trends to improve your experience with the Application.
                </p>
                <h2 className="text-xl font-semibold text-card-foreground">Security of Your Information</h2>
                 <p>
                    We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse.
                </p>
                <h2 className="text-xl font-semibold text-card-foreground">Contact Us</h2>
                <p>
                    If you have questions or comments about this Privacy Policy, please contact us.
                </p>
            </CardContent>
        </Card>
       </div>
    </main>
  );
}
