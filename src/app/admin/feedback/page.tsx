
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Inbox, ShieldAlert } from 'lucide-react';
import { db } from '@/lib/firebase';
import { collection, getDocs, orderBy, query, Timestamp } from 'firebase/firestore';
import { formatDistanceToNow } from 'date-fns';

// --- Admin Configuration ---
// Add the email addresses of authorized administrators here.
const ADMIN_EMAILS = ['raymondmaharjan65@gmail.com'];


interface Feedback {
    id: string;
    text: string;
    userName: string;
    userEmail: string;
    createdAt: Date;
}

export default function AdminFeedbackPage() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [feedbackList, setFeedbackList] = useState<Feedback[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {
        if (!loading) {
            if (!user || !ADMIN_EMAILS.includes(user.email || '')) {
                router.push('/dashboard');
            } else {
                setIsAuthorized(true);
            }
        }
    }, [user, loading, router]);


    useEffect(() => {
        if (!isAuthorized) return;
        
        const fetchFeedback = async () => {
            setIsLoading(true);
            try {
                const feedbackCol = collection(db, 'feedback');
                const q = query(feedbackCol, orderBy('createdAt', 'desc'));
                const feedbackSnapshot = await getDocs(q);
                const feedbacks = feedbackSnapshot.docs.map(doc => {
                    const data = doc.data();
                    // Convert Firestore Timestamp to JS Date
                    const createdAtDate = (data.createdAt as Timestamp)?.toDate() || new Date();
                    return {
                        id: doc.id,
                        text: data.text,
                        userName: data.userName || 'Anonymous',
                        userEmail: data.userEmail || 'No email',
                        createdAt: createdAtDate,
                    };
                });
                setFeedbackList(feedbacks);
            } catch (error) {
                console.error("Error fetching feedback: ", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchFeedback();
    }, [isAuthorized]);

    if (loading || !isAuthorized) {
        return (
             <DashboardLayout>
                <div className="flex justify-center items-center h-64">
                    <Loader2 className="h-12 w-12 animate-spin text-primary" />
                </div>
            </DashboardLayout>
        )
    }

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold">User Feedback Submissions</h1>
                    <p className="text-muted-foreground">Here's what your users are saying.</p>
                </div>

                {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <Loader2 className="h-12 w-12 animate-spin text-primary" />
                    </div>
                ) : feedbackList.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 text-center p-4 bg-muted/50 rounded-lg">
                        <Inbox className="h-12 w-12 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-semibold">No Feedback Yet</h3>
                        <p className="text-sm text-muted-foreground">Check back later to see submissions from users.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {feedbackList.map((feedback) => (
                            <Card key={feedback.id}>
                                <CardHeader>
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <CardTitle className="text-lg">{feedback.userName}</CardTitle>
                                            <CardDescription>{feedback.userEmail}</CardDescription>
                                        </div>
                                        <p className="text-xs text-muted-foreground">
                                            {formatDistanceToNow(feedback.createdAt, { addSuffix: true })}
                                        </p>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <p className="whitespace-pre-wrap">{feedback.text}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
