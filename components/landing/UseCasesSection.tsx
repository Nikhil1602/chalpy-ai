import AnimatedSection from "./AnimatedSection";
import { Headphones, Target, Wrench, Rocket } from "lucide-react";

const useCases = [
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

const UseCasesSection = () => {
    return (
        <section id="use-cases" className="section-padding relative">
            <div className="absolute inset-0 bg-linear-to-b from-background via-secondary/10 to-background" />
            <div className="container relative z-10 mx-auto max-w-5xl">
                <AnimatedSection className="text-center mb-16">
                    <span className="text-xs font-semibold uppercase tracking-widest text-orange-600 mb-4 block">Use Cases</span>
                    <h2 className="text-3xl md:text-5xl font-bold mb-4">
                        Built for <span className="gradient-text">Real Teams</span>
                    </h2>
                    <p className="text-gray-500 text-lg max-w-2xl mx-auto">
                        From support to sales — deploy AI where it matters most.
                    </p>
                </AnimatedSection>

                <div className="grid sm:grid-cols-2 gap-6">
                    {useCases.map((uc, i) => (
                        <AnimatedSection key={uc.title} delay={i * 0.1}>
                            <div className="border border-gray-800 rounded-xl p-6 h-full group hover:border-orange-500/30 transition-colors">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500/20 text-orange-500">
                                        <uc.icon size={20} />
                                    </div>
                                    <div className="text-right">
                                        <div className="text-2xl font-bold gradient-text">{uc.stat}</div>
                                        <div className="text-[10px] text-gray-500 uppercase tracking-wider">{uc.statLabel}</div>
                                    </div>
                                </div>
                                <h3 className="text-lg font-semibold text-foreground mb-2">{uc.title}</h3>
                                <p className="text-sm text-gray-500 leading-relaxed">{uc.description}</p>
                            </div>
                        </AnimatedSection>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default UseCasesSection;
