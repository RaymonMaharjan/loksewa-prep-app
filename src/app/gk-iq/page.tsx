
'use client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { Globe, BrainCircuit, ArrowRight } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';

const sections = [
    { 
      title: 'General Knowledge (GK) Quiz', 
      icon: Globe, 
      path: '/gk-quiz', 
      description: "Test your general awareness on various topics.",
      enabled: true
    },
    { 
      title: 'IQ Test', 
      icon: BrainCircuit, 
      path: '#', 
      description: "Sharpen your logical and analytical skills. (Coming Soon)",
      enabled: false 
    },
];

export default function GkIqPage() {
  const router = useRouter();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">GK & IQ</h1>
          <p className="text-muted-foreground">Expand your knowledge and test your intelligence.</p>
        </div>
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
          {sections.map((section) => (
            <Card 
              key={section.title} 
              onClick={() => section.enabled && router.push(section.path)}
              className={`group transition-all duration-300 flex flex-col justify-between ${section.enabled ? 'cursor-pointer hover:border-primary' : 'opacity-50 cursor-not-allowed'}`}
            >
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <section.icon className="h-8 w-8 text-primary" />
                  </div>
                   {section.enabled && <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-transform" />}
                </div>
              </CardHeader>
              <CardContent>
                <CardTitle className="text-lg mb-1">{section.title}</CardTitle>
                <CardDescription>{section.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
