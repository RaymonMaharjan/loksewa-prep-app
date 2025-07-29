
'use server';

/**
 * @fileOverview AI flow for generating IQ (General Reasoning Test) quizzes.
 *
 * - generateIqTest - A function that generates an IQ test.
 * - GenerateIqTestInput - The input type for the generateIqTest function.
 * - GenerateIqTestOutput - The return type for the generateIqTest function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const iqSyllabus = `
2.1 Logical Reasoning (9×1 Mark = 9 Marks)
   - Verbal Ability
   - Alphanumeric Series
   - Reasoning Analogies
   - Classification
   - Coding-Decoding
   - Order & Ranking
   - Distance & Directions
   - Analytical and Logical Reasoning
   - Assertion and Reason
   - Statement and Conclusion
   - Input-Output
   - Venn-diagram

2.2 Numerical Reasoning (8×1 Mark = 8 Marks)
   - Arithmetic Series
   - Analogy
   - Classification
   - Arithmetical Reasoning
   - Fraction
   - Percentage
   - Ratio
   - Average
   - Profit & Loss
   - Time & Work
   - Date & Calendar
   - Data Sufficiency
   - Data Interpretation & Data Verification

2.3 Spatial Reasoning (8×1 Mark = 8 Marks)
   - Figure Series
   - Figure Analogy
   - Figure Classification
   - Figure Matrix
   - Pattern Completion
   - Embedded Images
   - Image Formation & Analysis
   - Mirror and Water Images
   - Cubes and Dices
   - Paper Folding & Cutting
`;

const GenerateIqTestInputSchema = z.object({
  topics: z
    .array(z.string())
    .describe('An array of main topics for the IQ test.'),
  numQuestions: z
    .number()
    .int()
    .positive()
    .describe('The number of questions to include in the quiz.'),
});
export type GenerateIqTestInput = z.infer<typeof GenerateIqTestInputSchema>;

const GenerateIqTestOutputSchema = z.object({
  questions: z.array(
    z.object({
      question: z.string().describe('The text of the question. If the question involves images or figures, describe them in text.'),
      options: z.array(z.string()).describe('The possible answer options.'),
      correctAnswer: z.string().describe('The correct answer to the question.'),
      topic: z.string().describe('The main topic of the question.'),
    })
  ).describe('An array of questions for the IQ test.'),
});
export type GenerateIqTestOutput = z.infer<typeof GenerateIqTestOutputSchema>;

export async function generateIqTest(input: GenerateIqTestInput): Promise<GenerateIqTestOutput> {
  return generateIqTestFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateIqTestPrompt',
  input: {schema: GenerateIqTestInputSchema},
  output: {schema: GenerateIqTestOutputSchema},
  prompt: `You are an expert in generating IQ (General Reasoning Test) quizzes based on the following syllabus.

Syllabus:
${iqSyllabus}

You will generate a quiz with the specified number of questions based on the user-selected topics.

When a user selects a main topic (e.g., "Logical Reasoning"), you must create questions from its specific sub-topics. For Spatial Reasoning questions that rely on visuals, describe the figures and options clearly in text. For example: "Which of the following figures completes the series: [Description of Figure 1], [Description of Figure 2], ___?"

Generate specific, high-quality multiple-choice questions. Ensure each question has four plausible options and one correct answer. Each time this prompt is called, you must generate a new and unique set of questions.

User's Selected Topics:
{{#each topics}}
- {{{this}}}
{{/each}}

Number of Questions: {{numQuestions}}

VERY IMPORTANT: You must output the questions in a valid JSON format that strictly adheres to the provided schema. For every single question in the array, ensure that all fields ('question', 'options', 'correctAnswer', 'topic') are present and correctly populated. The "topic" field for each question should be the main topic it relates to (e.g., "Logical Reasoning").
`,
});

const generateIqTestFlow = ai.defineFlow(
  {
    name: 'generateIqTestFlow',
    inputSchema: GenerateIqTestInputSchema,
    outputSchema: GenerateIqTestOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
