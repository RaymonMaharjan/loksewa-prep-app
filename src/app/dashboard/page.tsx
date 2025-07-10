'use client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { BarChart, Calendar, FileText, FlaskConical, ArrowRight } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';

export default function DashboardPage() {
  const router = useRouter();

  const quickLinks = [
    { title: 'Start Daily Quiz', icon: Calendar, path: '/daily-quiz', description: "Test your knowledge" },
    { title: 'Browse Mock Tests', icon: FileText, path: '/mock-tests', description: "Simulate exam conditions" },
    { title: 'Create Custom Test', icon: FlaskConical, path: '/custom-test', description: "Personalize your practice" },
    { title: 'View Performance', icon: BarChart, path: '/performance', description: "Track your progress" },
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
            <Card 
              key={link.title} 
              onClick={() => router.push(link.path)}
              className="group cursor-pointer hover:border-primary transition-all duration-300 flex flex-col justify-between"
            >
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <link.icon className="h-6 w-6 text-primary" />
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-transform" />
                </div>
              </CardHeader>
              <CardContent>
                <CardTitle className="text-lg mb-1">{link.title}</CardTitle>
                <CardDescription>{link.description}</CardDescription>
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
