
'use server';

/**
 * @fileOverview AI flow for generating custom tests based on user-specified topics, sub-topics, and difficulty levels.
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
    .describe('An array of main topics and specific sub-topics to include in the custom test. Sub-topics are indented.'),
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
      topic: z.string().describe('The specific sub-topic of the question.'),
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
  prompt: `You are an expert in generating custom tests for students preparing for Loksewa exams, specializing in computer science and IT.

You will generate a custom test with the specified number of questions, difficulty level, and based on the provided syllabus topics and sub-topics.

Go deep into the provided syllabus. Generate specific, high-quality multiple-choice questions based on the selected sub-topics. Ensure each question has four plausible options and one correct answer.

Syllabus and Topics:
{{#each topics}}
{{{this}}}
{{/each}}

Difficulty: {{difficulty}}
Number of Questions: {{numQuestions}}

Ensure that the questions are relevant to the specified topics, sub-topics, and difficulty level.

Output the questions in JSON format. The "topic" field for each question should be the specific sub-topic from the syllabus it relates to.
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
