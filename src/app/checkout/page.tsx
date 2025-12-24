'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft, Banknote, Loader2, CreditCard, ShieldCheck } from 'lucide-react'
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

      await addOrder(orderData)
      localStorage.removeItem('cart')
      router.push('/thank-you')
    } catch (error) {
      console.error('Error submitting order:', error)
      setError('Failed to submit order. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <header className="border-b border-border bg-background/95 backdrop-blur sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/sales" className="text-muted-foreground hover:text-primary transition-colors flex items-center text-sm font-medium">
            <ChevronLeft className="mr-1 h-4 w-4" />
            Back to Store
          </Link>
          <div className="h-4 w-px bg-border mx-2" />
          <h1 className="text-lg font-bold">Secure Checkout</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 md:py-12">
        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[50vh] text-center space-y-4">
            <div className="p-4 bg-secondary rounded-full">
              <Banknote className="h-12 w-12 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-bold">Your cart is empty</h2>
            <p className="text-muted-foreground">Looks like you haven't added anything yet.</p>
            <Link href="/sales">
              <Button>Continue Shopping</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">

            {/* Left Column - Forms */}
            <div className="lg:col-span-7 space-y-8">
              <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-primary/10 p-2 rounded-lg text-primary">
                    <ShieldCheck className="h-6 w-6" />
                  </div>
                  <h2 className="text-xl font-bold">Shipping Information</h2>
                </div>

                <form id="checkout-form" onSubmit={handleSubmit} className="space-y-4">
                  {/* Error Message */}
                  {error && (
                    <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm px-4 py-3 rounded-lg mb-4">
                      {error}
                    </div>
                  )}

                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input type="text" id="name" name="name" value={formData.name} onChange={handleInputChange} required className="bg-background" disabled={isLoading} />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} required className="bg-background" disabled={isLoading} />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleInputChange} required className="bg-background" placeholder="+234..." disabled={isLoading} />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="address">Address</Label>
                    <Input type="text" id="address" name="address" value={formData.address} onChange={handleInputChange} required className="bg-background" disabled={isLoading} />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input type="text" id="city" name="city" value={formData.city} onChange={handleInputChange} required className="bg-background" disabled={isLoading} />
                    </div>
                    <div>
                      <Label htmlFor="zipCode">Zip Code</Label>
                      <Input type="text" id="zipCode" name="zipCode" value={formData.zipCode} onChange={handleInputChange} required className="bg-background" disabled={isLoading} />
                    </div>
                    <div>
                      <Label htmlFor="country">Country</Label>
                      <Input type="text" id="country" name="country" value={formData.country} onChange={handleInputChange} required className="bg-background" disabled={isLoading} />
                    </div>
                  </div>
                </form>
              </div>

              <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-primary/10 p-2 rounded-lg text-primary">
                    <CreditCard className="h-6 w-6" />
                  </div>
                  <h2 className="text-xl font-bold">Payment Method</h2>
                </div>

                <div className="bg-secondary/50 rounded-lg p-4 border border-border mb-6">
                  <p className="text-sm font-medium mb-1">Bank Transfer Instruction</p>
                  <p className="text-xs text-muted-foreground mb-4">Make payment to the account below and enter transaction ID.</p>

                  <div className="grid gap-2 text-sm bg-background p-3 rounded border border-border">
                    <div className="flex justify-between"><span className="text-muted-foreground">Bank:</span> <span className="font-medium">Access Bank</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Account Number:</span> <span className="font-mono font-bold select-all">1404116030</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Account Name:</span> <span className="font-medium">Haliru Bamidele Abdullahi</span></div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="paymentTransferId">Transaction Reference ID</Label>
                  <Input
                    type="text"
                    id="paymentTransferId"
                    name="paymentTransferId"
                    value={formData.paymentTransferId}
                    onChange={handleInputChange}
                    required
                    form="checkout-form"
                    className="bg-background"
                    placeholder="e.g. TRF-123456789"
                    disabled={isLoading}
                  />
                </div>
              </div>
            </div>

            {/* Right Column - Summary */}
            <div className="lg:col-span-5 lg:sticky lg:top-24">
              <div className="bg-card border border-border rounded-xl p-6 shadow-lg">
                <h3 className="text-lg font-bold mb-4">Order Summary</h3>
                <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                  {cart.map(item => (
                    <div key={item.productId} className="flex justify-between items-start py-3 border-b border-border last:border-0">
                      <div>
                        <p className="font-medium text-sm line-clamp-1">{item.name}</p>
                        <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-semibold text-sm">₦{(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                  ))}
                </div>

                <div className="pt-4 mt-2 border-t border-border space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>₦{totalPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="text-green-500 font-medium">Free</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold pt-2">
                    <span>Total</span>
                    <span>₦{totalPrice.toLocaleString()}</span>
                  </div>
                </div>

                <Button
                  type="submit"
                  form="checkout-form"
                  className="w-full mt-6 bg-green-600 hover:bg-green-700 text-white font-bold h-12"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Banknote className="mr-2 h-4 w-4" />
                      Complete Order
                    </>
                  )}
                </Button>
                <p className="text-xs text-center text-muted-foreground mt-4">
                  By placing this order, you agree to our Terms of Service.
                </p>
              </div>
            </div>

          </div>
        )}
      </main>
    </div>
  )
}