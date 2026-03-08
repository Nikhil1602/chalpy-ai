"use client"

import { useState, useCallback, useRef } from 'react';
import { ArrowLeft, Save, Bot, MessageSquare, Upload, Code2, Shield, Brain, Palette, ChevronLeft, ChevronRight, Clipboard, Play, FlaskConical, Settings, ExternalLink, FileImage, FileText, File, X, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useWorkspace } from '@/store/WorkspaceContext';
import { Chatbot, GuardrailRule, KnowledgeFile } from '@/types';
import { motion, AnimatePresence } from 'motion/react';
import { StepIndicator } from '@/components/chatbot/StepIndicator';
import { ThemeCustomizer } from '@/components/chatbot/ThemeCustomizer';
import { AIModelStep } from '@/components/chatbot/AIModelStep';
import { SystemPromptStep } from '@/components/chatbot/SystemPromptStep';
import { useParams, useRouter } from 'next/navigation';
import { useToast } from '@/hooks';
import SidebarContainer from '@/components/layout/SidebarContainer';
import Link from 'next/link';
import { defaultAIModel, defaultTheme } from '@/lib/constants';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';

const tones = [
  { value: 'professional', label: 'Professional' },
  { value: 'friendly', label: 'Friendly' },
  { value: 'casual', label: 'Casual' },
  { value: 'formal', label: 'Formal' },
];

const defaultGuardrails: GuardrailRule[] = [
  { id: 'g1', name: 'No harmful content', description: 'Prevents generation of harmful or offensive content', enabled: true },
  { id: 'g2', name: 'Stay on topic', description: 'Keeps conversations focused on the intended purpose', enabled: true },
  { id: 'g3', name: 'No personal data collection', description: 'Avoids collecting sensitive personal information', enabled: false },
  { id: 'g4', name: 'Fact-checking', description: 'Warns users when providing uncertain information', enabled: false },
];

const steps = [
  { id: 'general', label: 'General', icon: <Bot className="w-4 h-4" /> },
  { id: 'model', label: 'AI Model', icon: <Brain className="w-4 h-4" /> },
  { id: 'prompt', label: 'System Prompt', icon: <MessageSquare className="w-4 h-4" /> },
  { id: 'guardrails', label: 'Guardrails', icon: <Shield className="w-4 h-4" /> },
  { id: 'knowledge', label: 'Knowledge', icon: <Upload className="w-4 h-4" /> },
  { id: 'deploy', label: 'Deploy', icon: <Code2 className="w-4 h-4" /> },
];

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getFileIcon(type: string) {
  if (type.includes('pdf')) return <FileText className="w-5 h-5 text-red-500" />;
  if (type.includes('image')) return <FileImage className="w-5 h-5 text-blue-500" />;
  return <File className="w-5 h-5 text-muted-foreground" />;
}

function getFileExt(name: string) {
  return name.split('.').pop()?.toUpperCase() || 'FILE';
}

