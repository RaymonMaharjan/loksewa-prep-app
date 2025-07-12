
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { Loader2 } from 'lucide-react';
import { LandingHeader } from '@/components/layout/landing-header';
import { LandingFooter } from '@/components/layout/landing-footer';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, FlaskConical, BarChart2 } from 'lucide-react';


const features = [
  {
    icon: <FileText className="h-8 w-8 text-primary" />,
    title: 'AI-Powered Quizzes',
    description: 'Generate endless mock tests and daily quizzes from our extensive syllabus to sharpen your knowledge.',
  },
  {
    icon: <FlaskConical className="h-8 w-8 text-primary" />,
    title: 'Custom Test Creation',
    description: 'Focus on your weak areas by creating personalized tests with specific topics and difficulty levels.',
  },
  {
    icon: <BarChart2 className="h-8 w-8 text-primary" />,
    title: 'Performance Analytics',
    description: 'Track your progress over time with detailed analytics and identify topics that need more attention.',
  },
];


export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
        router.push('/dashboard');
    }
  }, [user, loading, router]);
  
  if (loading || user) {
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
                <Image src="/icons/loksewa_prep_logo_512x512.png" alt="Loksewa Prep Logo" width={80} height={80} className="mb-4" />
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
                <p className="mt-4 text-lg text-foreground">Loading your experience...</p>
            </div>
        </div>
      );
  }


  return (
    <div className="flex min-h-screen flex-col">
      <LandingHeader />
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Your Personal AI-Powered Loksewa Prep Partner
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Ace your exams with intelligent quizzes, personalized study plans, and detailed performance analytics. All tailored for the Nepal Loksewa syllabus.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/login">
                    <Button size="lg">Get Started</Button>
                  </Link>
                </div>
              </div>
              <Image
                src="https://placehold.co/600x400.png"
                width="600"
                height="400"
                alt="Hero"
                data-ai-hint="digital learning success"
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last"
              />
            </div>
          </div>
        </section>

        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-muted">
            <div className="container px-4 md:px-6">
                <div className="flex flex-col items-center justify-center space-y-4 text-center">
                    <div className="space-y-2">
                        <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm">Key Features</div>
                        <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Everything You Need to Succeed</h2>
                        <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                            Our platform is packed with powerful tools to make your exam preparation effective and efficient.
                        </p>
                    </div>
                </div>
                <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:gap-12 lg:grid-cols-3 mt-12">
                    {features.map((feature) => (
                        <Card key={feature.title}>
                            <CardHeader className="flex items-center gap-4">
                                {feature.icon}
                                <CardTitle>{feature.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <CardDescription>{feature.description}</CardDescription>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
        
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container grid items-center gap-6 px-4 md:px-6 lg:grid-cols-2 lg:gap-10">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                Ready to start your journey to success?
              </h2>
              <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Create an account and get immediate access to all our features. Your preparation starts now.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row lg:justify-end">
               <Link href="/login">
                  <Button size="lg">Sign Up for Free</Button>
                </Link>
            </div>
          </div>
        </section>
      </main>
      <LandingFooter />
    </div>
  );
}
