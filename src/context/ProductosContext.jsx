/**
 * ProductosContext.jsx
 * ─────────────────────
 * Contexto global de productos para compartir el estado entre
 * Persona 4 (formulario/gestión) y Persona 3 (lista de productos).
 *
 * USO:
 *   1. Envolver <App> con <ProductosProvider> en main.jsx
 *   2. En cualquier componente: const { productos, agregarProducto, ... } = useProductos()
 */
import { createContext, useContext, useState } from 'react'

const ProductosContext = createContext(null)

// Datos de demo compartidos
let nextId = 8
const PRODUCTOS_INICIALES = [
  { id: 1, nombre: 'Laptop Lenovo IdeaPad 3', sku: 'LAP-001', categoria: 'Electrónica', precio: '2499.90', stock: '15', descripcion: 'Procesador Intel Core i5, 8GB RAM, 512GB SSD' },
  { id: 2, nombre: 'Zapatillas Running Nike Air', sku: 'ZAP-022', categoria: 'Deportes', precio: '349.00', stock: '0', descripcion: '' },
  { id: 3, nombre: 'Camiseta Polo Lacoste', sku: 'CAM-044', categoria: 'Ropa', precio: '189.90', stock: '32', descripcion: 'Algodón piqué, talla M' },
  { id: 4, nombre: 'Arroz Costeño 5kg', sku: 'ALI-010', categoria: 'Alimentos', precio: '28.50', stock: '4', descripcion: 'Arroz extra añejo, bolsa 5kg' },
  { id: 5, nombre: 'Silla Ergonómica Ejecutiva', sku: 'HOG-007', categoria: 'Hogar', precio: '699.00', stock: '8', descripcion: 'Soporte lumbar regulable, reposabrazos 4D' },
  { id: 6, nombre: 'Mouse Inalámbrico Logitech', sku: 'ELC-033', categoria: 'Electrónica', precio: '89.90', stock: '22', descripcion: 'Bluetooth + USB, batería 18 meses' },
  { id: 7, nombre: 'Pelota Fútbol Adidas', sku: 'DEP-099', categoria: 'Deportes', precio: '120.00', stock: '11', descripcion: 'Talla 5, FIFA Quality Pro' },
]

export function ProductosProvider({ children }) {
  const [productos, setProductos] = useState(PRODUCTOS_INICIALES)

  const agregarProducto = (campos) => {
    setProductos((prev) => [...prev, { id: nextId++, ...campos }])
  }

  const editarProducto = (id, campos) => {
    setProductos((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...campos } : p))
    )
  }

  const eliminarProducto = (id) => {
    setProductos((prev) => prev.filter((p) => p.id !== id))
  }

  return (
    <ProductosContext.Provider value={{ productos, agregarProducto, editarProducto, eliminarProducto }}>
      {children}
    </ProductosContext.Provider>
  )
}

export function useProductos() {
  const ctx = useContext(ProductosContext)
  if (!ctx) throw new Error('useProductos debe usarse dentro de ProductosProvider')
  return ctx
}
