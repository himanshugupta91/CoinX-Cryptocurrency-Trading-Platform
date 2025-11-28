import { Link } from "react-router-dom";
import { Twitter, Github, Linkedin, Mail, TrendingUp, Shield, Zap } from "lucide-react";

const Footer = () => {
    const currentYear = new Date().getFullYear();

    const footerLinks = {
        product: [
            { name: "Markets", path: "/" },
            { name: "Portfolio", path: "/portfolio" },
            { name: "Watchlist", path: "/watchlist" },
            { name: "Activity", path: "/activity" },
        ],
        company: [
            { name: "About Us", path: "#" },
            { name: "Careers", path: "#" },
            { name: "Blog", path: "#" },
            { name: "Press", path: "#" },
        ],
        support: [
            { name: "Help Center", path: "#" },
            { name: "Contact Us", path: "#" },
            { name: "API Docs", path: "#" },
            { name: "Status", path: "#" },
        ],
        legal: [
            { name: "Privacy Policy", path: "#" },
            { name: "Terms of Service", path: "#" },
            { name: "Cookie Policy", path: "#" },
            { name: "Disclaimer", path: "#" },
        ],
    };

    const socialLinks = [
        { icon: Twitter, href: "#", label: "Twitter" },
        { icon: Github, href: "#", label: "GitHub" },
        { icon: Linkedin, href: "#", label: "LinkedIn" },
        { icon: Mail, href: "#", label: "Email" },
    ];

    const features = [
        { icon: TrendingUp, text: "Real-time Market Data" },
        { icon: Shield, text: "Bank-level Security" },
        { icon: Zap, text: "Lightning Fast Trades" },
    ];

    return (
        <footer className="relative mt-20 border-t border-purple-500/20 overflow-hidden">
            {/* Gradient background */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-500/5 to-transparent pointer-events-none"></div>

            {/* Animated gradient orbs */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-400/10 rounded-full blur-3xl animate-pulse-slow"></div>
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-400/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }}></div>

            <div className="relative max-w-7xl mx-auto px-5 py-12">
                {/* Top Section - Brand & Features */}
                <div className="mb-12 pb-8 border-b border-purple-500/20">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                        {/* Brand */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-cyan-400 to-pink-400 flex items-center justify-center shadow-lg">
                                    <span className="text-2xl font-bold">C</span>
                                </div>
                                <h3 className="text-2xl font-bold gradient-text">CoinX</h3>
                            </div>
                            <p className="text-gray-400 max-w-md">
                                Your trusted platform for cryptocurrency trading. Experience the future of digital finance with cutting-edge technology and unparalleled security.
                            </p>
                        </div>

                        {/* Features */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {features.map((feature, index) => (
                                <div
                                    key={index}
                                    className="glass-card p-4 rounded-xl hover-lift border border-cyan-400/20 animate-fadeIn"
                                    style={{ animationDelay: `${index * 0.1}s` }}
                                >
                                    <feature.icon className="h-6 w-6 text-cyan-400 mb-2" />
                                    <p className="text-sm text-gray-300">{feature.text}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Middle Section - Links */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
                    {/* Product */}
                    <div className="space-y-4">
                        <h4 className="font-semibold text-white text-lg">Product</h4>
                        <ul className="space-y-2">
                            {footerLinks.product.map((link, index) => (
                                <li key={index}>
                                    <Link
                                        to={link.path}
                                        className="text-gray-400 hover:text-cyan-400 transition-colors duration-200 text-sm hover:translate-x-1 inline-block"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Company */}
                    <div className="space-y-4">
                        <h4 className="font-semibold text-white text-lg">Company</h4>
                        <ul className="space-y-2">
                            {footerLinks.company.map((link, index) => (
                                <li key={index}>
                                    <a
                                        href={link.path}
                                        className="text-gray-400 hover:text-purple-400 transition-colors duration-200 text-sm hover:translate-x-1 inline-block"
                                    >
                                        {link.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Support */}
                    <div className="space-y-4">
                        <h4 className="font-semibold text-white text-lg">Support</h4>
                        <ul className="space-y-2">
                            {footerLinks.support.map((link, index) => (
                                <li key={index}>
                                    <a
                                        href={link.path}
                                        className="text-gray-400 hover:text-purple-400 transition-colors duration-200 text-sm hover:translate-x-1 inline-block"
                                    >
                                        {link.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Legal */}
                    <div className="space-y-4">
                        <h4 className="font-semibold text-white text-lg">Legal</h4>
                        <ul className="space-y-2">
                            {footerLinks.legal.map((link, index) => (
                                <li key={index}>
                                    <a
                                        href={link.path}
                                        className="text-gray-400 hover:text-purple-400 transition-colors duration-200 text-sm hover:translate-x-1 inline-block"
                                    >
                                        {link.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Bottom Section - Social & Copyright */}
                <div className="pt-8 border-t border-purple-500/20">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                        {/* Social Links */}
                        <div className="flex items-center gap-4">
                            {socialLinks.map((social, index) => (
                                <a
                                    key={index}
                                    href={social.href}
                                    aria-label={social.label}
                                    className="h-10 w-10 rounded-full glass-card flex items-center justify-center hover-lift border border-cyan-400/20 hover:border-cyan-400/50 transition-all duration-300 group"
                                >
                                    <social.icon className="h-5 w-5 text-gray-400 group-hover:text-cyan-400 transition-colors duration-200" />
                                </a>
                            ))}
                        </div>

                        {/* Copyright */}
                        <div className="text-center md:text-right">
                            <p className="text-gray-400 text-sm">
                                © {currentYear} CoinX. All rights reserved.
                            </p>
                            <p className="text-gray-500 text-xs mt-1">
                                Built with ❤️ for the crypto community
                            </p>
                        </div>
                    </div>
                </div>

                {/* Newsletter Section (Optional) */}
                <div className="mt-12 glass-card p-6 rounded-2xl border border-cyan-400/20 hover-lift">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <div>
                            <h4 className="font-semibold text-white text-lg mb-1">Stay Updated</h4>
                            <p className="text-gray-400 text-sm">Get the latest crypto news and market insights</p>
                        </div>
                        <div className="flex gap-2 w-full md:w-auto">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="px-4 py-2 rounded-lg bg-slate-800/50 border border-cyan-400/30 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 flex-1 md:w-64"
                            />
                            <button className="px-6 py-2 rounded-lg btn-gradient font-semibold hover:scale-105 transition-transform duration-200 whitespace-nowrap">
                                Subscribe
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
