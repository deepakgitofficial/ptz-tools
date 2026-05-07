import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
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
import CaseConverter from './components/text-tools/CaseConverter'
import CodeMinifier from './components/developer-tools/CodeMinifier'
import AppLayout from './AppLayout'
import CodeUnminifier from './components/developer-tools/CodeUnminifier'

function App() {
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/*' element={<AppLayout />} >
        <Route path='test/' element={<h1>EMI Calculator</h1>} />
        <Route path='emi-calculator' element={<EmiCalculator />} />
        <Route path='gst-calculator' element={<GSTCalculatorAdvanced />} />
        <Route path='ppf-calculator' element={<PPFCalculator />} />
        <Route path='land-area-calculator' element={<LandAreaCalculator />} />
        <Route path='pregnancy-due-date-calculator' element={<PregnancyDueDateCalculator />} />
        <Route path='age-calculator' element={<AgeCalculator />} />
        <Route path='currency-converter' element={<CurrencyConverter />} />
        <Route path='image-resizer' element={<ImageResizer />} />
        <Route path='image-compressor' element={<ImageCompressor />} />
        <Route path='image-cropper' element={<ImageCropper />} />
        <Route path='image-converter' element={<ImageConverter />} />
        <Route path='image-to-text-ocr' element={<ImageToTextOCR />} />
        <Route path='words-case-converter' element={<CaseConverter />} />
        <Route path='code-minifier' element={<CodeMinifier />} />
        <Route path='code-unminifier' element={<CodeUnminifier />} />
      </Route>
    </Routes>
  )
}

export default App

