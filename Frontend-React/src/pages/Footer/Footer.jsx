import { Link } from "react-router-dom";
import { Twitter, Github, Linkedin } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

const Footer = () => {
    const currentYear = new Date().getFullYear();
    const { theme } = useTheme();
    const isLight = theme === "light";

    const links = [
        { name: "Markets", path: "/" },
        { name: "Portfolio", path: "/portfolio" },
        { name: "Watchlist", path: "/watchlist" },
        { name: "Activity", path: "/activity" },
    ];

    const socialLinks = [
        { icon: Twitter, href: "https://twitter.com" },
        { icon: Github, href: "https://github.com" },
        { icon: Linkedin, href: "https://linkedin.com" },
    ];

    return (
        <footer className={`border-t ${isLight ? "border-gray-200" : "border-neutral-800"}`}>
            <div className="max-w-6xl mx-auto px-4 py-12">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    {/* Logo */}
                    <div className={`text-lg font-semibold ${isLight ? "text-gray-900" : "text-white"}`}>
                        CoinX
                    </div>

                    {/* Links */}
                    <div className="flex items-center gap-6">
                        {links.map((link) => (
                            <Link
                                key={link.name}
                                to={link.path}
                                className={`text-sm transition-colors ${isLight
                                    ? "text-gray-500 hover:text-gray-900"
                                    : "text-neutral-500 hover:text-white"
                                    }`}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>

                    {/* Social */}
                    <div className="flex items-center gap-3">
                        {socialLinks.map((social, index) => (
                            <a
                                key={index}
                                href={social.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`h-8 w-8 rounded-lg flex items-center justify-center transition-all ${isLight
                                    ? "bg-gray-100 text-gray-500 hover:text-gray-900 hover:bg-gray-200"
                                    : "bg-neutral-800/50 text-neutral-500 hover:text-white hover:bg-neutral-800"
                                    }`}
                            >
                                <social.icon className="h-4 w-4" />
                            </a>
                        ))}
                    </div>
                </div>

                {/* Copyright */}
                <div className={`mt-8 pt-6 border-t text-center ${isLight ? "border-gray-200" : "border-neutral-800/50"}`}>
                    <p className={`text-sm ${isLight ? "text-gray-500" : "text-neutral-600"}`}>
                        © 2025 CoinX. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
