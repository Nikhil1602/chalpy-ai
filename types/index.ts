import { IconType } from "react-icons"

export type PackageTypes = {
    id: number,
    name: string,
    Icon: IconType
}[];

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
}

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
}

export type AIModel = 'chatgpt' | 'claude' | 'meta' | 'grok' | 'mistral' | 'gemini' | 'deepseek';

export interface AIModelConfig {
    model: AIModel;
    apiKey: string;
    modelVersion?: string;
}

export type TextModel = {
    value: string
    label: string
}

export type AIPlatform = {
    id: AIModel
    name: string
    provider: string
    description: string
    iconSrc: string
    models: TextModel[]
}

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
}

export const defaultLauncher: LauncherConfig = {
    backgroundColor: '#667eea',
    borderRadius: 50,
    padding: 8,
    icon: 'message',
    logoUrl: '',
    size: 56,
};

export const defaultTheme: ThemeConfig = {
    backgroundColor: '#ffffff',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    gradientFrom: '#667eea',
    gradientTo: '#764ba2',
    textColor: '#1a1a2e',
    borderRadius: 16,
    fontFamily: 'Inter',
    logoUrl: '',
    position: 'bottom-right',
    accentColor: '#667eea',
    headerColor: '#667eea',
    launcher: defaultLauncher,
};

export const defaultAIModel: AIModelConfig = {
    model: 'chatgpt',
    apiKey: '',
};

export interface GuardrailRule {
    id: string;
    name: string;
    description: string;
    enabled: boolean;
}

export interface KnowledgeSource {
    id: string;
    name: string;
    type: 'pdf' | 'text' | 'url';
    content: string;
    chunks: number;
    status: 'processing' | 'ready' | 'error';
    createdAt: Date;
    chatbotId: string;
}

export interface Message {
    id: string;
    role: 'user' | 'assistant' | 'system';
    content: string;
    timestamp: Date;
    metadata?: {
        sources?: string[];
        tokensUsed?: number;
    };
}

export interface Conversation {
    id: string;
    chatbotId: string;
    messages: Message[];
    createdAt: Date;
    updatedAt: Date;
}

export interface DeploymentConfig {
    chatbotId: string;
    embedScript: string;
    publicEndpoint: string;
    token: string;
    customization: WidgetCustomization;
}

export interface WidgetCustomization {
    primaryColor: string;
    position: 'bottom-right' | 'bottom-left';
    welcomeMessage: string;
    placeholderText: string;
    showBranding: boolean;
}

export interface Workspace {
    id: string;
    name: string;
    slug: string;
    ownerId: string;
    members: WorkspaceMember[];
    plan: 'free' | 'pro' | 'enterprise';
    createdAt: Date;
}

export interface WorkspaceMember {
    id: string;
    userId: string;
    email: string;
    name: string;
    role: 'owner' | 'admin' | 'member';
    avatar?: string;
}

export interface User {
    id: string;
    email: string;
    name: string;
    avatar?: string;
    workspaces: string[];
}
