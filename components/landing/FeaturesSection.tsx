import AnimatedSection from "./AnimatedSection";
import { FileText, Search, Cpu, Lock, Palette, Eye, Code2, BarChart3 } from "lucide-react";

const features = [
    { icon: FileText, title: "Upload Knowledge", description: "PDFs, URLs, docs — feed your chatbot any content source." },
    { icon: Search, title: "Vector Search (RAG)", description: "Semantic retrieval ensures accurate, relevant responses." },
    { icon: Cpu, title: "AI Model Selection", description: "Choose OpenAI, Anthropic, or any compatible provider." },
    { icon: Lock, title: "Secure API Key Input", description: "Encrypted at rest, never exposed to the frontend." },
    { icon: Palette, title: "UI Customization", description: "Colors, fonts, logos — make it unmistakably yours." },
    { icon: Eye, title: "Live Preview", description: "See your chatbot update in real-time as you configure it." },
    { icon: Code2, title: "Widget Deployment", description: "One script tag. Embed anywhere in minutes." },
    { icon: BarChart3, title: "Analytics Dashboard", description: "Track conversations, satisfaction, and engagement." },
];

const FeaturesSection = () => {
    return (
        <section id="features" className="section-padding relative">
            <div className="absolute inset-0 bg-linear-to-b from-background via-secondary/10 to-background" />
            <div className="container relative z-10 mx-auto max-w-6xl">
                <AnimatedSection className="text-center mb-16">
                    <span className="text-xs font-semibold uppercase tracking-widest text-orange-500 mb-4 block">Features</span>
                    <h2 className="text-3xl md:text-5xl font-bold mb-4">
                        Everything You Need to <span className="gradient-text">Ship Fast</span>
                    </h2>
                    <p className="text-gray-500 text-lg max-w-2xl mx-auto">
                        From data ingestion to deployment — a complete chatbot platform.
                    </p>
                </AnimatedSection>

                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {features.map((feat, i) => (
                        <AnimatedSection key={feat.title} delay={i * 0.06}>
                            <div className="border border-gray-800 rounded-xl p-5 h-full group hover:border-orange-500/30 transition-all hover:glow-sm">
                                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-500/20 text-orange-500 mb-3 group-hover:bg-orange-500/30 transition-colors">
                                    <feat.icon size={18} />
                                </div>
                                <h3 className="text-sm font-semibold text-foreground mb-1.5">{feat.title}</h3>
                                <p className="text-xs text-gray-500 leading-relaxed">{feat.description}</p>
                            </div>
                        </AnimatedSection>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeaturesSection;
