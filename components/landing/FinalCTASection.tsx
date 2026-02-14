import Link from "next/link";
import AnimatedSection from "./AnimatedSection";
import { ArrowRight, Shield } from "lucide-react";

const FinalCTASection = () => {
    return (
        <section id="cta" className="section-padding relative overflow-hidden">
            {/* Glow */}
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-[500px] h-[500px] rounded-full bg-orange-500/8 blur-[150px]" />
            </div>

            <div className="container relative z-10 mx-auto max-w-3xl text-center">
                <AnimatedSection>
                    <div className="border border-gray-800 rounded-2xl p-10 md:p-16 glow-md">
                        <div className="flex justify-center mb-6">
                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-500/10 glow-sm">
                                <Shield size={28} className="text-orange-500" />
                            </div>
                        </div>

                        <h2 className="text-3xl md:text-5xl font-bold mb-4">
                            Build Your AI Chatbot
                            <br />
                            <span className="gradient-text">With Full Control</span>
                        </h2>

                        <p className="text-gray-500 text-lg max-w-xl mx-auto mb-8">
                            Your model. Your data. Your brand. No lock-in, no hidden costs, no black boxes.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link href="#" className="group flex items-center gap-2 rounded-xl bg-orange-500 px-8 py-4 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90 glow-md">
                                Get Started Free
                                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                            </Link>
                        </div>

                        <p className="text-xs text-gray-500 mt-6">
                            Free plan available · No credit card required · Setup in minutes
                        </p>
                    </div>
                </AnimatedSection>
            </div>
        </section>
    );
};

export default FinalCTASection;
