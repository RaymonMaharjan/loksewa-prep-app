
'use client';
import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { generateCustomTest, type GenerateCustomTestOutput } from '@/ai/flows/generate-custom-test';
import { Loader2, TimerIcon, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

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
const NUM_QUESTIONS = 100;

export default function DailyQuizPage() {
  const [test, setTest] = useState<GenerateCustomTestOutput['questions'] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);

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
          difficulty: 'hard',
      });
      setTest(result.questions);
      setTimeLeft(result.questions.length * TIME_PER_QUESTION_SECONDS);
      setCurrentQuestionIndex(0);
      setSelectedAnswers({});
      setIsSubmitted(false);
      setScore(0);
    } catch (error) {
      console.error("Failed to generate test", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswerSelect = (value: string) => {
    setSelectedAnswers(prev => ({...prev, [currentQuestionIndex]: value}));
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

  const currentQuestion = test?.[currentQuestionIndex];

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
              <Zap className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-2xl">Daily Mock Test</CardTitle>
            <CardDescription>A full 100-question mock test is generated for you daily. It's timed and includes negative marking.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button size="lg" onClick={handleStartQuiz} disabled={isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Start Today\'s Mock Test'}
            </Button>
          </CardContent>
        </Card>
      </div>
  )

  const renderLoadingState = () => (
    <div className="flex flex-col items-center justify-center h-full text-center p-4">
      <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
      <h2 className="text-2xl font-semibold mb-2">Preparing Your Mock Test</h2>
      <p className="text-muted-foreground">The AI is generating 100 unique questions for you. This may take a moment.</p>
    </div>
  )

  const renderResultsState = () => (
      <Card className="w-full max-w-2xl mx-auto">
          <CardHeader className="text-center">
              <CardTitle className="text-3xl">Test Results</CardTitle>
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
              <div className="space-y-4">
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
               <div className="mt-6 text-center">
                  <Button onClick={handleStartQuiz}>Try Another Test</Button>
              </div>
          </CardContent>
      </Card>
  )

  const renderQuizState = () => (
     <div className="max-w-3xl mx-auto">
      <div className="sticky top-16 md:top-0 bg-background/80 backdrop-blur-sm z-10 py-4 -my-4 mb-4">
          <div className="flex justify-between items-center mb-2">
            <h1 className="text-2xl font-bold">Daily Mock Test</h1>
            <div className={cn("flex items-center gap-2 font-mono text-lg font-semibold", timeLeft < 60 ? "text-destructive" : "text-primary")}>
                <TimerIcon className="h-6 w-6" />
                <span>{formatTime(timeLeft)}</span>
            </div>
          </div>
          <Progress value={((currentQuestionIndex + 1) / (test?.length || 1)) * 100} />
      </div>

      {currentQuestion && (
        <Card>
          <CardHeader>
            <CardTitle>Question {currentQuestionIndex + 1} of {test?.length}</CardTitle>
            <CardDescription className="text-lg pt-2">{currentQuestion.question}</CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup value={selectedAnswers[currentQuestionIndex]} onValueChange={handleAnswerSelect} className="space-y-4">
              {currentQuestion.options.map((option, i) => (
                <div key={i} className="flex items-center space-x-2 p-3 rounded-md border has-[:checked]:bg-primary/10 has-[:checked]:border-primary transition-colors">
                  <RadioGroupItem value={option} id={`option-${i}`} />
                  <Label htmlFor={`option-${i}`} className="text-base flex-1 cursor-pointer">{option}</Label>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>
      )}
      <div className="flex justify-between mt-6">
        <Button variant="outline" onClick={() => setCurrentQuestionIndex(p => Math.max(0, p - 1))} disabled={currentQuestionIndex === 0}>Previous</Button>
        {currentQuestionIndex < (test?.length || 0) - 1 ? (
          <Button onClick={() => setCurrentQuestionIndex(p => Math.min(test!.length-1, p + 1))}>Next</Button>
        ) : (
          <Button onClick={handleSubmit}>Submit</Button>
        )}
      </div>
    </div>
  )

  return (
    <DashboardLayout>
       {isLoading && renderLoadingState()}
       {!isLoading && !test && renderInitialState()}
       {!isLoading && test && (isSubmitted ? renderResultsState() : renderQuizState())}
    </DashboardLayout>
  );
}
