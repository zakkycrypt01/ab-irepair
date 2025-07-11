'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft, Banknote, Loader2 } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { addOrder } from '../../../actions/addOrder'

interface CartItem {
  productId: number;
  name: string;
  price: number;
  quantity: number;
}

interface FormData {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  zipCode: string;
  paymentTransferId: string;
}

export default function CheckoutPage() {
  const router = useRouter()
  const [cart, setCart] = useState<CartItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    country: '',
    zipCode: '',
    paymentTransferId: ''
  })

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cart') || '[]')
    setCart(savedCart)
  }, [])

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target
    setFormData((prevData: FormData) => ({
      ...prevData,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      // Prepare order data
      const orderData = {
        customerInfo: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          country: formData.country,
          zipCode: formData.zipCode
        },
        items: cart,
        totalPrice: totalPrice,
        orderDate: new Date().toISOString(),
        paymentInfo: {
          transferId: formData.paymentTransferId,
          paymentMethod: 'Bank Transfer'
        }
      }

      // Submit order to server
      await addOrder(orderData)
      
      // Clear the cart
      localStorage.removeItem('cart')
      
      // Redirect to thank you page
      router.push('/thank-you')
    } catch (error) {
      console.error('Error submitting order:', error)
      setError('Failed to submit order. Please try again.')
    } finally {
      setIsLoading(false)
    }
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

        {cart.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-400 mb-4">Your cart is empty</p>
            <Link href="/sales" className="text-blue-400 hover:text-blue-300">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-semibold mb-4">Your Cart</h2>
              {cart.map(item => (
                <div key={item.productId} className="flex justify-between items-center mb-4 bg-gray-800 p-4 rounded-lg">
                  <div>
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="text-sm text-gray-400">Quantity: {item.quantity}</p>
                  </div>
                  <p className="font-semibold">₦{(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
              <div className="text-xl font-bold mt-4">Total: ₦{totalPrice.toFixed(2)}</div>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4">Shipping and Payment</h2>
              
              {error && (
                <div className="bg-red-900 border border-red-500 text-red-100 px-4 py-3 rounded mb-4">
                  {error}
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input 
                    type="text" 
                    id="name" 
                    name="name" 
                    value={formData.name} 
                    onChange={handleInputChange} 
                    required 
                    className="bg-gray-800 border-gray-700"
                    disabled={isLoading}
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    type="email" 
                    id="email" 
                    name="email" 
                    value={formData.email} 
                    onChange={handleInputChange} 
                    required 
                    className="bg-gray-800 border-gray-700"
                    disabled={isLoading}
                  />
                </div>
                <div>
                  <Label htmlFor="address">Address</Label>
                  <Input 
                    type="text" 
                    id="address" 
                    name="address" 
                    value={formData.address} 
                    onChange={handleInputChange} 
                    required 
                    className="bg-gray-800 border-gray-700"
                    disabled={isLoading}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input 
                      type="text" 
                      id="city" 
                      name="city" 
                      value={formData.city} 
                      onChange={handleInputChange} 
                      required 
                      className="bg-gray-800 border-gray-700"
                      disabled={isLoading}
                    />
                  </div>
                  <div>
                    <Label htmlFor="country">Country</Label>
                    <Input 
                      type="text" 
                      id="country" 
                      name="country" 
                      value={formData.country} 
                      onChange={handleInputChange} 
                      required 
                      className="bg-gray-800 border-gray-700"
                      disabled={isLoading}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="zipCode">Zip Code</Label>
                  <Input 
                    type="text" 
                    id="zipCode" 
                    name="zipCode" 
                    value={formData.zipCode} 
                    onChange={handleInputChange} 
                    required 
                    className="bg-gray-800 border-gray-700"
                    disabled={isLoading}
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input 
                    type="tel" 
                    id="phone" 
                    name="phone" 
                    value={formData.phone} 
                    onChange={handleInputChange} 
                    required 
                    className="bg-gray-800 border-gray-700"
                    placeholder="+2348123456789"
                    disabled={isLoading}
                  />
                </div>
                
                <div className="bg-gray-700 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-3">Payment Information</h3>
                  <p className="text-sm text-gray-300 mb-3">
                    Please make your payment via bank transfer and enter the transfer ID below:
                  </p>
                  <div className="bg-gray-800 p-3 rounded text-sm mb-3">
                    <p><strong>Bank Details:</strong></p>
                    <p>Account Name: Haliru Bamidele Abdullahi</p>
                    <p>Account Number: 1404116030</p>
                    <p>Bank: Access Bank</p>
                  </div>
                  <div>
                    <Label htmlFor="paymentTransferId">Payment Transfer ID</Label>
                    <Input 
                      type="text" 
                      id="paymentTransferId" 
                      name="paymentTransferId" 
                      value={formData.paymentTransferId} 
                      onChange={handleInputChange} 
                      required 
                      className="bg-gray-800 border-gray-700"
                      placeholder="Enter your bank transfer reference ID"
                      disabled={isLoading}
                    />
                  </div>
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-blue-500 hover:bg-blue-600"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Banknote className="mr-2" />
                      Place Order
                    </>
                  )}
                </Button>
              </form>
            </div>
          </div>
        )}
      </main>
      
      <footer className="bg-gray-800 py-6 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2025 ABTECH iREPAIR. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}