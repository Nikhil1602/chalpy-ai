"use client";

import SidebarContainer from '@/components/layout/SidebarContainer';
import { User, CreditCard, Key, Shield } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/store/AuthContext';
import { useWorkspace } from '@/store/WorkspaceContext';

const Settings = () => {

    const { user } = useAuth();
    const { currentWorkspace } = useWorkspace();

    return (
        <SidebarContainer>

            <PageHeader title="Settings" description="Manage your account and workspace preferences" />

            <Tabs defaultValue="account" className="space-y-6">
                <TabsList className="p-1">
                    <TabsTrigger value="account" className="gap-2">
                        <User className="w-4 h-4" />
                        Account
                    </TabsTrigger>
                    <TabsTrigger value="workspace" className="gap-2">
                        <Shield className="w-4 h-4" />
                        Workspace
                    </TabsTrigger>
                    <TabsTrigger value="billing" className="gap-2">
                        <CreditCard className="w-4 h-4" />
                        Billing
                    </TabsTrigger>
                    <TabsTrigger value="api" className="gap-2">
                        <Key className="w-4 h-4" />
                        API Keys
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="account">
                    <Card>
                        <CardHeader>
                            <CardTitle>Profile Information</CardTitle>
                            <CardDescription className='text-gray-500'>Update your account details</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className='grid grid-cols-2 gap-5'>
                                <div className="space-y-2">
                                    <Label htmlFor="name">Full Name</Label>
                                    <Input id="name" placeholder="Enter full name" defaultValue={user?.name} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input id="email" type="email" placeholder="Enter email" defaultValue={user?.email} />
                                </div>
                            </div>
                            <Button className='bg-orange-600 hover:bg-orange-700 cursor-pointer transition-colors duration-100'>Save Changes</Button>
                        </CardContent>
                    </Card>

                </TabsContent>

                <TabsContent value="workspace">
                    <Card>
                        <CardHeader>
                            <CardTitle>Workspace Settings</CardTitle>
                            <CardDescription className='text-gray-500'>Manage your workspace configuration</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="workspace-name">Workspace Name</Label>
                                <Input id="workspace-name" defaultValue={currentWorkspace?.name} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="workspace-slug">Workspace URL</Label>
                                <div className="flex">
                                    <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-input bg-gray-800 text-gray-300 text-sm">
                                        chalpy.ai/
                                    </span>
                                    <Input
                                        id="workspace-slug"
                                        defaultValue={currentWorkspace?.slug}
                                        className="rounded-l-none"
                                    />
                                </div>
                            </div>
                            <Button className='bg-orange-600 cursor-pointer hover:bg-orange-700 transition-colors duration-100'>Save Changes</Button>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="billing">
                    <Card>
                        <CardHeader>
                            <CardTitle>Current Plan</CardTitle>
                            <CardDescription>You're currently on the Pro plan</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center justify-between p-4 rounded-lg bg-primary/5 border border-primary/20">
                                <div>
                                    <p className="font-semibold text-foreground">Pro Plan</p>
                                    <p className="text-sm text-muted-foreground">$29/month · Billed monthly</p>
                                </div>
                                <Button variant="outline">Manage Plan</Button>
                            </div>

                            <div className="space-y-3">
                                <h4 className="font-medium">Usage This Month</h4>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Messages</span>
                                        <span className="text-foreground">4,521 / 10,000</span>
                                    </div>
                                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                                        <div className="h-full bg-primary rounded-full" style={{ width: '45%' }} />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Chatbots</span>
                                        <span className="text-foreground">2 / 5</span>
                                    </div>
                                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                                        <div className="h-full bg-primary rounded-full" style={{ width: '40%' }} />
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="api">
                    <Card>
                        <CardHeader>
                            <CardTitle>API Keys</CardTitle>
                            <CardDescription>Manage your API access tokens</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="p-4 rounded-lg border border-border">
                                <div className="flex items-center justify-between mb-2">
                                    <p className="font-medium text-foreground">Production Key</p>
                                    <Button variant="outline" size="sm">Regenerate</Button>
                                </div>
                                <div className="flex items-center gap-2">
                                    <code className="flex-1 px-3 py-2 rounded bg-muted text-sm font-mono text-muted-foreground">
                                        bf_live_••••••••••••••••••••••••
                                    </code>
                                    <Button variant="ghost" size="sm">Copy</Button>
                                </div>
                                <p className="text-xs text-muted-foreground mt-2">
                                    Created Jan 15, 2024 · Last used 2 hours ago
                                </p>
                            </div>

                            <Button variant="outline">
                                <Key className="w-4 h-4 mr-2" />
                                Create New Key
                            </Button>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

        </SidebarContainer>
    );

}

export default Settings