import { useNavigate, useLocation } from 'react-router-dom'
import { LayoutDashboard, Settings } from 'lucide-react'

function Sidebar() {
    const navigate = useNavigate()
    const location = useLocation()

    const isActive = (path: string) => location.pathname === path

    return (
        <aside className="w-56 bg-white border-r border-gray-200 flex flex-col min-h-screen fixed left-0 top-0 z-30">
            {/* Logo */}
            <div
                onClick={() => navigate('/')}
                className="flex items-center gap-2 px-6 py-5 cursor-pointer hover:opacity-80 border-b border-gray-100"
            >
                <span className="text-blue-500 font-bold text-xl">K</span>
                <span className="font-semibold text-gray-800">Kandan</span>
            </div>

            {/* Menu */}
            <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
                <button
                    onClick={() => navigate('/')}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm w-full text-left transition-colors cursor-pointer ${
                        isActive('/')
                            ? 'bg-blue-50 text-blue-600 font-medium'
                            : 'text-gray-600 hover:bg-gray-100'
                    }`}
                >
                    <LayoutDashboard size={16} />
                    Boards
                </button>

                <button
                    onClick={() => navigate('/settings')}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm w-full text-left transition-colors cursor-pointer ${
                        isActive('/settings')
                            ? 'bg-blue-50 text-blue-600 font-medium'
                            : 'text-gray-600 hover:bg-gray-100'
                    }`}
                >
                    <Settings size={16} />
                    Preferências
                </button>
            </nav>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-100">
                <p className="text-xs text-gray-400">Kandan {new Date().getFullYear()}</p>
                <a href="https://github.com/notSoDaniel" target="_blank" rel="noopener noreferrer" className="text-xs text-gray-400 hover:text-blue-500 transition-colors">
                    Made with ☕ by notSoDaniel
                </a>
            </div>
        </aside>
    )
}

export default Sidebar