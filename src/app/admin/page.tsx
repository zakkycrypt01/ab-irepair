'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Trash2, Upload } from 'lucide-react'

// Mock data for orders
const initialOrders = [
  { id: 1, customer: 'John Doe', total: 1299.99, status: 'Pending' },
  { id: 2, customer: 'Jane Smith', total: 79.99, status: 'Shipped' },
  // Add more mock orders as needed
]

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('orders')
  const [orders, setOrders] = useState(initialOrders)
  const [products, setProducts] = useState<{ id: number; name: string; category: string; price: string; description: string; image: string | null }[]>([])
  const [newProduct, setNewProduct] = useState<NewProduct>({
    name: '',
    category: '',
    price: '',
    description: '',
    image: null
  })

  useEffect(() => {
    // In a real application, you would fetch orders and products from an API
    setProducts(JSON.parse(localStorage.getItem('products') || '[]'))
  }, [])

const handleProductSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const productToAdd: Product = {
        ...newProduct,
        id: Date.now(),
        image: newProduct.image instanceof File ? URL.createObjectURL(newProduct.image) : '/placeholder.svg?height=200&width=300'
    }
    setProducts([...products, productToAdd])
    localStorage.setItem('products', JSON.stringify([...products, productToAdd]))
    setNewProduct({ name: '', category: '', price: '', description: '', image: null })
}

interface Order {
    id: number;
    customer: string;
    total: number;
    status: string;
}

interface Product {
    id: number;
    name: string;
    category: string;
    price: string;
    description: string;
    image: string | null;
}

interface NewProduct {
    name: string;
    category: string;
    price: string;
    description: string;
    image: File | string | null;
}

const deleteProduct = (productId: number) => {
    const updatedProducts = products.filter((product: Product) => product.id !== productId)
    setProducts(updatedProducts)
    localStorage.setItem('products', JSON.stringify(updatedProducts))
}

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      
      <div className="mb-8">
        <button
          onClick={() => setActiveTab('orders')}
          className={`mr-4 px-4 py-2 rounded ${activeTab === 'orders' ? 'bg-blue-500' : 'bg-gray-700'}`}
        >
          Orders
        </button>
        <button
          onClick={() => setActiveTab('products')}
          className={`px-4 py-2 rounded ${activeTab === 'products' ? 'bg-blue-500' : 'bg-gray-700'}`}
        >
          Products
        </button>
      </div>

      {activeTab === 'orders' && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Orders</h2>
          <table className="w-full bg-gray-800 rounded-lg overflow-hidden">
            <thead className="bg-gray-700">
              <tr>
                <th className="p-3 text-left">Order ID</th>
                <th className="p-3 text-left">Customer</th>
                <th className="p-3 text-left">Total</th>
                <th className="p-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order.id} className="border-t border-gray-700">
                  <td className="p-3">{order.id}</td>
                  <td className="p-3">{order.customer}</td>
                  <td className="p-3">${order.total.toFixed(2)}</td>
                  <td className="p-3">{order.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'products' && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Products</h2>
          <form onSubmit={handleProductSubmit} className="mb-8 bg-gray-800 p-6 rounded-lg">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-2">Name</label>
                <input
                  type="text"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                  className="w-full p-2 bg-gray-700 rounded"
                  required
                />
              </div>
              <div>
                <label className="block mb-2">Category</label>
                <input
                  type="text"
                  value={newProduct.category}
                  onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                  className="w-full p-2 bg-gray-700 rounded"
                  required
                />
              </div>
              <div>
                <label className="block mb-2">Price</label>
                <input
                  type="number"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                  className="w-full p-2 bg-gray-700 rounded"
                  required
                />
              </div>
              <div>
                <label className="block mb-2">Image</label>
                <input
                  type="file"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setNewProduct({...newProduct, image: e.target.files[0]})
                    }
                  }}
                  className="w-full p-2 bg-gray-700 rounded"
                  accept="image/*"
                />
              </div>
              <div className="col-span-2">
                <label className="block mb-2">Description</label>
                <textarea
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                  className="w-full p-2 bg-gray-700 rounded"
                  rows={3}
                  required
                ></textarea>
              </div>
            </div>
            <button type="submit" className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
              Add Product
            </button>
          </form>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map(product => (
              <div key={product.id} className="bg-gray-800 rounded-lg overflow-hidden shadow-lg">
                <Image src={product.image || "/placeholder.svg"} alt={product.name} width={300} height={200} className="w-full h-48 object-cover" />
                <div className="p-4">
                  <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
                  <p className="text-gray-400 text-sm mb-4">{product.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold">${parseFloat(product.price).toFixed(2)}</span>
                    <button
                      onClick={() => deleteProduct(product.id)}
                      className="bg-red-500 text-white p-2 rounded hover:bg-red-600"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}