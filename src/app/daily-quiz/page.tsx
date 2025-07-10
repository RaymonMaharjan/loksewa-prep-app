
'use client';
import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { generateCustomTest, type GenerateCustomTestOutput } from '@/ai/flows/generate-custom-test';
import { Loader2, TimerIcon, Zap, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ScrollArea } from '@/components/ui/scroll-area';
import { differenceInHours, formatDistanceToNow, addDays, startOfTomorrow } from 'date-fns';

type Question = GenerateCustomTestOutput['questions'][0];

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

const TIME_PER_QUESTION_SECONDS = 54;
const NEGATIVE_MARKING_PER_QUESTION = 0.20;
const NUM_QUESTIONS = 20;
const QUIZ_COOLDOWN_HOURS = 24;
const LOCAL_STORAGE_KEY = 'loksewaDailyQuizLastTaken';

export default function DailyQuizPage() {
  const [test, setTest] = useState<GenerateCustomTestOutput['questions'] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isQuizAvailable, setIsQuizAvailable] = useState(false);
  const [nextQuizTime, setNextQuizTime] = useState('');

  useEffect(() => {
    const checkQuizAvailability = () => {
        const lastTakenStr = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (lastTakenStr) {
            const lastTakenDate = new Date(lastTakenStr);
            const now = new Date();
            const hoursSinceLastTaken = differenceInHours(now, lastTakenDate);

            if (hoursSinceLastTaken < QUIZ_COOLDOWN_HOURS) {
                setIsQuizAvailable(false);
                const nextAvailableDate = addDays(startOfTomorrow(), 0);
                setNextQuizTime(formatDistanceToNow(nextAvailableDate, { addSuffix: true }));
            } else {
                setIsQuizAvailable(true);
            }
        } else {
            setIsQuizAvailable(true);
        }
    };

    checkQuizAvailability();
    // Also check every minute to update the countdown
    const interval = setInterval(checkQuizAvailability, 60000); 
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!test || isSubmitted) return;

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [test, isSubmitted]);

  const handleStartQuiz = async () => {
    setIsLoading(true);
    setTest(null);
    try {
      const result = await generateCustomTest({ 
          topics: syllabusTopics, 
          numQuestions: NUM_QUESTIONS,
          difficulty: 'medium',
      });
      setTest(result.questions);
      setTimeLeft(result.questions.length * TIME_PER_QUESTION_SECONDS);
      setSelectedAnswers({});
      setIsSubmitted(false);
      setScore(0);
      localStorage.setItem(LOCAL_STORAGE_KEY, new Date().toISOString());
      setIsQuizAvailable(false); // Lock quiz after starting
    } catch (error) {
      console.error("Failed to generate test", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswerSelect = (questionIndex: number, value: string) => {
    setSelectedAnswers(prev => ({...prev, [questionIndex]: value}));
  };

  const handleSubmit = () => {
    if (!test) return;
    let finalScore = 0;
    test.forEach((q, index) => {
      if (selectedAnswers[index]) {
        if (selectedAnswers[index] === q.correctAnswer) {
          finalScore++;
        } else {
          finalScore -= NEGATIVE_MARKING_PER_QUESTION;
        }
      }
    });
    setScore(Math.max(0, finalScore)); // Ensure score doesn't go below 0
    setIsSubmitted(true);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const renderInitialState = () => (
     <div className="flex items-center justify-center h-full">
        <Card className="w-full max-w-lg text-center">
          <CardHeader>
            <div className="mx-auto bg-primary/10 p-3 rounded-full mb-4">
              {isQuizAvailable ? <Zap className="h-8 w-8 text-primary" /> : <Lock className="h-8 w-8 text-muted-foreground" />}
            </div>
            <CardTitle className="text-2xl">Daily Quiz</CardTitle>
            <CardDescription>
                {isQuizAvailable 
                    ? "A 20-question quiz is generated for you daily from all topics. It's timed and includes negative marking."
                    : `You've completed today's quiz. The next one will be available ${nextQuizTime}.`
                }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button size="lg" onClick={handleStartQuiz} disabled={isLoading || !isQuizAvailable}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Start Today\'s Quiz'}
            </Button>
          </CardContent>
        </Card>
      </div>
  )

  const renderLoadingState = () => (
    <div className="flex flex-col items-center justify-center h-full text-center p-4">
      <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
      <h2 className="text-2xl font-semibold mb-2">Preparing Your Quiz</h2>
      <p className="text-muted-foreground">The AI is generating 20 unique questions for you. This may take a moment.</p>
    </div>
  )

  const renderResultsState = () => (
      <Card className="w-full max-w-3xl mx-auto">
          <CardHeader className="text-center">
              <CardTitle className="text-3xl">Quiz Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
              <div className="text-center">
                  <p className="text-muted-foreground mb-2">Your Final Score</p>
                  <p className="text-5xl md:text-6xl font-bold text-primary">{score.toFixed(2)}</p>
                  <p className="text-muted-foreground mt-1">out of {test?.length} total marks</p>
              </div>
              <Alert>
                  <AlertTitle>Scoring Details</AlertTitle>
                  <AlertDescription>
                    Correct answers are worth 1 point. Incorrect answers have a negative marking of {NEGATIVE_MARKING_PER_QUESTION} points.
                  </AlertDescription>
              </Alert>
              <ScrollArea className="h-96">
                <div className="space-y-4 pr-4">
                  {test?.map((q, index) => {
                      const userAnswer = selectedAnswers[index];
                      const isCorrect = userAnswer === q.correctAnswer;
                      return (
                          <div key={index} className={cn("p-4 rounded-lg border", userAnswer ? (isCorrect ? "border-green-500 bg-green-500/10" : "border-red-500 bg-red-500/10") : "bg-muted/50")}>
                              <p className="font-semibold">{index + 1}. {q.question}</p>
                              <p className="text-sm mt-2">Your answer: <span className={cn("font-medium", userAnswer ? (isCorrect ? "text-green-700 dark:text-green-400" : "text-red-700 dark:text-red-400") : "text-muted-foreground")}>{userAnswer || "Not answered"}</span></p>
                              {!isCorrect && userAnswer && <p className="text-sm">Correct answer: <span className="font-medium text-green-700 dark:text-green-400">{q.correctAnswer}</span></p>}
                          </div>
                      )
                  })}
                </div>
              </ScrollArea>
               <div className="mt-6 text-center">
                  <Button onClick={() => setTest(null)}>Back to Quiz Home</Button>
              </div>
          </CardContent>
      </Card>
  )

  const renderQuizState = () => {
    return (
     <div className="max-w-3xl mx-auto">
        <div className="sticky top-16 md:top-0 bg-background/80 backdrop-blur-sm z-10 py-4 -my-4 mb-4">
            <div className="flex justify-between items-center mb-2">
                <h1 className="text-2xl font-bold">Daily Quiz</h1>
                <div className={cn("flex items-center gap-2 font-mono text-lg font-semibold", timeLeft < 60 ? "text-destructive" : "text-primary")}>
                    <TimerIcon className="h-6 w-6" />
                    <span>{formatTime(timeLeft)}</span>
                </div>
            </div>
            <Progress value={((Object.keys(selectedAnswers).length) / (test?.length || 1)) * 100} />
             <Alert className="mt-4">
               <AlertDescription>
                This quiz is timed and includes negative marking of {NEGATIVE_MARKING_PER_QUESTION} for each incorrect answer. Good luck!
               </AlertDescription>
            </Alert>
        </div>

        {test?.map((q, index) => (
            <Card key={index} className="mb-6">
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

        <div className="flex justify-end mt-6">
            <Button onClick={handleSubmit}>Submit Quiz</Button>
        </div>
        </div>
    )
    }

  return (
    <DashboardLayout>
       {isLoading && renderLoadingState()}
       {!isLoading && !test && renderInitialState()}
       {!isLoading && test && (isSubmitted ? renderResultsState() : renderQuizState())}
    </DashboardLayout>
  );
}
