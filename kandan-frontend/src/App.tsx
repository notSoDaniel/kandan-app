import { Routes, Route } from 'react-router-dom'
import BoardsPage from './pages/BoardsPage'
import BoardPage from './pages/BoardPage'

function App() {
    return (
        <div className="min-h-screen bg-gray-100">
            <Routes>
                <Route path="/" element={<BoardsPage />} />
                <Route path="/boards/:id" element={<BoardPage />} />
            </Routes>
        </div>
    )
}

export default App