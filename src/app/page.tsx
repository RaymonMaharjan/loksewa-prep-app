import { LoginForm } from '@/components/auth/login-form';
import Image from 'next/image';

export default function LoginPage() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center p-8">
      <Image
        src="/login-background.jpg"
        alt="Background"
        data-ai-hint="people studying"
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
