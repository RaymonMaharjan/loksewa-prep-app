'use client';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';

const topics = [
  { id: 'gk', label: 'General Knowledge' },
  { id: 'iq', label: 'IQ' },
  { id: 'english', label: 'English' },
  { id: 'nepali', label: 'Nepali' },
  { id: 'math', label: 'Mathematics' },
];

export default function CustomTestPage() {
    const { toast } = useToast();

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // In a real app, you would call the generateCustomTest flow here.
        // For now, we'll just show a toast notification.
        toast({
            title: "Test Generation Started",
            description: "Your custom test is being generated. This might take a moment.",
        });
    };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Custom Test Generator</h1>
          <p className="text-muted-foreground">Create your own test by selecting topics and difficulty.</p>
        </div>
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Test Configuration</CardTitle>
            <CardDescription>Fill in the details to generate your personalized test.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label>Topics</Label>
                <div className="grid grid-cols-2 gap-4 rounded-lg border p-4">
                  {topics.map((topic) => (
                    <div key={topic.id} className="flex items-center space-x-2">
                      <Checkbox id={topic.id} />
                      <Label htmlFor={topic.id} className="font-normal cursor-pointer">{topic.label}</Label>
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="difficulty">Difficulty</Label>
                    <Select required>
                        <SelectTrigger id="difficulty">
                            <SelectValue placeholder="Select difficulty" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="easy">Easy</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="hard">Hard</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="num-questions">Number of Questions</Label>
                    <Input id="num-questions" type="number" placeholder="e.g., 10" defaultValue="10" min="5" max="50" required />
                </div>
              </div>
              <Button type="submit" className="w-full">Generate Test</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
