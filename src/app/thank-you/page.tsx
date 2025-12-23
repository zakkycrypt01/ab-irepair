'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { CheckCircle, ArrowRight, Home, Printer, Download } from 'lucide-react'
import jsPDF from 'jspdf'

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
    <>
      <div className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center print:bg-white print:text-black">
        <div className="max-w-4xl w-full mx-auto p-4">
          <div className="bg-gray-800 rounded-lg p-8 shadow-xl print:bg-white print:shadow-none print:rounded-none">
            <div className="text-center mb-8">
              <div className="flex justify-center mb-6">
                <CheckCircle className="h-16 w-16 text-green-500" />
              </div>
              
              <h1 className="text-3xl font-bold mb-4">Thank You!</h1>
              
              <p className="text-gray-300 mb-6 print:text-gray-600">
                Your order has been successfully placed. We'll process it shortly and send you a confirmation email.
              </p>
              
              {showDownloadNotification && (
                <div className="bg-green-600 text-white p-3 rounded-lg mb-6 print:hidden">
                  <p className="text-sm">✅ Receipt has been automatically downloaded to your device!</p>
                </div>
              )}
            </div>

            {orderData && (
              <div className="mb-8">
                <div className="bg-gray-700 rounded-lg p-6 mb-6 print:bg-gray-100 print:border print:border-gray-300">
                  <h2 className="text-xl font-semibold mb-4 print:text-black">Order Receipt</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <h3 className="font-semibold mb-2 print:text-black">Order Details</h3>
                      <p className="text-sm text-gray-300 print:text-gray-600">Order ID: {orderData.orderId}</p>
                      <p className="text-sm text-gray-300 print:text-gray-600">Date: {new Date(orderData.orderDate).toLocaleString()}</p>
                      <p className="text-sm text-gray-300 print:text-gray-600">Status: {orderData.status.toUpperCase()}</p>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold mb-2 print:text-black">Customer Information</h3>
                      <p className="text-sm text-gray-300 print:text-gray-600">{orderData.customerInfo.name}</p>
                      <p className="text-sm text-gray-300 print:text-gray-600">{orderData.customerInfo.email}</p>
                      <p className="text-sm text-gray-300 print:text-gray-600">{orderData.customerInfo.phone}</p>
                      <p className="text-sm text-gray-300 print:text-gray-600">{orderData.customerInfo.address}</p>
                      <p className="text-sm text-gray-300 print:text-gray-600">{orderData.customerInfo.city}, {orderData.customerInfo.country} {orderData.customerInfo.zipCode}</p>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h3 className="font-semibold mb-2 print:text-black">Payment Information</h3>
                    <div className="bg-gray-600 rounded p-3 print:bg-gray-200">
                      <p className="text-sm text-gray-300 print:text-gray-600">Method: {orderData.paymentInfo.paymentMethod}</p>
                      <p className="text-sm text-gray-300 print:text-gray-600">Transfer ID: {orderData.paymentInfo.transferId}</p>
                      <p className="text-sm text-gray-300 print:text-gray-600">Status: {orderData.paymentInfo.paymentStatus || 'Pending Verification'}</p>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h3 className="font-semibold mb-4 print:text-black">Items Ordered</h3>
                    <div className="space-y-3">
                      {orderData.items.map((item, index) => (
                        <div key={index} className="flex justify-between items-center border-b border-gray-600 pb-2 print:border-gray-300">
                          <div>
                            <p className="font-medium print:text-black">{item.name}</p>
                            <p className="text-sm text-gray-400 print:text-gray-600">Quantity: {item.quantity}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium print:text-black">₦{(item.price * item.quantity).toFixed(2)}</p>
                            <p className="text-sm text-gray-400 print:text-gray-600">₦{item.price.toFixed(2)} each</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="text-right border-t border-gray-600 pt-4 print:border-gray-300">
                    <p className="text-2xl font-bold print:text-black">Total: ₦{orderData.totalPrice.toFixed(2)}</p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 mb-6 print:hidden">
                  <button
                    onClick={handlePrint}
                    className="flex items-center justify-center bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 transition duration-150 ease-in-out"
                  >
                    <Printer className="mr-2 h-5 w-5" />
                    Print Receipt
                  </button>
                  
                  <button
                    onClick={() => handleDownloadReceipt()}
                    className="flex items-center justify-center bg-purple-600 text-white px-6 py-3 rounded-md hover:bg-purple-700 transition duration-150 ease-in-out"
                  >
                    <Download className="mr-2 h-5 w-5" />
                    Download Receipt
                  </button>
                </div>
              </div>
            )}
            
            <div className="space-y-4 print:hidden">
              <Link 
                href="/sales" 
                className="w-full bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600 transition duration-150 ease-in-out flex items-center justify-center"
              >
                <ArrowRight className="mr-2 h-5 w-5" />
                Continue Shopping
              </Link>
              
              <Link 
                href="/" 
                className="w-full bg-gray-700 text-white px-6 py-3 rounded-md hover:bg-gray-600 transition duration-150 ease-in-out flex items-center justify-center"
              >
                <Home className="mr-2 h-5 w-5" />
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        @media print {
          @page {
            margin: 0.5in;
            size: A4;
          }
          
          body {
            font-size: 12px;
            line-height: 1.4;
          }
          
          .print\\:hidden {
            display: none !important;
          }
          
          .print\\:bg-white {
            background-color: white !important;
          }
          
          .print\\:text-black {
            color: black !important;
          }
          
          .print\\:text-gray-600 {
            color: #666 !important;
          }
          
          .print\\:bg-gray-100 {
            background-color: #f5f5f5 !important;
          }
          
          .print\\:border {
            border: 1px solid #ddd !important;
          }
          
          .print\\:border-gray-300 {
            border-color: #ddd !important;
          }
          
          .print\\:shadow-none {
            box-shadow: none !important;
          }
          
          .print\\:rounded-none {
            border-radius: 0 !important;
          }
        }
      `}</style>
    </>
  )
}
