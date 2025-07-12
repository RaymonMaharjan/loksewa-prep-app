
'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Send } from 'lucide-react';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '@/contexts/auth-context';
import Link from 'next/link';

// This must match the admin list in /admin/feedback/page.tsx
const ADMIN_EMAILS = ['raymondmaharjan65@gmail.com'];

export default function FeedbackPage() {
    const { toast } = useToast();
    const { user } = useAuth();
    const [feedback, setFeedback] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const isUserAdmin = user && ADMIN_EMAILS.includes(user.email || '');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!feedback.trim()) {
            toast({
                title: 'Feedback cannot be empty',
                description: 'Please write something before submitting.',
                variant: 'destructive',
            });
            return;
        }

        if (!user) {
             toast({
                title: 'Not authenticated',
                description: 'You must be logged in to submit feedback.',
                variant: 'destructive',
            });
            return;
        }

        setIsLoading(true);

        try {
            await addDoc(collection(db, "feedback"), {
                text: feedback,
                userId: user.uid,
                userEmail: user.email,
                userName: user.displayName,
                createdAt: serverTimestamp(),
            });

            setFeedback('');
            toast({
                title: 'Feedback Sent!',
                description: "Thank you for your valuable input. We'll use it to make the app better.",
            });
        } catch (error) {
            console.error("Error adding document: ", error);
             toast({
                title: 'Error',
                description: 'There was an issue sending your feedback. Please try again.',
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold">Share Your Feedback</h1>
                    <p className="text-muted-foreground">We'd love to hear your thoughts on what you like and what we can improve.</p>
                </div>
                <Card className="max-w-2xl mx-auto">
                    <CardHeader>
                        <CardTitle>Submit a Review</CardTitle>
                        <CardDescription>Your feedback is crucial in helping us improve Loksewa Prep.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="feedback-textarea">Your Review & Suggestions</Label>
                                <Textarea
                                    id="feedback-textarea"
                                    placeholder="Tell us about your experience, what you love, or what's missing..."
                                    value={feedback}
                                    onChange={(e) => setFeedback(e.target.value)}
                                    rows={8}
                                    required
                                    disabled={isLoading}
                                />
                            </div>
                            <Button type="submit" className="w-full" disabled={isLoading || !user}>
                                {isLoading ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                    <Send className="mr-2 h-4 w-4" />
                                )}
                                Submit Feedback
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                 {isUserAdmin && (
                    <div className="text-center mt-4">
                        <Button variant="link" asChild>
                            <Link href="/admin/feedback">View Submitted Feedback (Admin)</Link>
                        </Button>
                    </div>
                 )}
            </div>
        </DashboardLayout>
    );
}
