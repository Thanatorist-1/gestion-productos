import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Layout from '../components/ui/Layout'
import { useProductos } from '../context/ProductosContext'

const navItems = [
  { label: "Dashboard", path: "/dashboard" },
  { label: "Productos", path: "/productos" },
  { label: "Carga Masiva", path: "/carga-masiva" },
  { label: "Reportes", path: "/reportes" },
]

export default function Dashboard() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout } = useAuth()
  const { productos } = useProductos()

  const totalProductos = productos.length
  const totalLowStock = productos.filter((p) => parseInt(p.stock) <= 5).length
  const stockTotal = productos.reduce((acc, p) => acc + (parseInt(p.stock) || 0), 0)

  const stats = [
    { title: "Total Productos", value: totalProductos },
    { title: "Bajo Stock", value: totalLowStock },
    { title: "Unidades Totales", value: stockTotal },
  ]

  return (
    <Layout>
      <main className="flex-1 p-8">

        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-bold">Resumen de operaciones</h1>
            <p className="text-gray-500 mt-2">Bienvenido {user?.name || 'Administrador'}</p>
          </div>
          <div className="flex gap-4">
            <button className="bg-white border rounded-xl px-6 py-3 shadow-sm hover:bg-gray-50">
              Exportar datos
            </button>
            <button
              onClick={() => navigate('/productos')}
              className="bg-indigo-600 text-white rounded-xl px-6 py-3 hover:bg-indigo-700"
            >
              Nueva entrada
            </button>
          </div>
        </div>

        {/* TARJETAS */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {stats.map((item) => (
            <div
              key={item.title}
              className="relative overflow-hidden bg-white rounded-3xl shadow-lg border border-gray-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 p-8"
            >
              <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-indigo-50"></div>
              <p className="text-gray-500 text-sm">{item.title}</p>
              <h2 className="text-5xl font-bold mt-3">{item.value}</h2>
              <div className="mt-5 h-2 rounded-full bg-gray-200 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-indigo-600 to-cyan-400 rounded-full" style={{ width: item.value > 0 ? '75%' : '0%' }}></div>
              </div>
              <div className="mt-5 flex justify-between items-center">
                <span className="text-indigo-500 font-bold text-sm">Actualizado</span>
                <span className="text-gray-400 text-sm">Tiempo real</span>
              </div>
            </div>
          ))}

          {/* Tarjeta Ganancia */}
          <div className="bg-white rounded-3xl shadow-lg border border-gray-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 p-8">
            <div className="w-14 h-14 rounded-xl bg-purple-500 mb-5"></div>
            <p className="text-gray-500 text-sm">Ganancia</p>
            <h2 className="text-5xl font-bold mt-3">$0</h2>
            <div className="mt-5 h-2 rounded-full bg-gray-200 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-indigo-600 to-cyan-400 rounded-full" style={{ width: '0%' }}></div>
            </div>
            <div className="mt-5 flex justify-between items-center">
              <span className="text-gray-400 font-bold text-sm">Sin datos aún</span>
              <span className="text-gray-400 text-sm">Este mes</span>
            </div>
          </div>
        </div>

        {/* GRÁFICO Y ACTIVIDAD */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-8">

          <div className="xl:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-2xl font-bold">Rendimiento semanal</h2>
                <p className="text-gray-500">Movimientos de inventario</p>
              </div>
              <button className="px-4 py-2 rounded-lg border hover:bg-gray-100">Semana</button>
            </div>
            <div className="flex items-center justify-center h-64 text-gray-400">
              <p>Sin datos cargados aún</p>
            </div>
          </div>

          <div className="bg-gradient-to-b from-white to-slate-50 rounded-2xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-2xl font-bold mb-6">Actividad reciente</h2>
            <div className="flex items-center justify-center h-40 text-gray-400">
              <p>Sin actividad reciente</p>
            </div>
          </div>

        </div>

        {/* TABLA */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 mt-8">
          <div className="flex justify-between items-center p-6 border-b">
            <div>
              <h2 className="text-2xl font-bold">Resumen del inventario</h2>
              <p className="text-gray-500">Productos actualmente registrados</p>
            </div>
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="Buscar producto..."
                className="border rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-5 py-2 rounded-xl">
                Buscar
              </button>
            </div>
          </div>

          {productos.length === 0 ? (
            <div className="flex items-center justify-center p-16 text-gray-400">
              <p>No hay productos registrados. Carga un Excel o crea un producto para comenzar.</p>
            </div>
          ) : (
            <div className="p-6">
              <p className="text-gray-500">Hay {productos.length} productos registrados. Ve al módulo de Productos para ver el detalle.</p>
            </div>
          )}

          <div className="flex justify-between items-center p-6 border-t">
            <span className="text-gray-500">Mostrando {productos.length} productos</span>
          </div>
        </div>

      </main>
    </Layout>
  )
}
