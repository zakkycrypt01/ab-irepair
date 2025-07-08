"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronLeft, FileText, Smartphone, Download } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import jsPDF from 'jspdf'

export default function DeviceRegistrationPage() {
  const [formData, setFormData] = useState({
    ownerName: "",
    ownerPhone: "",
    date: new Date().toISOString().split("T")[0],
    phoneBrand: "",
    phoneModel: "",
    phoneSerialNumber: "",
    phoneProblem: "",
    phoneBatteryType: "",
    phoneBatteryBrand: "",
    phoneColor: "",
    customerSignature: "",
    agreeToTerms: false,
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const generatePDF = (data: typeof formData) => {
    const doc = new jsPDF()
    
    // Set up the document
    doc.setFontSize(20)
    doc.setFont('helvetica', 'bold')
    doc.text('ABTECH - Phone Repair Agreement Slip', 105, 20, { align: 'center' })
    
    // Add a line separator
    doc.setLineWidth(0.5)
    doc.line(20, 25, 190, 25)
    
    let yPosition = 40
    
    // Customer Information Section
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.text('Customer Information:', 20, yPosition)
    yPosition += 10
    
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.text(`Name: ${data.ownerName}`, 20, yPosition)
    yPosition += 6
    doc.text(`Phone: ${data.ownerPhone}`, 20, yPosition)
    yPosition += 6
    doc.text(`Date: ${data.date}`, 20, yPosition)
    yPosition += 15
    
    // Device Information Section
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.text('Device Information:', 20, yPosition)
    yPosition += 10
    
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.text(`Brand: ${data.phoneBrand}`, 20, yPosition)
    yPosition += 6
    doc.text(`Model: ${data.phoneModel}`, 20, yPosition)
    yPosition += 6
    doc.text(`Serial Number: ${data.phoneSerialNumber || 'Not provided'}`, 20, yPosition)
    yPosition += 6
    doc.text(`Color: ${data.phoneColor || 'Not provided'}`, 20, yPosition)
    yPosition += 15
    
    // Battery Information Section
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.text('Battery Information:', 20, yPosition)
    yPosition += 10
    
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.text(`Type: ${data.phoneBatteryType || 'Not provided'}`, 20, yPosition)
    yPosition += 6
    doc.text(`Brand: ${data.phoneBatteryBrand || 'Not provided'}`, 20, yPosition)
    yPosition += 15
    
    // Problem Description Section
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.text('Problem Description:', 20, yPosition)
    yPosition += 10
    
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    const problemLines = doc.splitTextToSize(data.phoneProblem, 170)
    doc.text(problemLines, 20, yPosition)
    yPosition += problemLines.length * 6 + 15
    
    // Terms and Conditions Section
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.text('Terms and Conditions:', 20, yPosition)
    yPosition += 10
    
    doc.setFontSize(9)
    doc.setFont('helvetica', 'normal')
    const terms = [
      '1. We charge 1,000 naira for checking the phone problem and is non-refundable.',
      '2. It will take us approximately three working days to check the phone and give you result.',
      '3. After checking the phone, we will notify you about the phone, and you must make payment before we work on the phone.',
      '4. We do not have any phone component here example IC, PCB etc so it will take a long time for you to get the phone.',
      '5. It may take four weeks or less for us to finish the repair.',
      '6. On no account should you call us everyday disturbing us about the phone.',
      '7. We will call you when we are done. We will refund your money if we cannot fix the phone.'
    ]
    
    terms.forEach(term => {
      const termLines = doc.splitTextToSize(term, 170)
      doc.text(termLines, 20, yPosition)
      yPosition += termLines.length * 5 + 3
    })
    
    yPosition += 10
    
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.text('Signatures:', 20, yPosition)
    yPosition += 15
    
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.text(`Customer: ${data.customerSignature}`, 20, yPosition)
    doc.text('Technician: ABTECH', 120, yPosition)
    
    yPosition += 20
    doc.setFontSize(8)
    doc.setFont('helvetica', 'italic')
    doc.text('Customer agrees to all terms and conditions stated above.', 105, yPosition, { align: 'center' })
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5)
    const filename = `ABTECH_Repair_Agreement_${data.ownerName.replace(/\s+/g, '_')}_${timestamp}.pdf`
    
    doc.save(filename)
  }

  const sendToTelegram = async (data: typeof formData) => {
    const BOT_TOKEN = process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN || "YOUR_BOT_TOKEN"
    const CHAT_ID = process.env.NEXT_PUBLIC_TELEGRAM_CHAT_ID || "YOUR_CHAT_ID"
    
    const message = `
🔧 New Device Registration - ABTECH

👤 Customer Information:
• Name: ${data.ownerName}
• Phone: ${data.ownerPhone}
• Date: ${data.date}

📱 Device Details:
• Brand: ${data.phoneBrand}
• Model: ${data.phoneModel}
• Serial Number: ${data.phoneSerialNumber || 'Not provided'}
• Color: ${data.phoneColor || 'Not provided'}

🔋 Battery Information:
• Type: ${data.phoneBatteryType || 'Not provided'}
• Brand: ${data.phoneBatteryBrand || 'Not provided'}

⚠️ Problem Description:
${data.phoneProblem}

✍️ Signatures:
• Customer: ${data.customerSignature}
• Technician: ABTECH

✅ Terms and conditions agreed
    `.trim()

    try {
      const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: CHAT_ID,
          text: message,
        }),
      })

      const result = await response.json()
      
      if (!response.ok) {
        console.error('Telegram API Error:', result)
        throw new Error('Failed to send message to Telegram')
      }

      return true
    } catch (error) {
      console.error('Error sending to Telegram:', error)
      return false
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!formData.agreeToTerms) {
      alert("Please agree to the terms and conditions")
      return
    }
    if (!formData.customerSignature.trim()) {
      alert("Please provide your signature")
      return
    }

    try {
      // Show loading state - use a more reliable way to find the button
      const form = e.currentTarget
      const submitButton = form?.querySelector('button[type="submit"]') as HTMLButtonElement
      
      if (submitButton) {
        submitButton.disabled = true
        submitButton.textContent = 'Sending...'
      }

      const success = await sendToTelegram(formData)
      
      if (success) {
        generatePDF(formData)
        
        alert("Device registration submitted successfully and sent to ABTECH! Your agreement slip has been downloaded as PDF.")
        setFormData({
          ownerName: "",
          ownerPhone: "",
          date: new Date().toISOString().split("T")[0],
          phoneBrand: "",
          phoneModel: "",
          phoneSerialNumber: "",
          phoneProblem: "",
          phoneBatteryType: "",
          phoneBatteryBrand: "",
          phoneColor: "",
          customerSignature: "",
          agreeToTerms: false,
        })
      } else {
        alert("Registration saved locally, but failed to send to Telegram. Please contact ABTECH directly.")
      }
    } catch (error) {
      console.error('Submission error:', error)
      alert("An error occurred. Please try again or contact ABTECH directly.")
    } finally {
      // Reset button state - use a more reliable method
      setTimeout(() => {
        const submitButton = document.querySelector('button[type="submit"]') as HTMLButtonElement
        if (submitButton) {
          submitButton.disabled = false
          submitButton.innerHTML = '<svg class="mr-2" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14,2 14,8 20,8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10,9 9,9 8,9"></polyline></svg>Submit Registration'
        }
      }, 100)
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 text-gray-100">
      <header className="bg-slate-800 py-4 border-b border-slate-700">
        <div className="container mx-auto px-4">
          <Link href="/" className="text-blue-400 hover:text-blue-300 flex items-center">
            <ChevronLeft className="mr-2" />
            Back to Main Page
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-slate-800 rounded-lg shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <Smartphone className="mr-3 text-blue-400" size={32} />
              <h1 className="text-3xl font-bold">Phone Repair Agreement Slip</h1>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Device Owner Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="ownerName" className="text-gray-300">
                    Phone Owner's Name:
                  </Label>
                  <Input
                    type="text"
                    id="ownerName"
                    name="ownerName"
                    value={formData.ownerName}
                    onChange={handleInputChange}
                    required
                    className="bg-slate-700 border-slate-600 text-white mt-1"
                    placeholder="Enter full name"
                  />
                </div>

                <div>
                  <Label htmlFor="ownerPhone" className="text-gray-300">
                    Owner's Phone Number:
                  </Label>
                  <Input
                    type="tel"
                    id="ownerPhone"
                    name="ownerPhone"
                    value={formData.ownerPhone}
                    onChange={handleInputChange}
                    required
                    className="bg-slate-700 border-slate-600 text-white mt-1"
                    placeholder="Enter phone number"
                  />
                </div>

                <div>
                  <Label htmlFor="date" className="text-gray-300">
                    Date:
                  </Label>
                  <Input
                    type="date"
                    id="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    required
                    className="bg-slate-700 border-slate-600 text-white mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="phoneBrand" className="text-gray-300">
                    Phone Brand:
                  </Label>
                  <Input
                    type="text"
                    id="phoneBrand"
                    name="phoneBrand"
                    value={formData.phoneBrand}
                    onChange={handleInputChange}
                    required
                    className="bg-slate-700 border-slate-600 text-white mt-1"
                    placeholder="e.g., iPhone, Samsung, etc."
                  />
                </div>

                <div>
                  <Label htmlFor="phoneModel" className="text-gray-300">
                    Phone Model:
                  </Label>
                  <Input
                    type="text"
                    id="phoneModel"
                    name="phoneModel"
                    value={formData.phoneModel}
                    onChange={handleInputChange}
                    required
                    className="bg-slate-700 border-slate-600 text-white mt-1"
                    placeholder="e.g., iPhone 14, Galaxy S23, etc."
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="phoneSerialNumber" className="text-gray-300">
                    Phone Serial Number:
                  </Label>
                  <Input
                    type="text"
                    id="phoneSerialNumber"
                    name="phoneSerialNumber"
                    value={formData.phoneSerialNumber}
                    onChange={handleInputChange}
                    className="bg-slate-700 border-slate-600 text-white mt-1"
                    placeholder="Enter serial number"
                  />
                </div>

                <div>
                  <Label htmlFor="phoneBatteryType" className="text-gray-300">
                    Phone Battery Type:
                  </Label>
                  <Input
                    type="text"
                    id="phoneBatteryType"
                    name="phoneBatteryType"
                    value={formData.phoneBatteryType}
                    onChange={handleInputChange}
                    className="bg-slate-700 border-slate-600 text-white mt-1"
                    placeholder="e.g., Li-ion, Li-Po, etc."
                  />
                </div>

                <div>
                  <Label htmlFor="phoneBatteryBrand" className="text-gray-300">
                    Phone Battery Brand:
                  </Label>
                  <Input
                    type="text"
                    id="phoneBatteryBrand"
                    name="phoneBatteryBrand"
                    value={formData.phoneBatteryBrand}
                    onChange={handleInputChange}
                    className="bg-slate-700 border-slate-600 text-white mt-1"
                    placeholder="Enter battery brand"
                  />
                </div>

                <div>
                  <Label htmlFor="phoneColor" className="text-gray-300">
                    Phone Colour:
                  </Label>
                  <Input
                    type="text"
                    id="phoneColor"
                    name="phoneColor"
                    value={formData.phoneColor}
                    onChange={handleInputChange}
                    className="bg-slate-700 border-slate-600 text-white mt-1"
                    placeholder="Enter phone color"
                  />
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="phoneProblem" className="text-gray-300">
                Phone Problem:
              </Label>
              <Textarea
                id="phoneProblem"
                name="phoneProblem"
                value={formData.phoneProblem}
                onChange={handleInputChange}
                required
                className="bg-slate-700 border-slate-600 text-white mt-1"
                placeholder="Describe the problem with your phone"
                rows={3}
              />
            </div>

            {/* Terms and Conditions */}
            <div className="bg-slate-700 p-6 rounded-lg mt-8">
              <h3 className="text-xl font-semibold mb-4 text-center">NOTE</h3>
              <div className="space-y-3 text-sm text-gray-300">
                <div className="flex">
                  <span className="font-semibold mr-2">1.</span>
                  <span>We charge 1,000 naira for checking the phone problem and is a non refundable.</span>
                </div>
                <div className="flex">
                  <span className="font-semibold mr-2">2.</span>
                  <span>It will take us approximately three working days to check the phone and give you result.</span>
                </div>
                <div className="flex">
                  <span className="font-semibold mr-2">3.</span>
                  <span>
                    After checking the phone, we will notify you about the phone, and you must make payment before we
                    work on the phone.
                  </span>
                </div>
                <div className="flex">
                  <span className="font-semibold mr-2">4.</span>
                  <span>
                    We do not have any phone component here example IC, PCB etc so it will take a long time for you to
                    get the phone.
                  </span>
                </div>
                <div className="flex">
                  <span className="font-semibold mr-2">5.</span>
                  <span>It may take four weeks or less for us to finish the repair.</span>
                </div>
                <div className="flex">
                  <span className="font-semibold mr-2">6.</span>
                  <span>On no account should you call us everyday disturbing us about the phone.</span>
                </div>
                <div className="flex">
                  <span className="font-semibold mr-2">7.</span>
                  <span>We will call you when we are done. We will refund your money if we cannot fix the phone.</span>
                </div>
              </div>
            </div>

            {/* Agreement Checkbox */}
            <div className="flex items-center space-x-2 mt-6">
              <Checkbox
                id="agreeToTerms"
                name="agreeToTerms"
                checked={formData.agreeToTerms}
                onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, agreeToTerms: !!checked }))}
                className="border-slate-600"
              />
              <Label htmlFor="agreeToTerms" className="text-gray-300">
                I agree to the terms and conditions stated above
              </Label>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center gap-4 mt-8">
              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg"
                disabled={!formData.agreeToTerms}
              >
                <FileText className="mr-2" />
                Submit Registration
              </Button>
              
              {/* Download PDF Button - only show if form has essential data */}
              {formData.ownerName && formData.phoneBrand && formData.phoneModel && formData.phoneProblem && formData.customerSignature && (
                <Button
                  type="button"
                  onClick={() => generatePDF(formData)}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 text-lg"
                  variant="outline"
                >
                  <Download className="mr-2" />
                  Download PDF
                </Button>
              )}
            </div>
          </form>

          {/* Signature Section */}
          <div className="mt-8 pt-6 border-t border-slate-600">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <Label htmlFor="customerSignature" className="text-gray-300">Customer Sign:</Label>
                <Input
                  type="text"
                  id="customerSignature"
                  name="customerSignature"
                  value={formData.customerSignature}
                  onChange={handleInputChange}
                  required
                  className="bg-slate-700 border-slate-600 text-white mt-2"
                  placeholder="Enter your full name as signature"
                />
              </div>
              <div>
                <Label className="text-gray-300">Technician Sign:</Label>
                <div className="bg-slate-700 border border-slate-600 rounded-md px-3 py-2 mt-2 text-white font-semibold">
                  ABTECH
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}