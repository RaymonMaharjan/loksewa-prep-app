
'use client';
import Link from 'next/link';
import Image from 'next/image';
import { Button, buttonVariants } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';
import { ModeToggle } from './mode-toggle';
import { useState } from 'react';

const navLinks = [
  { href: '#features', label: 'Features' },
  { href: '#how-it-works', label: 'How It Works' },
  { href: '#pricing', label: 'Pricing' },
  { href: '#faq', label: 'FAQ' },
];

export function LandingHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLinkClick = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="px-4 lg:px-6 h-16 flex items-center bg-background/80 backdrop-blur-sm sticky top-0 z-50 border-b">
      <Link href="/" className="flex items-center justify-center mr-auto">
        <Image src="/icons/Landscape 1.jpg" alt="Loksewa Prep Logo" width={150} height={40} />
        <span className="sr-only">Loksewa Prep</span>
      </Link>
      <nav className="ml-auto hidden gap-4 sm:gap-6 lg:flex">
        {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="text-sm font-medium hover:underline underline-offset-4">
                {link.label}
            </Link>
        ))}
      </nav>
       <div className="hidden items-center gap-2 md:ml-6 md:flex">
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
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <div className="grid gap-4 p-4">
                <Link href="/" onClick={handleLinkClick} className="flex items-center justify-center mb-4">
                    <Image src="/icons/Landscape 1.jpg" alt="Loksewa Prep Logo" width={150} height={40} />
                    <span className="sr-only">Loksewa Prep</span>
                </Link>
                <div className="flex flex-col gap-4">
                    {navLinks.map((link) => (
                         <Link key={link.href} href={link.href} onClick={handleLinkClick} className="text-lg font-medium hover:underline underline-offset-4">
                            {link.label}
                        </Link>
                    ))}
                </div>
                <hr className="my-4" />
                <Link href="/login" onClick={handleLinkClick} className={buttonVariants({ variant: 'outline', className: 'w-full' })}>
                    Sign In
                </Link>
                <Link href="/login" onClick={handleLinkClick} className={buttonVariants({className: 'w-full'})}>
                    Get Started
                </Link>
              </div>
            </SheetContent>
          </Sheet>
       </div>
    </header>
  );
}
