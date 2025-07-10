
'use client';

import { useState, useEffect } from 'react';

const LOCAL_STORAGE_KEY = 'loksewaTestHistory';

export interface TestResult {
  id: string;
  date: string;
  score: number;
  totalQuestions: number;
  type: 'daily-quiz' | 'mock-test' | 'custom-test';
  topics: string[];
}

export function useLoksewa() {
  const [history, setHistory] = useState<TestResult[]>([]);

  useEffect(() => {
    try {
      const storedHistory = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedHistory) {
        setHistory(JSON.parse(storedHistory));
      }
    } catch (error) {
      console.error("Failed to load test history from localStorage", error);
      setHistory([]);
    }
  }, []);

  const addTestResult = (result: Omit<TestResult, 'id' | 'date'>) => {
    const newResult: TestResult = {
      ...result,
      id: new Date().toISOString() + Math.random(),
      date: new Date().toISOString(),
    };

    setHistory(prevHistory => {
      const updatedHistory = [...prevHistory, newResult];
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedHistory));
      } catch (error) {
        console.error("Failed to save test history to localStorage", error);
      }
      return updatedHistory;
    });
  };
  
  const getRecentScores = (count = 5) => {
    return history
      .slice()
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, count)
      .map((item, index) => ({
        name: `Test ${history.length - index}`,
        score: (item.score / item.totalQuestions) * 100,
      }))
      .reverse();
  };

  const getTopicPerformance = () => {
    const topicStats: Record<string, { total: number; correct: number }> = {};

    history.forEach(result => {
      const pointsPerQuestion = result.totalQuestions > 0 ? result.score / result.totalQuestions : 0;
      result.topics.forEach(topic => {
        if (!topicStats[topic]) {
          topicStats[topic] = { total: 0, correct: 0 };
        }
        topicStats[topic].total += result.totalQuestions / result.topics.length;
        // This is an approximation as we don't have per-question topic data
        topicStats[topic].correct += pointsPerQuestion * (result.totalQuestions / result.topics.length);
      });
    });

    return Object.entries(topicStats).map(([name, stats]) => ({
      name: name.split(' ').slice(0, 2).join(' '), // Shorten long topic names
      value: stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0,
    }));
  };

  const getScoresOverTime = () => {
    // Aggregate scores by month
    const monthlyScores: Record<string, { totalScore: number; count: number }> = {};
    history.forEach(result => {
        const month = new Date(result.date).toLocaleString('default', { month: 'short' });
        if (!monthlyScores[month]) {
            monthlyScores[month] = { totalScore: 0, count: 0 };
        }
        monthlyScores[month].totalScore += (result.score / result.totalQuestions) * 100;
        monthlyScores[month].count++;
    });

    const sortedMonths = Object.keys(monthlyScores).sort((a,b) => {
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        return months.indexOf(a) - months.indexOf(b);
    });
    
    return sortedMonths.map(month => ({
      date: month,
      score: Math.round(monthlyScores[month].totalScore / monthlyScores[month].count),
    }));
  };


  return { history, addTestResult, getRecentScores, getTopicPerformance, getScoresOverTime };
}
