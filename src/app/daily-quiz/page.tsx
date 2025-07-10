'use client';
import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { generateDailyQuiz, type GenerateDailyQuizOutput } from '@/ai/flows/generate-daily-quiz';
import { Loader2, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

type Quiz = GenerateDailyQuizOutput['quiz'];

export default function DailyQuizPage() {
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const handleStartQuiz = async () => {
    setIsLoading(true);
    setQuiz(null);
    try {
      const result = await generateDailyQuiz({ topic: 'General Knowledge', numberOfQuestions: 5 });
      setQuiz(result.quiz);
      setCurrentQuestionIndex(0);
      setSelectedAnswers({});
      setIsSubmitted(false);
      setScore(0);
    } catch (error) {
      console.error("Failed to generate quiz", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswerSelect = (value: string) => {
    setSelectedAnswers(prev => ({...prev, [currentQuestionIndex]: value}));
  };

  const handleSubmit = () => {
    let finalScore = 0;
    quiz?.forEach((q, index) => {
      if (selectedAnswers[index] === q.answer) {
        finalScore++;
      }
    });
    setScore(finalScore);
    setIsSubmitted(true);
  };

  const currentQuestion = quiz?.[currentQuestionIndex];

  const renderInitialState = () => (
     <div className="flex items-center justify-center h-full">
        <Card className="w-full max-w-lg text-center">
          <CardHeader>
            <div className="mx-auto bg-primary/10 p-3 rounded-full mb-4">
              <Zap className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-2xl">Daily Quiz Challenge</CardTitle>
            <CardDescription>A new quiz is generated for you every day. Test your knowledge in just a few minutes!</CardDescription>
          </CardHeader>
          <CardContent>
            <Button size="lg" onClick={handleStartQuiz} disabled={isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Start Today\'s Quiz'}
            </Button>
          </CardContent>
        </Card>
      </div>
  )

  const renderLoadingState = () => (
    <div className="flex items-center justify-center h-full">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="ml-4 text-lg">Generating your quiz...</p>
    </div>
  )

  const renderResultsState = () => (
      <Card className="w-full max-w-2xl mx-auto">
          <CardHeader className="text-center">
              <CardTitle className="text-3xl">Quiz Results</CardTitle>
              <CardDescription>You scored {score} out of {quiz?.length}!</CardDescription>
          </CardHeader>
          <CardContent>
              <div className="space-y-4">
                  {quiz?.map((q, index) => {
                      const userAnswer = selectedAnswers[index];
                      const isCorrect = userAnswer === q.answer;
                      return (
                          <div key={index} className={cn("p-4 rounded-lg border", isCorrect ? "border-green-500 bg-green-500/10" : "border-red-500 bg-red-500/10")}>
                              <p className="font-semibold">{index + 1}. {q.question}</p>
                              <p className="text-sm mt-2">Your answer: <span className={cn("font-medium", isCorrect ? "text-green-700 dark:text-green-400" : "text-red-700 dark:text-red-400")}>{userAnswer || "Not answered"}</span></p>
                              {!isCorrect && <p className="text-sm">Correct answer: <span className="font-medium text-green-700 dark:text-green-400">{q.answer}</span></p>}
                          </div>
                      )
                  })}
              </div>
               <div className="mt-6 text-center">
                  <Button onClick={handleStartQuiz}>Try Another Quiz</Button>
              </div>
          </CardContent>
      </Card>
  )

  const renderQuizState = () => (
     <div className="max-w-3xl mx-auto">
      <Progress value={((currentQuestionIndex + 1) / (quiz?.length || 1)) * 100} className="mb-4" />
      {currentQuestion && (
        <Card>
          <CardHeader>
            <CardTitle>Question {currentQuestionIndex + 1} of {quiz.length}</CardTitle>
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
        {currentQuestionIndex < (quiz?.length || 0) - 1 ? (
          <Button onClick={() => setCurrentQuestionIndex(p => Math.min(quiz!.length-1, p + 1))} disabled={!selectedAnswers[currentQuestionIndex]}>Next</Button>
        ) : (
          <Button onClick={handleSubmit} disabled={Object.keys(selectedAnswers).length !== quiz?.length}>Submit</Button>
        )}
      </div>
    </div>
  )

  return (
    <DashboardLayout>
       {isLoading && renderLoadingState()}
       {!isLoading && !quiz && renderInitialState()}
       {!isLoading && quiz && (isSubmitted ? renderResultsState() : renderQuizState())}
    </DashboardLayout>
  );
}
