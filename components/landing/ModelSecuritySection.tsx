import AnimatedSection from "./AnimatedSection";
import { Shield, Eye, Server, KeyRound, CheckCircle2 } from "lucide-react";

const trustPoints = [
    { icon: KeyRound, text: "Bring your own API key — full ownership" },
    { icon: Shield, text: "Keys encrypted with AES-256 at rest" },
    { icon: Eye, text: "Never exposed on the frontend" },
    { icon: Server, text: "Used only for your chatbot sessions" },
    { icon: CheckCircle2, text: "No vendor lock-in — switch anytime" },
];

const ModelSecuritySection = () => {
    return (
        <section id="security" className="section-padding">
            <div className="container mx-auto max-w-5xl">
                <AnimatedSection className="text-center mb-16">
                    <span className="text-xs font-semibold uppercase tracking-widest text-orange-500 mb-4 block">Security & Trust</span>
                    <h2 className="text-3xl md:text-5xl font-bold mb-4">
                        Your Model. Your Key.{" "}
                        <span className="gradient-text">Your Rules.</span>
                    </h2>
                    <p className="text-gray-500 text-lg max-w-2xl mx-auto">
                        We never train on your data. Your API key stays encrypted and is only used for your chatbot.
                    </p>
                </AnimatedSection>

                <div className="grid md:grid-cols-2 gap-8 items-center">
                    <AnimatedSection>
                        <div className="space-y-4">
                            {trustPoints.map((point) => (
                                <div key={point.text} className="flex items-start gap-3 group">
                                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-orange-500/20 text-orange-500">
                                        <point.icon size={16} />
                                    </div>
                                    <span className="text-sm text-gray-500 leading-relaxed pt-1">{point.text}</span>
                                </div>
                            ))}
                        </div>
                    </AnimatedSection>

                    <AnimatedSection delay={0.2}>
                        <div className="border border-gray-800 rounded-xl p-6 glow-sm">
                            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
                                Model Configuration
                            </div>
                            <div className="space-y-4">
                                {/* Provider Select */}
                                <div>
                                    <label className="text-xs text-gray-500 mb-1 block">AI Provider</label>
                                    <div className="flex gap-2">
                                        <div className="flex-1 rounded-lg bg-orange-500/10 border border-orange-500/30 px-4 py-2.5 text-sm font-medium text-orange-500 text-center">
                                            OpenAI
                                        </div>
                                        <div className="flex-1 rounded-lg bg-gray-900 border border-gray-800 px-4 py-2.5 text-sm text-gray-500 text-center">
                                            Anthropic
                                        </div>
                                    </div>
                                </div>

                                {/* Model Select */}
                                <div>
                                    <label className="text-xs text-gray-500 mb-1 block">Model</label>
                                    <div className="rounded-lg bg-gray-900 border border-border px-4 py-2.5 text-sm text-foreground flex justify-between items-center">
                                        <span>GPT-4o</span>
                                        <span className="text-xs text-orange-500">Recommended</span>
                                    </div>
                                </div>

                                {/* API Key */}
                                <div>
                                    <label className="text-xs text-gray-500 mb-1 block">API Key</label>
                                    <div className="rounded-lg bg-gray-900 border border-border px-4 py-2.5 flex items-center gap-2">
                                        <span className="text-sm font-mono text-gray-500 flex-1">sk-••••••••••••••••3kF9</span>
                                        <Shield size={14} className="text-orange-500" />
                                    </div>
                                </div>

                                {/* Status */}
                                <div className="flex items-center gap-2 rounded-lg bg-orange-500/5 border border-orange-500/20 px-3 py-2">
                                    <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                                    <span className="text-xs text-orange-500 font-medium">Key verified & encrypted</span>
                                </div>
                            </div>
                        </div>
                    </AnimatedSection>
                </div>
            </div>
        </section>
    );
};

export default ModelSecuritySection;
