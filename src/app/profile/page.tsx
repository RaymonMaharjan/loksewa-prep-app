
'use client';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useLoksewa } from '@/hooks/use-loksewa';
import { useAuth } from '@/contexts/auth-context';

export default function ProfilePage() {
    const { history } = useLoksewa();
    const { user } = useAuth();

  if (!user) {
    return null; // Or a loading spinner
  }

  return (
    <DashboardLayout>
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">User Profile</h1>
                <p className="text-muted-foreground">View and manage your profile information.</p>
            </div>
            <Card>
                <CardHeader className="flex flex-col items-center text-center space-y-4">
                    <Avatar className="h-24 w-24">
                        <AvatarImage src={user.photoURL || ''} data-ai-hint="profile avatar" alt={user.displayName || 'User'} />
                        <AvatarFallback>{user.displayName?.charAt(0) || 'U'}</AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                        <CardTitle className="text-2xl">{user.displayName}</CardTitle>
                        <CardDescription>{user.email}</CardDescription>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                        <div className="p-4 bg-muted rounded-lg">
                            <p className="text-sm text-muted-foreground">Tests Taken</p>
                            <p className="text-2xl font-bold">{history.length}</p>
                        </div>
                         <div className="p-4 bg-muted rounded-lg">
                            <p className="text-sm text-muted-foreground">Quizzes Completed</p>
                            <p className="text-2xl font-bold">{history.filter(t => t.type === 'daily-quiz').length}</p>
                        </div>
                         <div className="p-4 bg-muted rounded-lg">
                            <p className="text-sm text-muted-foreground">Mock Tests Done</p>
                            <p className="text-2xl font-bold">{history.filter(t => t.type === 'mock-test').length}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    </DashboardLayout>
  );
}
