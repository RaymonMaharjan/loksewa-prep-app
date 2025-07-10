'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating a daily practice quiz with MCQs.
 *
 * - generateDailyQuiz - A function that generates a daily practice quiz.
 * - GenerateDailyQuizInput - The input type for the generateDailyQuiz function.
 * - GenerateDailyQuizOutput - The output type for the generateDailyQuiz function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateDailyQuizInputSchema = z.object({
  topic: z.string().describe('The topic for the daily quiz.'),
  numberOfQuestions: z
    .number()
    .min(5)
    .max(10)
    .default(5) // Default to 5 questions if not specified
    .describe('The number of multiple-choice questions in the quiz (5-10).'),
});

export type GenerateDailyQuizInput = z.infer<typeof GenerateDailyQuizInputSchema>;

const GenerateDailyQuizOutputSchema = z.object({
  quiz: z.array(
    z.object({
      question: z.string().describe('The quiz question.'),
      options: z.array(z.string()).describe('The multiple-choice options.'),
      answer: z.string().describe('The correct answer to the question.'),
    })
  ).describe('A list of quiz questions with options and answers.'),
});

export type GenerateDailyQuizOutput = z.infer<typeof GenerateDailyQuizOutputSchema>;

export async function generateDailyQuiz(input: GenerateDailyQuizInput): Promise<GenerateDailyQuizOutput> {
  return generateDailyQuizFlow(input);
}

const generateDailyQuizPrompt = ai.definePrompt({
  name: 'generateDailyQuizPrompt',
  input: {schema: GenerateDailyQuizInputSchema},
  output: {schema: GenerateDailyQuizOutputSchema},
  prompt: `You are an expert quiz generator. Generate a quiz with {{numberOfQuestions}} multiple-choice questions on the topic of {{topic}}.  Each question should have four options, and clearly identify the correct answer.

Output the quiz in JSON format as a list of question objects with 'question', 'options', and 'answer' fields. The 'options' field should be a list of strings.

For example:
[
  {
    "question": "What is the capital of France?",
    "options": ["Berlin", "Paris", "London", "Rome"],
    "answer": "Paris"
  },
  {
    "question": "What is the highest mountain in the world?",
    "options": ["K2", "Kangchenjunga", "Mount Everest", "Lhotse"],
    "answer": "Mount Everest"
  }
]
`,
});

const generateDailyQuizFlow = ai.defineFlow(
  {
    name: 'generateDailyQuizFlow',
    inputSchema: GenerateDailyQuizInputSchema,
    outputSchema: GenerateDailyQuizOutputSchema,
  },
  async input => {
    const {output} = await generateDailyQuizPrompt(input);
    return output!;
  }
);
