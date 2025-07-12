
'use client';
import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';
import { generateGkQuiz, type GenerateGkQuizOutput, type GenerateGkQuizInput } from '@/ai/flows/generate-gk-quiz';
import { Loader2, TimerIcon } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { cn } from '@/lib/utils';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useLoksewa } from '@/hooks/use-loksewa';
import Link from 'next/link';

type Question = GenerateGkQuizOutput['questions'][0];

const syllabus = [
    { id: '1.1', label: 'Physical, socio-cultural and economic geography and demography of Nepal' },
    { id: '1.2', label: 'Major natural resources of Nepal' },
    { id: '1.3', label: 'Geographical diversity, climatic conditions, and livelihood & lifestyle of people' },
    { id: '1.4', label: 'Notable events and personalities, social, cultural and economic conditions in modern history of Nepal' },
    { id: '1.5', label: 'Current periodical plan of Nepal' },
    { id: '1.6', label: 'Information on sustainable development, environment, pollution, climate change, biodiversity, science and technology' },
    { id: '1.7', label: "Nepal's international affairs and general information on the UNO, SAARC & BIMSTEC" },
    { id: '1.8', label: 'The Constitution of Nepal (From Part 1 to 5 and Schedules)' },
    { id: '1.9', label: 'Governance system and Government (Federal, Provincial and Local)' },
    { id: '1.10', label: 'Provisions of civil service act and regulation relating to constitution of civil service, organisational structure, posts of service, fulfillment of vacancy and code of conduct' },
    { id: '1.11', label: 'Functional scope of public services' },
    { id: '1.12', label: 'Public Service Charter' },
    { id: '1.13', label: 'Concept, objective and importance of public policy' },
    { id: '1.14', label: 'Fundamentals of management: planning, organizing, directing, controlling, coordinating, decision making, motivation and leadership' },
    { id: '1.15', label: 'Government planning, budgeting and accounting system' },
    { id: '1.16', label: 'Major events and current affairs of national and international importance' },
];

const TIME_PER_QUESTION_SECONDS = 54;
const NEGATIVE_MARKING_PER_QUESTION = 0.20;

