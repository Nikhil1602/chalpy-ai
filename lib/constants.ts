import { AIModelConfig, AIPlatform, ChatbotPosition, FontFamily, GuardrailRule, LauncherConfig, ThemeConfig } from "@/types";
import { Ban, BookOpen, Bot, Brain, CheckCircle2, Cpu, DollarSign, Eye, Globe, Headphones, Key, KeyRound, Layers, LayoutDashboard, Paintbrush, Palette, Rocket, Server, Settings, Shield, ShieldCheck, ShieldOff, Target, Upload, Wrench } from "lucide-react";
import chatgptImg from "@/public/chatgpt-icon.png";
import geminiImg from "@/public/google-gemini-icon.png";
import deepseekImg from "@/public/deepseek-icon.png";
import claudeImg from "@/public/claude-ai-icon.png";
import groqImg from "@/public/grok-icon.png";
import metaImg from "@/public/meta-ai-icon.png";
import mistralImg from "@/public/mistral-ai-icon.png"

export const htmlTemplate = (templateDetails: { title: string, description: string, link: string, name: string, linkText: string }) => `
<!DOCTYPE html>
<html>
  <body style="margin:0;padding:20px;background-color:#f9fafb;font-family:Arial,Helvetica,sans-serif;">
    <table align="center" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:auto;background-color:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 4px 10px rgba(0,0,0,0.05);">
      
      <!-- Header -->
      <tr>
        <td style="background-color:#f97316;padding:30px 20px;text-align:center;">
          <img src="https://raw.githubusercontent.com/Nikhil1602/chalpy-ai/refs/heads/main/public/logo.png" alt="Logo" width="80" style="display:block;margin:auto;border-radius:12px;background:#ffffff;padding:8px;" />
        </td>
      </tr>

      <!-- Body -->
      <tr>
        <td style="padding:40px 30px;color:#1f2937;">
          <h1 style="margin:0 0 20px 0;font-size:24px;color:#111827;">
            ${templateDetails.title}
          </h1>

          <p style="font-size:16px;line-height:24px;margin-bottom:20px;color:#374151;">
            Hi ${templateDetails.name},
          </p>

          <p style="font-size:15px;line-height:24px;margin-bottom:30px;color:#4b5563;">
            ${templateDetails.description}
          </p>

          <!-- Button -->
          <div style="text-align:center;margin-bottom:30px;">
            <a href="${templateDetails.link}"
              style="background-color:#f97316;color:#ffffff;text-decoration:none;padding:14px 28px;border-radius:6px;font-size:16px;font-weight:bold;display:inline-block;">
              ${templateDetails.linkText}
            </a>
          </div>

          <p style="width:100%;display:flex;text-align:center;justify-content:center;align-items:center;font-size:13px;color:#6b7280;line-height:20px;">
            This link will expire in 48 hours.
          </p>
        </td>
      </tr>

      <!-- Divider -->
      <tr>
        <td style="border-top:1px solid #e5e7eb;"></td>
      </tr>

      <!-- Footer -->
      <tr>
        <td style="padding:30px;text-align:center;background-color:#fff7ed;">
          
          <!-- Social Icons -->
          <div style="margin-bottom:15px;">
            <a href="https://www.linkedin.com/in/nikhil-barot-508968223/" style="margin:0 10px;text-decoration:none;">
              <img src="https://cdn-icons-png.flaticon.com/512/174/174857.png" width="28" alt="LinkedIn" />
            </a>

            <a href="https://github.com/Nikhil1602" style="margin:0 10px;text-decoration:none;">
              <img src="https://cdn-icons-png.flaticon.com/512/733/733553.png" width="28" alt="GitHub" />
            </a>
          </div>

          <p style="font-size:12px;color:#6b7280;margin:0;">
            © 2026 Chalpy AI. All rights reserved.
          </p>

        </td>
      </tr>

    </table>
  </body>
</html>
`;

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
  status: "draft",
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
  provider: 'groq',
  model: 'llama-3.1-8b-instant',
  apiKey: process.env.GROQ_API_KEY || 'cx3xxxx2342S4r',
};

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function getFileExt(name: string) {
  return name.split('.').pop()?.toUpperCase() || 'FILE';
}

