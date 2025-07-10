'use client';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Bookmark } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const questions = [
  { id: 1, question: 'What is the capital of Nepal?', topic: 'GK', difficulty: 'Easy' },
  { id: 2, question: 'Who wrote the book "Muna Madan"?', topic: 'Nepali', difficulty: 'Medium' },
  { id: 3, question: 'Solve for x: 2x + 5 = 15', topic: 'IQ', difficulty: 'Easy' },
  { id: 4, question: 'What is the synonym of "ubiquitous"?', topic: 'English', difficulty: 'Hard' },
  { id: 5, question: 'When was the first constitution of Nepal promulgated?', topic: 'GK', difficulty: 'Medium' },
  { id: 6, question: 'Identify the odd one out: Apple, Banana, Orange, Potato', topic: 'IQ', difficulty: 'Easy' },
  { id: 7, question: 'Choose the correct preposition: He is good ___ English.', topic: 'English', difficulty: 'Medium' },
];

export default function QuestionBankPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Question Bank</h1>
          <p className="text-muted-foreground">Explore our vast collection of questions.</p>
        </div>
        <div className="flex flex-col md:flex-row gap-4">
          <Input placeholder="Search questions..." className="max-w-sm" />
          <Select>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Filter by Topic" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="gk">GK</SelectItem>
              <SelectItem value="iq">IQ</SelectItem>
              <SelectItem value="english">English</SelectItem>
              <SelectItem value="nepali">Nepali</SelectItem>
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Filter by Difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="easy">Easy</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="hard">Hard</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[60%]">Question</TableHead>
                <TableHead>Topic</TableHead>
                <TableHead>Difficulty</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {questions.map((q) => (
                <TableRow key={q.id}>
                  <TableCell className="font-medium">{q.question}</TableCell>
                  <TableCell><Badge variant="outline">{q.topic}</Badge></TableCell>
                  <TableCell>
                    <Badge variant={q.difficulty === 'Easy' ? 'secondary' : q.difficulty === 'Hard' ? 'destructive' : 'default'} className="capitalize">{q.difficulty}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" aria-label="Bookmark question">
                      <Bookmark className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </DashboardLayout>
  );
}
