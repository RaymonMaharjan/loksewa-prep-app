'use server';

/**
 * @fileOverview AI flow for generating custom tests based on user-specified topics and difficulty levels.
 *
 * - generateCustomTest - A function that generates a custom test.
 * - GenerateCustomTestInput - The input type for the generateCustomTest function.
 * - GenerateCustomTestOutput - The return type for the generateCustomTest function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateCustomTestInputSchema = z.object({
  topics: z
    .array(z.string())
    .describe('An array of topics to include in the custom test.'),
  difficulty: z
    .enum(['easy', 'medium', 'hard'])
    .describe('The difficulty level of the questions in the custom test.'),
  numQuestions: z
    .number()
    .int()
    .positive()
    .describe('The number of questions to include in the custom test.'),
});
export type GenerateCustomTestInput = z.infer<typeof GenerateCustomTestInputSchema>;

const GenerateCustomTestOutputSchema = z.object({
  questions: z.array(
    z.object({
      question: z.string().describe('The text of the question.'),
      options: z.array(z.string()).describe('The possible answer options.'),
      correctAnswer: z.string().describe('The correct answer to the question.'),
      topic: z.string().describe('The topic of the question.'),
      difficulty: z.enum(['easy', 'medium', 'hard']).describe('The difficulty level of the question.'),
    })
  ).describe('An array of questions for the custom test.'),
});
export type GenerateCustomTestOutput = z.infer<typeof GenerateCustomTestOutputSchema>;

export async function generateCustomTest(input: GenerateCustomTestInput): Promise<GenerateCustomTestOutput> {
  return generateCustomTestFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateCustomTestPrompt',
  input: {schema: GenerateCustomTestInputSchema},
  output: {schema: GenerateCustomTestOutputSchema},
  prompt: `You are an expert in generating custom tests for students preparing for Loksewa exams.

You will generate a custom test with the specified number of questions, topics, and difficulty level.

Topics: {{topics}}
Difficulty: {{difficulty}}
Number of Questions: {{numQuestions}}

Ensure that the questions are relevant to the specified topics and difficulty level.

Output the questions in JSON format.

Here's the output format:
{
  "questions": [
    {
      "question": "Question 1 text",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": "Correct Answer",
      "topic": "Question Topic",
      "difficulty": "Question Difficulty"
    },
    {
      "question": "Question 2 text",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": "Correct Answer",
      "topic": "Question Topic",
      "difficulty": "Question Difficulty"
    }
  ]
}
`,
});

const generateCustomTestFlow = ai.defineFlow(
  {
    name: 'generateCustomTestFlow',
    inputSchema: GenerateCustomTestInputSchema,
    outputSchema: GenerateCustomTestOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
