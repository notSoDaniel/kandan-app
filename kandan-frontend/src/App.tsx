import { Routes, Route } from 'react-router-dom'
import BoardsPage from './pages/BoardsPage'
import BoardPage from './pages/BoardPage'
import Navbar from './components/Navbar'

function App() {
    return (
        <div className="min-h-screen bg-gray-100 relative">
            {/* Marca d'água */}
            <div className="fixed inset-0 flex items-center justify-center pointer-events-none select-none z-0 overflow-hidden">
        <span className="font-bold text-gray-200" style={{ fontSize: '50vw', lineHeight: 1, opacity: 0.4, transform: 'translateY(-5%)' }}>
          KD
        </span>
            </div>

            <div className="relative z-10 flex flex-col min-h-screen">
                <Navbar />
                <main className="flex-1">
                    <Routes>
                        <Route path="/" element={<BoardsPage />} />
                        <Route path="/boards/:id" element={<BoardPage />} />
                    </Routes>
                </main>
                <footer className="text-center py-4 text-gray-400 text-sm border-t border-white bg-white">
                    Built by <a href="https://github.com/notSoDaniel" target="_blank" className="hover:text-gray-600 underline">notSoDaniel</a> · Kandan {new Date().getFullYear()}
                </footer>
            </div>
        </div>
    )
}

export default App