import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { FaCompress } from "react-icons/fa6";
import {
  BiCalculator, BiMoney, BiHome, BiImage, BiCrop,
  BiTransfer, BiText, BiArrowToRight,
} from 'react-icons/bi';
import { FaBaby, FaBirthdayCake, FaExchangeAlt, FaRulerCombined, FaShieldAlt, FaBolt, FaGift } from 'react-icons/fa';
import { GoCodeSquare } from 'react-icons/go';
import Footer from '../components/Layout/Footer';

const toolGroups = [
  {
    category: 'Calculator Tools',
    color: 'from-blue-400 to-blue-600',
    bg: 'from-blue-50 to-blue-50',
    border: 'border-blue-200',
    tools: [
      { name: 'EMI Calculator', link: '/emi-calculator', icon: <BiCalculator />, desc: 'Plan your loan EMIs instantly' },
      { name: 'GST Calculator', link: '/gst-calculator', icon: <BiCalculator />, desc: 'Inclusive & exclusive GST calculation' },
      { name: 'PPF Calculator', link: '/ppf-calculator', icon: <BiMoney />, desc: 'Track your PPF maturity amount' },
      { name: 'Land Area Calculator', link: '/land-area-calculator', icon: <FaRulerCombined />, desc: 'Irregular land area in sq ft & gaj' },
      { name: 'Pregnancy Due Date', link: '/pregnancy-due-date-calculator', icon: <FaBaby />, desc: 'Estimate delivery date & trimester' },
      { name: 'Age Calculator', link: '/age-calculator', icon: <FaBirthdayCake />, desc: 'Exact age with next birthday' },

    ],
  },
  {
    category: 'Image Tools',
    color: 'from-green-400 to-emerald-600',
    bg: 'from-green-50 to-emerald-50',
    border: 'border-green-200',
    tools: [
      { name: 'Image Resizer', link: '/image-resizer', icon: <BiImage />, desc: 'Resize to any dimension instantly' },
      { name: 'Image Compressor', link: '/image-compressor', icon: <FaCompress />, desc: 'Reduce file size without quality loss' },
      { name: 'Image Cropper', link: '/image-cropper', icon: <BiCrop />, desc: 'Crop with custom aspect ratios' },
      { name: 'Image Converter', link: '/image-converter', icon: <BiTransfer />, desc: 'Convert between JPG, PNG, WEBP' },
      { name: 'Image to Text OCR', link: '/image-to-text-ocr', icon: <BiText />, desc: 'Extract text from any image' },
      { name: 'Watermark Adder', link: '/watermark-adder', icon: <BiText />, desc: 'Extract text from any image' },
      { name: 'Passport Size Photo Maker', link: '/passport-size-photo-maker', icon: <BiText /> },
    ],
  },
  {
    category: 'Grammar & Text Tools',
    color: 'from-orange-400 to-orange-600',
    bg: 'from-orange-50 to-orange-50',
    border: 'border-orange-200',
    tools: [
      { name: 'Words Case Converter', link: '/words-case-converter', icon: <BiText />, desc: 'Convert between upper, lower, title case' },
      { name: 'Currency Converter', link: '/currency-converter', icon: <FaExchangeAlt />, desc: 'Live exchange rates, 150+ currencies' },

      { name: 'Compare Code & Text', link: '/diff-checker', icon: <FaExchangeAlt />, desc: 'Comprission' },

    ],
  },
  {
    category: "Developer Tools",
    color: "from-rose-400 to-rose-600",
    bg: "from-rose-50 to-rose-50",
    border: "border-rose-200",
    tools: [
      { name: 'Compare Code', link: '/diff-checker', icon: <FaExchangeAlt />, desc: 'Comprission code ' },
      { name: 'Code Minifier', link: '/code-minifier', icon: <GoCodeSquare />, desc: 'Minify JavaScript & CSS with advanced optimisation' },
      { name: "Code Unminifier", link: "/code-unminifier", icon: <GoCodeSquare />, desc: "Unminify JavaScript & CSS with advanced optimisation" },
      { name: 'Color Palette Generator', link: '/color-palette-generator', icon: <GoCodeSquare />, desc: 'Generate harmonious color palettes from a base color' },
      { name: 'Pro Color Palette Generator', link: '/pro-color-palette-generator', icon: <GoCodeSquare />, desc: 'Advanced palette generator with multiple algorithms & export options' },
      // { name: 'Font Pairing Tool', link: '/font-pairing-tool', icon: <GoCodeSquare />, desc: 'Discover beautiful font combinations for your projects' },
    ]
  }
];

