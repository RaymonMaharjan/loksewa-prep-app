
'use client';
import Link from 'next/link';
import Image from 'next/image';
import { Button, buttonVariants } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';
import { ModeToggle } from './mode-toggle';

const navLinks = [
  { href: '#features', label: 'Features' },
  { href: '#pricing', label: 'Pricing' },
  { href: '#contact', label: 'Contact' },
];

export function LandingHeader() {
  return (
    <header className="px-4 lg:px-6 h-14 flex items-center bg-background/80 backdrop-blur-sm sticky top-0 z-50 border-b">
      <Link href="/" className="flex items-center justify-center mr-auto">
        <Image src="/icons/logo.svg" alt="Loksewa Prep Logo" width={24} height={24} className="mr-2" />
        <span className="font-bold">Loksewa Prep</span>
      </Link>
      <nav className="ml-auto hidden gap-4 sm:gap-6 lg:flex">
        {/* Intentionally empty for now, can add nav links later */}
      </nav>
       <div className="hidden items-center gap-2 md:flex">
         <ModeToggle />
        <Link href="/login" className={buttonVariants({ variant: 'outline' })}>
          Sign In
        </Link>
        <Link href="/login" className={buttonVariants()}>
          Get Started
        </Link>
      </div>

       <div className="flex items-center gap-2 md:hidden">
         <ModeToggle />
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <div className="grid gap-4 p-4">
                <Link href="/" className="flex items-center justify-center mb-4">
                    <Image src="/icons/logo.svg" alt="Loksewa Prep Logo" width={24} height={24} className="mr-2" />
                    <span className="font-bold">Loksewa Prep</span>
                </Link>
                <Link href="/login" className={buttonVariants({ variant: 'outline', className: 'w-full' })}>
                    Sign In
                </Link>
                <Link href="/login" className={buttonVariants({className: 'w-full'})}>
                    Get Started
                </Link>
              </div>
            </SheetContent>
          </Sheet>
       </div>
    </header>
  );
}
