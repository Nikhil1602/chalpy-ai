import Image from "next/image";
import AnimatedSection from "./AnimatedSection";

const CustomizationSection = () => {
    return (
        <section className="section-padding relative">
            <div className="absolute inset-0 bg-linear-to-b from-background via-secondary/10 to-background" />
            <div className="container relative z-10 mx-auto max-w-5xl">
                <AnimatedSection className="text-center mb-16">
                    <span className="text-xs font-semibold uppercase tracking-widest text-orange-500 mb-4 block">Customization</span>
                    <h2 className="text-3xl md:text-5xl font-bold mb-4">
                        Fully Aligned With <span className="gradient-text">Your Brand</span>
                    </h2>
                    <p className="text-gray-500 text-lg max-w-2xl mx-auto">
                        Every pixel of your chatbot can be tailored to match your brand identity.
                    </p>
                </AnimatedSection>

                <AnimatedSection delay={0.15}>
                    <div className="border border-gray-800 rounded-xl p-6 md:p-8 glow-sm">
                        <div className="grid md:grid-cols-2 gap-8">
                            {/* Controls */}
                            <div className="space-y-6">
                                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Design Controls</div>

                                {/* Colors */}
                                <div>
                                    <label className="text-sm text-foreground font-medium mb-2 block">Brand Colors</label>
                                    <div className="flex gap-3">
                                        {[
                                            "bg-orange-500", "bg-orange-700", "bg-red-600",
                                            "bg-gray-500", "bg-foreground",
                                        ].map((c, i) => (
                                            <div
                                                key={i}
                                                className={`w-8 h-8 rounded-full ${c} ${i === 0 ? "ring-2 ring-orange-500/50 ring-offset-2 ring-offset-card" : ""} cursor-pointer transition-transform hover:scale-110`}
                                            />
                                        ))}
                                    </div>
                                </div>

                                {/* Font */}
                                <div>
                                    <label className="text-sm text-gray-500 font-medium mb-2 block">Font Family</label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {["Inter", "Poppins", "Mono"].map((f, i) => (
                                            <div
                                                key={f}
                                                className={`text-center text-xs py-2 rounded-lg border cursor-pointer transition-colors ${i === 0
                                                    ? "border-orange-500/30 bg-orange-500/10 text-orange-500"
                                                    : "border-gray-800 bg-gray-900 text-gray-500 hover:text-gray-500"
                                                    }`}
                                            >
                                                {f}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Position */}
                                <div>
                                    <label className="text-sm text-gray-500 font-medium mb-2 block">Widget Position</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {["Bottom Right", "Bottom Left", "Top Right", "Top Left"].map((pos, i) => (
                                            <div
                                                key={pos}
                                                className={`text-center text-xs py-2 rounded-lg border cursor-pointer transition-colors ${i === 0
                                                    ? "border-orange-500/30 bg-orange-500/10 text-orange-500"
                                                    : "border-gray-800 bg-gray-900 text-gray-500"
                                                    }`}
                                            >
                                                {pos}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Logo */}
                                <div>
                                    <label className="text-sm text-gray-600 font-medium mb-2 block">Logo</label>
                                    <div className="flex items-center gap-3 rounded-lg border border-dashed border-gray-800 bg-gray-800/50 px-4 py-3">
                                        <div className="p-2 rounded-lg bg-orange-500/20 flex items-center justify-center text-orange-500 text-xs font-bold">
                                            <Image src="/logo.png" alt="Chalpy AI Logo" width={32} height={32} />
                                        </div>
                                        <span className="text-xs text-gray-500">logo.svg uploaded</span>
                                    </div>
                                </div>
                            </div>

                            {/* Preview */}
                            <div className="flex items-center border rounded-lg bg-gray-800/20 justify-center">
                                <div className="w-full max-w-[320px]">
                                    <div className="rounded-2xl border border-orange-500/20 bg-card overflow-hidden glow-sm">
                                        {/* Header */}
                                        <div className="bg-orange-500/10 px-4 py-3 flex items-center gap-2">
                                            {/* <div className="w-6 h-6 p-1 rounded-full bg-orange-500/20 flex items-center justify-center text-[10px] text-primary font-bold"> */}
                                            <Image src="/logo.png" alt="Chalpy AI Logo" width={30} height={30} />
                                            {/* </div> */}
                                            <span className="text-sm font-semibold text-foreground">Chalpy Bot</span>
                                            <div className="ml-auto w-2 h-2 rounded-full bg-orange-500" />
                                        </div>

                                        {/* Messages */}
                                        <div className="p-3 space-y-2.5 min-h-[200px]">
                                            <div className="flex justify-start">
                                                <div className="rounded-xl rounded-bl-sm bg-gray-900 px-3 py-2 max-w-[85%]">
                                                    <span className="text-xs text-gray-500">👋 Hi! How can I help you today?</span>
                                                </div>
                                            </div>
                                            <div className="flex justify-end">
                                                <div className="rounded-xl rounded-br-sm bg-orange-500/10 border border-orange-500/20 px-3 py-2 max-w-[85%]">
                                                    <span className="text-xs text-foreground">What pricing plans do you offer?</span>
                                                </div>
                                            </div>
                                            <div className="flex justify-start">
                                                <div className="rounded-xl rounded-bl-sm bg-gray-900 px-3 py-2 max-w-[85%]">
                                                    <span className="text-xs text-gray-500">We offer Starter, Pro, and Enterprise plans starting at $29/mo.</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Input */}
                                        <div className="border-t border-border/50 px-3 py-2">
                                            <div className="flex items-center gap-2 rounded-lg bg-gray-800/50 px-3 py-2">
                                                <span className="text-xs text-gray-500 flex-1">Ask anything...</span>
                                                <div className="w-6 h-6 rounded-md bg-orange-500 flex items-center justify-center text-primary-foreground text-[10px]">↑</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </AnimatedSection>
            </div>
        </section>
    );
};

export default CustomizationSection;
