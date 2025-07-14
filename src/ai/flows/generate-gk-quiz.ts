
'use server';

/**
 * @fileOverview AI flow for generating General Knowledge (GK) quizzes based on the specified syllabus.
 *
 * - generateGkQuiz - A function that generates a GK quiz.
 * - GenerateGkQuizInput - The input type for the generateGkQuiz function.
 * - GenerateGkQuizOutput - The return type for the generateGkQuiz function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const gkSyllabus = `
1. General Awareness and Contemporary Issues
   1.1 Physical, socio-cultural and economic geography and demography of Nepal
   1.2 Major natural resources of Nepal
   1.3 Geographical diversity, climatic conditions, and livelihood & lifestyle of people
   1.4 Notable events and personalities, social, cultural and economic conditions in modern history of Nepal
   1.5 Current periodical plan of Nepal
   1.6 Information on sustainable development, environment, pollution, climate change, biodiversity, science and technology
   1.7 Nepal's international affairs and general information on the UNO, SAARC & BIMSTEC
   1.8 The Constitution of Nepal (From Part 1 to 5 and Schedules)
   1.9 Governance system and Government (Federal, Provincial and Local)
   1.10 Provisions of civil service act and regulation relating to constitution of civil service, organisational structure, posts of service, fulfillment of vacancy and code of conduct
   1.11 Functional scope of public services
   1.12 Public Service Charter
   1.13 Concept, objective and importance of public policy
   1.14 Fundamentals of management: planning, organizing, directing, controlling, coordinating, decision making, motivation and leadership
   1.15 Government planning, budgeting and accounting system
   1.16 Major events and current affairs of national and international importance
`;

const GenerateGkQuizInputSchema = z.object({
  topics: z
    .array(z.string())
    .describe('An array of main topics for the GK quiz.'),
  numQuestions: z
    .number()
    .int()
    .positive()
    .describe('The number of questions to include in the quiz.'),
});
export type GenerateGkQuizInput = z.infer<typeof GenerateGkQuizInputSchema>;

const GenerateGkQuizOutputSchema = z.object({
  questions: z.array(
    z.object({
      question: z.string().describe('The text of the question.'),
      options: z.array(z.string()).describe('The possible answer options.'),
      correctAnswer: z.string().describe('The correct answer to the question.'),
      topic: z.string().describe('The main topic of the question.'),
    })
  ).describe('An array of questions for the GK quiz.'),
});
export type GenerateGkQuizOutput = z.infer<typeof GenerateGkQuizOutputSchema>;

export async function generateGkQuiz(input: GenerateGkQuizInput): Promise<GenerateGkQuizOutput> {
  return generateGkQuizFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateGkQuizPrompt',
  input: {schema: GenerateGkQuizInputSchema},
  output: {schema: GenerateGkQuizOutputSchema},
  prompt: `You are an expert in generating General Knowledge (GK) quizzes for students preparing for Loksewa exams in Nepal. Your knowledge is based on the following syllabus for "General Awareness and Contemporary Issues":

Syllabus:
${gkSyllabus}

You will generate a quiz with the specified number of questions based on the user-selected topics.

CRITICAL INSTRUCTION: You MUST ensure that every single question and, most importantly, the 'correctAnswer' are factually accurate and verifiable. Double-check all dates, names, figures, and historical events. Do not provide information that is speculative or incorrect. Your primary goal is accuracy.

When a user selects a main topic, you must GO DEEP into that topic by creating questions from its specific sub-topics listed in the syllabus above. Generate specific, high-quality multiple-choice questions. Ensure each question has four plausible options and one correct answer. Each time this prompt is called, you must generate a new and unique set of questions.

Whenever a question or answer contains a date, you MUST provide it in both Bikram Sambat (B.S.) and Anno Domini (A.D.) formats (e.g., "2079 B.S. (2023 A.D.)").

User's Selected Topics:
{{#each topics}}
- {{{this}}}
{{/each}}

Number of Questions: {{numQuestions}}

VERY IMPORTANT: You must output the questions in a valid JSON format that strictly adheres to the provided schema. For every single question in the array, ensure that all fields ('question', 'options', 'correctAnswer', 'topic') are present and correctly populated. The "topic" field for each question should be the main topic it relates to (e.g., "Physical, socio-cultural and economic geography and demography of Nepal").
`,
});

const generateGkQuizFlow = ai.defineFlow(
  {
    name: 'generateGkQuizFlow',
    inputSchema: GenerateGkQuizInputSchema,
    outputSchema: GenerateGkQuizOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
