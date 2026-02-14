import AnimatedSection from "./AnimatedSection";
import { Ban, DollarSign, Paintbrush, ShieldOff } from "lucide-react";

const problems = [
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

const ProblemSection = () => {
    return (
        <section className="section-padding relative">
            <div className="absolute inset-0 bg-linear-to-b from-background via-secondary/20 to-background" />
            <div className="container relative z-10 mx-auto max-w-5xl">
                <AnimatedSection className="text-center mb-16">
                    <span className="text-xs font-semibold uppercase tracking-widest text-orange-500 mb-4 block">The Problem</span>
                    <h2 className="text-3xl md:text-5xl font-bold mb-4">
                        AI Chatbots Today Are <span className="gradient-text">Broken</span>
                    </h2>
                    <p className="text-gray-500 text-lg max-w-2xl mx-auto">
                        Most chatbot platforms take your data hostage, hide costs, and give you zero control.
                    </p>
                </AnimatedSection>

                <div className="grid sm:grid-cols-2 gap-6">
                    {problems.map((problem, i) => (
                        <AnimatedSection key={problem.title} delay={i * 0.1}>
                            <div className="border border-gray-800 rounded-xl p-6 h-full group hover:border-orange-500/30 transition-colors">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500/20 text-orange-500 mb-4">
                                    <problem.icon size={20} />
                                </div>
                                <h3 className="text-lg font-semibold text-foreground mb-2">{problem.title}</h3>
                                <p className="text-sm text-gray-500 leading-relaxed">{problem.description}</p>
                            </div>
                        </AnimatedSection>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ProblemSection;
