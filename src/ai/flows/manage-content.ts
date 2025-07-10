'use server';

/**
 * @fileOverview An AI-powered content management system for adding, editing, and categorizing questions,
 * as well as scheduling daily quizzes.
 *
 * - manageContent - A function that manages content creation, editing, and scheduling.
 * - ManageContentInput - The input type for the manageContent function.
 * - ManageContentOutput - The return type for the manageContent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ManageContentInputSchema = z.object({
  task: z
    .string()
    .describe(
      'The content management task to perform. Examples: Add question, Edit question, Categorize question, Schedule daily quiz.'
    ),
  question: z.string().optional().describe('The question to add or edit.'),
  answer: z.string().optional().describe('The answer to the question.'),
  category: z.string().optional().describe('The category of the question.'),
  quizSchedule: z.string().optional().describe('The schedule for the daily quiz.'),
});
export type ManageContentInput = z.infer<typeof ManageContentInputSchema>;

const ManageContentOutputSchema = z.object({
  success: z.boolean().describe('Whether the content management task was successful.'),
  message: z.string().describe('A message describing the result of the task.'),
});
export type ManageContentOutput = z.infer<typeof ManageContentOutputSchema>;

export async function manageContent(input: ManageContentInput): Promise<ManageContentOutput> {
  return manageContentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'manageContentPrompt',
  input: {schema: ManageContentInputSchema},
  output: {schema: ManageContentOutputSchema},
  prompt: `You are an AI content management system. You can add, edit, and categorize questions in the question bank, as well as schedule daily quizzes.

  Task: {{{task}}}
  Question: {{{question}}}
  Answer: {{{answer}}}
  Category: {{{category}}}
  Quiz Schedule: {{{quizSchedule}}}

  Based on the task provided, take the requested action and respond with a success boolean and a message.
  If the task is to add a question, add the question, answer, and category to the question bank.
  If the task is to edit a question, edit the question, answer, or category in the question bank.
  If the task is to categorize a question, categorize the question in the question bank.
  If the task is to schedule a daily quiz, schedule the daily quiz with the provided schedule.
`,
});

const manageContentFlow = ai.defineFlow(
  {
    name: 'manageContentFlow',
    inputSchema: ManageContentInputSchema,
    outputSchema: ManageContentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
