
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';

export default function TermsOfServicePage() {
  return (
    <main className="flex min-h-screen flex-col items-center bg-background p-4 sm:p-8">
        <div className="w-full max-w-4xl">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
        </Link>
        <Card>
            <CardHeader>
            <CardTitle className="text-2xl md:text-3xl">Terms of Service</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground space-y-4">
                <p>Last updated: {new Date().toLocaleDateString()}</p>
                <h2 className="text-xl font-semibold text-card-foreground">Agreement to Terms</h2>
                <p>
                    By using Loksewa Prep, you agree to be bound by these Terms of Service. If you do not agree to these terms, you may not use the application. We may modify the Terms at any time, and such modification shall be effective immediately upon posting of the modified Terms.
                </p>
                <h2 className="text-xl font-semibold text-card-foreground">Use of the Service</h2>
                <p>
                    Loksewa Prep is provided for your personal, non-commercial use only. You are responsible for your use of the application and for any consequences thereof. You must not misuse the services. For example, do not interfere with our services or try to access them using a method other than the interface and the instructions that we provide.
                </p>
                <h2 className="text-xl font-semibold text-card-foreground">User Accounts</h2>
                <p>
                    To use certain features of the application, you must register for an account using your Google identity. You are responsible for safeguarding your account and for all activities that occur under your account.
                </p>
                 <h2 className="text-xl font-semibold text-card-foreground">Disclaimers</h2>
                <p>
                    The service is provided "AS IS." While we strive to provide high-quality content and a good user experience, we do not warrant that the service will be uninterrupted, timely, secure, or error-free. The questions and study plans are generated by an AI and may contain inaccuracies. They should be used as a study aid, not as a definitive source of information.
                </p>
                 <h2 className="text-xl font-semibold text-card-foreground">Governing Law</h2>
                <p>
                    These terms shall be governed by and construed in accordance with the laws of the land, without regard to its conflict of law provisions.
                </p>
            </CardContent>
        </Card>
        </div>
    </main>
  );
}
