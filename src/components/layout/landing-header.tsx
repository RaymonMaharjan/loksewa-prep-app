
'use client';
import Link from 'next/link';
import { Button, buttonVariants } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';
import { LoksewaLogo } from '../icons/loksewa-logo';
import { ModeToggle } from './mode-toggle';

const navLinks = [
  { href: '#features', label: 'Features' },
  { href: '#pricing', label: 'Pricing' },
  { href: '#contact', label: 'Contact' },
];

export function LandingHeader() {
  return (
    <header className="px-4 lg:px-6 h-14 flex items-center bg-background/80 backdrop-blur-sm sticky top-0 z-50 border-b">
      <Link href="/" className="flex items-center justify-center">
        <LoksewaLogo className="h-6 w-6 mr-2" />
        <span className="font-bold">Loksewa Prep</span>
      </Link>
      <nav className="ml-auto hidden gap-4 sm:gap-6 lg:flex">
        {/* Intentionally empty for now, can add nav links later */}
      </nav>
       <div className="ml-auto flex items-center gap-2">
         <ModeToggle />
        <Link href="/login" className={buttonVariants({ variant: 'outline' })}>
          Sign In
        </Link>
        <Link href="/login" className={buttonVariants()}>
          Get Started
        </Link>
      </div>

      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="ml-4 lg:hidden">
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <div className="grid gap-4 p-4">
            <Link href="/" className="flex items-center justify-center">
                <LoksewaLogo className="h-6 w-6 mr-2" />
                <span className="font-bold">Loksewa Prep</span>
            </Link>
            {/* Can add mobile nav links here */}
          </div>
        </SheetContent>
      </Sheet>
    </header>
  );
}
