'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { CheckCircle, ArrowRight, Home, Printer, Download, ShoppingBag, Package } from 'lucide-react'
import jsPDF from 'jspdf'
import { Button } from "@/components/ui/button"

interface OrderData {
  orderId: string
  customerInfo: {
    name: string
    email: string
    phone: string
    address: string
    city: string
    country: string
    zipCode: string
  }
  items: {
    productId: string
    name: string
    price: number
    quantity: number
  }[]
  totalPrice: number
  orderDate: string
  paymentInfo: {
    transferId: string
    paymentMethod: string
    paymentStatus?: string
  }
  status: string
}

export default function ThankYouPage() {
  const [orderData, setOrderData] = useState<OrderData | null>(null)
  const [showDownloadNotification, setShowDownloadNotification] = useState(false)

  useEffect(() => {
    // Get order data from localStorage
    const lastOrder = localStorage.getItem('lastOrder')
    if (lastOrder) {
      try {
        const parsedOrder = JSON.parse(lastOrder)
        setOrderData(parsedOrder)

        // Auto-download receipt after successful order placement
        setTimeout(() => {
          handleDownloadReceipt(parsedOrder)
          setShowDownloadNotification(true)
          // Hide notification after 5 seconds
          setTimeout(() => setShowDownloadNotification(false), 5000)
        }, 2000) // Wait 2 seconds before auto-download
      } catch (error) {
        console.error('Error parsing order data:', error)
      }
    }
  }, [])

  const handlePrint = () => {
    window.print()
  }

  const handleDownloadReceipt = (order?: OrderData) => {
    const orderToUse = order || orderData
    if (!orderToUse) return

    const doc = new jsPDF()
    const pageWidth = doc.internal.pageSize.getWidth()
    const date = new Date(orderToUse.orderDate).toLocaleString()
    let yPos = 20

    // Header
    doc.setFontSize(20)
    doc.setFont('helvetica', 'bold')
    doc.text('ABTECH iREPAIR', pageWidth / 2, yPos, { align: 'center' })
    yPos += 8
    doc.setFontSize(14)
    doc.text('ORDER RECEIPT', pageWidth / 2, yPos, { align: 'center' })
    yPos += 10

    // Divider line
    doc.setLineWidth(0.5)
    doc.line(20, yPos, pageWidth - 20, yPos)
    yPos += 10

    // Order Info
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.text(`Order ID: ${orderToUse.orderId}`, 20, yPos)
    doc.text(`Date: ${date}`, pageWidth - 20, yPos, { align: 'right' })
    yPos += 6
    doc.text(`Status: ${orderToUse.status.toUpperCase()}`, 20, yPos)
    yPos += 12

    // Customer Information Section
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(12)
    doc.text('CUSTOMER INFORMATION', 20, yPos)
    yPos += 8
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(10)
    doc.text(`Name: ${orderToUse.customerInfo.name}`, 20, yPos)
    yPos += 6
    doc.text(`Email: ${orderToUse.customerInfo.email}`, 20, yPos)
    yPos += 6
    doc.text(`Phone: ${orderToUse.customerInfo.phone}`, 20, yPos)
    yPos += 12

    // Shipping Address Section
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(12)
    doc.text('SHIPPING ADDRESS', 20, yPos)
    yPos += 8
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(10)
    doc.text(orderToUse.customerInfo.address, 20, yPos)
    yPos += 6
    doc.text(`${orderToUse.customerInfo.city}, ${orderToUse.customerInfo.country}`, 20, yPos)
    yPos += 6
    doc.text(orderToUse.customerInfo.zipCode, 20, yPos)
    yPos += 12

    // Payment Information Section
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(12)
    doc.text('PAYMENT INFORMATION', 20, yPos)
    yPos += 8
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(10)
    doc.text(`Method: ${orderToUse.paymentInfo.paymentMethod}`, 20, yPos)
    yPos += 6
    doc.text(`Transfer ID: ${orderToUse.paymentInfo.transferId}`, 20, yPos)
    yPos += 6
    doc.text(`Status: ${orderToUse.paymentInfo.paymentStatus || 'Pending Verification'}`, 20, yPos)
    yPos += 12

    // Items Section
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(12)
    doc.text('ITEMS ORDERED', 20, yPos)
    yPos += 8

    // Table Header
    doc.setFillColor(240, 240, 240)
    doc.rect(20, yPos - 4, pageWidth - 40, 8, 'F')
    doc.setFontSize(10)
    doc.text('Item', 25, yPos)
    doc.text('Qty', 110, yPos)
    doc.text('Price', 130, yPos)
    doc.text('Subtotal', 160, yPos)
    yPos += 8

    // Table Items
    doc.setFont('helvetica', 'normal')
    orderToUse.items.forEach((item) => {
      if (yPos > 260) {
        doc.addPage()
        yPos = 20
      }
      doc.text(item.name.substring(0, 40), 25, yPos)
      doc.text(item.quantity.toString(), 110, yPos)
      doc.text(`₦${item.price.toFixed(2)}`, 130, yPos)
      doc.text(`₦${(item.price * item.quantity).toFixed(2)}`, 160, yPos)
      yPos += 8
    })

    // Divider line
    yPos += 4
    doc.line(20, yPos, pageWidth - 20, yPos)
    yPos += 10

    // Total
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(14)
    doc.text(`TOTAL: ₦${orderToUse.totalPrice.toFixed(2)}`, pageWidth - 20, yPos, { align: 'right' })
    yPos += 20

    // Footer
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(10)
    doc.text('Thank you for your order!', pageWidth / 2, yPos, { align: 'center' })
    yPos += 6
    doc.text('We will process it shortly and send you a confirmation email.', pageWidth / 2, yPos, { align: 'center' })
    yPos += 12
    doc.setFontSize(9)
    doc.text('ABTECH iREPAIR | Contact: info@abtech-irepair.com', pageWidth / 2, yPos, { align: 'center' })

    // Save the PDF
    doc.save(`ABTECH_Receipt_${orderToUse.orderId}.pdf`)
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4 print:bg-white print:text-black">
      <div className="max-w-3xl w-full mx-auto animate-in fade-in zoom-in duration-500">

        {/* Success Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 dark:bg-green-900/20 rounded-full mb-6 relative">
            <div className="absolute inset-0 bg-green-400/20 rounded-full animate-ping" />
            <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-500 relative z-10" />
          </div>

          <h1 className="text-4xl font-extrabold mb-4 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">Thank You!</h1>
          <p className="text-xl text-muted-foreground print:text-gray-600">
            Your order has been placed successfully.
          </p>

          {showDownloadNotification && (
            <div className="mt-6 mx-auto max-w-md bg-green-100 border border-green-200 text-green-800 px-4 py-3 rounded-xl flex items-center justify-center gap-2 animate-in slide-in-from-top-4 print:hidden">
              <CheckCircle className="h-5 w-5" />
              <span className="text-sm font-medium">Receipt auto-downloaded!</span>
            </div>
          )}
        </div>

        {orderData && (
          <div className="bg-card border border-border shadow-2xl rounded-2xl overflow-hidden print:shadow-none print:border-none">

            {/* Receipt Header */}
            <div className="bg-muted/50 p-6 border-b border-border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 print:hidden">
              <div>
                <h2 className="text-lg font-bold flex items-center gap-2">
                  <Package className="h-5 w-5 text-primary" /> Order Details
                </h2>
                <p className="text-sm text-muted-foreground">ID: #{orderData.orderId}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handlePrint} className="gap-2">
                  <Printer className="h-4 w-4" /> Print
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleDownloadReceipt()} className="gap-2">
                  <Download className="h-4 w-4" /> PDF
                </Button>
              </div>
            </div>

            <div className="p-8 print:p-0">
              {/* Print Header (Visible only when printing) */}
              <div className="hidden print:block text-center mb-8 border-b pb-8">
                <h1 className="text-3xl font-bold mb-2">ABTECH iREPAIR</h1>
                <p className="text-gray-500">Order Receipt</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div>
                  <h3 className="font-semibold text-muted-foreground mb-3 text-sm uppercase tracking-wider">Customer</h3>
                  <div className="bg-secondary/20 p-4 rounded-xl border border-border/50 space-y-1">
                    <p className="font-medium text-foreground">{orderData.customerInfo.name}</p>
                    <p className="text-sm text-muted-foreground">{orderData.customerInfo.email}</p>
                    <p className="text-sm text-muted-foreground">{orderData.customerInfo.phone}</p>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-muted-foreground mb-3 text-sm uppercase tracking-wider">Delivery Details</h3>
                  <div className="bg-secondary/20 p-4 rounded-xl border border-border/50 space-y-1">
                    <p className="text-sm text-foreground">{orderData.customerInfo.address}</p>
                    <p className="text-sm text-muted-foreground">{orderData.customerInfo.city}, {orderData.customerInfo.country}</p>
                    <p className="text-sm text-muted-foreground">{orderData.customerInfo.zipCode}</p>
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <h3 className="font-semibold text-muted-foreground mb-3 text-sm uppercase tracking-wider">Items</h3>
                <div className="border border-border rounded-xl overflow-hidden">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-muted/50 text-muted-foreground font-medium">
                      <tr>
                        <th className="px-4 py-3">Product</th>
                        <th className="px-4 py-3 text-center">Qty</th>
                        <th className="px-4 py-3 text-right">Price</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {orderData.items.map((item, index) => (
                        <tr key={index} className="bg-card">
                          <td className="px-4 py-3 font-medium">{item.name}</td>
                          <td className="px-4 py-3 text-center text-muted-foreground">{item.quantity}</td>
                          <td className="px-4 py-3 text-right">₦{(item.price * item.quantity).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-muted/30 font-bold">
                      <tr>
                        <td colSpan={2} className="px-4 py-3 text-right">Total</td>
                        <td className="px-4 py-3 text-right text-lg text-primary">₦{orderData.totalPrice.toLocaleString()}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              <div className="bg-secondary/30 p-4 rounded-xl border border-border flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Payment Method:</span>
                  <span className="font-medium ml-2">{orderData.paymentInfo.paymentMethod}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Transaction ID:</span>
                  <span className="font-mono bg-background px-2 py-1 rounded ml-2 border border-border">{orderData.paymentInfo.transferId}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Status:</span>
                  <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-500">
                    {orderData.paymentInfo.paymentStatus || 'Pending Verification'}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-muted/30 p-6 border-t border-border flex flex-col sm:flex-row gap-4 justify-center print:hidden">
              <Link href="/sales" className="w-full sm:w-auto">
                <Button className="w-full gap-2" size="lg">
                  <ShoppingBag className="h-4 w-4" /> Continue Shopping
                </Button>
              </Link>
              <Link href="/" className="w-full sm:w-auto">
                <Button variant="outline" className="w-full gap-2" size="lg">
                  <Home className="h-4 w-4" /> Back to Home
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>

      <style jsx global>{`
        @media print {
          body {
            background-color: white !important;
            color: black !important;
          }
           .print\\:hidden {
            display: none !important;
          }
          .print\\:block {
             display: block !important;
          }
        }
      `}</style>
    </div>
  )
}