export const tones = [
  { value: 'professional', label: 'Professional' },
  { value: 'friendly', label: 'Friendly' },
  { value: 'casual', label: 'Casual' },
  { value: 'formal', label: 'Formal' },
];

export const defaultGuardrails: GuardrailRule[] = [
  { id: 'g1', name: 'No harmful content', description: 'Prevents generation of harmful or offensive content', enabled: true },
  { id: 'g2', name: 'Stay on topic', description: 'Keeps conversations focused on the intended purpose', enabled: true },
  { id: 'g3', name: 'No personal data collection', description: 'Avoids collecting sensitive personal information', enabled: false },
  { id: 'g4', name: 'Fact-checking', description: 'Warns users when providing uncertain information', enabled: false },
];

export const aiPlatforms: AIPlatform[] = [
  {
    id: 'chatgpt',
    name: 'ChatGPT',
    provider: 'OpenAI',
    description: 'GPT-4o, GPT-4.1',
    iconSrc: chatgptImg,
    models: [
      { value: 'gpt-4o', label: 'GPT 4o' },
      { value: 'gpt-4o-mini', label: 'GPT 4o Mini' },
      { value: 'gpt-4.1-mini', label: 'GPT 4.1 Mini' }
    ],
  },
  {
    id: 'gemini',
    name: 'Gemini',
    provider: 'Google',
    description: 'Gemini 1.5',
    iconSrc: geminiImg,
    models: [
      { value: 'gemini-1.5-pro', label: 'Gemini 1.5 Pro' },
      { value: 'gemini-1.5-flash', label: 'Gemini 1.5 Flash' },
      { value: 'gemini-2.0-flash', label: 'Gemini 2.0 Flash' },
    ],
  },
  {
    id: 'claude',
    name: 'Claude',
    provider: 'Anthropic',
    description: 'Claude 3.5',
    iconSrc: claudeImg,
    models: [
      { value: 'claude-3-haiku', label: 'Claude 3 Haiku' },
      { value: 'claude-3-sonnet', label: 'Claude 3 Sonnet' },
      { value: 'claude-3-5-sonnet', label: 'Claude 3.5 Sonnet' },
    ],
  },
  {
    id: 'meta',
    name: 'Llama',
    provider: 'Meta',
    description: 'Llama 3',
    iconSrc: metaImg,
    models: [
      { value: 'meta-llama/llama-3.1-8b-instruct', label: 'Llama 3.1 8B instruct' },
      { value: 'meta-llama/llama-3.1-70b-instruct', label: 'Llama 3.1 70B instruct' },
    ],
  },
  {
    id: 'deepseek',
    name: 'DeepSeek',
    provider: 'DeepSeek',
    description: 'DeepSeek R1, DeepSeek V3',
    iconSrc: deepseekImg,
    models: [
      { value: 'deepseek-chat', label: 'DeepSeek Chat' },
      { value: 'deepseek-coder', label: 'DeepSeek Coder' },
    ],
  },
  {
    id: 'groq',
    name: 'Groq',
    provider: 'X AI',
    description: 'Groq 1.5',
    iconSrc: groqImg,
    models: [
      { value: 'llama-3.1-8b-instant', label: 'Llama 3.1 8B instant' },
      { value: 'llama-3.1-70b-versatile', label: 'Llama 3.1 70B versatile' },
      { value: 'mixtral-8x7b-32768', label: 'Mixtral 8X7B-32768' },
    ],
  },
  {
    id: 'mistral',
    name: 'Mistral',
    provider: 'Mistral AI',
    description: 'Mistral Large',
    iconSrc: mistralImg,
    models: [
      { value: 'mistral-small', label: 'Mistral Small' },
      { value: 'mistral-medium', label: 'Mistral Medium' },
      { value: 'mistral-large', label: 'Mistral Large' },
    ],
  }
];

