
'use client';
import { useState, useEffect } from 'react';
import { BookCheck, Loader2, Sparkles, ArrowLeft } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { generateDailyRoutine, type GenerateDailyRoutineOutput } from '@/ai/flows/generate-daily-routine';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import Link from 'next/link';

const LOCAL_STORAGE_KEY = 'loksewaDailyRoutine';

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

export default function RoutinePage() {
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [generatedRoutine, setGeneratedRoutine] = useState<GenerateDailyRoutineOutput | null>(null);

    useEffect(() => {
        try {
            const savedRoutine = localStorage.getItem(LOCAL_STORAGE_KEY);
            if (savedRoutine) {
                setGeneratedRoutine(JSON.parse(savedRoutine));
            }
        } catch (error) {
            console.error("Failed to load routine from localStorage", error);
            localStorage.removeItem(LOCAL_STORAGE_KEY);
        }
    }, []);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setGeneratedRoutine(null);

        const formData = new FormData(e.currentTarget);
        const studyHours = parseInt(formData.get('study-hours') as string, 10);
        const weakSubjects = syllabusTopics.filter(topic => formData.has(topic));

        if (isNaN(studyHours) || studyHours <= 0) {
            toast({
                title: "Invalid Input",
                description: "Please enter a valid number of study hours.",
                variant: "destructive",
            });
            setIsLoading(false);
            return;
        }

        try {
            const result = await generateDailyRoutine({ studyHours, weakSubjects });
            setGeneratedRoutine(result);
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(result));
        } catch (error) {
            console.error("Failed to generate routine", error);
            toast({
                title: "Error",
                description: "There was an issue generating your routine. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleGenerateNew = () => {
        setGeneratedRoutine(null);
        localStorage.removeItem(LOCAL_STORAGE_KEY);
    }

    const renderForm = () => (
        <div className="flex items-center justify-center h-full">
            <Card className="w-full max-w-lg">
                <CardHeader className="text-center">
                    <div className="mx-auto bg-primary/10 p-3 rounded-full mb-4">
                        <BookCheck className="h-8 w-8 text-primary" />
                    </div>
                    <CardTitle className="text-2xl">Today's Study Routine</CardTitle>
                    <CardDescription>Get a personalized, AI-generated study plan for your day.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="study-hours">How many hours can you study today?</Label>
                            <Input name="study-hours" id="study-hours" type="number" placeholder="e.g., 3" min="1" max="12" required />
                        </div>

                        <div className="space-y-2">
                            <Label>Any weak subjects to focus on? (Optional)</Label>
                            <ScrollArea className="h-48 w-full rounded-md border p-4">
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
                        
                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <> <Sparkles className="mr-2 h-4 w-4" /> Generate Routine </>}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );

    const renderLoading = () => (
        <div className="flex flex-col items-center justify-center h-full text-center p-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
            <h2 className="text-2xl font-semibold mb-2">Crafting Your Daily Plan...</h2>
            <p className="text-muted-foreground">The AI is preparing your personalized tasks for today.</p>
        </div>
    );

    const renderRoutine = () => (
        <div className="max-w-3xl mx-auto space-y-6">
            <div>
                <h1 className="text-2xl md:text-3xl font-bold">Your Daily Routine</h1>
                <p className="text-muted-foreground">
                    Today's focus: <span className="font-semibold text-primary">{generatedRoutine?.focusSubjects.join(', ')}</span>
                </p>
            </div>

            <Alert>
                <Sparkles className="h-4 w-4" />
                <AlertTitle>Motivational Tip</AlertTitle>
                <AlertDescription>{generatedRoutine?.motivation}</AlertDescription>
            </Alert>

            <div className="space-y-4">
                {generatedRoutine?.tasks.map((item, index) => (
                    <Card key={index}>
                        <CardHeader>
                            <CardTitle className="text-lg">Task {index + 1}: {item.task}</CardTitle>
                            <CardDescription>Suggested time: {item.time}</CardDescription>
                        </CardHeader>
                    </Card>
                ))}
            </div>

            <div className="text-center pt-4 flex justify-center items-center space-x-4">
                <Button onClick={handleGenerateNew}>
                    <Sparkles className="mr-2 h-4 w-4" /> Generate a New Routine
                </Button>
                <Button variant="outline" asChild>
                    <Link href="/dashboard">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
                    </Link>
                </Button>
            </div>
        </div>
    );

    return (
        <DashboardLayout>
            {isLoading ? renderLoading() : (generatedRoutine ? renderRoutine() : renderForm())}
        </DashboardLayout>
    );
}
