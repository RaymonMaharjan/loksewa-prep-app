'use client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { BarChart, Calendar, FileText, FlaskConical } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';

export default function DashboardPage() {
  const router = useRouter();

  const quickLinks = [
    { title: 'Start Daily Quiz', icon: Calendar, path: '/daily-quiz' },
    { title: 'Browse Mock Tests', icon: FileText, path: '/mock-tests' },
    { title: 'Create Custom Test', icon: FlaskConical, path: '/custom-test' },
    { title: 'View Performance', icon: BarChart, path: '/performance' },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Welcome back!</h1>
          <p className="text-muted-foreground">Here's a quick overview of your prep status.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {quickLinks.map((link) => (
            <Card key={link.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{link.title}</CardTitle>
                <link.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <Button onClick={() => router.push(link.path)} className="w-full">
                  Go
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest achievements and progress.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              <p>You completed "General Knowledge - Set 1" with a score of <strong>8/10</strong>.</p>
              <p className="mt-2">Keep up the great work!</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
