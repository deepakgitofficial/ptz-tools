import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';

import {
    BiCalculator, BiChevronDown, BiHome, BiMoney,
    BiSolidCalculator, BiSolidPaintRoll, BiX, BiCrop,
    BiImage, BiTransfer, BiText,
    BiSolidPackage, BiSearch,
} from 'react-icons/bi';
import { FaBaby, FaBirthdayCake, FaCompressAlt, FaExchangeAlt, FaRulerCombined } from 'react-icons/fa';
import { HiSparkles } from 'react-icons/hi';
import { FaLaptopCode } from "react-icons/fa";
import { GoCodeSquare } from "react-icons/go";
import { AiFillAmazonCircle } from "react-icons/ai";

const sideMenu = [
    {
        name: 'Useful Tools',
        icon: <BiSolidCalculator />,
        dropdown: true,
        children: [
            { name: 'Amazon Fees Calculator', link: '/amazon-fees-calculator', icon: <AiFillAmazonCircle /> },
            { name: 'EMI Calculator', link: '/emi-calculator', icon: <BiCalculator /> },
            { name: 'GST Calculator', link: '/gst-calculator', icon: <BiCalculator /> },
            { name: 'PPF Calculator', link: '/ppf-calculator', icon: <BiMoney /> },
            { name: 'Land Area Calculator', link: '/land-area-calculator', icon: <FaRulerCombined /> },
            { name: 'Pregnancy Due Date', link: '/pregnancy-due-date-calculator', icon: <FaBaby /> },
            { name: 'Age Calculator', link: '/age-calculator', icon: <FaBirthdayCake /> },
            { name: 'Currency Converter', link: '/currency-converter', icon: <FaExchangeAlt /> },
        ],
    },
    {
        name: 'Image Processing',
        icon: <BiSolidPaintRoll />,
        dropdown: true,
        children: [
            { name: 'Image Resizer', link: '/image-resizer', icon: <BiImage /> },
            { name: 'Image Compressor', link: '/image-compressor', icon: <FaCompressAlt /> },
            { name: 'Image Cropper', link: '/image-cropper', icon: <BiCrop /> },
            { name: 'Image Converter', link: '/image-converter', icon: <BiTransfer /> },
            { name: 'Image to Text OCR', link: '/image-to-text-ocr', icon: <BiText /> },
            { name: 'Watermark Add', link: '/watermark-adder', icon: <BiText /> },
            { name: 'Passport Size Photo Maker', link: '/passport-size-photo-maker', icon: <BiText /> },
        ],
    },
    {
        name: "Text Tools",
        icon: <BiSolidPackage />,
        dropdown: true,
        children: [
            { name: 'Words Case Converter', link: '/words-case-converter', icon: <BiHome /> },
            { name: 'Compare Between', link: '/diff-checker', icon: <BiHome /> },
        ],
    },
    {
        name: "Developer Tools",
        icon: <FaLaptopCode />,
        dropdown: true,
        children: [
            { name: 'Code Minifier', link: '/code-minifier', icon: <GoCodeSquare /> },
            { name: 'Code Unminifier', link: '/code-unminifier', icon: <GoCodeSquare /> },
            { name: 'Color Palette Generator', link: '/color-palette-generator', icon: <GoCodeSquare /> },
            { name: 'Pro Color Palette Generator', link: '/pro-color-palette-generator', icon: <GoCodeSquare /> },
            { name: 'Font Pairing Tool', link: '/font-pairing-tool', icon: <GoCodeSquare /> },
        ],
    },
];

