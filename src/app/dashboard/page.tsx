'use client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { BarChart, Calendar, FileText, FlaskConical, ArrowRight, PieChart as PieChartIcon, BarChart2 as BarChartIcon } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';


const quickLinks = [
    { title: 'Start Daily Quiz', icon: Calendar, path: '/daily-quiz', description: "Test your knowledge" },
    { title: 'Browse Mock Tests', icon: FileText, path: '/mock-tests', description: "Simulate exam conditions" },
    { title: 'Create Custom Test', icon: FlaskConical, path: '/custom-test', description: "Personalize your practice" },
    { title: 'View Performance', icon: BarChart, path: '/performance', description: "Track your progress" },
  ];

const recentScoresData = [
  { name: 'Test 1', score: 80 },
  { name: 'Test 2', score: 95 },
  { name: 'Test 3', score: 72 },
  { name: 'Test 4', score: 88 },
  { name: 'Test 5', score: 91 },
];

const topicPerformanceData = [
    { name: 'GK', value: 400, fill: "var(--color-chart-1)" },
    { name: 'IQ', value: 300, fill: "var(--color-chart-2)" },
    { name: 'English', value: 300, fill: "var(--color-chart-3)" },
    { name: 'Nepali', value: 200, fill: "var(--color-chart-4)" },
];

const chartConfig = {
  score: {
    label: "Score",
    color: "hsl(var(--primary))",
  },
};

const pieChartConfig = {
    "GK": { label: "GK", color: "hsl(var(--chart-1))" },
    "IQ": { label: "IQ", color: "hsl(var(--chart-2))" },
    "English": { label: "English", color: "hsl(var(--chart-3))" },
    "Nepali": { label: "Nepali", color: "hsl(var(--chart-4))" },
}


export default function DashboardPage() {
  const router = useRouter();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Welcome back!</h1>
          <p className="text-muted-foreground">Here's a quick overview of your prep status.</p>
        </div>
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {quickLinks.map((link) => (
            <Card 
              key={link.title} 
              onClick={() => router.push(link.path)}
              className="group cursor-pointer hover:border-primary transition-all duration-300 flex flex-col justify-between"
            >
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <link.icon className="h-6 w-6 text-primary" />
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-transform" />
                </div>
              </CardHeader>
              <CardContent>
                <CardTitle className="text-lg mb-1">{link.title}</CardTitle>
                <CardDescription>{link.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="grid gap-6 md:grid-cols-2">
            <Card>
                <CardHeader>
                    <CardTitle>Recent Test Scores</CardTitle>
                    <CardDescription>Your scores from the last 5 tests.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ChartContainer config={chartConfig} className="h-[250px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <RechartsBarChart data={recentScoresData} margin={{ top: 5, right: 5, bottom: 5, left: -25 }}>
                                <XAxis dataKey="name" tickLine={false} axisLine={false} tickMargin={8} fontSize={12} />
                                <YAxis domain={[0, 100]} unit="%" tickLine={false} axisLine={false} tickMargin={8} fontSize={12} />
                                <Tooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
                                <Bar dataKey="score" fill="var(--color-score)" radius={4} />
                            </RechartsBarChart>
                        </ResponsiveContainer>
                    </ChartContainer>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Topic Breakdown</CardTitle>
                    <CardDescription>Your performance across different topics.</CardDescription>
                </CardHeader>
                <CardContent>
                   <ChartContainer config={pieChartConfig} className="h-[250px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Tooltip content={<ChartTooltipContent hideLabel />} />
                                <Pie data={topicPerformanceData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} innerRadius={60}>
                                    {topicPerformanceData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.fill} />
                                    ))}
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                    </ChartContainer>
                </CardContent>
            </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
