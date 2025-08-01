
import Link from 'next/link';
import Image from 'next/image';

const footerLinks = [
    {
        title: "Legal",
        links: [
            { label: "Privacy Policy", href: "/privacy-policy" },
            { label: "Terms of Service", href: "/terms-of-service" },
        ]
    }
];

const SocialIcon = ({ href, children }: { href: string, children: React.ReactNode }) => (
    <Link href={href} className="text-muted-foreground hover:text-foreground" target="_blank" rel="noopener noreferrer">
        {children}
    </Link>
)

export function LandingFooter() {
  return (
    <footer className="py-6 md:px-8 md:py-12 w-full border-t">
      <div className="container flex flex-col items-center justify-between gap-6 sm:flex-row">
        <div className="flex flex-col items-center sm:items-start">
            <div className="flex items-center gap-2 mb-2">
                <Image src="/icons/Landscape 1.jpg" alt="Loksewa Prep Logo" width={150} height={40} />
                <span className="sr-only">Loksewa Prep</span>
            </div>
            <p className="text-xs text-muted-foreground">
                &copy; {new Date().getFullYear()} Loksewa Prep. All rights reserved.
            </p>
        </div>
        <div className="flex gap-4">
             <SocialIcon href="https://x.com">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
            </SocialIcon>
            <SocialIcon href="https://github.com">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.168 6.839 9.49.5.092.682-.217.682-.482 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.031-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.378.203 2.398.1 2.651.64.7 1.03 1.595 1.03 2.688 0 3.848-2.338 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.001 10.001 0 0022 12c0-5.523-4.477-10-10-10" clipRule="evenodd" /></svg>
            </SocialIcon>
        </div>
      </div>
    </footer>
  );
}
