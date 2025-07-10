
'use client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { Calendar, FileText, FlaskConical, ArrowRight } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { useLoksewa } from '@/hooks/use-loksewa';
import { useMemo } from 'react';


const quickLinks = [
    { title: 'Start Daily Quiz', icon: Calendar, path: '/daily-quiz', description: "A quick 20-question test" },
    { title: 'Mock Test', icon: FileText, path: '/mock-test', description: "A 50-question mock exam" },
    { title: 'Create Custom Test', icon: FlaskConical, path: '/custom-test', description: "Personalize your practice" },
  ];

const chartConfig = {
  score: {
    label: "Score",
    color: "hsl(var(--primary))",
  },
};

const pieChartColors = [
    "hsl(var(--chart-1))",
    "hsl(var(--chart-2))",
    "hsl(var(--chart-3))",
    "hsl(var(--chart-4))",
    "hsl(var(--chart-5))",
];

export default function DashboardPage() {
  const router = useRouter();
  const { getRecentScores, getTopicPerformance, history } = useLoksewa();

  const recentScoresData = useMemo(getRecentScores, [history]);
  const topicPerformanceData = useMemo(() => {
      return getTopicPerformance().map((topic, index) => ({
          ...topic,
          fill: pieChartColors[index % pieChartColors.length],
      }));
  }, [history]);
  
  const pieChartConfig = useMemo(() => {
      const config: any = {};
      topicPerformanceData.forEach(topic => {
          config[topic.name] = { label: topic.name, color: topic.fill };
      });
      return config;
  }, [topicPerformanceData]);

  const renderEmptyState = (title: string, description: string) => (
    <div className="flex flex-col items-center justify-center h-[250px] text-center p-4 bg-muted/50 rounded-lg">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  )


  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Welcome back!</h1>
          <p className="text-muted-foreground">Here's a quick overview of your prep status.</p>
        </div>
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
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
                    <CardDescription>Your percentage scores from the last 5 tests.</CardDescription>
                </CardHeader>
                <CardContent>
                    {recentScoresData.length > 0 ? (
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
                    ) : (
                        renderEmptyState("No Recent Scores", "Take a quiz or test to see your scores here.")
                    )}
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Topic Performance</CardTitle>
                    <CardDescription>Your average performance across different topics.</CardDescription>
                </CardHeader>
                <CardContent>
                   {topicPerformanceData.length > 0 ? (
                    <ChartContainer config={pieChartConfig} className="h-[250px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Tooltip content={<ChartTooltipContent hideLabel nameKey="name" />} />
                                    <Pie data={topicPerformanceData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} innerRadius={60}>
                                        {topicPerformanceData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.fill} />
                                        ))}
                                    </Pie>
                                </PieChart>
                            </ResponsiveContainer>
                        </ChartContainer>
                   ) : (
                       renderEmptyState("No Topic Data", "Complete a few tests to see your topic breakdown.")
                   )}
                </CardContent>
            </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
