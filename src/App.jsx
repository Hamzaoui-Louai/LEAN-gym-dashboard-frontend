import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { PageTransitionProvider } from './components/PageTransition'
import LandingPage from './pages/LandingPage'
import SignupPage from './pages/SignupPage'

function App() {
  return (
    <BrowserRouter>
      <PageTransitionProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/signup" element={<SignupPage />} />
        </Routes>
      </PageTransitionProvider>
    </BrowserRouter>
  )
}

export default App
