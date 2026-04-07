import { useNavigate } from 'react-router-dom'

function Navbar() {
    const navigate = useNavigate()

    return (
        <nav className="bg-white shadow-sm px-8 py-4 flex items-center gap-3 relative z-20 border-b border-gray-200">
            <button
                onClick={() => navigate('/')}
                className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
                <span className="text-blue-500 font-bold text-xl">KD</span>
                <span className="font-semibold text-gray-800">Kandan</span>
            </button>
        </nav>
    )
}

export default Navbar