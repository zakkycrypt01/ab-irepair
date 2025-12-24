'use client'

import { getAllProduct } from '../../../actions/getAllProduct'
import { useState, useEffect } from 'react'
import type { StaticImageData } from 'next/image'
import Image from 'next/image'
import Link from 'next/link'
import { Search, ShoppingCart, ChevronLeft, X, Filter, Minus, Plus } from 'lucide-react'
import { Button } from "@/components/ui/button" // Assuming you might have these, but if not I'll stick to standard tailwind
// If components don't exist, I'll use standard Tailwind classes.

import lapimage1 from "/public/images/laptop1.jpg"
import lapimage2 from "/public/images/laptop2.jpg"
import access1 from "/public/images/powerbank.jpg"

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

export default function SalesPage() {
  const [activeTab, setActiveTab] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [cart, setCart] = useState<CartItem[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [products, setProducts] = useState<Product[]>([])

  // Tabs configuration
  const categories = [
    { id: "all", label: "All Products" },
    { id: "laptop", label: "Laptops" },
    { id: "accessory", label: "Accessories" },
    { id: "powerbank", label: "Power Banks" },
  ]

  useEffect(() => {
    const getProduct = async () => {
      try {
        const products = await getAllProduct();
        setProducts(products);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    getProduct();
  }, []);

  useEffect(() => {
    const savedCart = localStorage.getItem("cart")
    if (savedCart) {
      setCart(JSON.parse(savedCart))
    }
  }, [])

  const filteredProducts = products.filter(product =>
    (activeTab === "all" || product.category === activeTab) &&
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const addToCart = (product: Product) => {
    setCart((prevCart: CartItem[]) => {
      const existingItem = prevCart.find(item => item.productId === product.productId)
      let newCart: CartItem[]
      if (existingItem) {
        newCart = prevCart.map(item =>
          item.productId === product.productId ? { ...item, quantity: item.quantity + 1 } : item
        )
      } else {
        newCart = [...prevCart, { ...product, quantity: 1 }]
      }
      localStorage.setItem('cart', JSON.stringify(newCart))
      return newCart
    })
    setIsCartOpen(true) // Open cart to show visual feedback
  }

  const removeFromCart = (productId: number) => {
    setCart(prevCart => {
      const newCart = prevCart.filter(item => item.productId !== productId)
      localStorage.setItem('cart', JSON.stringify(newCart))
      return newCart
    })
  }

  const updateQuantity = (productId: number, quantity: number) => {
    setCart(prevCart => {
      const newCart = prevCart.map(item =>
        item.productId === productId ? { ...item, quantity: quantity } : item
      )
      localStorage.setItem('cart', JSON.stringify(newCart))
      return newCart
    })
  }

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center text-muted-foreground hover:text-green-500 transition-colors">
              <ChevronLeft className="h-5 w-5 mr-1" />
              <span className="hidden sm:inline-block font-medium">Main Site</span>
            </Link>
            <div className="h-6 w-px bg-border mx-2 hideen sm:block" />
            <h1 className="text-xl font-bold bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text text-transparent">
              Store
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <input
                type="text"
                placeholder="Search products..."
                className="pl-10 pr-4 py-2 w-64 rounded-full bg-secondary text-sm focus:outline-none focus:ring-2 focus:ring-green-500 border border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            </div>

            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 rounded-full hover:bg-secondary transition-colors"
              aria-label="Open cart"
            >
              <ShoppingCart className="h-6 w-6 text-foreground" />
              {totalItems > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center ring-2 ring-background">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar (visible only on small screens) */}
        <div className="md:hidden px-4 pb-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search products..."
              className="pl-10 pr-4 py-2 w-full rounded-full bg-secondary text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 flex-1">
        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-8 justify-center md:justify-start">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveTab(cat.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border ${activeTab === cat.id
                  ? "bg-green-500 text-white border-green-600 shadow-md"
                  : "bg-card text-muted-foreground border-border hover:border-green-500 hover:text-green-500"
                }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg">No products found matching your criteria.</p>
            <button onClick={() => { setActiveTab("all"); setSearchTerm(""); }} className="mt-4 text-green-500 hover:underline">Clear filters</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map(product => (
              <div key={product.productId} className="group bg-card rounded-xl overflow-hidden border border-border/50 hover:shadow-xl hover:border-green-500/30 transition-all duration-300 flex flex-col h-full">
                <div className="relative aspect-auto h-48 overflow-hidden bg-secondary">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                </div>

                <div className="p-5 flex flex-col flex-1">
                  <div className="flex-1">
                    <p className="text-xs text-green-500 font-semibold mb-1 uppercase tracking-wider">{product.category}</p>
                    <h3 className="text-lg font-bold text-foreground mb-2 line-clamp-2 leading-tight">{product.name}</h3>
                    <p className="text-muted-foreground text-sm line-clamp-2 mb-4">{product.description}</p>
                  </div>

                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                    <span className="text-xl font-bold text-foreground">₦{product.price.toLocaleString()}</span>
                    <button
                      onClick={() => addToCart(product)}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm hover:shadow active:scale-95 transform"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Cart Sidebar Overlay - Fixed positioning */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop to close */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={() => setIsCartOpen(false)} />

          <div className="relative w-full max-w-md bg-background h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300 border-l border-border">
            <div className="p-4 border-b border-border flex items-center justify-between bg-muted/30">
              <div className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5 text-green-500" />
                <h2 className="text-lg font-bold">Your Cart ({totalItems})</h2>
              </div>
              <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-secondary rounded-full text-muted-foreground transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-4">
                  <div className="bg-secondary p-4 rounded-full">
                    <ShoppingCart className="h-12 w-12 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground">Your cart looks empty.</p>
                  <button onClick={() => setIsCartOpen(false)} className="text-green-500 font-medium hover:underline">
                    Start Shopping
                  </button>
                </div>
              ) : (
                cart.map(item => (
                  <div key={item.productId} className="flex gap-4 p-3 rounded-lg bg-card border border-border shadow-sm">
                    <div className="w-20 h-20 bg-secondary rounded-md overflow-hidden relative flex-shrink-0">
                      <Image src={item.image} alt={item.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="font-semibold text-sm line-clamp-1">{item.name}</h3>
                        <p className="text-xs text-muted-foreground">Unit: ₦{item.price.toLocaleString()}</p>
                      </div>

                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-1 bg-secondary rounded-lg p-1">
                          <button
                            onClick={() => updateQuantity(item.productId, Math.max(1, item.quantity - 1))}
                            className="w-6 h-6 flex items-center justify-center rounded bg-background hover:text-red-500 transition-colors shadow-sm"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                            className="w-6 h-6 flex items-center justify-center rounded bg-background hover:text-green-500 transition-colors shadow-sm"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                        <button onClick={() => removeFromCart(item.productId)} className="text-xs text-red-500 hover:underline">
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-6 border-t border-border bg-muted/20">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-muted-foreground">Total</span>
                  <span className="text-2xl font-bold text-foreground">₦{totalPrice.toLocaleString()}</span>
                </div>
                <Link href="/checkout" className="w-full">
                  <button className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-xl shadow-lg transition-all active:scale-[0.98]">
                    Proceed to Checkout
                  </button>
                </Link>
                <button onClick={() => setIsCartOpen(false)} className="w-full mt-3 text-sm text-muted-foreground hover:text-foreground text-center">
                  Continue Shopping
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}