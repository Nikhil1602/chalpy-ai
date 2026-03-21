"use client"

import { useState, useEffect } from 'react';
import { ArrowLeft, Save, Shield, Brain, Palette, ChevronLeft, ChevronRight, Clipboard, Play, FlaskConical, Settings, ExternalLink, TriangleAlert, ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useWorkspace } from '@/store/WorkspaceContext';
import { Chatbot, statusType, ThemeConfig } from '@/types';
import { motion, AnimatePresence } from 'motion/react';
import { StepIndicator } from '@/components/chatbot/StepIndicator';
import { ThemeCustomizer } from '@/components/chatbot/ThemeCustomizer';
import { AIModelStep } from '@/components/chatbot/AIModelStep';
import { SystemPromptStep } from '@/components/chatbot/SystemPromptStep';
import { useParams, useRouter } from 'next/navigation';
import { useStepper, useToast } from '@/hooks';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { SidebarContainer } from '@/components/layout';
import { defaultTheme, formatSize, getFileExt, tones } from '@/lib/constants';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';

export default function ChatbotEditor() {

  const { id } = useParams();
  const router = useRouter();

  const { guardrails, isChatbotsLoading, fetchBot, resetForm, knowledgeFiles, formData, handleSaveAdd, handleSaveUpdate, setFormData, getFileIcon } = useWorkspace();
  const isNew = id === 'new';

  const [selectedGuardrailIds, setSelectedGuardrailIds] = useState<string[]>([]);
  const [selectedKnowledgeIds, setSelectedKnowledgeIds] = useState<Set<string>>(new Set([]));

  const { showToast } = useToast();

  useEffect(() => {

    if (isNew) {
      resetForm();
      return;
    };

    const fetchChatBot = async () => {

      fetchBot(id as string, (data: any) => {
        setSelectedGuardrailIds(data.guardrails?.filter((g: any) => g.enabled).map((g: any) => g.id) || []);
        setSelectedKnowledgeIds(new Set(data.knowledge?.filter((k: any) => k.enabled).map((k: any) => k.id) || []));
      });

    }

    fetchChatBot();

  }, [id]);

  const { steps, currentStep, completedSteps, goNext, goPrev, handleStepClick } = useStepper({ isNew, formData });

  const handleSave = async () => {

    if (isNew) {
      await handleSaveAdd({ selectedGuardrailIds, selectedKnowledgeIds });
    } else {
      await handleSaveUpdate({ selectedGuardrailIds, selectedKnowledgeIds, id: id as string ?? null })
    }

    router.push(`/chatbot`);

  };

  const toggleGuardrail = (id: string) => {
    setSelectedGuardrailIds(selectedGuardrailIds.includes(id) ? selectedGuardrailIds.filter((gid) => gid !== id) : [...selectedGuardrailIds, id]);
  };

  const toggleAll = () => {
    setSelectedGuardrailIds(selectedGuardrailIds.length === guardrails.length ? [] : guardrails.map((g) => g.id));
  };

  const toggleSelectKnowledgeFile = (id: string) => {

    setSelectedKnowledgeIds(prev => {
      const next = new Set(prev);

      if (next.has(id)) next.delete(id);
      else next.add(id);

      return next;
    });

  };

  return (
    <SidebarContainer>

      {/* Header */}
      <div className="flex items-center justify-between mb-6">

        <div className="flex items-center gap-4">

          <Button onClick={() => router.back()} className='bg-gray-800 cursor-pointer hover:bg-gray-900 text-white' size="icon">
            <ArrowLeft className="w-5 h-5" />
          </Button>

          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {isNew ? 'Create New Chatbot' : 'Edit Chatbot'}
            </h1>
            <p className="text-gray-500 text-sm">
              Step {currentStep + 1} of {steps.length} — {steps[currentStep].label}
            </p>
          </div>

        </div>

        {!isChatbotsLoading && <div className="flex items-center gap-3">
          {!isNew && (
            <Link href={`/chatbot/${id}/playground`}>
              <Button className='bg-gray-800 cursor-pointer hover:bg-gray-900 text-gray-200 transition-colors duration-100' size="sm">
                <FlaskConical className="w-4 h-4 mr-2" /> Test
              </Button>
            </Link>
          )}
        </div>}

      </div>

      {/* Step Indicator */}
      {isChatbotsLoading ?
        <div className='mb-6'>
          <Skeleton className='h-20 w-full bg-gray-800' />
        </div>
        : <div className="mb-6">
          <StepIndicator steps={steps} currentStep={currentStep} completedSteps={completedSteps} onStepClick={handleStepClick} />
        </div>}

      {/* Step Content */}
      {isChatbotsLoading ?
        <div className='my-3'>
          <Skeleton className='h-120 w-full bg-gray-800' />
        </div>
        :
        <AnimatePresence mode="wait">

          <motion.div key={currentStep} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>

            {/* Step 0: General */}
            {currentStep === 0 && (
              <div className="space-y-6">
                <div className="grid gap-6 lg:grid-cols-2">

                  <Card>
                    <CardHeader>
                      <CardTitle>Basic Information</CardTitle>
                      <CardDescription className='text-gray-500'>Set up your chatbot's identity</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Name <span className="text-red-500">*</span></Label>
                        <Input id="name" placeholder="e.g., Customer Support Bot" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea id="description" placeholder="Briefly describe what this chatbot does..." value={formData.description} onChange={(e: any) => setFormData({ ...formData, description: e.target.value })} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="role">Role <span className="text-red-500">*</span></Label>
                        <Input id="role" placeholder="e.g., Support Agent" value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })} required />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Behavior Settings</CardTitle>
                      <CardDescription className='text-gray-500'>Configure how your chatbot responds</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label>Conversation Tone</Label>
                        <Select value={formData.tone} onValueChange={(v: Chatbot['tone']) => setFormData({ ...formData, tone: v })}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            {tones.map((t) => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-center justify-between py-4 border-b border-border">
                        <div className="space-y-0.5">
                          <Label>Conversation Memory</Label>
                          <p className="text-sm text-gray-500">Remember context from previous messages</p>
                        </div>
                        <Switch checked={formData.enableMemory} onCheckedChange={(c) => setFormData({ ...formData, enableMemory: c })} />
                      </div>
                      <div className="flex items-center justify-between py-4">
                        <div className="space-y-0.5">
                          <Label>Status</Label>
                          <p className="text-sm text-gray-500">Make this chatbot active</p>
                        </div>
                        <Select value={formData?.configuration?.status} onValueChange={(v: statusType) => setFormData({ ...formData, configuration: { ...formData.configuration, status: v } as ThemeConfig })}>
                          <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="draft">Draft</SelectItem>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="paused">Paused</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </CardContent>
                  </Card>

                </div>

                {/* Theme Customizer */}
                <div className="pt-2">
                  <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Palette className="w-5 h-5 text-orange-500" /> Theme & Appearance
                  </h2>
                  <ThemeCustomizer theme={formData.configuration || defaultTheme} onChange={(theme: any) => setFormData({ ...formData, configuration: theme })} botName={formData.name || ''} />
                </div>
              </div>
            )}

            {/* Step 1: AI Model */}
            {currentStep === 1 && (
              <AIModelStep formData={formData} setFormData={setFormData} />
            )}

            {/* Step 2: System Prompt */}
            {currentStep === 2 && (
              <SystemPromptStep systemPrompt={formData.systemPrompt || ''} onChange={(systemPrompt: any) => setFormData({ ...formData, systemPrompt })} />
            )}

            {/* Step 3: Guardrails */}
            {currentStep === 3 && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between flex-wrap gap-3">
                    <div>
                      <CardTitle>Safety Guardrails</CardTitle>
                      <CardDescription className='text-gray-500'>Select guardrails to apply to this chatbot</CardDescription>
                    </div>
                    <Link href="/guardrails">
                      <Button className='bg-orange-600 hover:bg-orange-700 cursor-pointer' size="sm">
                        <Settings className="w-4 h-4 mr-2" /> Manage Guardrails
                        <ExternalLink className="w-3 h-3 ml-1.5" />
                      </Button>
                    </Link>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">

                  {guardrails.length === 0 ? (
                    <div className="text-center py-10 border rounded-md border-dashed">
                      <Shield className="w-10 h-10 text-orange-700 mx-auto mb-3" />
                      <p className="text-gray-500 mb-3">No guardrails available yet.</p>
                      <Link href="/guardrails">
                        <Button className='bg-orange-500 hover:bg-orange-700 cursor-pointer' size="sm">Create Guardrails</Button>
                      </Link>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center justify-between pb-2 border-b border-border">
                        <span className="text-sm text-gray-500">
                          {selectedGuardrailIds.length} of {guardrails.length} selected
                        </span>
                        <Button className='bg-gray-700 hover:bg-gray-800 cursor-pointer' size="sm" onClick={toggleAll}>
                          {selectedGuardrailIds.length === guardrails.length ? 'Deselect All' : 'Select All'}
                        </Button>
                      </div>
                      {guardrails.map((rule) => (
                        <label key={rule.id} className="flex items-center justify-between gap-4 p-4 rounded-lg border cursor-pointer hover:bg-gray-800/50 transition-colors">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className='p-2 bg-orange-500/20 rounded-md'>
                              <Shield className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
                            </div>
                            <div className="min-w-0">
                              <p className="font-medium text-foreground">{rule.name}</p>
                              <p className="text-sm text-gray-500">{rule.description}</p>
                            </div>
                          </div>
                          <Switch checked={selectedGuardrailIds.includes(rule.id)} onCheckedChange={() => toggleGuardrail(rule.id)} className="mt-0.5" />
                        </label>
                      ))}
                    </>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Step 4: Knowledge */}
            {currentStep === 4 && (
              <Card>

                <CardHeader>
                  <CardTitle>Knowledge Base</CardTitle>
                  <CardDescription className='text-gray-500'>Upload documents to train your chatbot with custom knowledge</CardDescription>
                </CardHeader>

                <CardContent>

                  {knowledgeFiles.length === 0 ?
                    <div className="border-2 border-dashed border-gray-500 rounded-xl p-8 sm:p-12 text-center cursor-pointer transition-colors" onClick={() => { }} onDragOver={(e) => e.preventDefault()}>
                      <TriangleAlert className="w-10 h-10 text-gray-500 mx-auto mb-3" />
                      <h3 className="text-base font-semibold text-foreground mb-1">No files in knowledge base</h3>
                      <p className="text-sm text-gray-500 mb-3">kindly add files to knowledge base</p>
                      <Button onClick={() => router.push("/knowledge-base")} className='bg-orange-500 hover:bg-orange-600 cursor-pointer'>Go to knowledge base <ArrowUpRight /></Button>
                    </div> :
                    <div className="divide-y mt-2 divide-border rounded-lg border overflow-hidden">
                      {knowledgeFiles.map((file) => (
                        <div key={file.id} className={`flex items-center gap-3 px-4 py-3 transition-colors ${selectedKnowledgeIds.has(file.id || "") ? 'bg-orange-500/5' : 'hover:bg-gray-800/40'}`}>
                          <Checkbox checked={selectedKnowledgeIds.has(file.id || "")} onCheckedChange={() => toggleSelectKnowledgeFile(file.id)} />
                          {getFileIcon(file.type)}
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-foreground truncate">{file.name}</p>
                            <p className="text-xs text-gray-500">{formatSize(file.size)}</p>
                          </div>
                          <Badge className="text-[10px] bg-gray-700 shrink-0">
                            {getFileExt(file.name)}
                          </Badge>

                        </div>
                      ))}
                    </div>
                  }

                </CardContent>
              </Card>
            )}

            {/* Step 5: Deploy */}
            {currentStep === 5 && (
              <Card>
                <CardHeader>
                  <CardTitle>Deployment</CardTitle>
                  <CardDescription className='text-gray-500'>Get the embed code to add this chatbot to your website</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label>Embed Script</Label>
                    <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm overflow-x-auto">
                      <code className="text-gray-400">
                        {`<script src="https://chalpy.ai/widget.js" data-bot-id="${id || 'new'}" async></script>`}
                      </code>
                    </div>
                    <Button className="bg-orange-600 hover:bg-orange-800 cursor-pointer" size="sm" onClick={() => { navigator.clipboard.writeText(`<script src="https://chalpy.ai/widget.js" data-bot-id="${id || 'new'}" async></script>`); showToast('Copied to clipboard!', 'success'); }}>
                      <Clipboard className="w-4 h-4 mr-2" /> Copy to Clipboard
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <Label>Public API Endpoint</Label>
                    <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm">
                      <code className="text-gray-400">{`https://api.chalpy.ai/v1/chat/${id || 'new'}`}</code>
                    </div>
                  </div>
                  <div className="p-4 rounded-lg bg-orange-500/5 border border-orange-500/20">
                    <div className="flex items-start gap-3">
                      <Brain className="w-5 h-5 text-orange-500 mt-0.5" />
                      <div>
                        <p className="font-medium text-foreground">API Token Required</p>
                        <p className="text-sm text-gray-500 mt-1">
                          Include your API token in request headers. Generate one in workspace settings.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

          </motion.div>

        </AnimatePresence>
      }

      {/* Navigation Buttons */}
      {isChatbotsLoading ?
        <div className='mt-8'>
          <Skeleton className='h-20 w-full bg-gray-800' />
        </div> :
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">

          <Button className='cursor-pointer bg-gray-700 hover:bg-gray-800 text-white' onClick={goPrev} disabled={currentStep === 0}>
            <ChevronLeft className="w-4 h-4 mr-1" /> Previous
          </Button>

          <div className="text-sm text-muted-foreground">
            {currentStep + 1} / {steps.length}
          </div>

          {currentStep < steps.length - 1 ? (
            <Button className='cursor-pointer bg-orange-500 hover:bg-orange-700' onClick={goNext}>
              Next <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          ) : (
            <div className='flex gap-3'>
              <Link href={`/chatbot/${id}/playground`}>
                <Button className='bg-gray-800 hover:bg-gray-900 text-white cursor-pointer transition-colors duration-150'>
                  <Play className="w-4 h-4 mr-1" />
                  Playground
                </Button>
              </Link>
              <Button className='bg-orange-500 hover:bg-orange-600 text-white cursor-pointer transition-colors duration-150' onClick={handleSave}>
                <Save className="w-4 h-4 mr-2" />
                {isNew ? 'Create Chatbot' : 'Save Changes'}
              </Button>
            </div>
          )}
        </div>}

    </SidebarContainer>
  );
};


// {
//   id: `bot-${Date.now()}`,
//   workspaceId: "workspace-1",
//   name: "Support Desk",
//   description: "Helps qualify leads and answer product questions",
//   role: 'Customer Support',
//   systemPrompt: 'You are a helpful customer support agent.',
//   tone: 'professional',
//   enableMemory: true,
//   guardrails: [
//     {
//       id: 'guardrail-1',
//       name: 'No harmful content',
//       description: 'Prevents harmful responses',
//       enabled: true
//     },
//     {
//       id: 'guardrail-2',
//       name: 'Stay on topic',
//       description: 'Keeps conversations focused',
//       enabled: true
//     }
//   ],
//   knowledgeBase: [
//     "uploaded-file-url-from-supabase",
//     ...
//   ],
//   status: 'draft',
//   workspaceId: 'workspace-123',
//   createdAt: new Date(),
//   updatedAt: new Date(),
//   theme: {
//     backgroundColor: '#ffffff',
//     gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
//     gradientFrom: '#667eea',
//     gradientTo: '#764ba2',
//     textColor: '#1a1a2e',
//     borderRadius: 16,
//     fontFamily: 'Inter',
//     logoUrl: '',
//     position: 'bottom-right',
//     accentColor: '#667eea',
//     headerColor: '#667eea',
//     launcher: {
//       backgroundColor: '#667eea',
//       borderRadius: 50,
//       padding: 8,
//       icon: 'message',
//       logoUrl: '',
//       size: 56,
//     },
//   },
//   aiModel: {
//     model: 'chatgpt',
//     modelVersion: 'gpt-4o',
//     apiKey: '23xxx11vd',
//   }
// }