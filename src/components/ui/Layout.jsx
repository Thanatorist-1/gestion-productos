import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function Layout({ children }) {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout } = useAuth()

  const navItems = [
    { label: 'Dashboard', icon: '▦', path: '/dashboard' },
    { label: 'Productos', icon: '☰', path: '/productos' },
    { label: 'Carga Masiva', icon: '⬆', path: '/carga-masiva' },
    { label: 'Reportes', icon: '❖', path: '/reportes' },
  ]

  return (
    <div className="min-h-screen flex bg-gray-50 font-sans">
      {/* SIDEBAR */}
      <aside className="w-52 bg-white border-r border-gray-200 flex flex-col justify-between py-6 px-4 shrink-0">
        <div>
          <button 
            onClick={() => navigate('/dashboard')}
            className="text-xl font-bold text-indigo-700 mb-8 px-2 w-full text-left hover:text-indigo-800 transition-colors"
          >
            GestionaYa
          </button>
          {navItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path)
            return (
              <button
                key={item.label}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1 text-sm cursor-pointer transition-all ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-700 font-semibold'
                    : 'text-gray-500 hover:bg-gray-100'
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            )
          })}
        </div>

        {/* Storage status & User */}
        <div>
          <div className="bg-slate-800 rounded-xl p-4 mb-4">
            <p className="text-xs text-gray-400 font-semibold uppercase mb-2">Almacenamiento</p>
            <div className="h-2 bg-slate-600 rounded-full overflow-hidden mb-2">
              <div className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-full" style={{ width: '75%' }}></div>
            </div>
            <p className="text-xs text-gray-400">7.5 GB de 10 GB</p>
          </div>
          
          <div className="px-2">
            <p className="text-sm font-semibold text-gray-800 truncate">{user?.name || 'Administrador'}</p>
            <p className="text-xs text-gray-500 truncate mb-3">{user?.email || 'admin@gestionaya.com'}</p>
            <button
              onClick={() => { logout(); navigate('/login') }}
              className="text-xs font-semibold text-red-500 hover:text-red-700 transition-colors"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </aside>

      {/* CONTENIDO PRINCIPAL */}
      <div className="flex-1 flex flex-col min-w-0 overflow-auto">
        {children}
      </div>
    </div>
  )
}