export default function GkQuizPage() {
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [generatedTest, setGeneratedTest] = useState<GenerateGkQuizOutput | null>(null);
    const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(0);
    const { addTestResult } = useLoksewa();
    const [resultsSummary, setResultsSummary] = useState({
        attempted: 0,
        unattempted: 0,
        correct: 0,
        incorrect: 0
    });

    useEffect(() => {
        if (!generatedTest || isSubmitted) return;

        const timer = setInterval(() => {
            setTimeLeft(prevTime => {
                if (prevTime <= 1) {
                    clearInterval(timer);
                    handleSubmitTest();
                    return 0;
                }
                return prevTime - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [generatedTest, isSubmitted]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setGeneratedTest(null);
        setIsSubmitted(false);
        setScore(0);
        setSelectedAnswers({});

        const formData = new FormData(e.currentTarget);
        
        const selectedTopicLabels: string[] = [];
        syllabus.forEach(topic => {
            if (formData.has(topic.id)) {
                selectedTopicLabels.push(topic.label);
            }
        });

        const numQuestions = parseInt(formData.get('num-questions') as string, 10);
        
        if (selectedTopicLabels.length === 0) {
            toast({
                title: "No Topics Selected",
                description: "Please select at least one topic.",
                variant: "destructive",
            });
            setIsLoading(false);
            return;
        }

        const currentTestConfig: GenerateGkQuizInput = {
            topics: selectedTopicLabels,
            numQuestions,
        };

        try {
            const result = await generateGkQuiz(currentTestConfig);
            setGeneratedTest(result);
            setTimeLeft(result.questions.length * TIME_PER_QUESTION_SECONDS);
        } catch (error) {
            console.error("Failed to generate GK quiz", error);
            toast({
                title: "Error",
                description: "There was an issue generating your quiz. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleAnswerSelect = (questionIndex: number, value: string) => {
        setSelectedAnswers(prev => ({...prev, [questionIndex]: value}));
    };
    
    const handleSubmitTest = () => {
        if (!generatedTest) return;
        let finalScore = 0;
        let correctCount = 0;
        let incorrectCount = 0;
        let attemptedCount = 0;

        generatedTest.questions.forEach((q, index) => {
            if (selectedAnswers[index]) {
                attemptedCount++;
                if (selectedAnswers[index] === q.correctAnswer) {
                    finalScore++;
                    correctCount++;
                } else {
                    finalScore -= NEGATIVE_MARKING_PER_QUESTION;
                    incorrectCount++;
                }
            }
        });

        setResultsSummary({
            attempted: attemptedCount,
            unattempted: generatedTest.questions.length - attemptedCount,
            correct: correctCount,
            incorrect: incorrectCount,
        });

        const finalClampedScore = Math.max(0, finalScore);
        setScore(finalClampedScore); 
        setIsSubmitted(true);
    };

    const handleTryAgain = () => {
        setGeneratedTest(null);
        setIsSubmitted(false);
        setScore(0);
        setSelectedAnswers({});
    }

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    if (isLoading) {
        return (
            <DashboardLayout>
                <div className="flex flex-col items-center justify-center h-full text-center p-4">
                    <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                    <h2 className="text-2xl font-semibold mb-2">Generating Your GK Quiz</h2>
                    <p className="text-muted-foreground">The AI is creating your personalized questions. Please wait a moment.</p>
                </div>
            </DashboardLayout>
        );
    }
    
    if (generatedTest) {
        if (isSubmitted) {
            return (
                <DashboardLayout>
                    <Card className="w-full max-w-3xl mx-auto">
                        <CardHeader className="text-center">
                            <CardTitle className="text-2xl md:text-3xl">GK Quiz Results</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="text-center">
                                <p className="text-muted-foreground mb-2">Your Final Score</p>
                                <p className="text-5xl md:text-6xl font-bold text-primary">{score.toFixed(2)}</p>
                                <p className="text-muted-foreground mt-1">out of {generatedTest.questions.length} total marks</p>
                            </div>
                            
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                                <div className="p-3 bg-muted rounded-lg">
                                    <p className="text-sm text-muted-foreground">Attempted</p>
                                    <p className="text-2xl font-bold">{resultsSummary.attempted}</p>
                                </div>
                                <div className="p-3 bg-green-500/10 rounded-lg">
                                    <p className="text-sm text-green-700 dark:text-green-400">Correct</p>
                                    <p className="text-2xl font-bold text-green-600 dark:text-green-500">{resultsSummary.correct}</p>
                                </div>
                                <div className="p-3 bg-red-500/10 rounded-lg">
                                    <p className="text-sm text-red-700 dark:text-red-400">Incorrect</p>
                                    <p className="text-2xl font-bold text-red-600 dark:text-red-500">{resultsSummary.incorrect}</p>
                                </div>
                                <div className="p-3 bg-muted rounded-lg">
                                    <p className="text-sm text-muted-foreground">Unattempted</p>
                                    <p className="text-2xl font-bold">{resultsSummary.unattempted}</p>
                                </div>
                            </div>
                            
                            <Alert className="mb-6">
                              <AlertTitle>Scoring Details</AlertTitle>
                              <AlertDescription>
                                Correct answers are worth 1 point. Incorrect answers have a negative marking of {NEGATIVE_MARKING_PER_QUESTION} points.
                              </AlertDescription>
                            </Alert>
                            <ScrollArea className="h-96">
                                <div className="space-y-4 pr-4">
                                    {generatedTest.questions.map((q, index) => {
                                        const userAnswer = selectedAnswers[index];
                                        const isCorrect = userAnswer === q.correctAnswer;
                                        return (
                                            <div key={index} className={cn("p-4 rounded-lg border", userAnswer ? (isCorrect ? "border-green-500 bg-green-500/10" : "border-red-500 bg-red-500/10") : "bg-muted/50")}>
                                                <p className="font-semibold">{index + 1}. {q.question}</p>
                                                <p className="text-sm mt-2">Your answer: <span className={cn("font-medium", userAnswer ? (isCorrect ? "text-green-700 dark:text-green-400" : "text-red-700 dark:text-red-400") : "text-muted-foreground")}>{userAnswer || "Not answered"}</span></p>
                                                <p className="text-sm">Correct answer: <span className="font-medium text-green-700 dark:text-green-400">{q.correctAnswer}</span></p>
                                            </div>
                                        )
                                    })}
                                </div>
                            </ScrollArea>
                            <div className="mt-6 text-center space-x-4">
                                <Button onClick={handleTryAgain}>Create Another Quiz</Button>
                                <Button variant="outline" asChild><Link href="/dashboard">Go to Dashboard</Link></Button>
                            </div>
                        </CardContent>
                    </Card>
                </DashboardLayout>
            )
        }
        
        return (
            <DashboardLayout>
                <div className="max-w-3xl mx-auto space-y-6">
                    <div className="sticky top-16 md:top-0 bg-background/80 backdrop-blur-sm z-10 py-4 -my-4">
                        <div className="flex justify-between items-center mb-2">
                             <h1 className="text-2xl font-bold">General Knowledge Quiz</h1>
                             <div className={cn("flex items-center gap-2 font-mono text-lg font-semibold", timeLeft < 60 ? "text-destructive" : "text-primary")}>
                                <TimerIcon className="h-6 w-6" />
                                <span>{formatTime(timeLeft)}</span>
                             </div>
                        </div>
                        <Alert>
                           <AlertDescription>
                            This quiz is timed and includes negative marking of {NEGATIVE_MARKING_PER_QUESTION} for each incorrect answer. Good luck!
                           </AlertDescription>
                        </Alert>
                    </div>

                    {generatedTest.questions.map((q, index) => (
                        <Card key={index}>
                            <CardHeader>
                                <CardTitle>Question {index + 1}</CardTitle>
                                <CardDescription className="text-base md:text-lg pt-2">{q.question}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <RadioGroup value={selectedAnswers[index]} onValueChange={(value) => handleAnswerSelect(index, value)} className="space-y-4">
                                    {q.options.map((option, i) => (
                                        <div key={i} className="flex items-center space-x-2 p-3 rounded-md border has-[:checked]:bg-primary/10 has-[:checked]:border-primary transition-colors">
                                        <RadioGroupItem value={option} id={`q${index}-option-${i}`} />
                                        <Label htmlFor={`q${index}-option-${i}`} className="text-sm md:text-base flex-1 cursor-pointer">{option}</Label>
                                        </div>
                                    ))}
                                </RadioGroup>
                            </CardContent>
                        </Card>
                    ))}
                    <Button onClick={handleSubmitTest} className="w-full">Submit Quiz</Button>
                </div>
            </DashboardLayout>
        )
    }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">GK Quiz Generator</h1>
          <p className="text-muted-foreground">Create a quiz by selecting topics from the GK syllabus.</p>
        </div>
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Quiz Configuration</CardTitle>
            <CardDescription>Fill in the details to generate your personalized GK quiz.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label>Syllabus Topics (Select at least one)</Label>
                <ScrollArea className="h-72 w-full rounded-md border p-4">
                    <div className="space-y-3">
                        {syllabus.map((topic) => (
                            <div key={topic.id} className="flex items-start space-x-2">
                                <Checkbox id={topic.id} name={topic.id} />
                                <Label htmlFor={topic.id} className="font-normal cursor-pointer leading-tight">{topic.label}</Label>
                            </div>
                        ))}
                    </div>
                </ScrollArea>
              </div>
              <div className="space-y-2">
                  <Label htmlFor="num-questions">Number of Questions</Label>
                  <Input name="num-questions" id="num-questions" type="number" placeholder="e.g., 10" defaultValue="10" min="5" max="25" required />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Generate Quiz'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
