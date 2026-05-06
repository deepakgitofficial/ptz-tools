import { useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Sidebar from './components/Layout/Sidebar'
import EmiCalculator from './components/EmiCalculator'
import PPFCalculator, { GSTCalculatorAdvanced } from './components/tax/GSTCalculator'
import LandAreaCalculator from './components/area/LandAreaCalculator'
import PregnancyDueDateCalculator from './components/health/PregnancyDueDateCalculator'
import AgeCalculator from './components/health/AgeCalculator'
import CurrencyConverter from './components/CurrencyConverter'
import ImageResizer from './components/most-usefull/ImageResizer'
import ImageCompressor from './components/most-usefull/ImageCompressor'
import ImageCropper from './components/most-usefull/ImageCropper'
import ImageConverter from './components/most-usefull/ImageConverter'
import ImageToTextOCR from './components/most-usefull/ImageToTextOCR'
import { HiMenu } from 'react-icons/hi'
import CaseConverter from './components/text-tools/CaseConverter'
import CodeMinifier from './components/developer-tools/CodeMinifier'
import AppLayout from './AppLayout'

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex min-h-screen bg-[var(--background)]">

      {/* Mobile overlay backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      {/* <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} /> */}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Mobile topbar */}
        <header className="lg:hidden flex items-center gap-3 px-4 py-3 bg-[var(--bg-dark)] border-b border-[var(--border-dark)] sticky top-0 z-10">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg text-slate-400 hover:text-[var(--primary)] hover:bg-white/5 transition-all"
            aria-label="Open sidebar"
          >
            <HiMenu className="w-5 h-5" />
          </button>
          <span className="font-bold text-lg text-white tracking-wide">
            FIN<span className="text-[var(--primary)]">TOOLS</span>
          </span>
        </header>

        {/* Route content */}
        <main className="flex-1">
          <Routes>
            <Route path='/' element={<Home />} />
          </Routes>
          <AppLayout />
        </main>
      </div>
    </div>
  )
}

export default App
