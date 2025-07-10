
'use client';
import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { generateCustomTest, type GenerateCustomTestOutput } from '@/ai/flows/generate-custom-test';
import { Loader2, TimerIcon } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { cn } from '@/lib/utils';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';

type Question = GenerateCustomTestOutput['questions'][0];
type MockTest = {
  id: string;
  title: string;
  topic: string[] | 'all';
  difficulty: 'Easy' | 'Medium' | 'Hard';
  description: string;
};

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

const mockTests: MockTest[] = [
    { id: 'full-syllabus', title: 'Full Syllabus Mock Test', topic: 'all', difficulty: 'Hard', description: "A comprehensive test covering all topics." },
    { id: 'cf-1', title: 'Computer Fundamentals', topic: ['Computer Fundamentals'], difficulty: 'Medium', description: 'Focus on the basics of computer systems.' },
    { id: 'ds-1', title: 'Data Structures & Algorithms', topic: ['Data Structure and Algorithms'], difficulty: 'Hard', description: 'Test your knowledge on complex data structures.' },
    { id: 'dbms-1', title: 'Database Management', topic: ['Database Management System'], difficulty: 'Medium', description: 'Questions on DBMS concepts and SQL.' },
    { id: 'cn-1', title: 'Networks & Security', topic: ['Computer Networks and Security'], difficulty: 'Hard', description: 'Covering networking protocols and security.' },
];

const TIME_PER_QUESTION_SECONDS = 54;
const NEGATIVE_MARKING_PER_QUESTION = 0.20;
const NUM_QUESTIONS = 100;

