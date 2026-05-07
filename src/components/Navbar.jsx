import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { HiMenu, HiX } from 'react-icons/hi';
import { BiChevronDown, BiArrowToRight } from 'react-icons/bi';

const Navbar = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();

    // Handle scroll for glassmorphism effect
    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close mobile menu on route change
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [location]);

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'EMI Calculator', path: '/emi-calculator' },
        { name: 'Image Tools', path: '/image-resizer' },
        { name: 'Text Tools', path: '/words-case-converter' },
    ];

    return (
        <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${scrolled
            ? 'bg-[var(--bg-dark)]/90 backdrop-blur-md py-3 border-b border-white/10'
            : 'bg-transparent py-5'
            }`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 group">
                        {/* <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--primary)] to-[var(--primary-dark)] flex items-center justify-center text-slate-900 text-lg font-black shadow-lg shadow-[var(--primary)]/20 group-hover:scale-110 transition-transform">
                            PTZ
                        </div> */}
                        <span className="font-bold text-xl text-gray-600 tracking-wide">
                            <span className="text-cyan-400"> PTZ</span> Tools
                        </span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.path}
                                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${location.pathname === link.path
                                    ? 'text-[var(--primary)] bg-white/5'
                                    : 'text-gray-600 hover:text-[var(--primary)]'
                                    }`}
                            >
                                {link.name}
                            </Link>
                        ))}

                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-all"
                        >
                            {isMobileMenuOpen ? <HiX className="w-6 h-6" /> : <HiMenu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <div className={`md:hidden absolute top-full left-0 right-0 bg-[var(--bg-dark)] border-b border-white/10 transition-all duration-300 overflow-hidden ${isMobileMenuOpen ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'
                }`}>
                <div className="px-4 py-6 space-y-2">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            to={link.path}
                            className={`block px-4 py-3 rounded-xl text-base font-semibold transition-all ${location.pathname === link.path
                                ? 'text-[var(--primary)] bg-white/5'
                                : 'text-gray-600 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            {link.name}
                        </Link>
                    ))}
                    {/* <Link
                        to="/emi-calculator"
                        className="flex items-center justify-center gap-2 w-full mt-4 p-4 rounded-xl bg-[var(--gradient-primary)] text-slate-900 font-bold"
                    >
                        Get Started <BiArrowToRight />
                    </Link> */}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;