export const sampleMessages = [
  { role: 'assistant' as const, text: 'Hi there! 👋 How can I help you today?' },
  { role: 'user' as const, text: 'What services do you offer?' },
  { role: 'assistant' as const, text: 'We offer a wide range of AI-powered solutions including chatbot creation, knowledge management, and more!' },
];

export const personaTemplates = [
  { name: 'Customer Support', prompt: 'You are a friendly and efficient customer support agent. Always greet the user warmly, acknowledge their issue, and provide clear step-by-step solutions. If you cannot resolve the issue, escalate politely.' },
  { name: 'Sales Assistant', prompt: 'You are a knowledgeable sales assistant. Help users understand product features, compare options, and make informed decisions. Be persuasive but honest. Never pressure the user.' },
  { name: 'Technical Expert', prompt: 'You are a technical expert. Provide accurate, detailed technical explanations. Use code examples when relevant. Adapt your explanations to the user\'s apparent skill level.' },
  { name: 'Onboarding Guide', prompt: 'You are a friendly onboarding guide. Walk new users through setup and features step by step. Be patient, encouraging, and use simple language.' },
];

export const constraintSuggestions = [
  'Never share or ask for personal information like passwords or credit card numbers.',
  'Always stay on topic and redirect off-topic conversations politely.',
  'If unsure about an answer, clearly state that you are not certain.',
  'Do not make promises about features, timelines, or pricing that are not confirmed.',
  'Respond in the same language the user is writing in.',
];

export const responseFormats = [
  { name: 'Concise', instruction: 'Keep responses concise and under 3 sentences when possible.' },
  { name: 'Structured', instruction: 'Use bullet points and numbered lists for clarity. Break down complex answers into sections.' },
  { name: 'Conversational', instruction: 'Respond in a natural, conversational tone. Use casual language and occasional emojis.' },
  { name: 'Formal', instruction: 'Use formal language with proper grammar. Avoid contractions and slang.' },
];

export const gradientPresets = [
  { from: '#667eea', to: '#764ba2' },
  { from: '#f093fb', to: '#f5576c' },
  { from: '#4facfe', to: '#00f2fe' },
  { from: '#43e97b', to: '#38f9d7' },
  { from: '#fa709a', to: '#fee140' },
  { from: '#a18cd1', to: '#fbc2eb' },
];

export const fonts: { value: FontFamily; label: string }[] = [
  { value: 'Inter', label: 'Inter' },
  { value: 'Poppins', label: 'Poppins' },
  { value: 'Roboto', label: 'Roboto' },
  { value: 'Open Sans', label: 'Open Sans' },
  { value: 'Lato', label: 'Lato' },
];

export const positions: { value: ChatbotPosition; label: string }[] = [
  { value: 'bottom-right', label: 'Bottom Right' },
  { value: 'bottom-left', label: 'Bottom Left' },
  { value: 'top-right', label: 'Top Right' },
  { value: 'top-left', label: 'Top Left' },
];

export const ALLOWED_TONES = ["professional", "casual", "friendly", "formal"] as const;

export const ALLOWED_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
  "text/csv",
  "text/markdown",
]

export const footerLinks = {
  "Quick Links": [
    {
      id: 1,
      name: "Features",
      href: "#features",
    },
    {
      id: 2,
      name: "Security",
      href: "#security",
    },
    {
      id: 3,
      name: "How It Works",
      href: "#how-it-works",
    },
    {
      id: 4,
      name: "Use Cases",
      href: "#use-cases",
    }
  ],
};

