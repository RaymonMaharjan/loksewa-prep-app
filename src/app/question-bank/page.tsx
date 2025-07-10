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
  { id: 1, question: 'What are the main components of a CPU?', topic: 'Computer Fundamentals', difficulty: 'Easy' },
  { id: 2, question: 'What is the difference between a class and an object?', topic: 'Programming', difficulty: 'Medium' },
  { id: 3, question: 'Explain the concept of a binary search tree.', topic: 'Data Structures', difficulty: 'Hard' },
  { id: 4, question: 'What is the function of the ALU in a microprocessor?', topic: 'Architecture', difficulty: 'Medium' },
  { id: 5, question: 'Describe the process scheduling in an operating system.', topic: 'Operating Systems', difficulty: 'Hard' },
  { id: 6, question: 'What is database normalization?', topic: 'DBMS', difficulty: 'Medium' },
  { id: 7, question: 'What is the purpose of a firewall in network security?', topic: 'Networks & Security', difficulty: 'Easy' },
];

const topics = [
    { value: 'computer_fundamentals', label: 'Computer Fundamentals' },
    { value: 'programming', label: 'Procedural and Object Oriented Programming' },
    { value: 'data_structures', label: 'Data Structure and Algorithms' },
    { value: 'architecture', label: 'Microprocessors and Computer Architecture' },
    { value: 'os', label: 'Operating Systems' },
    { value: 'dbms', label: 'Database Management System' },
    { value: 'networks_security', label: 'Computer Networks and Security' },
    { value: 'software_engineering', label: 'Software Engineering' },
    { value: 'web_technologies', label: 'MIS and Web Technologies' },
    { value: 'it_trends', label: 'Recent IT Trends and Terminology' },
    { value: 'legal', label: 'Constitution, Acts, Rules and IT Policy' },
];

export default function QuestionBankPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Question Bank</h1>
          <p className="text-muted-foreground">Explore our vast collection of questions.</p>
        </div>
        <div className="flex flex-col md:flex-row gap-4">
          <Input placeholder="Search questions..." className="max-w-sm" />
          <Select>
            <SelectTrigger className="w-full md:w-[280px]">
              <SelectValue placeholder="Filter by Topic" />
            </SelectTrigger>
            <SelectContent>
              {topics.map(topic => (
                <SelectItem key={topic.value} value={topic.value}>{topic.label}</SelectItem>
              ))}
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
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50%] md:w-[60%]">Question</TableHead>
                  <TableHead>Topic</TableHead>
                  <TableHead>Difficulty</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {questions.map((q) => (
                  <TableRow key={q.id}>
                    <TableCell className="font-medium">{q.question}</TableCell>
                    <TableCell><Badge variant="outline" className="whitespace-nowrap">{q.topic}</Badge></TableCell>
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
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
