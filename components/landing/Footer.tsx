import Image from "next/image";
import Link from "next/link";

const footerLinks = {
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

const Footer = () => {
    return (
        <footer className="border-t border-gray-600/40 bg-card/30">
            <div className="container mx-auto px-4 md:px-8 py-12">
                <div className="flex w-full justify-between">
                    {/* Brand */}
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            {/* <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500/20">
                                <span className="text-lg font-bold text-orange-500">⚡</span>
                            </div>
                            <span className="text-lg font-bold text-foreground">ChatForge</span> */}
                            <Image src="/logo.png" alt="Chalpy AI Logo" width={45} height={45} />
                        </div>
                        <p className="text-sm text-gray-500 leading-relaxed">
                            Build branded AI chatbots trained on your data — powered by your AI models.
                        </p>
                    </div>

                    {/* Links */}
                    {Object.entries(footerLinks).map(([category, links]) => (
                        <div key={category}>
                            <h4 className="text-sm font-semibold text-foreground mb-4">{category}</h4>
                            <ul className="space-y-2">
                                {links.map((link) => (
                                    <li key={link.id}>
                                        <Link href={link.href} className="text-sm text-gray-500 hover:text-foreground transition-colors">
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="mt-12 pt-6 border-t border-gray-600/40 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-xs text-gray-500">
                        © 2026 Chalpy AI. All rights reserved.
                    </p>
                    <div className="flex items-center gap-4">
                        <Link target="_blank" href="https://github.com/Nikhil1602" className="text-xs text-muted-foreground hover:text-orange-500 transition-colors">GitHub</Link>
                        <Link target="_blank" href="https://www.linkedin.com/in/nikhil-barot-508968223/" className="text-xs text-muted-foreground hover:text-orange-500 transition-colors">Linkedin</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
