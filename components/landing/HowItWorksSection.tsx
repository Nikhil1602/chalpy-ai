import AnimatedSection from "./AnimatedSection";
import { Cpu, Upload, Paintbrush, Globe } from "lucide-react";

const steps = [
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

const HowItWorksSection = () => {
    return (
        <section id="how-it-works" className="section-padding">
            <div className="container mx-auto max-w-5xl">
                <AnimatedSection className="text-center mb-16">
                    <span className="text-xs font-semibold uppercase tracking-widest text-orange-500 mb-4 block">How It Works</span>
                    <h2 className="text-3xl md:text-5xl font-bold mb-4">
                        Live in <span className="gradient-text">Four Steps</span>
                    </h2>
                    <p className="text-gray-500 text-lg max-w-2xl mx-auto">
                        From zero to deployed chatbot in under 10 minutes.
                    </p>
                </AnimatedSection>

                <div className="relative">
                    {/* Connecting line */}
                    {/* <div className="absolute left-8 top-0 bottom-0 w-px bg-orange-500 hidden md:block" /> */}

                    <div className="space-y-8">
                        {steps.map((step, i) => (
                            <AnimatedSection key={step.step} delay={i * 0.12}>
                                <div className="flex gap-6 items-start group">
                                    <div className="relative z-10 flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gray-900 border border-gray-700 group-hover:border-orange-500/40 transition-colors">
                                        <step.icon size={24} className="text-orange-500" />
                                    </div>
                                    <div className="pt-2">
                                        <span className="text-xs font-mono text-orange-500 mb-1 block">{step.step}</span>
                                        <h3 className="text-lg font-semibold text-foreground mb-1">{step.title}</h3>
                                        <p className="text-sm text-gray-500 leading-relaxed">{step.description}</p>
                                    </div>
                                </div>
                            </AnimatedSection>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HowItWorksSection;