export default function MockTestsPage() {
  const { toast } = useToast();
  const [activeTest, setActiveTest] = useState<GenerateCustomTestOutput | null>(null);
  const [activeTestTitle, setActiveTestTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    if (!activeTest || isSubmitted) return;

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
  }, [activeTest, isSubmitted]);

  const handleStartTest = async (test: MockTest) => {
    setIsLoading(true);
    setActiveTest(null);
    setIsSubmitted(false);
    setSelectedAnswers({});
    setScore(0);
    setActiveTestTitle(test.title);

    try {
      const topicsToSend = test.topic === 'all' ? syllabusTopics : test.topic;

      const result = await generateCustomTest({
        topics: topicsToSend,
        difficulty: test.difficulty.toLowerCase() as 'easy' | 'medium' | 'hard',
        numQuestions: NUM_QUESTIONS,
      });
      setActiveTest(result);
      setTimeLeft(result.questions.length * TIME_PER_QUESTION_SECONDS);
    } catch (error) {
      console.error("Failed to generate mock test", error);
      toast({
        title: "Error",
        description: "There was an issue generating the mock test. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswerSelect = (questionIndex: number, value: string) => {
    setSelectedAnswers(prev => ({ ...prev, [questionIndex]: value }));
  };

  const handleSubmitTest = () => {
    if (!activeTest) return;
    let finalScore = 0;
    activeTest.questions.forEach((q, index) => {
      if (selectedAnswers[index]) {
        if (selectedAnswers[index] === q.correctAnswer) {
          finalScore++;
        } else {
          finalScore -= NEGATIVE_MARKING_PER_QUESTION;
        }
      }
    });
    setScore(Math.max(0, finalScore));
    setIsSubmitted(true);
  };

  const handleBackToTests = () => {
    setActiveTest(null);
    setIsSubmitted(false);
  };

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
          <h2 className="text-2xl font-semibold mb-2">Preparing Your Mock Test</h2>
          <p className="text-muted-foreground">The AI is generating 100 unique questions for you. This may take a moment.</p>
        </div>
      </DashboardLayout>
    );
  }

  if (activeTest) {
    if (isSubmitted) {
      return (
        <DashboardLayout>
          <Card className="w-full max-w-3xl mx-auto">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl md:text-3xl">Test Results</CardTitle>
              <CardDescription>{activeTestTitle}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <p className="text-muted-foreground mb-2">Your Final Score</p>
                <p className="text-5xl md:text-6xl font-bold text-primary">{score.toFixed(2)}</p>
                <p className="text-muted-foreground mt-1">out of {activeTest.questions.length} total marks</p>
              </div>
              <Alert>
                <AlertTitle>Scoring Details</AlertTitle>
                <AlertDescription>
                  Correct answers are worth 1 point. Incorrect answers have a negative marking of {NEGATIVE_MARKING_PER_QUESTION} points.
                </AlertDescription>
              </Alert>
              <ScrollArea className="h-96">
                <div className="space-y-4 pr-4">
                  {activeTest.questions.map((q, index) => {
                    const userAnswer = selectedAnswers[index];
                    const isCorrect = userAnswer === q.correctAnswer;
                    return (
                      <div key={index} className={cn("p-4 rounded-lg border", userAnswer ? (isCorrect ? "border-green-500 bg-green-500/10" : "border-red-500 bg-red-500/10") : "bg-muted/50")}>
                        <p className="font-semibold">{index + 1}. {q.question}</p>
                        <p className="text-sm mt-2">Your answer: <span className={cn("font-medium", userAnswer ? (isCorrect ? "text-green-700 dark:text-green-400" : "text-red-700 dark:text-red-400") : "text-muted-foreground")}>{userAnswer || "Not answered"}</span></p>
                        {!isCorrect && userAnswer && <p className="text-sm">Correct answer: <span className="font-medium text-green-700 dark:text-green-400">{q.correctAnswer}</span></p>}
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
              <div className="mt-6 text-center">
                <Button onClick={handleBackToTests}>Back to Mock Tests</Button>
              </div>
            </CardContent>
          </Card>
        </DashboardLayout>
      );
    }

    return (
      <DashboardLayout>
          <div className="flex flex-col h-[calc(100vh-theme(spacing.24))]">
              <div className="sticky top-16 md:top-0 bg-background/80 backdrop-blur-sm z-10 py-4">
                  <div className="flex justify-between items-center mb-2 max-w-5xl mx-auto px-4">
                      <h1 className="text-xl md:text-2xl font-bold truncate pr-4">{activeTestTitle}</h1>
                      <div className={cn("flex items-center gap-2 font-mono text-lg font-semibold", timeLeft < 600 ? "text-destructive" : "text-primary")}>
                          <TimerIcon className="h-6 w-6" />
                          <span>{formatTime(timeLeft)}</span>
                      </div>
                  </div>
                   <div className="max-w-5xl mx-auto px-4">
                        <Alert>
                            <AlertDescription>
                                This is a full-length mock test. Each incorrect answer will result in a deduction of {NEGATIVE_MARKING_PER_QUESTION} points.
                            </AlertDescription>
                        </Alert>
                    </div>
              </div>
              <ScrollArea className="flex-grow">
                  <div className="max-w-5xl mx-auto space-y-6 px-4 py-6">
                      {activeTest.questions.map((q, index) => (
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
                      <Button onClick={handleSubmitTest} className="w-full !mt-8">Submit Test</Button>
                  </div>
              </ScrollArea>
          </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Mock Tests</h1>
          <p className="text-muted-foreground">Test your knowledge with our AI-generated mock tests.</p>
        </div>
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {mockTests.map((test) => (
            <Card key={test.id} className="flex flex-col hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle>{test.title}</CardTitle>
                  <Badge variant={test.difficulty === 'Easy' ? 'secondary' : test.difficulty === 'Hard' ? 'destructive' : 'default'} className="capitalize">{test.difficulty}</Badge>
                </div>
                <CardDescription>{test.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="text-sm text-muted-foreground space-y-2">
                  <p>100 questions</p>
                  <p>90 minutes</p>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" onClick={() => handleStartTest(test)}>Start Test</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
