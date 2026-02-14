import AnimatedSection from "./AnimatedSection";
import { Brain, Key, Layers, Palette } from "lucide-react";

const solutions = [
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

const SolutionSection = () => {
    return (
        <section className="section-padding">
            <div className="container mx-auto max-w-5xl">
                <AnimatedSection className="text-center mb-16">
                    <span className="text-xs font-semibold uppercase tracking-widest text-orange-500 mb-4 block">The Solution</span>
                    <h2 className="text-3xl md:text-5xl font-bold mb-4">
                        AI Chatbots <span className="gradient-text">You Actually Own</span>
                    </h2>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        Full control over your AI model, your data, your brand, and your costs.
                    </p>
                </AnimatedSection>

                <div className="grid md:grid-cols-2 gap-6">
                    {solutions.map((sol, i) => (
                        <AnimatedSection key={sol.title} delay={i * 0.1}>
                            <div className="border border-gray-800 rounded-xl p-6 h-full group hover:border-orange-500/30 transition-colors relative overflow-hidden">
                                <div className="absolute top-4 right-4">
                                    <span className="text-[10px] font-semibold uppercase tracking-wider text-orange-500 bg-orange-500/20 px-2.5 py-1 rounded-full">
                                        {sol.tag}
                                    </span>
                                </div>
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500/20 text-orange-500 mb-4">
                                    <sol.icon size={20} />
                                </div>
                                <h3 className="text-lg font-semibold text-foreground mb-2">{sol.title}</h3>
                                <p className="text-sm text-gray-500 leading-relaxed">{sol.description}</p>
                            </div>
                        </AnimatedSection>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default SolutionSection;