export default function ChatbotEditor() {

  const { id } = useParams();
  const router = useRouter();
  const { getChatbot, updateChatbot, addChatbot, guardrails } = useWorkspace();
  const isNew = id === 'new';
  const existingBot = !isNew ? getChatbot(id as string ?? null) : null;

  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set(isNew ? [] : [0, 1, 2, 3, 4, 5]));
  const [selectedGuardrailIds, setSelectedGuardrailIds] = useState<string[]>(
    existingBot?.guardrails?.filter(g => g.enabled).map(g => g.id) || []
  );
  const [knowledgeFiles, setKnowledgeFiles] = useState<KnowledgeFile[]>([]);
  const { showToast } = useToast();
  const inputRef = useRef<HTMLInputElement>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const [formData, setFormData] = useState<Partial<Chatbot>>({
    name: existingBot?.name || '',
    description: existingBot?.description || '',
    role: existingBot?.role || '',
    systemPrompt: existingBot?.systemPrompt || 'You are a helpful AI assistant. Answer questions accurately and helpfully.',
    tone: existingBot?.tone || 'professional',
    enableMemory: existingBot?.enableMemory ?? true,
    guardrails: existingBot?.guardrails?.filter(g => g.enabled) || defaultGuardrails,
    status: existingBot?.status || 'draft',
    theme: existingBot?.theme || defaultTheme,
    aiModel: existingBot?.aiModel || defaultAIModel,
  });

  const validateStep = useCallback((step: number): string | null => {

    switch (step) {

      case 0:
        if (!formData.name?.trim()) return 'Please provide a name for your chatbot';
        if (!formData.role?.trim()) return 'Please provide a role for your chatbot';
        return null;
      case 1:
        if (!formData.aiModel?.apiKey?.trim()) return 'Please enter an API key for the selected model';
        return null;
      case 2:
        if (!formData.systemPrompt?.trim()) return 'Please provide a system prompt';
        return null;
      default:
        return null;

    }

  }, [formData]);

  const goNext = () => {

    const error = validateStep(currentStep);

    if (error) {
      showToast(error, 'error');
      return;
    }

    setCompletedSteps(prev => new Set([...prev, currentStep]));
    setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));

  };

  const goPrev = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  const handleStepClick = (index: number) => {

    if (index < currentStep || completedSteps.has(index) || index === currentStep + 1) {
      if (index > currentStep) {
        const error = validateStep(currentStep);
        if (error) { showToast(error, 'error'); return; }
        setCompletedSteps(prev => new Set([...prev, currentStep]));
      }
      setCurrentStep(index);

    }
  };

  const handleSave = () => {

    if (!formData.name) { showToast('Please provide a name', 'error'); return; }

    if (isNew) {
      const newBot: Chatbot = {
        id: `bot-${Date.now()}`,
        name: formData.name!,
        description: formData.description || '',
        role: formData.role || 'Assistant',
        systemPrompt: formData.systemPrompt || '',
        tone: formData.tone || 'professional',
        enableMemory: formData.enableMemory ?? true,
        guardrails: formData.guardrails || [],
        status: 'draft',
        workspaceId: 'workspace-1',
        createdAt: new Date(),
        updatedAt: new Date(),
        theme: formData.theme || defaultTheme,
        aiModel: formData.aiModel || defaultAIModel,
      };
      addChatbot(newBot);
      showToast('Chatbot created successfully!', 'success');
      router.push(`/chatbot/${newBot.id}`);

    } else {

      updateChatbot(id as string ?? null, formData);
      showToast('Changes saved successfully!', 'success');

    }

  };

  const toggleGuardrail = (id: string) => {
    if (selectedGuardrailIds.includes(id)) {
      setSelectedGuardrailIds(selectedGuardrailIds.filter((gid) => gid !== id));
    } else {
      setSelectedGuardrailIds([...selectedGuardrailIds, id]);
    }
  };

  const toggleAll = () => {
    if (selectedGuardrailIds.length === guardrails.length) {
      setSelectedGuardrailIds([]);
    } else {
      setSelectedGuardrailIds(guardrails.map((g) => g.id));
    }
  };

  const handleFiles = (fileList: FileList | null) => {
    if (!fileList) return;
    const newFiles: KnowledgeFile[] = [];
    const errors: string[] = [];

    Array.from(fileList).forEach((f) => {
      if (f.size > MAX_FILE_SIZE) {
        errors.push(`${f.name} exceeds 10MB limit`);
        return;
      }
      if (knowledgeFiles.some((ef) => ef.name === f.name && ef.size === f.size)) {
        errors.push(`${f.name} already added`);
        return;
      }
      newFiles.push({
        id: `file-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        name: f.name,
        size: f.size,
        type: f.type,
      });
    });

    if (errors.length) showToast(errors.join(', '), "error");
    if (newFiles.length) {
      setKnowledgeFiles([...knowledgeFiles, ...newFiles]);
      showToast(`${newFiles.length} file(s) added`, "success")
    }
  };

  const removeFile = (id: string) => {
    setKnowledgeFiles(knowledgeFiles.filter((f) => f.id !== id));
    setSelectedIds((prev) => { const n = new Set(prev); n.delete(id); return n; });
  };

  const removeSelectedFile = () => {
    setKnowledgeFiles(knowledgeFiles.filter((f) => !selectedIds.has(f.id)));
    setSelectedIds(new Set());
    showToast("Files removed", "success");
  };

  const toggleSelectFile = (id: string) => {
    setSelectedIds((prev) => {
      const n = new Set(prev);
      if (n.has(id)) n.delete(id); else n.add(id);
      return n;
    });
  };

  const toggleAllFiles = () => {
    if (selectedIds.size === knowledgeFiles.length) setSelectedIds(new Set());
    else setSelectedIds(new Set(knowledgeFiles.map((f) => f.id)));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
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
              {isNew ? 'Create New Chatbot' : formData.name || 'Edit Chatbot'}
            </h1>
            <p className="text-gray-500 text-sm">
              Step {currentStep + 1} of {steps.length} — {steps[currentStep].label}
            </p>
          </div>

        </div>

        <div className="flex items-center gap-3">
          {!isNew && (
            <Link href={`/chatbot/${id}/playground`}>
              <Button className='bg-gray-800 cursor-pointer hover:bg-gray-900 text-gray-200 transition-colors duration-100' size="sm">
                <FlaskConical className="w-4 h-4 mr-2" /> Test
              </Button>
            </Link>
          )}
        </div>

      </div>

      {/* Step Indicator */}
      <div className="mb-6">
        <StepIndicator steps={steps} currentStep={currentStep} completedSteps={completedSteps} onStepClick={handleStepClick} />
      </div>

      {/* Step Content */}
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
                      <Select value={formData.status} onValueChange={(v: Chatbot['status']) => setFormData({ ...formData, status: v })}>
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
                <ThemeCustomizer
                  theme={formData.theme || defaultTheme}
                  onChange={(theme: any) => setFormData({ ...formData, theme })}
                  botName={formData.name || ''}
                />
              </div>
            </div>
          )}

          {/* Step 1: AI Model */}
          {currentStep === 1 && (
            <AIModelStep
              config={formData.aiModel || defaultAIModel}
              onChange={(aiModel: any) => setFormData({ ...formData, aiModel })}
            />
          )}

          {/* Step 2: System Prompt */}
          {currentStep === 2 && (
            <SystemPromptStep
              systemPrompt={formData.systemPrompt || ''}
              onChange={(systemPrompt: any) => setFormData({ ...formData, systemPrompt })}
            />
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

                {/* Drop zone */}
                <div className="border-2 border-dashed border-gray-500 rounded-xl p-8 sm:p-12 text-center cursor-pointer hover:border-orange-500/50 hover:bg-gray-800/30 transition-colors" onClick={() => inputRef.current?.click()} onDragOver={(e) => e.preventDefault()} onDrop={handleDrop}>
                  <Upload className="w-10 h-10 text-gray-500 mx-auto mb-3" />
                  <h3 className="text-base font-semibold text-foreground mb-1">Upload Documents</h3>
                  <p className="text-sm text-gray-500 mb-3">Drag and drop files or click to browse</p>
                  <Button className='bg-gray-800 hover:bg-gray-900 cursor-pointer'>Choose Files</Button>
                  <p className="text-xs text-gray-500 mt-3">Supports PDF, TXT, DOCX, CSV, MD — up to 10MB each</p>
                  <input ref={inputRef} type="file" multiple className="hidden" accept=".pdf,.txt,.docx,.csv,.md" onChange={(e) => { handleFiles(e.target.files); e.target.value = ''; }} />
                </div>

                {knowledgeFiles.length > 0 && (
                  <div className="my-3">
                    <div className="flex items-center justify-between">
                      <div className="flex h-3 my-3 items-center gap-3">
                        <Checkbox checked={selectedIds.size === knowledgeFiles.length && knowledgeFiles.length > 0} onCheckedChange={toggleAllFiles} />
                        <span className="text-sm text-muted-foreground">
                          {knowledgeFiles.length} file{knowledgeFiles.length !== 1 ? 's' : ''} uploaded
                          {selectedIds.size > 0 && <span className='text-gray-500'> · {selectedIds.size} selected</span>}
                        </span>
                      </div>
                      {selectedIds.size > 0 && (
                        <Button className='text-red-500 cursor-pointer hover:bg-red-500/20' size="sm" onClick={removeSelectedFile}>
                          <Trash2 className="w-full h-full mr-1.5" /> Remove Selected
                        </Button>
                      )}
                    </div>

                    <div className="divide-y mt-2 divide-border rounded-lg border overflow-hidden">
                      {knowledgeFiles.map((file) => (
                        <div key={file.id} className={`flex items-center gap-3 px-4 py-3 transition-colors ${selectedIds.has(file.id) ? 'bg-orange-500/5' : 'hover:bg-gray-800/40'}`}>
                          <Checkbox checked={selectedIds.has(file.id)} onCheckedChange={() => toggleSelectFile(file.id)} />
                          {getFileIcon(file.type)}
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-foreground truncate">{file.name}</p>
                            <p className="text-xs text-gray-500">{formatSize(file.size)}</p>
                          </div>
                          <Badge className="text-[10px] bg-gray-700 shrink-0">
                            {getFileExt(file.name)}
                          </Badge>
                          <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0 text-gray-500 hover:text-red-500 cursor-pointer" onClick={() => removeFile(file.id)}>
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
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

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">

        <Button className='cursor-pointer' variant="outline" onClick={goPrev} disabled={currentStep === 0}>
          <ChevronLeft className="w-4 h-4 mr-1" /> Previous
        </Button>

        <div className="text-sm text-muted-foreground">
          {currentStep + 1} / {steps.length}
        </div>

        {currentStep < steps.length - 1 ? (
          <Button className='cursor-pointer' onClick={goNext}>
            Next <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        ) : (
          <div className='flex gap-3'>
            <Link href={`/chatbot/${id}/playground`}>
              <Button className='bg-gray-800 hover:bg-gray-900 text-white cursor-pointer transition-colors duration-150' onClick={handleSave}>
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
      </div>
    </SidebarContainer>
  );
}


// {
//   id: `bot-${Date.now()}`,
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