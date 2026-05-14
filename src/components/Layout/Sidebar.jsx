import React, { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'

import {
    BiCalculator, BiChevronDown, BiHome, BiMoney,
    BiSolidCalculator, BiSolidPaintRoll, BiX, BiCrop,
    BiImage, BiTransfer, BiText,
    BiSolidPackage,
} from 'react-icons/bi'
import { FaBaby, FaBirthdayCake, FaCompressAlt, FaExchangeAlt, FaRulerCombined } from 'react-icons/fa'
import { HiSparkles } from 'react-icons/hi'
import { FaLaptopCode } from "react-icons/fa";
import { GoCodeSquare } from "react-icons/go";

const sideMenu = [

    {
        name: 'Calculate & Currency Tools',
        icon: <BiSolidCalculator />,
        dropdown: true,
        children: [

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
            // { name: 'Code Formatter', link: '/code-formatter', icon: <GoCodeSquare /> },
            // { name: 'Code Validator', link: '/code-validator', icon: <GoCodeSquare /> },

            // { name: 'Code Generator', link: '/code-generator', icon: <GoCodeSquare /> },
            // { name: 'Code Converter', link: '/code-converter', icon: <GoCodeSquare /> },
            // { name: 'Code Editor', link: '/code-editor', icon: <GoCodeSquare /> },
        ],
    },

]

const Sidebar = ({ isOpen, onClose }) => {
    const [openIndex, setOpenIndex] = useState(0) // default open first group

    const handleToggle = (index) => {
        setOpenIndex((prev) => (prev === index ? null : index));
    }

    const currentYear = new Date().getFullYear();


    return (
        <>
            {/* ── Sidebar panel ─────────────────────────────────────────── */}
            <aside
                className={`
          fixed top-0 left-0 z-30 h-full flex flex-col
          w-[260px] bg-[#0f172a]
          border-r border-white/5
          transition-transform duration-300 ease-in-out
          lg:static lg:translate-x-0 lg:flex
          ${isOpen ? 'translate-x-0 ' : '-translate-x-full'}
        `}
                style={{ height: "100vh" }} >
                {/* ── Logo ────────────────────────────────────────────────── */}
                <div className="flex items-center justify-between px-5 py-5 border-b border-white/5">
                    <Link to="/">
                        <div className="flex items-center gap-2">

                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--primary)] to-[var(--primary-dark)] flex items-center justify-center text-slate-900 text-sm font-black">
                                PTZ
                            </div>
                            <span className="font-bold text-lg text-white tracking-wide">
                                <span className="text-[var(--primary)]">TOOLS</span>
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

                {/* ── Nav label ────────────────────────────────────────────── */}
                <div className="px-5 pt-5 pb-2">
                    <p className="text-[0.65rem] font-bold text-slate-600 uppercase tracking-widest flex items-center gap-1.5">
                        <HiSparkles className="w-3 h-3 text-[var(--primary)]" />
                        Navigation
                    </p>
                </div>

                {/* ── Menu ────────────────────────────────────────────────── */}
                <nav className="flex-1 overflow-y-auto sidebar-scroll px-3 pb-6">
                    {sideMenu.map((item, index) => {
                        const isOpen = openIndex === index

                        return (
                            <div key={index} className="mb-1">
                                {/* Group header */}
                                <button
                                    onClick={() => handleToggle(index)}
                                    className={`
                    w-full flex items-center gap-3 px-3 py-2.5 rounded-xl
                    text-sm font-semibold transition-all duration-200
                    ${isOpen
                                            ? 'text-[var(--primary)] bg-[var(--bg-sidebar-active)]'
                                            : 'text-slate-400 hover:text-white hover:bg-white/5'
                                        }
                  `}
                                >
                                    <span className="text-base flex-shrink-0">{item.icon}</span>
                                    <span className="flex-1 text-left">{item.name}</span>
                                    <BiChevronDown
                                        className={`w-4 h-4 flex-shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180 text-[var(--primary)]' : ''}`}
                                    />
                                </button>

                                {/* Animated children */}
                                <div
                                    className="overflow-hidden transition-all duration-300"
                                    style={{ maxHeight: isOpen ? `${item.children.length * 48}px` : '0px' }}
                                >

                                    <div className="mt-0.5 ml-3 pl-3 border-l border-white/5 space-y-0.5">
                                        {item.children.map((child, childIndex) => (
                                            <NavLink
                                                key={childIndex}
                                                to={child.link}
                                                onClick={onClose}
                                                className={({ isActive }) => `
                          flex items-center gap-3 px-3 py-2 rounded-lg
                          text-sm font-medium transition-all duration-150
                          ${isActive
                                                        ? 'text-[var(--primary)] bg-[var(--bg-sidebar-active)]'
                                                        : 'text-slate-500 hover:text-slate-200 hover:bg-white/5'
                                                    }
                        `}
                                            >
                                                <span className="text-base flex-shrink-0">{child.icon}</span>
                                                <span className="truncate">{child.name}</span>
                                            </NavLink>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </nav>

                {/* ── Footer ──────────────────────────────────────────────── */}
                <div className="px-5 py-4 border-t border-white/5">
                    <p className="text-[0.65rem] text-slate-600 text-center">
                        © {currentYear} PTZ Tools • All tools are free & secure
                    </p>
                </div>
            </aside >
        </>
    )
}

export default Sidebar