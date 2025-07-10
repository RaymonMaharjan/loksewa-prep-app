
'use client';
import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';
import { generateCustomTest, type GenerateCustomTestOutput } from '@/ai/flows/generate-custom-test';
import { Loader2 } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { cn } from '@/lib/utils';

type Question = GenerateCustomTestOutput['questions'][0];

const syllabus = [
    { 
        id: 'computer_fundamentals', 
        label: 'Computer Fundamentals',
        subTopics: [
            'Introduction to computer systems',
            'Computer Hardware and Software',
            'CPU: ALU, Registers, CU',
            'Memory and Storage devices',
            'Input and Output devices',
            'Operating system and application programs',
            'Computer virus and remedies',
            'Word processor, Spreadsheet, PowerPoint',
            'Computer system configuration',
            'Basic troubleshooting',
            'Fonts, Nepali Fonts, Unicode and Unicode Fonts',
            'Using Unicode for Nepali documents',
        ]
    },
    { 
        id: 'programming', 
        label: 'Procedural and Object Oriented Programming',
        subTopics: [
            'Concept of Procedural Programming', 'Programming with C', 'Keywords, Identifiers', 'Data types', 'Statements and Operators', 'Preprocessor Directives', 'Input/Output, Control statements, Loops', 'Procedure/Functions', 'Array, String and Pointer', 'Structure and Union', 'Files', 'Object Oriented Programming and Features', 'Objects and Classes', 'Operator/Function Overloading', 'Abstraction, Encapsulation, Inheritance, Polymorphism, Template', 'Exception handling'
        ]
    },
    { 
        id: 'data_structures', 
        label: 'Data Structure and Algorithms',
        subTopics: [
            'Data structures and Abstract data types', 'Stack and Queue', 'Lists, Linked Lists, Queues, Trees, Binary Search-Trees', 'Recursion', 'Introductory Notions of algorithm design: Divide-and-Conquer, Dynamic Programming, Greedy Methods, Backtracking', 'Graph algorithms: Depth-first Search and Breadth-first Search, Shortest Path Problems, Minimum Spanning Trees, Directed Acyclic Graphs. Complexity Analysis of Algorithms, Worst and Average Case Analysis', 'Time and Space Analysis of Algorithms', 'Hashing', 'Sorting', 'Searching', 'Graphs, Graph Traversals'
        ]
    },
    { 
        id: 'architecture', 
        label: 'Microprocessors and Computer Architecture',
        subTopics: [
            'Microprocessor and Bus System of Microprocessor Based System', 'Intel 8085 microprocessor architecture, programming and interfacing', 'Intel 8086 microprocessor architecture', 'Assembly Language Programming with 8086', 'Instruction Set, Instruction Format and Addressing Modes', 'Interrupt System in Microprocessors', 'Computer Organization and Computer Architecture', 'Instruction Cycle and Machine Cycle, Execution of an Instruction', 'CPU structure and function, Arithmetic and Logic Unit, Representation of data, Arithmetic operations', 'Control Unit, Hardwired and Microprogrammed Control Unit', 'Memory Devices, Classification and Hierarchies', 'Cache Memory and Cache Mapping, Multi-level Cache Memory', 'Von Neumann and Harvard architecture, RISC & CISC architecture', 'Input Output Organization: I/O programming, memory mapped I/O, basic interrupt system, DMA', 'Pipelining, Pipelining Hazards and Remedies', 'Multiprocessors and Multicore architecture'
        ]
    },
    { 
        id: 'os', 
        label: 'Operating Systems',
        subTopics: [
            'Operating system and its functions', 'Types of operating systems', 'Basic components of the Operating Systems', 'Process and Threads, Process Management, Inter-Process Communication, Mutual Exclusion and Synchronization', 'Process Scheduling', 'Memory Management techniques', 'File System Management', 'I/O Management & Disk Allocation and Scheduling Methods', 'Deadlock', 'Security', 'Distributed Systems: Distributed Message passing, RPC, Client-server computing, Clusters', 'Common Operating Systems: Windows and Linux with Their typical features'
        ]
    },
    { 
        id: 'dbms', 
        label: 'Database Management System',
        subTopics: [
            'Database Management System and its Applications', 'ER modeling', 'Relational Languages and Relational Model', 'Database Constraints and Normalization', 'Normalization: 1NF, 2NF, 3NF, BCNF, 4NF,5NF, DKNF', 'Architecture of DBMS: Client-server, Open Architectures, Transaction Processing, Multi-User & Concurrency, and Backup & Recovery Database.', 'Basic Concept of major RDBMS products: Oracle, Sybase, DB2, SQL Server and other Databases.', 'SQL queries, Views', 'Query Processing and Optimization', 'Database Storage, Indexing and Hashing', 'Transactions Management and Concurrency Control', 'Crash Recovery', 'Distributed Database Systems and Object-Oriented Database System', 'Concept of Data Warehousing'
        ]
    },
    { 
        id: 'networks_security', 
        label: 'Computer Networks and Security',
        subTopics: [
            'Computer Networks, Types of networks and Applications', 'Layered network architecture, OSI and TCP/IP model', 'Physical layer, Transmission media, Switching and Multiplexing, Data Encoding Techniques', 'Data Link Layer and its services, MAC Address, Multiple access protocols, CSMA/CD, CSMA/CA', 'Network Devices: Repeaters, Hubs, Bridges, Switches, Routers, Gateways and their functions', 'Network Layer and its services, IP addressing, Public and Private IP address, Network Layer Protocols, Routing Principles, Classifications of Routing Algorithms, Routing Protocols, IPv4, IPv6', 'IP address management, Autonomous system, Multi-homing', 'Transport Layer and its functions, Port number, TCP and UDP Protocols', 'Application Layer protocols and functions, HTTP & HTTPS, FTP, DNS, SMTP, POP, IMAP Protocols', 'Distributed system, Clusters, Network Security, Disaster Recovery, Data Storage Techniques: Clustering, NAS, SAN', 'Network Security and its Importance, Passive and Active Attacks,', 'Cryptography, Traditional Ciphers', 'Symmetric Encryption, DES and AES', 'Asymmetric encryption and its importance, Diffie and Hellman algorithm, RSA Algorithm', 'Cryptographic Hash Functions, Message Authentication Code, Digital Signature', 'Securing Wireless LANs, VPN, Firewalls, IDS and IPS', 'Disaster Recovery: Need for Disaster Recovery, Disaster Recovery plan, Data backup, Fault Tolerance', 'Advanced Data Storage Techniques: Enterprise Data Storage, Clustering, Network Attached Storage, Storage Area Networks', 'Network Troubleshooting: Using Systematic Approach to Troubleshooting', 'Network Support Tools: Utilities, Network Baseline', 'Network Access Points (NAP), Common Network Component, Common Peripheral Ports'
        ]
    },
    { 
        id: 'software_engineering', 
        label: 'Software Engineering',
        subTopics: [
            'Software Engineering and its importance', 'Software Process models', 'Requirement engineering', 'System models', 'Architectural design', 'Software Reuse', 'Software Testing, Verification and Validation', 'Software Estimation', 'Quality Management', 'Configuration Management', 'Software Project Management'
        ]
    },
    { 
        id: 'web_technologies', 
        label: 'MIS and Web Technologies',
        subTopics: [
            'Information Systems and Decision making', 'Basics of Website Design, HTML and Content Management System', 'JavaScript, XML, PHP', 'Client server architecture', 'Managing a web server, Hosting a website in a server and via cloud service providers', 'Multimedia systems', 'Knowledge Management, The strategic use of Information Technology.', 'Work Process Redesign (Reengineering) with Information Technology, Enterprise Resources Planning Systems, Information Systems Security, Information Privacy, and Global Information Technology issues.', 'Software Supported Demonstrations including advanced Spreadsheet topics, Software Component Based Systems (CBSE),'
        ]
    },
    { 
        id: 'it_trends', 
        label: 'Recent IT Trends and Terminology',
        subTopics: [
            'Machine Learning and Artificial Intelligence', 'Computer Vision', 'Internet of Things (IoT)', 'BigData', 'Block Chain', 'E-Governance, E-commerce', 'Data Center and its management', 'Cloud/Grid/Cluster/Edge computing', 'Video conferencing/Online meeting/Online class'
        ]
    },
    { 
        id: 'legal', 
        label: 'Constitution of Nepal, Acts, Rules and IT Policy',
        subTopics: [
            'The Constitution of Nepal', 'History of IT in Nepal', 'Copyright Act, 2059 B.S.', 'Electronic Transaction Act, 2063 B.S.', 'IT Policy of Nepal, 2072 B.S.', 'Digital Nepal Framework 2076', 'Licensing Issues', 'Basic concept of Public Procurement Act, Public Procurement Rule, Procurement Process, PPMO, E-bidding'
        ]
    },
];


