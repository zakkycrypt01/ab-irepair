'use client'

import { getAllProduct } from '../../../actions/getAllProduct'
import { useState, useEffect } from 'react'
import type { StaticImageData } from 'next/image'
import Image from 'next/image'
import Link from 'next/link'
import { Search, ShoppingCart, ChevronLeft, X} from 'lucide-react'
import lapimage1 from "/public/images/laptop1.jpg"
import lapimage2 from "/public/images/laptop2.jpg"
import access1 from "/public/images/powerbank.jpg"


export default function SalesPage() {
  const [activeTab, setActiveTab] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [cart, setCart] = useState<CartItem[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    const getProduct = async () => {
      try {
        const products = await getAllProduct();
        console.log(products);
        setProducts(products);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
  
    getProduct();
  }, []);
  

  const filteredProducts = products.filter(product => 
    (activeTab === "all" || product.category === activeTab) &&
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  interface Product {
    productId: number;
    name: string;
    category: string;
    price: number;
    image: StaticImageData;
    description: string;
  }

  interface CartItem extends Product {
    quantity: number;
  }

  const addToCart = (product: Product) => {
    setCart((prevCart: CartItem[]) => {
      const existingItem = prevCart.find(item => item.productId === product.productId)
      if (existingItem) {
        return prevCart.map(item => 
          item.productId === product.productId ? { ...item, quantity: item.quantity + 1 } : item
        )
      } else {
        return [...prevCart, { ...product, quantity: 1 }]
      }
    })
  }

  const removeFromCart = (productId: number) => {
    setCart(prevCart => prevCart.filter(item => item.productId !== productId))
  }

  const updateQuantity = (productId: number, quantity: number) => {
    setCart(prevCart => 
      prevCart.map(item =>
        item.productId === productId ? { ...item, quantity : quantity } : item
      )
    )
  }

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  useEffect(() => {
    const savedCart = localStorage.getItem("cart")
    if (savedCart) {
      setCart(JSON.parse(savedCart))
    }
  }, [])

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <header className="bg-gray-800 py-4 sticky top-0 z-10">
        <div className="container mx-auto px-4 flex-col justify-between items-center">
          <div className="flex items-center justify-between mb-3 space-x-4">
            <Link href="/" className="text-gray-300 hover:text-white transition duration-150 ease-in-out flex items-center relative">
            <ChevronLeft className="mr-2" />
              Main Page
            </Link>
          </div>
          <div className="flex mb-4 justify-between items-center">
            <h1 className="text-xl font-bold">ABTECH iREPAIR Store</h1>
            <button className="bg-gray-700 p-2 rounded-full hover:bg-gray-600 transition duration-150 ease-in-out relative">
            <ShoppingCart className="h-6 w-6 text-white" />
            <span className="sr-only">Shopping Cart</span>
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
              {totalItems}
                </span>
              )}
            </button>
          </div>

            <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-4">        
            <div className="relative flex justify-end items-center value style = w-400 md:w-auto">
              <input
              type="text"
              placeholder="Search products..."
              className="pl-10 pr-4 py-2 rounded-full bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-64"
              value={searchTerm}
              style={{width: "400px"}}
              onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            </div>
            
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
            <div key={product.productId} className="bg-gray-800 rounded-lg overflow-hidden shadow-lg transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-xl">
              <Image src={product.image} alt={product.name} width={300} height={200} className="w-full h-48 object-cover" />
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
                <p className="text-gray-400 text-sm mb-4">{product.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold"># {product.price.toFixed(2)}</span>
                  <button 
                  onClick={()=> addToCart(product)}
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-150 ease-in-out">
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
      <div className="fixed bottom-4 right-4">
        <button 
          onClick={() => setIsCartOpen(true)}
          className="bg-blue-500 text-white p-3 rounded-full hover:bg-blue-600 transition duration-150 ease-in-out"
        >
          <ShoppingCart className="h-6 w-6" />
          {totalItems > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
              {totalItems}
            </span>
          )}
        </button>
      </div>
      {isCartOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end">
          <div className="bg-gray-800 w-full max-w-md p-6 overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Your Cart</h2>
              <button onClick={() => setIsCartOpen(false)} className="text-gray-500 hover:text-white">
                <X className="h-6 w-6" />
              </button>
            </div>
            {cart.length === 0 ? (
              <p>Your cart is empty.</p>
            ) : (
              <>
                {cart.map(item => (
                  <div key={item.productId} className="flex items-center justify-between py-4 border-b border-gray-700">
                    <div>
                      <h3 className="font-semibold">{item.name}</h3>
                      <p className="text-sm text-gray-400">${item.price.toFixed(2)} x {item.quantity}</p>
                    </div>
                    <div className="flex items-center">
                      <button 
                        onClick={() => updateQuantity(item.productId, Math.max(1, item.quantity - 1))}
                        className="px-2 py-1 bg-gray-700 rounded-l"
                      >
                        -
                      </button>
                      <span className="px-4 py-1 bg-gray-700">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        className="px-2 py-1 bg-gray-700 rounded-r"
                      >
                        +
                      </button>
                      <button 
                        onClick={() => removeFromCart(item.productId)}
                        className="ml-2 text-red-500 hover:text-red-600"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
                <div className="mt-4">
                  <p className="text-xl font-bold">Total: ${totalPrice.toFixed(2)}</p>
                  <Link href="/checkout" className="w-full mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-150 ease-in-out inline-block text-center">
                    Checkout
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <footer className="bg-gray-800 py-6 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2023 ABTECH iREPAIR. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}