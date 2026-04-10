import { Routes, Route } from 'react-router-dom'
import BoardsPage from './pages/BoardsPage'
import BoardPage from './pages/BoardPage'
import Sidebar from './components/Sidebar'

function App() {
    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Marca d'água */}
            <div className="fixed inset-0 flex items-center justify-center pointer-events-none select-none z-0 overflow-hidden">
        <span className="font-bold text-gray-200" style={{ fontSize: '50vw', lineHeight: 1, opacity: 0.4, transform: 'translateY(-5%)' }}>
          KD
        </span>
            </div>

            <Sidebar />

            {/* Conteúdo principal — ml-56 para não ficar atrás da sidebar */}
            <main className="flex-1 ml-56 relative z-10">
                <Routes>
                    <Route path="/" element={<BoardsPage />} />
                    <Route path="/boards/:id" element={<BoardPage />} />
                    <Route path="/settings" element={<div className="p-8"><h1 className="text-2xl font-bold">Preferências</h1></div>} />
                </Routes>
            </main>
        </div>
    )
}

export default App