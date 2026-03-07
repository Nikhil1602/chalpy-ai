import { LucideIcon } from "lucide-react";
import { ChangeEvent, ReactNode } from "react";

export type StorageType = 'local' | 'session';

export type ChatbotPosition = 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';

export type FontFamily = 'Inter' | 'Poppins' | 'Roboto' | 'Open Sans' | 'Lato';

export type LauncherIcon = 'message' | 'bot' | 'sparkles' | 'headphones' | 'help';

export interface LauncherConfig {
    backgroundColor: string;
    borderRadius: number;
    padding: number;
    icon: LauncherIcon;
    logoUrl: string;
    size: number;
};

export interface ThemeConfig {
    backgroundColor: string;
    gradient: string;
    gradientFrom: string;
    gradientTo: string;
    textColor: string;
    borderRadius: number;
    fontFamily: FontFamily;
    logoUrl: string;
    position: ChatbotPosition;
    accentColor: string;
    headerColor: string;
    launcher: LauncherConfig;
};

export type AIModel = 'chatgpt' | 'claude' | 'meta' | 'grok' | 'mistral' | 'gemini' | 'deepseek';

export interface AIModelConfig {
    model: AIModel;
    apiKey: string;
    modelVersion?: string;
};

export type TextModel = {
    value: string
    label: string
};

export type AIPlatform = {
    id: AIModel
    name: string
    provider: string
    description: string
    iconSrc: string
    models: TextModel[]
};

export interface Chatbot {
    id: string;
    name: string;
    description: string;
    avatar?: string;
    systemPrompt: string;
    tone: 'professional' | 'friendly' | 'casual' | 'formal';
    role: string;
    enableMemory: boolean;
    guardrails: GuardrailRule[];
    createdAt: Date;
    updatedAt: Date;
    status: 'draft' | 'active' | 'paused';
    workspaceId: string;
    theme: ThemeConfig;
    aiModel: AIModelConfig;
};

export interface GuardrailRule {
    id: string;
    name: string;
    description: string;
    enabled: boolean;
};

export interface KnowledgeSource {
    id: string;
    name: string;
    type: 'pdf' | 'text' | 'url';
    content: string;
    chunks: number;
    status: 'processing' | 'ready' | 'error';
    createdAt: Date;
    chatbotId: string;
};

export interface Message {
    id: string;
    role: 'user' | 'assistant' | 'system';
    content: string;
    timestamp: Date;
    metadata?: {
        sources?: string[];
        tokensUsed?: number;
    };
};

export interface Conversation {
    id: string;
    chatbotId: string;
    messages: Message[];
    createdAt: Date;
    updatedAt: Date;
};

export interface DeploymentConfig {
    chatbotId: string;
    embedScript: string;
    publicEndpoint: string;
    token: string;
    customization: WidgetCustomization;
};

export interface WidgetCustomization {
    primaryColor: string;
    position: 'bottom-right' | 'bottom-left';
    welcomeMessage: string;
    placeholderText: string;
    showBranding: boolean;
};

export interface Workspace {
    id: string;
    name: string;
    slug: string;
    ownerId: string;
    members: WorkspaceMember[];
    plan: 'free' | 'pro' | 'enterprise';
    createdAt: Date;
};

export interface WorkspaceMember {
    id: string;
    userId: string;
    email: string;
    name: string;
    role: 'owner' | 'admin' | 'member';
    avatar?: string;
};

export interface User {
    email: string;
    name: string;
    password: string;
    avatar?: string;
};

export interface AuthState {
    hasSignUp: boolean;
    isVerificationSend: boolean;
    isVerificationResend: boolean;
    isLoading: boolean;
};

export interface AuthContextType {
    user: User;
    authState: AuthState;
    handleAuthState: (name: "isLoading" | "hasSignUp" | "isVerificationSend" | "isVerificationResend", value: boolean) => void;
    isAuthenticated: boolean;
    login: (e: React.FormEvent) => Promise<void>;
    logout: () => void;
    signup: (e: React.FormEvent) => Promise<void>;
    forgotPassword: () => Promise<void>;
    resendVerification: () => Promise<void>;
    handleAuthChange: (e: ChangeEvent<HTMLInputElement>) => void;
};

export interface ChatbotCardProps {
    deleteChatbot: any;
    chatbot: Chatbot;
    index: number;
}

export interface ChatPreviewProps {
    theme: ThemeConfig;
    botName: string;
}

export interface Step {
    id: string;
    label: string;
    icon: React.ReactNode;
}

export interface StepIndicatorProps {
    steps: Step[];
    currentStep: number;
    completedSteps: Set<number>;
    onStepClick: (index: number) => void;
}

export interface SystemPromptStepProps {
    systemPrompt: string;
    onChange: (prompt: string) => void;
}

export interface ThemeCustomizerProps {
    theme: ThemeConfig;
    onChange: (theme: ThemeConfig) => void;
    botName: string;
}

export interface AIModelStepProps {
    config: AIModelConfig;
    onChange: (config: AIModelConfig) => void;
}

export interface AnimatedSectionProps {
    children: ReactNode;
    className?: string;
    delay?: number;
}

export interface PageHeaderProps {
    title: string;
    description?: string;
    children?: React.ReactNode;
    className?: string;
}

export interface ChatInterfaceProps {
    messages: Message[];
    isLoading: boolean;
    onSendMessage: (message: string) => void;
    placeholder?: string;
    showSources?: boolean;
}

export interface UseChatbotOptions {
    chatbotId: string;
    onMessage?: (message: Message) => void;
}

export interface MetricChartProps {
    title: string;
    data: Array<{ date: string; value: number }>;
    type?: 'area' | 'bar';
    color?: string;
}

export interface StatCardProps {
    title: string;
    value: string | number;
    change?: string;
    changeType?: 'positive' | 'negative' | 'neutral';
    icon: LucideIcon;
    index?: number;
}