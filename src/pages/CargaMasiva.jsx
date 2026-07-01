import { useState } from 'react'
import * as XLSX from 'xlsx'
import Layout from '../components/ui/Layout'

const categoriasIniciales = [
  { nombre: 'Prendas de vestir', sku: 124 },
  { nombre: 'Electrodomesticos', sku: 89 },
  { nombre: 'Suministros de Oficina', sku: 452 },
]

const COLORES = ['bg-blue-500', 'bg-purple-500', 'bg-green-500', 'bg-orange-500']

export default function CargaMasiva() {
  const [dragging, setDragging] = useState(false)
  const [datos, setDatos] = useState([])
  const [nombreArchivo, setNombreArchivo] = useState('')
  const [error, setError] = useState('')
  const [busqueda, setBusqueda] = useState('')
  const [pagina, setPagina] = useState(1)
  const POR_PAGINA = 4

  const procesarArchivo = (file) => {
    if (!file.name.match(/\.(xlsx|xls|csv)$/)) {
      setError('Solo se aceptan archivos .xlsx, .xls o .csv')
      return
    }
    setError('')
    setNombreArchivo(file.name)
    const reader = new FileReader()
    reader.onload = (e) => {
      const workbook = XLSX.read(e.target.result, { type: 'binary' })
      const sheet = workbook.Sheets[workbook.SheetNames[0]]
      const data = XLSX.utils.sheet_to_json(sheet)
      setDatos(data)
      setPagina(1)
    }
    reader.readAsBinaryString(file)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) procesarArchivo(file)
  }

  const handleInput = (e) => {
    const file = e.target.files[0]
    if (file) procesarArchivo(file)
  }

  const datosFiltrados = datos.filter((fila) =>
    Object.values(fila).some((v) =>
      String(v).toLowerCase().includes(busqueda.toLowerCase())
    )
  )

  const totalPaginas = Math.ceil(datosFiltrados.length / POR_PAGINA)
  const datosPagina = datosFiltrados.slice((pagina - 1) * POR_PAGINA, pagina * POR_PAGINA)
  const columnas = datos.length > 0 ? Object.keys(datos[0]) : []

  return (
    <Layout>


      <main className="flex-1 p-8">

        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Data Upload</h1>
            <p className="text-gray-400 text-sm mt-1">Import your inventory and product datasets securely.</p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 border border-gray-300 px-4 py-2 rounded-lg text-sm hover:bg-gray-50">
              ⬇ Download Template
            </button>
            <button
              onClick={() => datos.length > 0 && alert(`${datos.length} registros confirmados.`)}
              className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-indigo-700"
            >
              ✓ Confirm Import
            </button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6 mb-6">

          {/* Zona Drag & Drop */}
          <div
            className="col-span-2"
            onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
          >
            <div className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all ${
              dragging ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 bg-white'
            }`}>
              <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">📄</div>
              <p className="text-lg font-semibold text-gray-700 mb-1">
                {nombreArchivo || 'Drag and drop your files here'}
              </p>
              <p className="text-sm text-gray-400 mb-4">Support for .xlsx, .csv, and .ods files (Max 50MB)</p>
              <button
                onClick={() => document.getElementById('fileInput').click()}
                className="border-2 border-dashed border-indigo-400 text-indigo-600 px-6 py-2 rounded-lg text-sm hover:bg-indigo-50"
              >
                Browse Files
              </button>
              <input id="fileInput" type="file" accept=".xlsx,.xls,.csv" className="hidden" onChange={handleInput} />
            </div>
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          </div>

          {/* Categorías */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5">
            <div className="flex justify-between items-center mb-4">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Active Categories</p>
              <span className="text-xs text-indigo-600 cursor-pointer hover:underline">Manage</span>
            </div>
            {categoriasIniciales.map((cat, i) => (
              <div key={cat.nombre} className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-2">
                  <div className={`w-2.5 h-2.5 rounded-full ${COLORES[i]}`}></div>
                  <span className="text-sm text-gray-700">{cat.nombre}</span>
                </div>
                <span className="text-xs text-gray-400">{cat.sku} SKU</span>
              </div>
            ))}
            <button className="w-full mt-2 border border-dashed border-gray-300 text-gray-400 text-sm py-2 rounded-lg hover:bg-gray-50">
              + New Category
            </button>
          </div>
        </div>

        {/* Previsualización */}
        {datos.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-200">
            <div className="flex justify-between items-center p-5 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-bold text-gray-800">Data Preview</h2>
                <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-full">VALIDATED</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2">
                  <span className="text-gray-400 text-sm">🔍</span>
                  <input
                    type="text"
                    placeholder="Search rows..."
                    value={busqueda}
                    onChange={(e) => { setBusqueda(e.target.value); setPagina(1) }}
                    className="text-sm outline-none w-36"
                  />
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    {columnas.map((col) => (
                      <th key={col} className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                        {col} ↕
                      </th>
                    ))}
                    <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {datosPagina.map((fila, i) => (
                    <tr key={i} className="border-b border-gray-50 hover:bg-gray-50">
                      {columnas.map((col) => (
                        <td key={col} className="px-5 py-3 text-gray-700">{fila[col]}</td>
                      ))}
                      <td className="px-5 py-3">
                        <span className="text-green-500 text-lg">✓</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Paginación */}
            <div className="flex justify-between items-center px-5 py-4 border-t border-gray-100">
              <span className="text-sm text-gray-400">
                Showing {datosPagina.length} of {datosFiltrados.length} entries
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPagina((p) => Math.max(1, p - 1))}
                  disabled={pagina === 1}
                  className="px-2 py-1 rounded border text-sm disabled:opacity-40 hover:bg-gray-100"
                >
                  ‹
                </button>
                {Array.from({ length: Math.min(3, totalPaginas) }, (_, i) => i + 1).map((n) => (
                  <button
                    key={n}
                    onClick={() => setPagina(n)}
                    className={`px-3 py-1 rounded text-sm ${pagina === n ? 'bg-indigo-600 text-white' : 'border hover:bg-gray-100'}`}
                  >
                    {n}
                  </button>
                ))}
                <button
                  onClick={() => setPagina((p) => Math.min(totalPaginas, p + 1))}
                  disabled={pagina === totalPaginas}
                  className="px-2 py-1 rounded border text-sm disabled:opacity-40 hover:bg-gray-100"
                >
                  ›
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </Layout>
  )
}