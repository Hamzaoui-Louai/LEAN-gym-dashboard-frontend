import { BrowserRouter } from 'react-router-dom'
import { PageTransitionProvider } from './components/PageTransition'
import { AuthProvider } from './context/AuthContext'
import AppRoutes from './routes/AppRoutes'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <PageTransitionProvider>
          <AppRoutes />
        </PageTransitionProvider>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
