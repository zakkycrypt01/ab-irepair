'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft, CreditCard } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

export default function CheckoutPage() {
  const router = useRouter()
  const [cart, setCart] = useState<CartItem[]>([])
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    country: '',
    zipCode: '',
    cardNumber: '',
    expiryDate: '',
    cvv: ''
  })

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cart') || '[]')
    setCart(savedCart)
  }, [])

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prevData: FormData) => ({
        ...prevData,
        [name]: value
    }))
}

interface CartItem {
    id: string
    name: string
    price: number
    quantity: number
}

interface FormData {
    name: string
    email: string
    address: string
    city: string
    country: string
    zipCode: string
    cardNumber: string
    expiryDate: string
    cvv: string
}

const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // Here you would typically send the order data to your server
    console.log('Order submitted:', { ...formData, cart, totalPrice })
    // Clear the cart
    localStorage.removeItem('cart')
    // Redirect to a thank you page
    router.push('/thank-you')
}

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <header className="bg-gray-800 py-4">
        <div className="container mx-auto px-4">
          <Link href="/sales" className="text-blue-400 hover:text-blue-300 flex items-center">
            <ChevronLeft className="mr-2" />
            Back to Store
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-semibold mb-4">Your Cart</h2>
            {cart.map(item => (
              <div key={item.id} className="flex justify-between items-center mb-4 bg-gray-800 p-4 rounded-lg">
                <div>
                  <h3 className="font-semibold">{item.name}</h3>
                  <p className="text-sm text-gray-400">Quantity: {item.quantity}</p>
                </div>
                <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
            <div className="text-xl font-bold mt-4">Total: ${totalPrice.toFixed(2)}</div>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4">Shipping and Payment</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input type="text" id="name" name="name" value={formData.name} onChange={handleInputChange} required className="bg-gray-800" />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} required className="bg-gray-800" />
              </div>
              <div>
                <Label htmlFor="address">Address</Label>
                <Input type="text" id="address" name="address" value={formData.address} onChange={handleInputChange} required className="bg-gray-800" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input type="text" id="city" name="city" value={formData.city} onChange={handleInputChange} required className="bg-gray-800" />
                </div>
                <div>
                  <Label htmlFor="country">Country</Label>
                  <Input type="text" id="country" name="country" value={formData.country} onChange={handleInputChange} required className="bg-gray-800" />
                </div>
              </div>
              <div>
                <Label htmlFor="zipCode">Zip Code</Label>
                <Input type="text" id="zipCode" name="zipCode" value={formData.zipCode} onChange={handleInputChange} required className="bg-gray-800" />
              </div>
              <div>
                <Label htmlFor="cardNumber">Card Number</Label>
                <Input type="text" id="cardNumber" name="cardNumber" value={formData.cardNumber} onChange={handleInputChange} required className="bg-gray-800" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="expiryDate">Expiry Date</Label>
                  <Input type="text" id="expiryDate" name="expiryDate" value={formData.expiryDate} onChange={handleInputChange} required placeholder="MM/YY" className="bg-gray-800" />
                </div>
                <div>
                  <Label htmlFor="cvv">CVV</Label>
                  <Input type="text" id="cvv" name="cvv" value={formData.cvv} onChange={handleInputChange} required className="bg-gray-800" />
                </div>
              </div>
              <Button type="submit" className="w-full">
                <CreditCard className="mr-2" />
                Place Order
              </Button>
            </form>
          </div>
        </div>
      </main>
    </div>
  )
}