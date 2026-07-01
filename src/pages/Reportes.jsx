import { useMemo } from 'react'
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import Layout from '../components/ui/Layout'
import { useProductos } from '../context/ProductosContext'

const COLORS = ['#4f46e5', '#06b6d4', '#f59e0b', '#ef4444', '#8b5cf6', '#10b981']

export default function Reportes() {
  const { productos } = useProductos()

  const dataCategoria = useMemo(() => {
    const stockPorCategoria = productos.reduce((acc, curr) => {
      // Sumamos el stock en lugar de contar la cantidad de productos
      const stock = parseInt(curr.stock) || 0
      acc[curr.categoria] = (acc[curr.categoria] || 0) + stock
      return acc
    }, {})
    
    // Solo mostrar categorías que tengan más de 0 stock
    return Object.entries(stockPorCategoria)
      .filter(([_, value]) => value > 0)
      .map(([name, value]) => ({ name, value }))
  }, [productos])

  return (
    <Layout>
      <main className="flex-1 p-8 bg-slate-50 min-h-screen">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Reportes y Estadísticas</h1>
        <p className="text-gray-500 mb-8">Análisis visual del inventario real en stock.</p>
        
        {dataCategoria.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center shadow-sm">
            <p className="text-4xl mb-4">📊</p>
            <h2 className="text-lg font-bold text-gray-700">Sin datos de stock</h2>
            <p className="text-gray-400">Actualmente no hay productos con stock disponible para generar los reportes.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            
            {/* Gráfico Circular - Distribución por Categoría */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-800 mb-1">Distribución de Stock</h2>
              <p className="text-sm text-gray-400 mb-6">Porcentaje de unidades físicas por categoría.</p>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={dataCategoria}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={120}
                      innerRadius={70}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    >
                      {dataCategoria.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      formatter={(value) => [`${value} unidades`, 'Stock']}
                    />
                    <Legend verticalAlign="bottom" height={36} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Gráfico de Barras - Unidades en Stock */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-800 mb-1">Unidades en Stock</h2>
              <p className="text-sm text-gray-400 mb-6">Volumen de artículos disponibles agrupados por categoría.</p>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={dataCategoria}
                    margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#64748b' }} tickLine={false} axisLine={false} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: '#64748b' }} tickLine={false} axisLine={false} />
                    <Tooltip 
                      cursor={{ fill: '#f8fafc' }}
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      formatter={(value) => [`${value} unidades`, 'Stock']}
                    />
                    <Bar dataKey="value" fill="#4f46e5" radius={[6, 6, 0, 0]} name="Total de Productos">
                      {dataCategoria.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>
        )}
      </main>
    </Layout>
  )
}