
'use server';

/**
 * @fileOverview AI flow for generating a daily study routine.
 *
 * - generateDailyRoutine - A function that creates a study routine for the day.
 * - GenerateDailyRoutineInput - The input type for the generateDailyRoutine function.
 * - GenerateDailyRoutineOutput - The return type for the generateDailyRoutine function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const fullSyllabus = `
1. Computer Fundamentals
2. Procedural and Object Oriented Programming
3. Data Structure and Algorithms
4. Microprocessors and Computer Architecture
5. Operating Systems
6. Database Management System
7. Computer Networks and Security
8. Software Engineering
9. MIS and Web Technologies
10. Recent IT Trends and Terminology
11. Constitution of Nepal, Acts, Rules and IT Policy
`;

const GenerateDailyRoutineInputSchema = z.object({
  studyHours: z.number().positive().describe('The number of hours the user can study today.'),
  weakSubjects: z.array(z.string()).optional().describe('A list of subjects the user feels they are weakest in.'),
});
export type GenerateDailyRoutineInput = z.infer<typeof GenerateDailyRoutineInputSchema>;

const GenerateDailyRoutineOutputSchema = z.object({
  focusSubjects: z.array(z.string()).describe('A list of 1-3 main subjects to focus on for the day.'),
  tasks: z.array(
      z.object({
          time: z.string().describe('Suggested time block for the task (e.g., 1-2 hours).'),
          task: z.string().describe('A specific, actionable study task.'),
      })
  ).describe('A list of specific tasks to cover during the day.'),
  motivation: z.string().describe('A short, motivational quote or tip for the day.'),
});
export type GenerateDailyRoutineOutput = z.infer<typeof GenerateDailyRoutineOutputSchema>;

export async function generateDailyRoutine(input: GenerateDailyRoutineInput): Promise<GenerateDailyRoutineOutput> {
  return generateDailyRoutineFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateDailyRoutinePrompt',
  input: {schema: GenerateDailyRoutineInputSchema},
  output: {schema: GenerateDailyRoutineOutputSchema},
  prompt: `You are an expert academic advisor who creates focused, daily study routines for students preparing for the Loksewa IT Officer exam. Your guidance is based on the following syllabus:

Syllabus:
${fullSyllabus}

Create a realistic and effective study routine for today based on the user's inputs.

User's Inputs:
- Available Study Hours Today: {{studyHours}}
{{#if weakSubjects}}
- Weakest Subjects: {{#each weakSubjects}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
{{/if}}

Instructions:
1.  Select 1-3 subjects from the syllabus to be the main focus for today. Prioritize the user's weak subjects if provided.
2.  Break down the available study hours into specific, actionable tasks.
3.  Each task should have a suggested time allocation and a clear goal (e.g., "Review OSI model layers", "Take a 10-question quiz on 'Database Normalization'").
4.  Generate a short, motivational tip to keep the student inspired.
5.  Ensure the total time for all tasks matches the user's available study hours.

VERY IMPORTANT: You must output the routine in a valid JSON format that strictly adheres to the provided schema.
`,
});

const generateDailyRoutineFlow = ai.defineFlow(
  {
    name: 'generateDailyRoutineFlow',
    inputSchema: GenerateDailyRoutineInputSchema,
    outputSchema: GenerateDailyRoutineOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
