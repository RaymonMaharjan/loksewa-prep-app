
'use client';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { useLoksewa } from '@/hooks/use-loksewa';

const chartConfig = {
  score: {
    label: "Score (%)",
    color: "hsl(var(--primary))",
  },
};

export default function PerformancePage() {
  const { getScoresOverTime } = useLoksewa();
  const chartData = getScoresOverTime();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Performance Analytics</h1>
          <p className="text-muted-foreground">Track your progress and identify areas for improvement.</p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Test Scores Over Time</CardTitle>
            <CardDescription>Your average score in mock tests grouped by month.</CardDescription>
          </CardHeader>
          <CardContent>
            {chartData.length > 0 ? (
              <ChartContainer config={chartConfig} className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: -25 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false}/>
                    <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} />
                    <YAxis domain={[0, 100]} unit="%" tickLine={false} axisLine={false} tickMargin={8}/>
                     <Tooltip
                      cursor={false}
                      content={<ChartTooltipContent indicator="dot" />}
                    />
                    <Bar dataKey="score" fill="var(--color-score)" radius={8} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            ) : (
                 <div className="flex flex-col items-center justify-center h-[300px] text-center p-4 bg-muted/50 rounded-lg">
                    <h3 className="text-lg font-semibold">No Performance Data Yet</h3>
                    <p className="text-sm text-muted-foreground">Complete some tests to see your progress over time.</p>
                </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
