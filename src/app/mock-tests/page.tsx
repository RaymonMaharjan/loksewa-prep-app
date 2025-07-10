'use client';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const mockTests = [
  { id: 'gk-1', title: 'General Knowledge - Set 1', topic: 'GK', questions: 25, time: 30, difficulty: 'Medium' },
  { id: 'iq-1', title: 'IQ Challenge - Part A', topic: 'IQ', questions: 20, time: 25, difficulty: 'Easy' },
  { id: 'en-1', title: 'English Grammar Test', topic: 'English', questions: 30, time: 20, difficulty: 'Medium' },
  { id: 'np-1', title: 'Nepali Language Proficiency', topic: 'Nepali', questions: 25, time: 30, difficulty: 'Hard' },
];

export default function MockTestsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Mock Tests</h1>
          <p className="text-muted-foreground">Test your knowledge with our topic-wise mock tests.</p>
        </div>
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {mockTests.map((test) => (
            <Card key={test.id} className="flex flex-col hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle>{test.title}</CardTitle>
                  <Badge variant={test.difficulty === 'Easy' ? 'secondary' : test.difficulty === 'Hard' ? 'destructive' : 'default'} className="capitalize">{test.difficulty}</Badge>
                </div>
                <CardDescription>Topic: {test.topic}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="text-sm text-muted-foreground space-y-2">
                  <p>{test.questions} questions</p>
                  <p>{test.time} minutes</p>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Start Test</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
