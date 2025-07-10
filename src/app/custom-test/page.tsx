'use client';
import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';
import { generateCustomTest, type GenerateCustomTestOutput } from '@/ai/flows/generate-custom-test';
import { Loader2 } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { cn } from '@/lib/utils';

type Question = GenerateCustomTestOutput['questions'][0];

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
    const [isLoading, setIsLoading] = useState(false);
    const [generatedTest, setGeneratedTest] = useState<GenerateCustomTestOutput | null>(null);
    const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [score, setScore] = useState(0);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setGeneratedTest(null);
        setIsSubmitted(false);
        setScore(0);
        setSelectedAnswers({});

        const formData = new FormData(e.currentTarget);
        const selectedTopics = topics.filter(topic => formData.has(topic.id)).map(topic => topic.label);
        const difficulty = formData.get('difficulty') as 'easy' | 'medium' | 'hard';
        const numQuestions = parseInt(formData.get('num-questions') as string, 10);
        
        if (selectedTopics.length === 0) {
            toast({
                title: "No Topics Selected",
                description: "Please select at least one topic.",
                variant: "destructive",
            });
            setIsLoading(false);
            return;
        }

        try {
            const result = await generateCustomTest({
                topics: selectedTopics,
                difficulty,
                numQuestions,
            });
            setGeneratedTest(result);
        } catch (error) {
            console.error("Failed to generate custom test", error);
            toast({
                title: "Error",
                description: "There was an issue generating your test. Please try again.",
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
        let finalScore = 0;
        generatedTest?.questions.forEach((q, index) => {
          if (selectedAnswers[index] === q.correctAnswer) {
            finalScore++;
          }
        });
        setScore(finalScore);
        setIsSubmitted(true);
    };

    const handleTryAgain = () => {
        setGeneratedTest(null);
        setIsSubmitted(false);
        setScore(0);
        setSelectedAnswers({});
    }

    if (isLoading) {
        return (
            <DashboardLayout>
                <div className="flex flex-col items-center justify-center h-full text-center">
                    <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                    <h2 className="text-2xl font-semibold mb-2">Generating Your Test</h2>
                    <p className="text-muted-foreground">The AI is hard at work creating your personalized questions. Please wait a moment.</p>
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
                            <CardTitle className="text-3xl">Test Results</CardTitle>
                            <CardDescription>You scored {score} out of {generatedTest.questions.length}!</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {generatedTest.questions.map((q, index) => {
                                    const userAnswer = selectedAnswers[index];
                                    const isCorrect = userAnswer === q.correctAnswer;
                                    return (
                                        <div key={index} className={cn("p-4 rounded-lg border", isCorrect ? "border-green-500 bg-green-500/10" : "border-red-500 bg-red-500/10")}>
                                            <p className="font-semibold">{index + 1}. {q.question}</p>
                                            <p className="text-sm mt-2">Your answer: <span className={cn("font-medium", isCorrect ? "text-green-700 dark:text-green-400" : "text-red-700 dark:text-red-400")}>{userAnswer || "Not answered"}</span></p>
                                            {!isCorrect && <p className="text-sm">Correct answer: <span className="font-medium text-green-700 dark:text-green-400">{q.correctAnswer}</span></p>}
                                        </div>
                                    )
                                })}
                            </div>
                            <div className="mt-6 text-center">
                                <Button onClick={handleTryAgain}>Create Another Test</Button>
                            </div>
                        </CardContent>
                    </Card>
                </DashboardLayout>
            )
        }
        
        return (
            <DashboardLayout>
                <div className="max-w-3xl mx-auto space-y-6">
                    <h1 className="text-2xl font-bold">Your Custom Test</h1>
                    {generatedTest.questions.map((q, index) => (
                        <Card key={index}>
                            <CardHeader>
                                <CardTitle>Question {index + 1}</CardTitle>
                                <CardDescription className="text-lg pt-2">{q.question}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <RadioGroup value={selectedAnswers[index]} onValueChange={(value) => handleAnswerSelect(index, value)} className="space-y-4">
                                    {q.options.map((option, i) => (
                                        <div key={i} className="flex items-center space-x-2 p-3 rounded-md border has-[:checked]:bg-primary/10 has-[:checked]:border-primary transition-colors">
                                        <RadioGroupItem value={option} id={`q${index}-option-${i}`} />
                                        <Label htmlFor={`q${index}-option-${i}`} className="text-base flex-1 cursor-pointer">{option}</Label>
                                        </div>
                                    ))}
                                </RadioGroup>
                            </CardContent>
                        </Card>
                    ))}
                    <Button onClick={handleSubmitTest} className="w-full" disabled={Object.keys(selectedAnswers).length !== generatedTest.questions.length}>Submit Test</Button>
                </div>
            </DashboardLayout>
        )
    }

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
                <Label>Topics (Select at least one)</Label>
                <ScrollArea className="h-72 w-full rounded-md border">
                  <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {topics.map((topic) => (
                      <div key={topic.id} className="flex items-start space-x-2">
                        <Checkbox id={topic.id} name={topic.id} />
                        <Label htmlFor={topic.id} className="font-normal cursor-pointer leading-tight">{topic.label}</Label>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="difficulty">Difficulty</Label>
                    <Select name="difficulty" defaultValue="medium" required>
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
                    <Input name="num-questions" id="num-questions" type="number" placeholder="e.g., 10" defaultValue="10" min="5" max="25" required />
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Generate Test'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
