
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

const fullSyllabus = `
1. Computer Fundamentals
   1.1. Introduction to computer systems
   1.2. Computer Hardware and Software
   1.3. CPU: ALU, Registers, CU
   1.4. Memory and Storage devices
   1.5. Input and Output devices
   1.6. Operating system and application programs
   1.7. Computer virus and remedies
   1.8. Word processor, Spreadsheet, PowerPoint
   1.9. Computer system configuration
   1.10. Basic troubleshooting
   1.11. Fonts, Nepali Fonts, Unicode and Unicode Fonts
   1.12. Using Unicode for Nepali documents
2. Procedural and Object Oriented Programming
   2.1. Concept of Procedural Programming
   2.2. Programming with C
   2.3. Keywords, Identifiers
   2.4. Data types
   2.5. Statements and Operators
   2.6. Preprocessor Directives
   2.7. Input/Output, Control statements, Loops
   2.8. Procedure/Functions
   2.9. Array, String and Pointer
   2.10. Structure and Union
   2.11. Files
   2.12. Object Oriented Programming and Features
   2.13. Objects and Classes
   2.14. Operator/Function Overloading
   2.15. Abstraction, Encapsulation, Inheritance, Polymorphism, Template
   2.16. Exception handling
3. Data Structure and Algorithms
   3.1. Data structures and Abstract data types
   3.2. Stack and Queue
   3.3. Lists, Linked Lists, Queues, Trees, Binary Search-Trees
   3.4. Recursion
   3.5. Introductory Notions of algorithm design: Divide-and-Conquer, Dynamic Programming, Greedy Methods, Backtracking
   3.6. Graph algorithms: Depth-first Search and Breadth-first Search, Shortest Path Problems, Minimum Spanning Trees, Directed Acyclic Graphs. Complexity Analysis of Algorithms, Worst and Average Case Analysis
   3.7. Time and Space Analysis of Algorithms
   3.8. Hashing
   3.9. Sorting
   3.10. Searching
   3.11. Graphs, Graph Traversals
4. Microprocessors and Computer Architecture
   4.1. Microprocessor and Bus System of Microprocessor Based System
   4.2. Intel 8085 microprocessor architecture, programming and interfacing
   4.3. Intel 8086 microprocessor architecture
   4.4. Assembly Language Programming with 8086
   4.5. Instruction Set, Instruction Format and Addressing Modes
   4.6. Interrupt System in Microprocessors
   4.7. Computer Organization and Computer Architecture
   4.8. Instruction Cycle and Machine Cycle, Execution of an Instruction
   4.9. CPU structure and function, Arithmetic and Logic Unit, Representation of data, Arithmetic operations
   4.10. Control Unit, Hardwired and Microprogrammed Control Unit
   4.11. Memory Devices, Classification and Hierarchies
   4.12. Cache Memory and Cache Mapping, Multi-level Cache Memory
   4.13. Von Neumann and Harvard architecture, RISC & CISC architecture
   4.14. Input Output Organization: I/O programming, memory mapped I/O, basic interrupt system, DMA
   4.15. Pipelining, Pipelining Hazards and Remedies
   4.16. Multiprocessors and Multicore architecture
5. Operating Systems
   5.1. Operating system and its functions
   5.2. Types of operating systems
   5.3. Basic components of the Operating Systems
   5.4. Process and Threads, Process Management, Inter-Process Communication, Mutual Exclusion and Synchronization
   5.5. Process Scheduling
   5.6. Memory Management techniques
   5.7. File System Management
   5.8. I/O Management & Disk Allocation and Scheduling Methods
   5.9. Deadlock
   5.10. Security
   5.11. Distributed Systems: Distributed Message passing, RPC, Client-server computing, Clusters
   5.12. Common Operating Systems: Windows and Linux with Their typical features
6. Database Management System
   6.1. Database Management System and its Applications
   6.2. ER modeling
   6.3. Relational Languages and Relational Model
   6.4. Database Constraints and Normalization
   6.5. Normalization: 1NF, 2NF, 3NF, BCNF, 4NF,5NF, DKNF
   6.6. Architecture of DBMS: Client-server, Open Architectures, Transaction Processing, Multi-User & Concurrency, and Backup & Recovery Database.
   6.7. Basic Concept of major RDBMS products: Oracle, Sybase, DB2, SQL Server and other Databases.
   6.8. SQL queries, Views
   6.9. Query Processing and Optimization
   6.10. Database Storage, Indexing and Hashing
   6.11. Transactions Management and Concurrency Control
   6.12. Crash Recovery
   6.13. Distributed Database Systems and Object-Oriented Database System
   6.14. Concept of Data Warehousing
7. Computer Networks and Security
   7.1. Computer Networks, Types of networks and Applications
   7.2. Layered network architecture, OSI and TCP/IP model
   7.3. Physical layer, Transmission media, Switching and Multiplexing, Data Encoding Techniques
   7.4. Data Link Layer and its services, MAC Address, Multiple access protocols, CSMA/CD, CSMA/CA
   7.5. Network Devices: Repeaters, Hubs, Bridges, Switches, Routers, Gateways and their functions
   7.6. Network Layer and its services, IP addressing, Public and Private IP address, Network Layer Protocols, Routing Principles, Classifications of Routing Algorithms, Routing Protocols, IPv4, IPv6
   7.7. IP address management, Autonomous system, Multi-homing
   7.8. Transport Layer and its functions, Port number, TCP and UDP Protocols
   7.9. Application Layer protocols and functions, HTTP & HTTPS, FTP, DNS, SMTP, POP, IMAP Protocols
   7.10. Distributed system, Clusters, Network Security, Disaster Recovery, Data Storage Techniques: Clustering, NAS, SAN
   7.11. Network Security and its Importance, Passive and Active Attacks,
   7.12. Cryptography, Traditional Ciphers
   7.13. Symmetric Encryption, DES and AES
   7.14. Asymmetric encryption and its importance, Diffie and Hellman algorithm, RSA Algorithm
   7.15. Cryptographic Hash Functions, Message Authentication Code, Digital Signature
   7.16. Securing Wireless LANs, VPN, Firewalls, IDS and IPS
   7.17. Disaster Recovery: Need for Disaster Recovery, Disaster Recovery plan, Data backup, Fault Tolerance
   7.18. Advanced Data Storage Techniques: Enterprise Data Storage, Clustering, Network Attached Storage, Storage Area Networks
   7.19. Network Troubleshooting: Using Systematic Approach to Troubleshooting
   7.20. Network Support Tools: Utilities, Network Baseline
   7.21. Network Access Points (NAP), Common Network Component, Common Peripheral Ports
8. Software Engineering
   8.1. Software Engineering and its importance
   8.2. Software Process models
   8.3. Requirement engineering
   8.4. System models
   8.5. Architectural design
   8.6. Software Reuse
   8.7. Software Testing, Verification and Validation
   8.8. Software Estimation
   8.9. Quality Management
   8.10. Configuration Management
   8.11. Software Project Management
9. MIS and Web Technologies
   9.1. Information Systems and Decision making
   9.2. Basics of Website Design, HTML and Content Management System
   9.3. JavaScript, XML, PHP
   9.4. Client server architecture
   9.5. Managing a web server, Hosting a website in a server and via cloud service providers
   9.6. Multimedia systems
   9.7. Knowledge Management, The strategic use of Information Technology.
   9.8. Work Process Redesign (Reengineering) with Information Technology, Enterprise Resources Planning Systems, Information Systems Security, Information Privacy, and Global Information Technology issues.
   9.9. Software Supported Demonstrations including advanced Spreadsheet topics, Software Component Based Systems (CBSE),
10. Recent IT Trends and Terminology
    10.1. Machine Learning and Artificial Intelligence
    10.2. Computer Vision
    10.3. Internet of Things (IoT)
    10.4. BigData
    10.5. Block Chain
    10.6. E-Governance, E-commerce
    10.7. Data Center and its management
    10.8. Cloud/Grid/Cluster/Edge computing
    10.9. Video conferencing/Online meeting/Online class
11. Constitution of Nepal, Acts, Rules and IT Policy
    11.1. The Constitution of Nepal
    11.2. History of IT in Nepal
    11.3. Copyright Act, 2059 B.S.
    11.4. Electronic Transaction Act, 2063 B.S.
    11.5. IT Policy of Nepal, 2072 B.S.
    11.6. Digital Nepal Framework 2076
    11.7. Licensing Issues
    11.8. Basic concept of Public Procurement Act, Public Procurement Rule, Procurement Process, PPMO, E-bidding
`;

const GenerateCustomTestInputSchema = z.object({
  topics: z
    .array(z.string())
    .describe('An array of main topics for the custom test.'),
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
      topic: z.string().describe('The main topic of the question.'),
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
  prompt: `You are an expert in generating custom tests for students preparing for Loksewa exams, specializing in computer science and IT. Your knowledge is based on the following comprehensive syllabus:

Full Syllabus:
${fullSyllabus}

You will generate a custom test with the specified number of questions and difficulty level, based on the user-selected main topics.

When a user selects a main topic, you must GO DEEP into that topic by creating questions from its specific sub-topics listed in the syllabus above. Generate specific, high-quality multiple-choice questions. Ensure each question has four plausible options and one correct answer.

User's Selected Topics:
{{#each topics}}
- {{{this}}}
{{/each}}

Difficulty: {{difficulty}}
Number of Questions: {{numQuestions}}

Ensure that the questions are relevant to the specified topics and difficulty level.

Output the questions in JSON format. The "topic" field for each question should be the main topic it relates to (e.g., "Computer Fundamentals").
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
