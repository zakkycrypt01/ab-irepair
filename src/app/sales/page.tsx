'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Search, ShoppingCart } from 'lucide-react'
import lapimage1 from "/public/images/laptop1.jpg"
import lapimage2 from "/public/images/laptop2.jpg"
import access1 from "/public/images/powerbank.jpg"

const products = [
  { 
    id: 1, 
    name: "Elitebook 840 G3", 
    category: "laptop", 
    price: 295000, 
    image: lapimage1,
    description: "High-performance laptop with 8GB RAM, 256GB SSD, and the latest Intel Core i5 processor."
  },
  { 
    id: 2, 
    name: "Dell Latitude E7240", 
    category: "laptop", 
    price: 375000.00, 
    image: lapimage2,
    description: "Ultra-thin and light laptop with 4K display, 256GB SSD and 8GB RAM, and all-day battery life."
  },
  // { 
  //   id: 3, 
  //   name: "Phone Case Pro", 
  //   category: "accessory", 
  //   price: 29.99, 
  //   image: "/placeholder.svg?height=200&width=200",
  //   description: "Durable and stylish phone case with military-grade drop protection."
  // },
  // { 
  //   id: 4, 
  //   name: "Wireless Earbuds", 
  //   category: "accessory", 
  //   price: 79.99, 
  //   image: "/placeholder.svg?height=200&width=200",
  //   description: "True wireless earbuds with active noise cancellation and 24-hour battery life."
  // },
  // { 
  //   id: 5, 
  //   name: "10000mAh Power Bank", 
  //   category: "powerbank", 
  //   price: 49.99, 
  //   image: "/placeholder.svg?height=200&width=200",
  //   description: "Compact 10000mAh power bank with fast charging and dual USB ports."
  // },
  { 
    id: 6, 
    name: "20000mAh Power Bank", 
    category: "powerbank", 
    price: 17000, 
    image: access1,
    description: "High-capacity 20000mAh power bank with USB-C PD and Qi wireless charging."
  },
]

export default function SalesPage() {
  const [activeTab, setActiveTab] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")

  const filteredProducts = products.filter(product => 
    (activeTab === "all" || product.category === activeTab) &&
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <header className="bg-gray-800 py-4 sticky top-0 z-10">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex-col items-center space-x-4">
            <Link href="/" className="text-gray-300 hover:text-white transition duration-150 ease-in-out flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Main Page
            </Link>
            <h1 className="text-2xl font-bold">ABTECH iREPAIR Store</h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                className="pl-10 pr-4 py-2 rounded-full bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            </div>
            <button className="bg-gray-700 p-2 rounded-full hover:bg-gray-600 transition duration-150 ease-in-out">
              <ShoppingCart className="h-5 w-5" />
              <span className="sr-only">Shopping Cart</span>
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex space-x-2 bg-gray-800 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab("all")}
              className={`px-4 py-2 rounded-md ${activeTab === "all" ? "bg-blue-500 text-white" : "text-gray-300 hover:text-white"}`}
            >
              All Products
            </button>
            <button
              onClick={() => setActiveTab("laptop")}
              className={`px-4 py-2 rounded-md ${activeTab === "laptop" ? "bg-blue-500 text-white" : "text-gray-300 hover:text-white"}`}
            >
              Laptops
            </button>
            <button
              onClick={() => setActiveTab("accessory")}
              className={`px-4 py-2 rounded-md ${activeTab === "accessory" ? "bg-blue-500 text-white" : "text-gray-300 hover:text-white"}`}
            >
              Phone Accessories
            </button>
            <button
              onClick={() => setActiveTab("powerbank")}
              className={`px-4 py-2 rounded-md ${activeTab === "powerbank" ? "bg-blue-500 text-white" : "text-gray-300 hover:text-white"}`}
            >
              Power Banks
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map(product => (
            <div key={product.id} className="bg-gray-800 rounded-lg overflow-hidden shadow-lg transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-xl">
              <Image src={product.image} alt={product.name} width={300} height={200} className="w-full h-48 object-cover" />
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
                <p className="text-gray-400 text-sm mb-4">{product.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold"># {product.price.toFixed(2)}</span>
                  <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-150 ease-in-out">
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      <footer className="bg-gray-800 py-6 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2023 ABTECH iREPAIR. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}