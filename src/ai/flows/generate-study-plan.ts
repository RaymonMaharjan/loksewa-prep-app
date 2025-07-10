
'use server';

/**
 * @fileOverview AI flow for generating a personalized study plan for Loksewa exam preparation.
 *
 * - generateStudyPlan - A function that creates a weekly study plan based on user inputs.
 * - GenerateStudyPlanInput - The input type for the generateStudyPlan function.
 * - GenerateStudyPlanOutput - The return type for the generateStudyPlan function.
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

const GenerateStudyPlanInputSchema = z.object({
  targetDate: z.string().describe('The user\'s target exam date in ISO format (e.g., YYYY-MM-DD).'),
  weakSubjects: z.array(z.string()).describe('A list of subjects the user feels they are weakest in.'),
  studyHoursPerWeek: z.number().positive().describe('The number of hours the user can dedicate to studying each week.'),
});
export type GenerateStudyPlanInput = z.infer<typeof GenerateStudyPlanInputSchema>;

const GenerateStudyPlanOutputSchema = z.object({
  weeklyPlan: z.array(
    z.object({
      week: z.number().describe('The week number of the study plan (e.g., 1, 2, 3).'),
      focus: z.string().describe('The main theme or focus for the week.'),
      tasks: z.array(z.string()).describe('A list of specific tasks or topics to cover during the week.'),
    })
  ).describe('A structured weekly study plan.'),
});
export type GenerateStudyPlanOutput = z.infer<typeof GenerateStudyPlanOutputSchema>;

export async function generateStudyPlan(input: GenerateStudyPlanInput): Promise<GenerateStudyPlanOutput> {
  return generateStudyPlanFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateStudyPlanPrompt',
  input: {schema: GenerateStudyPlanInputSchema},
  output: {schema: GenerateStudyPlanOutputSchema},
  prompt: `You are an expert academic advisor specializing in creating personalized study plans for students preparing for the Loksewa IT Officer exam. Your guidance is based on the following syllabus:

Syllabus:
${fullSyllabus}

You will create a structured, week-by-week study plan for a student based on their inputs.

Student's Inputs:
- Target Exam Date: {{targetDate}}
- Weakest Subjects: {{#each weakSubjects}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
- Available Study Hours Per Week: {{studyHoursPerWeek}}

Your task is to generate a realistic and effective weekly study plan that helps the student prepare thoroughly before their target date.

Instructions:
1.  Calculate the total number of weeks available until the exam date.
2.  Create a balanced plan that covers all topics in the syllabus.
3.  Give special emphasis to the user's declared "Weakest Subjects" by allocating more time and suggesting more practice for them, especially in the earlier weeks.
4.  Structure the output as a list of weekly plans. Each week should have a clear "focus" and a list of actionable "tasks".
5.  Tasks should be specific, like "Review TCP/IP model layers," "Take a 20-question custom quiz on 'Data Structures'," or "Attempt a full 50-question mock test."
6.  In the final 1-2 weeks, the plan should focus on revision and taking full mock tests.

VERY IMPORTANT: You must output the plan in a valid JSON format that strictly adheres to the provided schema. Ensure every week in the 'weeklyPlan' array is a complete object with 'week', 'focus', and 'tasks' fields.
`,
});

const generateStudyPlanFlow = ai.defineFlow(
  {
    name: 'generateStudyPlanFlow',
    inputSchema: GenerateStudyPlanInputSchema,
    outputSchema: GenerateStudyPlanOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