export default function CustomTestPage() {
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [generatedTest, setGeneratedTest] = useState<GenerateCustomTestOutput | null>(null);
    const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [score, setScore] = useState(0);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setGeneratedTest(null);
        setIsSubmitted(false);
        setScore(0);
        setSelectedAnswers({});

        const formData = new FormData(e.currentTarget);
        
        const selectedTopicLabels: string[] = [];
        syllabus.forEach(topic => {
            if (formData.has(topic.id)) {
                selectedTopicLabels.push(topic.label);
            }
        });

        const difficulty = formData.get('difficulty') as 'easy' | 'medium' | 'hard';
        const numQuestions = parseInt(formData.get('num-questions') as string, 10);
        
        if (selectedTopicLabels.length === 0) {
            toast({
                title: "No Topics Selected",
                description: "Please select at least one topic.",
                variant: "destructive",
            });
            setIsLoading(false);
            return;
        }

        try {
            const result = await generateCustomTest({
                topics: selectedTopicLabels,
                difficulty,
                numQuestions,
            });
            setGeneratedTest(result);
        } catch (error) {
            console.error("Failed to generate custom test", error);
            toast({
                title: "Error",
                description: "There was an issue generating your test. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleAnswerSelect = (questionIndex: number, value: string) => {
        setSelectedAnswers(prev => ({...prev, [questionIndex]: value}));
    };
    
    const handleSubmitTest = () => {
        let finalScore = 0;
        generatedTest?.questions.forEach((q, index) => {
          if (selectedAnswers[index] === q.correctAnswer) {
            finalScore++;
          }
        });
        setScore(finalScore);
        setIsSubmitted(true);
    };

    const handleTryAgain = () => {
        setGeneratedTest(null);
        setIsSubmitted(false);
        setScore(0);
        setSelectedAnswers({});
    }

    if (isLoading) {
        return (
            <DashboardLayout>
                <div className="flex flex-col items-center justify-center h-full text-center p-4">
                    <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                    <h2 className="text-2xl font-semibold mb-2">Generating Your Test</h2>
                    <p className="text-muted-foreground">The AI is hard at work creating your personalized questions. Please wait a moment.</p>
                </div>
            </DashboardLayout>
        );
    }
    
    if (generatedTest) {
        if (isSubmitted) {
            return (
                <DashboardLayout>
                    <Card className="w-full max-w-3xl mx-auto">
                        <CardHeader className="text-center">
                            <CardTitle className="text-2xl md:text-3xl">Test Results</CardTitle>
                            <CardDescription>You scored {score} out of {generatedTest.questions.length}!</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {generatedTest.questions.map((q, index) => {
                                    const userAnswer = selectedAnswers[index];
                                    const isCorrect = userAnswer === q.correctAnswer;
                                    return (
                                        <div key={index} className={cn("p-4 rounded-lg border", isCorrect ? "border-green-500 bg-green-500/10" : "border-red-500 bg-red-500/10")}>
                                            <p className="font-semibold">{index + 1}. {q.question}</p>
                                            <p className="text-sm mt-2">Your answer: <span className={cn("font-medium", isCorrect ? "text-green-700 dark:text-green-400" : "text-red-700 dark:text-red-400")}>{userAnswer || "Not answered"}</span></p>
                                            {!isCorrect && <p className="text-sm">Correct answer: <span className="font-medium text-green-700 dark:text-green-400">{q.correctAnswer}</span></p>}
                                        </div>
                                    )
                                })}
                            </div>
                            <div className="mt-6 text-center">
                                <Button onClick={handleTryAgain}>Create Another Test</Button>
                            </div>
                        </CardContent>
                    </Card>
                </DashboardLayout>
            )
        }
        
        return (
            <DashboardLayout>
                <div className="max-w-3xl mx-auto space-y-6">
                    <h1 className="text-2xl font-bold">Your Custom Test</h1>
                    {generatedTest.questions.map((q, index) => (
                        <Card key={index}>
                            <CardHeader>
                                <CardTitle>Question {index + 1}</CardTitle>
                                <CardDescription className="text-base md:text-lg pt-2">{q.question}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <RadioGroup value={selectedAnswers[index]} onValueChange={(value) => handleAnswerSelect(index, value)} className="space-y-4">
                                    {q.options.map((option, i) => (
                                        <div key={i} className="flex items-center space-x-2 p-3 rounded-md border has-[:checked]:bg-primary/10 has-[:checked]:border-primary transition-colors">
                                        <RadioGroupItem value={option} id={`q${index}-option-${i}`} />
                                        <Label htmlFor={`q${index}-option-${i}`} className="text-sm md:text-base flex-1 cursor-pointer">{option}</Label>
                                        </div>
                                    ))}
                                </RadioGroup>
                            </CardContent>
                        </Card>
                    ))}
                    <Button onClick={handleSubmitTest} className="w-full" disabled={Object.keys(selectedAnswers).length !== generatedTest.questions.length}>Submit Test</Button>
                </div>
            </DashboardLayout>
        )
    }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Custom Test Generator</h1>
          <p className="text-muted-foreground">Create your own test by selecting topics and difficulty.</p>
        </div>
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Test Configuration</CardTitle>
            <CardDescription>Fill in the details to generate your personalized test.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label>Syllabus Topics (Select at least one)</Label>
                <ScrollArea className="h-72 w-full rounded-md border p-4">
                    <div className="space-y-3">
                        {syllabus.map((topic) => (
                            <div key={topic.id} className="flex items-start space-x-2">
                                <Checkbox id={topic.id} name={topic.id} />
                                <Label htmlFor={topic.id} className="font-normal cursor-pointer leading-tight">{topic.label}</Label>
                            </div>
                        ))}
                    </div>
                </ScrollArea>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="difficulty">Difficulty</Label>
                    <Select name="difficulty" defaultValue="medium" required>
                        <SelectTrigger id="difficulty">
                            <SelectValue placeholder="Select difficulty" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="easy">Easy</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="hard">Hard</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="num-questions">Number of Questions</Label>
                    <Input name="num-questions" id="num-questions" type="number" placeholder="e.g., 10" defaultValue="10" min="5" max="25" required />
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Generate Test'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