export const steps = [
  {
    icon: Cpu,
    step: "01",
    title: "Select AI Model & Add API Key",
    description: "Choose from OpenAI, Anthropic, or others. Plug in your own key for full cost control.",
  },
  {
    icon: Upload,
    step: "02",
    title: "Upload Your Content",
    description: "Feed it PDFs, URLs, docs, or text. Your chatbot learns only from your data.",
  },
  {
    icon: Paintbrush,
    step: "03",
    title: "Customize Behavior & Design",
    description: "Set the tone, personality, and appearance. Match your brand perfectly.",
  },
  {
    icon: Globe,
    step: "04",
    title: "Embed on Your Website",
    description: "Copy one script tag. Your branded AI chatbot is live in seconds.",
  },
];

export const trustPoints = [
  { icon: KeyRound, text: "Bring your own API key — full ownership" },
  { icon: Shield, text: "Keys encrypted with AES-256 at rest" },
  { icon: Eye, text: "Never exposed on the frontend" },
  { icon: Server, text: "Used only for your chatbot sessions" },
  { icon: CheckCircle2, text: "No vendor lock-in — switch anytime" },
];

export const navLinks = [
  { label: "Features", href: "#features" },
  { label: "Security", href: "#security" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Use Cases", href: "#use-cases" },
];

export const problems = [
  {
    icon: ShieldOff,
    title: "Black-Box AI Tools",
    description: "No visibility into how your data is processed, stored, or used by the AI provider.",
  },
  {
    icon: DollarSign,
    title: "Unpredictable AI Costs",
    description: "Hidden markup on API usage. You're paying 3-5× more than direct model pricing.",
  },
  {
    icon: Paintbrush,
    title: "Generic Chatbot UI",
    description: "Cookie-cutter widgets that scream 'third-party tool' and erode brand trust.",
  },
  {
    icon: Ban,
    title: "No Control Over Models",
    description: "Locked into one provider's model with no way to switch or compare performance.",
  },
];

export const solutions = [
  {
    icon: Brain,
    title: "Knowledge-Only Responses",
    description: "Your chatbot only answers from your uploaded content. No hallucinations, no off-topic wandering.",
    tag: "RAG-Powered",
  },
  {
    icon: Layers,
    title: "Model-Agnostic Architecture",
    description: "Switch between OpenAI, Anthropic, or any compatible model. Compare results, optimize for cost or quality.",
    tag: "Multi-Model",
  },
  {
    icon: Key,
    title: "Bring Your Own Key",
    description: "Use your own API key for full cost transparency. Pay only what the provider charges — zero markup.",
    tag: "BYOK",
  },
  {
    icon: Palette,
    title: "Full UI Customization",
    description: "Colors, fonts, logos, position — every pixel matches your brand. Your chatbot, your design.",
    tag: "White-Label",
  },
];

export const useCases = [
  {
    icon: Headphones,
    title: "Customer Support",
    description: "Deflect 60%+ of tickets with instant, accurate responses from your knowledge base.",
    stat: "60%",
    statLabel: "fewer tickets",
  },
  {
    icon: Target,
    title: "Lead Generation",
    description: "Qualify visitors 24/7 with conversational intake forms and smart routing.",
    stat: "3×",
    statLabel: "more leads",
  },
  {
    icon: Wrench,
    title: "Internal Tools",
    description: "Give your team instant access to SOPs, policies, and technical documentation.",
    stat: "80%",
    statLabel: "faster answers",
  },
  {
    icon: Rocket,
    title: "Product Onboarding",
    description: "Guide new users through setup with contextual, AI-powered walkthroughs.",
    stat: "2×",
    statLabel: "activation rate",
  },
];

export const menuItems = [
  { id: 'menu-item-1', title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { id: 'menu-item-2', title: "Chatbot", href: "/chatbot", icon: Bot },
  { id: 'menu-item-3', title: "Guardrails", href: "/guardrails", icon: ShieldCheck },
  { id: 'menu-item-4', title: "Knowledge Base", href: "/knowledge-base", icon: BookOpen },
  { id: 'menu-item-5', title: "Settings", href: "/settings", icon: Settings },
];