
import { LoginForm } from '@/components/auth/login-form';

export default function LoginPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-muted p-8">
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
    </main>
  );
}
