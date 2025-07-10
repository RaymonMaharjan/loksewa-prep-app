
'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BarChart2,
  BookOpenCheck,
  Calendar,
  FileText,
  FlaskConical,
  LayoutDashboard,
  List,
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

const menuItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/daily-quiz', label: 'Daily Quiz', icon: Calendar },
  { href: '/daily-mock-test', label: 'Mock Test', icon: FileText },
  { href: '/question-bank', label: 'Question Bank', icon: List },
  { href: '/performance', label: 'Performance', icon: BarChart2 },
  { href: '/custom-test', label: 'Custom Test', icon: FlaskConical },
];

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2">
            <BookOpenCheck className="w-8 h-8 text-primary" />
            <div className="flex flex-col">
              <h2 className="text-lg font-semibold">Loksewa Prep</h2>
            </div>
          </div>
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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="w-full justify-start p-2 h-auto">
                 <div className="flex justify-between items-center w-full">
                    <div className="flex gap-2 items-center">
                       <Avatar className="h-8 w-8">
                         <AvatarImage src="https://placehold.co/100x100.png" data-ai-hint="profile avatar" alt="User" />
                         <AvatarFallback>U</AvatarFallback>
                       </Avatar>
                       <div className="flex flex-col items-start group-data-[collapsible=icon]:hidden">
                         <span className="text-sm font-medium">User</span>
                         <span className="text-xs text-muted-foreground">user@email.com</span>
                       </div>
                    </div>
                  </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 mb-2" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">User</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    user@email.com
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/">Log out</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-14 items-center gap-4 border-b bg-card/50 px-4 md:px-6 sticky top-0 z-30">
          <SidebarTrigger className="md:hidden" />
          <div className="flex-1">
            <h1 className="text-lg font-semibold">
              {menuItems.find((item) => pathname.startsWith(item.href))?.label || 'Dashboard'}
            </h1>
          </div>
        </header>
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
