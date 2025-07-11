import { LoginForm } from '@/components/auth/login-form';
import Image from 'next/image';

export default function LoginPage() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center p-8">
      <Image
        src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1920"
        alt="Background"
        data-ai-hint="students technology"
        layout="fill"
        objectFit="cover"
        className="z-0"
      />
      <div className="absolute inset-0 bg-black/50 z-10" />
      <div className="relative z-20 w-full max-w-md">
        <LoginForm />
      </div>
    </main>
  );
}
