
'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import {
  BarChart2,
  Calendar,
  FileText,
  FlaskConical,
  LayoutDashboard,
  Settings,
  User,
  Wand,
  LogOut,
  Loader2,
  Menu,
  BookCheck,
  Globe,
  MessageSquare,
} from 'lucide-react';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarTrigger,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
} from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '../ui/button';
import { useAuth } from '@/contexts/auth-context';
import { useToast } from '@/hooks/use-toast';
import { differenceInMinutes, addMinutes } from 'date-fns';

const menuItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/routine', label: 'Routine', icon: BookCheck },
  { href: '/daily-quiz', label: 'Daily Quiz', icon: Calendar },
  { href: '/mock-test', label: 'Mock Test', icon: FileText },
  { href: '/custom-test', label: 'Custom Test', icon: FlaskConical },
  { href: '/study-plan', label: 'Study Plan', icon: Wand },
  { href: '/gk-iq', label: 'GK & IQ', icon: Globe },
  { href: '/performance', label: 'Performance', icon: BarChart2 },
  { href: '/feedback', label: 'Feedback', icon: MessageSquare },
];

const QUIZ_COOLDOWN_MINUTES = 24 * 60; // 24 hours
const LOCAL_STORAGE_KEY = 'loksewaDailyQuizLastTaken';
const NOTIFICATION_SHOWN_KEY = 'dailyQuizNotificationShown';

const UserProfileMenu = () => {
    const { user, signOut } = useAuth();
    if (!user) return null;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="w-full justify-start p-2 h-auto">
                 <div className="flex justify-between items-center w-full">
                    <div className="flex gap-2 items-center">
                       <Avatar className="h-8 w-8">
                         <AvatarImage src={user.photoURL || ''} data-ai-hint="profile avatar" alt={user.displayName || 'User'} />
                         <AvatarFallback>{user.displayName?.charAt(0) || 'U'}</AvatarFallback>
                       </Avatar>
                       <div className="flex flex-col items-start group-data-[collapsible=icon]:hidden">
                         <span className="text-sm font-medium">{user.displayName}</span>
                         <span className="text-xs text-muted-foreground">{user.email}</span>
                       </div>
                    </div>
                  </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 mb-2" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user.displayName}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                 <Link href="/profile" className='flex items-center gap-2 cursor-pointer'>
                  <User className="h-4 w-4" /> Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/settings" className='flex items-center gap-2 cursor-pointer'>
                  <Settings className="h-4 w-4" /> Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={signOut} className="flex items-center gap-2 cursor-pointer">
                <LogOut className="h-4 w-4" /> Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
    )
}

function DashboardLayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, loading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  React.useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);
  
  React.useEffect(() => {
    if (user) {
        const notificationShown = sessionStorage.getItem(NOTIFICATION_SHOWN_KEY);
        if (notificationShown) {
            return;
        }

        const lastTakenStr = localStorage.getItem(LOCAL_STORAGE_KEY);
        let isAvailable = true;

        if (lastTakenStr) {
            const lastTakenDate = new Date(lastTakenStr);
            const now = new Date();
            const minutesSinceLastTaken = differenceInMinutes(now, lastTakenDate);
            if (minutesSinceLastTaken < QUIZ_COOLDOWN_MINUTES) {
                isAvailable = false;
            }
        }
        
        if (isAvailable) {
            toast({
                title: 'Daily Quiz Available!',
                description: "Your daily quiz is ready. Test your knowledge now.",
                action: (
                    <Button asChild variant="secondary" size="sm">
                        <Link href="/daily-quiz">Take Quiz</Link>
                    </Button>
                ),
            });
            sessionStorage.setItem(NOTIFICATION_SHOWN_KEY, 'true');
        }
    }
  }, [user, toast]);


  if (loading || !user) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      <Sidebar>
        <SidebarHeader>
          <Link href="/dashboard" className="flex items-center gap-2">
            <Image src="/icons/Landscape 1.jpg" alt="Loksewa Prep Logo" width={150} height={40} className="group-data-[collapsible=icon]:hidden" />
             <Image src="/icons/512x512.jpg" alt="Loksewa Prep Logo" width={32} height={32} className="hidden group-data-[collapsible=icon]:block" />
            <span className="sr-only">Loksewa Prep</span>
          </Link>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.label}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname.startsWith(item.href)}
                  tooltip={item.label}
                >
                  <Link href={item.href}>
                    <item.icon />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
            <UserProfileMenu />
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-14 items-center gap-4 border-b bg-card/50 px-4 md:px-6 sticky top-0 z-30">
          <SidebarTrigger className="md:hidden">
            <Menu />
          </SidebarTrigger>
          <div className="flex-1">
            <h1 className="text-lg font-semibold">
              {menuItems.find((item) => pathname.startsWith(item.href))?.label || 'Dashboard'}
            </h1>
          </div>
        </header>
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </SidebarInset>
    </>
  );
}

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);
  
  if (loading || !user) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <SidebarProvider>
      <DashboardLayoutContent>{children}</DashboardLayoutContent>
    </SidebarProvider>
  );
}
