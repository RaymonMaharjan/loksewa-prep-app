'use client';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';

const topics = [
    { id: 'computer_fundamentals', label: 'Computer Fundamentals' },
    { id: 'programming', label: 'Procedural and Object Oriented Programming' },
    { id: 'data_structures', label: 'Data Structure and Algorithms' },
    { id: 'architecture', label: 'Microprocessors and Computer Architecture' },
    { id: 'os', label: 'Operating Systems' },
    { id: 'dbms', label: 'Database Management System' },
    { id: 'networks_security', label: 'Computer Networks and Security' },
    { id: 'software_engineering', label: 'Software Engineering' },
    { id: 'web_technologies', label: 'MIS and Web Technologies' },
    { id: 'it_trends', label: 'Recent IT Trends and Terminology' },
    { id: 'legal', label: 'Constitution, Acts, Rules and IT Policy' },
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
                <ScrollArea className="h-72 w-full rounded-md border">
                  <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {topics.map((topic) => (
                      <div key={topic.id} className="flex items-start space-x-2">
                        <Checkbox id={topic.id} />
                        <Label htmlFor={topic.id} className="font-normal cursor-pointer leading-tight">{topic.label}</Label>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
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
