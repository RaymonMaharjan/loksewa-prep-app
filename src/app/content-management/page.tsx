'use client';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function ContentManagementPage() {
    const { toast } = useToast();

    const handleContentSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // In a real app, call the manageContent flow here.
        toast({ title: "Success", description: "Your request has been submitted for processing." });
        (e.target as HTMLFormElement).reset();
    };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Content Management</h1>
          <p className="text-muted-foreground">Use AI to add, edit, and manage questions and quizzes.</p>
        </div>
        <Tabs defaultValue="add-question" className="w-full max-w-3xl mx-auto">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="add-question">Manage Question</TabsTrigger>
            <TabsTrigger value="schedule-quiz">Schedule Quiz</TabsTrigger>
          </TabsList>
          <TabsContent value="add-question">
            <Card>
              <CardHeader>
                <CardTitle>Add or Edit a Question</CardTitle>
                <CardDescription>Use natural language to manage questions. The AI will understand your intent.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleContentSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="task">Your Request</Label>
                    <Textarea id="task" placeholder='e.g., "Add a new hard GK question: What is the highest peak in Africa? The options are Mont Blanc, Kilimanjaro, Mount Elbrus, and Aconcagua. The correct answer is Kilimanjaro."' rows={5} required />
                  </div>
                  <Button type="submit" className="w-full">Process Request</Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="schedule-quiz">
             <Card>
              <CardHeader>
                <CardTitle>Schedule a Daily Quiz</CardTitle>
                <CardDescription>Describe when and what kind of quiz you want to schedule.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleContentSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="schedule-task">Scheduling Request</Label>
                    <Textarea id="schedule-task" placeholder='e.g., "Schedule a daily quiz on Current Affairs for every Monday at 9 AM."' rows={5} required />
                  </div>
                  <Button type="submit" className="w-full">Schedule Quiz</Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