const stats = [
  { number: '12+', label: 'Free Tools', icon: <FaGift /> },
  { number: '100%', label: 'Client-Side', icon: <FaShieldAlt /> },
  { number: '0s', label: 'Upload Wait', icon: <FaBolt /> },
];

const Home = () => {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Navbar />

      {/* ── Hero ───────────────────────────────────────────────────── */}
      {/* <section className="relative overflow-hidden" style={{ background: 'var(--gradient-hero)' }}>

        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[var(--primary)] opacity-10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-[var(--primary-dark)] opacity-10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto px-6 py-20 text-center animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[var(--primary)] text-sm font-semibold mb-6">
            <FaBolt className="w-3 h-3" />
            100% Free
          </div>

          <h1 className="text-3xl sm:text-5xl font-bold text-white  mb-5">
            Your All-in-One<br />
            <span className="bg-gradient-to-r from-[var(--primary)] to-[var(--primary-dark)] bg-clip-text text-transparent">
              Tool Suite
            </span>
          </h1>

          <p className="text-slate-400 text-lg max-w-xl mx-auto mb-8 leading-relaxed">
            Financial calculators, image editors, and utility tools — all running directly in your browser. No uploads, no tracking, no cost.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/emi-calculator"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-bold text-slate-900"
              style={{ background: 'var(--gradient-primary)' }}
            >
              Try EMI Calculator <BiArrowToRight className="w-5 h-5" />
            </Link>
            <Link
              to="/image-resizer"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-white bg-white/10 border border-white/10 hover:bg-white/15 transition-all"
            >
              Image Tools
            </Link>
          </div>
        </div>
      </section> */}

      {/* ── Stats ──────────────────────────────────────────────────── */}
      {/* <section className="max-w-4xl mx-auto px-6 -mt-6 mb-12 relative z-10">
        <div className="grid grid-cols-3 gap-4">
          {stats.map((s, i) => (
            <div
              key={i}
              className="stat-card animate-slide-up"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="text-[var(--primary)] text-xl mb-1">{s.icon}</div>
              <div className="stat-number">{s.number}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </section> */}

      {/* ── Tool Groups ─────────────────────────────────────────────── */}
      <section className=" mx-auto px-6 md:px-12 pb-16 space-y-12 tool-groups md:mt-24 mt-12 ">
        {toolGroups.map((group, gi) => (
          <div key={gi}>
            {/* Group heading */}
            <div className="flex items-center gap-3 mb-5">
              <div className={`h-1 w-8 rounded-full bg-gradient-to-r ${group.color}`} />
              <h2 className="text-xl font-bold text-[var(--text-primary)]">{group.category}</h2>
              <div className="flex-1 h-px bg-[var(--border)]" />
            </div>

            {/* Tool cards grid */}
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {group.tools.map((tool, ti) => (
                <Link
                  key={ti}
                  to={tool.link}
                  className={`
                    group flex flex-col gap-3 p-5 rounded-xl
                    bg-gradient-to-br ${group.bg}
                    border ${group.border}
                    hover:shadow-lg hover:-translate-y-1
                    transition-all duration-200 animate-slide-up
                  `}
                  style={{ animationDelay: `${ti * 0.06}s` }}
                >
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${group.color} flex items-center justify-center text-white text-xl shadow-sm`}>
                    {tool.icon}
                  </div>
                  <div>
                    <p className="font-bold text-[var(--text-primary)] text-sm group-hover:text-[var(--primary-dark)] transition-colors">
                      {tool.name}
                    </p>
                    {/* <p className="text-xs text-[var(--text-secondary)] mt-0.5 leading-relaxed">
                      {tool.desc}
                    </p> */}
                  </div>
                  {/* <div className="mt-auto">
                    <span className="text-xs font-semibold text-[var(--primary-dark)] flex items-center gap-1 group-hover:gap-2 transition-all">
                      Open tool <BiArrowToRight />
                    </span>
                  </div> */}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* ── Footer note ─────────────────────────────────────────────── */}
      <Footer />
    </div>
  );
};

export default Home;