const Sidebar = ({ isOpen, onClose }) => {
    const [openIndex, setOpenIndex] = useState(0); // default open first group
    const [searchQuery, setSearchQuery] = useState('');
    const searchInputRef = useRef(null);
    const location = useLocation();

    const currentYear = new Date().getFullYear();

    // Auto-expand group that contains active link on mount/route-change
    useEffect(() => {
        const activeGroupIndex = sideMenu.findIndex((group) =>
            group.children.some((child) => child.link === location.pathname)
        );
        if (activeGroupIndex !== -1) {
            setOpenIndex(activeGroupIndex);
        }
    }, [location.pathname]);

    // Keyboard shortcut listener for focusing search (pressing '/')
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (
                document.activeElement.tagName === 'INPUT' ||
                document.activeElement.tagName === 'TEXTAREA' ||
                document.activeElement.isContentEditable
            ) {
                return;
            }
            if (e.key === '/') {
                e.preventDefault();
                searchInputRef.current?.focus();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const handleToggle = (index) => {
        setOpenIndex((prev) => (prev === index ? null : index));
    };

    // Filter tools across all categories based on search input
    const filteredTools = useMemo(() => {
        if (!searchQuery.trim()) return [];
        const query = searchQuery.toLowerCase();
        const results = [];
        sideMenu.forEach((group) => {
            group.children.forEach((child) => {
                if (
                    child.name.toLowerCase().includes(query) ||
                    group.name.toLowerCase().includes(query)
                ) {
                    results.push({ ...child, categoryName: group.name });
                }
            });
        });
        return results;
    }, [searchQuery]);

    return (
        <>
            <aside
                className={`
                    fixed top-0 left-0 z-30 h-full flex flex-col
                    w-[260px] bg-gray-800
                    border-r border-white/5 
                    transition-transform duration-300 ease-in-out
                    lg:static lg:translate-x-0 lg:flex
                    ${isOpen ? 'translate-x-0' : '-translate-x-full'}
                `}
                style={{ height: "100vh" }}
            >
                {/* ── Logo ────────────────────────────────────────────────── */}
                <div className="flex items-center justify-between px-5 py-5 border-b border-white/5">
                    <Link to="/" className="group/logo">
                        <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--primary)] to-[var(--primary-dark)] flex items-center justify-center text-slate-900 text-sm font-black shadow-[0_0_15px_rgba(20,170,175,0.2)] group-hover/logo:scale-105 group-hover/logo:shadow-[0_0_20px_rgba(20,170,175,0.4)] transition-all duration-300">
                                PTZ
                            </div>
                            <span className="font-extrabold text-lg text-white tracking-wider group-hover/logo:text-slate-200 transition-colors duration-300">
                                PTZ <span className="text-[var(--primary)]">TOOLS</span>
                            </span>
                        </div>
                    </Link>
                    {/* Close btn — mobile only */}
                    <button
                        onClick={onClose}
                        className="lg:hidden p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-white/5 transition-all"
                    >
                        <BiX className="w-5 h-5" />
                    </button>
                </div>

                {/* ── Search Input ─────────────────────────────────────────── */}
                <div className="px-4 pt-4 pb-2">
                    <div className="relative group">
                        <BiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[var(--primary)] transition-colors text-base" />
                        <input
                            ref={searchInputRef}
                            type="text"
                            placeholder="Search tools... (Press '/')"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-8 py-2 text-xs bg-slate-900/60 text-slate-200 border border-white/5 rounded-xl placeholder-slate-500 focus:outline-none focus:border-[var(--primary)]/60 focus:ring-1 focus:ring-[var(--primary)]/30 transition-all font-medium"
                        />
                        {searchQuery ? (
                            <button
                                type="button"
                                onClick={() => setSearchQuery('')}
                                className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 rounded-md text-slate-500 hover:text-slate-200 hover:bg-white/5 transition-all"
                            >
                                <BiX className="text-sm" />
                            </button>
                        ) : (
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] bg-slate-800 text-slate-500 px-1.5 py-0.5 rounded-md font-mono pointer-events-none border border-white/5">
                                /
                            </span>
                        )}
                    </div>
                </div>

                {/* ── Nav label ────────────────────────────────────────────── */}
                {!searchQuery && (
                    <div className="px-5 pt-2 pb-2">
                        <p className="text-[0.65rem] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                            <HiSparkles className="w-3 h-3 text-[var(--primary)]" />
                            Navigation
                        </p>
                    </div>
                )}

                {/* ── Menu / Search Results ───────────────────────────────── */}
                <nav className="flex-1 overflow-y-auto sidebar-scroll px-3 pb-6 mt-1">
                    {searchQuery.trim() ? (
                        /* Flat Search Results List */
                        filteredTools.length > 0 ? (
                            <div className="space-y-1 mt-1">
                                <div className="px-3 py-1.5 text-[10px] text-slate-500 uppercase tracking-widest font-extrabold flex justify-between">
                                    <span>Search Results</span>
                                    <span>{filteredTools.length} found</span>
                                </div>
                                {filteredTools.map((child, childIndex) => {
                                    const isActive = location.pathname === child.link;
                                    return (
                                        <NavLink
                                            key={childIndex}
                                            to={child.link}
                                            onClick={() => {
                                                setSearchQuery('');
                                                onClose();
                                            }}
                                            className={`
                                                flex items-center gap-3 px-3.5 py-2.5 rounded-xl relative group/search-link
                                                text-xs font-semibold transition-all duration-200
                                                ${isActive
                                                    ? 'text-[var(--primary)] bg-[var(--bg-sidebar-active)] font-bold'
                                                    : 'text-slate-400 hover:text-slate-100 hover:bg-white/5'
                                                }
                                            `}
                                        >
                                            <span className={`text-sm flex-shrink-0 transition-colors ${isActive ? 'text-[var(--primary)]' : 'text-slate-500 group-hover/search-link:text-slate-300'}`}>
                                                {child.icon}
                                            </span>
                                            <div className="truncate flex-1 text-left">
                                                <span className="block truncate leading-tight">{child.name}</span>
                                                <span className="block text-[9px] text-slate-500 group-hover/search-link:text-slate-400 leading-none mt-0.5">
                                                    in {child.categoryName}
                                                </span>
                                            </div>
                                            {isActive && (
                                                <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)] shadow-[0_0_8px_var(--primary-glow)] absolute right-3" />
                                            )}
                                        </NavLink>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="text-center py-12 px-4 space-y-3">
                                <p className="text-xs text-slate-500 leading-normal font-medium">
                                    No tools matched your search.
                                </p>
                                <button
                                    onClick={() => setSearchQuery('')}
                                    className="text-[10px] font-bold text-[var(--primary)] hover:underline uppercase tracking-wider"
                                >
                                    Clear Search
                                </button>
                            </div>
                        )
                    ) : (
                        /* Default Hierarchical Sidebar Menu */
                        sideMenu.map((item, index) => {
                            const isOpen = openIndex === index;

                            return (
                                <div key={index} className="mb-1.5">
                                    {/* Group header */}
                                    <button
                                        onClick={() => handleToggle(index)}
                                        className={`
                                            w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl
                                            transition-all duration-200 group/header
                                            ${isOpen
                                                ? 'text-[var(--primary)] bg-[var(--bg-sidebar-active)]'
                                                : 'text-slate-300 hover:text-slate-100 hover:bg-white/5'
                                            }
                                        `}
                                    >
                                        <span className={`text-base flex-shrink-0 transition-colors ${isOpen ? 'text-[var(--primary)]' : 'text-slate-400 group-hover/header:text-slate-200'}`}>
                                            {item.icon}
                                        </span>
                                        <span className="flex-1 text-left tracking-wide font-extrabold uppercase text-[10px] text-white">
                                            {item.name}
                                        </span>

                                        {/* Tool Count Badge */}
                                        <span className="text-[9px] bg-slate-900/60 text-slate-500 px-1.5 py-0.5 rounded-md font-semibold border border-white/5 group-hover/header:text-slate-400 group-hover/header:border-white/10 transition-all mr-1">
                                            {item.children.length}
                                        </span>

                                        <BiChevronDown
                                            className={`w-4 h-4 flex-shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180 text-[var(--primary)]' : 'text-slate-500 group-hover/header:text-slate-300'}`}
                                        />
                                    </button>

                                    {/* Nested tool links */}
                                    <div
                                        className="overflow-hidden transition-all duration-300"
                                        style={{ maxHeight: isOpen ? `${item.children.length * 48}px` : '0px' }}
                                    >
                                        <div className="mt-1 ml-3.5 pl-3 border-l border-white/5 space-y-1">
                                            {item.children.map((child, childIndex) => {
                                                const isActive = location.pathname === child.link;
                                                return (
                                                    <NavLink
                                                        key={childIndex}
                                                        to={child.link}
                                                        onClick={onClose}
                                                        className={`
                                                            flex items-center gap-3 px-3.5 py-2 rounded-xl relative group/link
                                                            text-xs font-semibold transition-all duration-150
                                                            ${isActive
                                                                ? 'text-[var(--primary)] bg-[var(--bg-sidebar-active)] font-bold'
                                                                : 'text-slate-400 hover:text-slate-100 hover:bg-white/5'
                                                            }
                                                        `}
                                                    >
                                                        <span className={`text-sm flex-shrink-0 transition-colors ${isActive ? 'text-[var(--primary)]' : 'text-slate-500 group-hover/link:text-slate-300'}`}>
                                                            {child.icon}
                                                        </span>
                                                        <span className="truncate flex-1">{child.name}</span>
                                                        {isActive && (
                                                            <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)] shadow-[0_0_8px_var(--primary-glow)] absolute right-3" />
                                                        )}
                                                    </NavLink>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </nav>

                {/* ── Footer ──────────────────────────────────────────────── */}
                <div className="px-5 py-4 border-t border-white/5">
                    <p className="text-[0.65rem] text-slate-500 text-center leading-normal font-medium">
                        © {currentYear} PTZ Tools • All tools are free & secure
                    </p>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;