
'use client';
import { useState } from 'react';
import { addDays, format } from 'date-fns';
import { Calendar as CalendarIcon, Loader2, Wand } from 'lucide-react';

import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { generateStudyPlan, type GenerateStudyPlanOutput } from '@/ai/flows/generate-study-plan';

const syllabusTopics = [
    'Computer Fundamentals',
    'Procedural and Object Oriented Programming',
    'Data Structure and Algorithms',
    'Microprocessors and Computer Architecture',
    'Operating Systems',
    'Database Management System',
    'Computer Networks and Security',
    'Software Engineering',
    'MIS and Web Technologies',
    'Recent IT Trends and Terminology',
    'Constitution of Nepal, Acts, Rules and IT Policy',
];

export default function StudyPlanPage() {
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [generatedPlan, setGeneratedPlan] = useState<GenerateStudyPlanOutput | null>(null);
    const [date, setDate] = useState<Date>();
    
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setGeneratedPlan(null);

        const formData = new FormData(e.currentTarget);
        const weakSubjects = syllabusTopics.filter(topic => formData.has(topic));
        const studyHoursPerWeek = parseInt(formData.get('study-hours') as string, 10);

        if (!date) {
            toast({
                title: "No Date Selected",
                description: "Please select your target exam date.",
                variant: "destructive",
            });
            setIsLoading(false);
            return;
        }

        if (weakSubjects.length === 0) {
            toast({
                title: "No Weak Subjects",
                description: "Please select at least one area of improvement.",
                variant: "destructive",
            });
            setIsLoading(false);
            return;
        }

        try {
            const result = await generateStudyPlan({
                targetDate: format(date, 'yyyy-MM-dd'),
                weakSubjects,
                studyHoursPerWeek,
            });
            setGeneratedPlan(result);
        } catch (error) {
            console.error("Failed to generate study plan", error);
            toast({
                title: "Error",
                description: "There was an issue generating your plan. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };
    
    const renderForm = () => (
        <Card className="max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle>Create Your Study Plan</CardTitle>
                <CardDescription>Tell the AI about your goals, and it will generate a personalized schedule.</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <Label>Target Exam Date</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant={"outline"}
                                    className={cn(
                                        "w-full justify-start text-left font-normal",
                                        !date && "text-muted-foreground"
                                    )}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar
                                    mode="single"
                                    selected={date}
                                    onSelect={setDate}
                                    initialFocus
                                    disabled={(date) => date < new Date()}
                                />
                            </PopoverContent>
                        </Popover>
                    </div>

                    <div className="space-y-2">
                        <Label>Weakest Subjects (Select at least one)</Label>
                        <ScrollArea className="h-60 w-full rounded-md border p-4">
                            <div className="space-y-3">
                                {syllabusTopics.map((topic) => (
                                    <div key={topic} className="flex items-start space-x-2">
                                        <Checkbox id={topic} name={topic} />
                                        <Label htmlFor={topic} className="font-normal cursor-pointer leading-tight">{topic}</Label>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                    </div>
                    
                    <div className="space-y-2">
                        <Label htmlFor="study-hours">Study Hours per Week</Label>
                        <Input name="study-hours" id="study-hours" type="number" placeholder="e.g., 15" defaultValue="15" min="1" max="60" required />
                    </div>

                    <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <> <Wand className="mr-2 h-4 w-4" /> Generate Plan </>}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
    
    const renderLoading = () => (
         <div className="flex flex-col items-center justify-center h-full text-center p-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
            <h2 className="text-2xl font-semibold mb-2">Building Your Personalized Plan</h2>
            <p className="text-muted-foreground">The AI is analyzing your inputs to create the optimal study schedule. Please wait.</p>
        </div>
    );
    
    const renderPlan = () => (
        <div className="max-w-4xl mx-auto space-y-6">
            <div>
                <h1 className="text-2xl md:text-3xl font-bold">Your Personalized Study Plan</h1>
                <p className="text-muted-foreground">Here is your week-by-week guide to exam success.</p>
            </div>
            <Accordion type="single" collapsible className="w-full" defaultValue="item-0">
                {generatedPlan?.weeklyPlan.map((week, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                        <AccordionTrigger className="text-lg font-semibold">
                            Week {week.week}: {week.focus}
                        </AccordionTrigger>
                        <AccordionContent>
                            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
                                {week.tasks.map((task, i) => (
                                    <li key={i}>{task}</li>
                                ))}
                            </ul>
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
             <div className="text-center pt-4">
                <Button onClick={() => setGeneratedPlan(null)}>
                    <Wand className="mr-2 h-4 w-4" /> Create a New Plan
                </Button>
            </div>
        </div>
    );

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {isLoading ? renderLoading() : (generatedPlan ? renderPlan() : renderForm())}
            </div>
        </DashboardLayout>
    );
}
