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
    ownerDevice: "",
    date: new Date().toISOString().split("T")[0],
    deviceBrand: "",
    deviceModel: "",
    deviceSerialNumber: "",
    deviceProblem: "",
    deviceBatteryType: "",
    deviceBatteryBrand: "",
    deviceColor: "",
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
    
    let yPosition = 20
    
    // Simple header
    doc.setTextColor(0, 0, 0)
    doc.setFontSize(18)
    doc.setFont('helvetica', 'bold')
    doc.text('ABTECH - Device Repair Agreement', 20, yPosition)
    yPosition += 15
    
    // Document info
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, yPosition)
    doc.text(`ID: ${Date.now().toString().slice(-8)}`, 150, yPosition)
    yPosition += 12
    
    // Helper function for simple field rows
    const addField = (label: string, value: string) => {
      doc.setFontSize(10)
      doc.setFont('helvetica', 'bold')
      doc.text(label, 20, yPosition)
      doc.setFont('helvetica', 'normal')
      doc.text(value || 'Not provided', 80, yPosition)
      yPosition += 5
    }
    
    // Helper function for section headers
    const addSectionHeader = (title: string) => {
      yPosition += 3
      doc.setFontSize(12)
      doc.setFont('helvetica', 'bold')
      doc.text(title, 20, yPosition)
      yPosition += 7
    }
    
    // Customer Information
    addSectionHeader('Customer Information')
    addField('Name:', data.ownerName)
    addField('Device:', data.ownerDevice)
    addField('Date:', data.date)
    
    // Device Information
    addSectionHeader('Device Information')
    addField('Brand:', data.deviceBrand)
    addField('Model:', data.deviceModel)
    addField('Serial Number:', data.deviceSerialNumber)
    addField('Color:', data.deviceColor)
    
    // Battery Information
    addSectionHeader('Battery Information')
    addField('Type:', data.deviceBatteryType)
    addField('Brand:', data.deviceBatteryBrand)
    
    // Problem Description
    addSectionHeader('Problem Description')
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    const problemLines = doc.splitTextToSize(data.deviceProblem, 170)
    doc.text(problemLines, 20, yPosition)
    yPosition += problemLines.length * 4 + 5
    
    // Terms and Conditions
    addSectionHeader('Terms and Conditions')
    doc.setFontSize(9)
    doc.setFont('helvetica', 'normal')
    
    const terms = [
      '1. We charge 1,000 naira for checking the device problem and is non-refundable.',
      '2. It will take us approximately three working days to check the device and give you result.',
      '3. After checking the device, we will notify you about the device, and you must make payment before we work on the device.',
      '4. We do not have any device component here example IC, PCB etc so it will take a long time for you to get the device.',
      '5. It may take four weeks or less for us to finish the repair, Please bear with us .',
      '6. On no account should you call us everyday disturbing us about the device.',
      '7. We will call you when we are done. We will refund your money if we cannot fix the device.'
    ]
    
    terms.forEach((term) => {
      const termLines = doc.splitTextToSize(term, 170)
      doc.text(termLines, 20, yPosition)
      yPosition += termLines.length * 4 + 2
    })
    
    yPosition += 5
    
    // Signatures
    addSectionHeader('Signatures')
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    
    // Customer signature
    doc.text('Customer:', 20, yPosition)
    doc.text(data.customerSignature, 60, yPosition)
    yPosition += 7
    
    // Technician signature
    doc.text('Technician:', 20, yPosition)
    doc.text('ABTECH', 60, yPosition)
    yPosition += 10
    
    // Footer
    doc.setFontSize(8)
    doc.setFont('helvetica', 'italic')
    doc.text('This document was digitally generated and is legally binding.', 105, yPosition, { align: 'center' })
    
    // Generate filename
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5)
    const filename = `ABTECH_Repair_Agreement_${data.ownerName.replace(/\s+/g, '_')}_${timestamp}.pdf`
    
    // Save the PDF
    doc.save(filename)
  }

  const sendToTelegram = async (data: typeof formData) => {
    const BOT_TOKEN = process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN || "YOUR_BOT_TOKEN"
    const CHAT_ID = process.env.NEXT_PUBLIC_TELEGRAM_CHAT_ID || "YOUR_CHAT_ID"
    
    const message = `
🔧 New Device Registration - ABTECH

👤 Customer Information:
• Name: ${data.ownerName}
• Phone: ${data.ownerDevice}
• Date: ${data.date}

📱 Device Details:
• Brand: ${data.deviceBrand}
• Model: ${data.deviceModel}
• Serial Number: ${data.deviceSerialNumber || 'Not provided'}
• Color: ${data.deviceColor || 'Not provided'}

🔋 Battery Information:
• Type: ${data.deviceBatteryType || 'Not provided'}
• Brand: ${data.deviceBatteryBrand || 'Not provided'}

⚠️ Problem Description:
${data.deviceProblem}

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

    // Store reference to the form and button
    const form = e.currentTarget
    const submitButton = form.querySelector('button[type="submit"]') as HTMLButtonElement
    
    try {
      // Show loading state
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
          ownerDevice: "",
          date: new Date().toISOString().split("T")[0],
          deviceBrand: "",
          deviceModel: "",
          deviceSerialNumber: "",
          deviceProblem: "",
          deviceBatteryType: "",
          deviceBatteryBrand: "",
          deviceColor: "",
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
      // Reset button state
      if (submitButton) {
        submitButton.disabled = false
        submitButton.innerHTML = '<svg class="mr-2" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14,2 14,8 20,8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10,9 9,9 8,9"></polyline></svg>Submit Registration'
      }
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
              <h1 className="text-3xl font-bold">Device Repair Agreement Slip</h1>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Device Owner Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="ownerName" className="text-gray-300">
                    Device Owner's Name:
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
                  <Label htmlFor="ownerDevice" className="text-gray-300">
                    Owner's Phone Number:
                  </Label>
                  <Input
                    type="tel"
                    id="ownerDevice"
                    name="ownerDevice"
                    value={formData.ownerDevice}
                    onChange={handleInputChange}
                    required
                    className="bg-slate-700 border-slate-600 text-white mt-1"
                    placeholder="Enter whatsapp number"
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
                  <Label htmlFor="deviceBrand" className="text-gray-300">
                    Device Brand:
                  </Label>
                  <Input
                    type="text"
                    id="deviceBrand"
                    name="deviceBrand"
                    value={formData.deviceBrand}
                    onChange={handleInputChange}
                    required
                    className="bg-slate-700 border-slate-600 text-white mt-1"
                    placeholder="e.g., iPhone, Samsung, etc."
                  />
                </div>

                <div>
                  <Label htmlFor="deviceModel" className="text-gray-300">
                    Device Model:
                  </Label>
                  <Input
                    type="text"
                    id="deviceModel"
                    name="deviceModel"
                    value={formData.deviceModel}
                    onChange={handleInputChange}
                    required
                    className="bg-slate-700 border-slate-600 text-white mt-1"
                    placeholder="e.g., iPhone 14, Galaxy S23, etc."
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="deviceSerialNumber" className="text-gray-300">
                    Device Serial Number:
                  </Label>
                  <Input
                    type="text"
                    id="deviceSerialNumber"
                    name="deviceSerialNumber"
                    value={formData.deviceSerialNumber}
                    onChange={handleInputChange}
                    className="bg-slate-700 border-slate-600 text-white mt-1"
                    placeholder="Enter serial number"
                  />
                </div>

                <div>
                  <Label htmlFor="deviceBatteryType" className="text-gray-300">
                    Device Battery Type:
                  </Label>
                  <Input
                    type="text"
                    id="deviceBatteryType"
                    name="deviceBatteryType"
                    value={formData.deviceBatteryType}
                    onChange={handleInputChange}
                    className="bg-slate-700 border-slate-600 text-white mt-1"
                    placeholder="e.g., Li-ion, Li-Po, etc."
                  />
                </div>

                <div>
                  <Label htmlFor="deviceBatteryBrand" className="text-gray-300">
                    Device Battery Brand:
                  </Label>
                  <Input
                    type="text"
                    id="deviceBatteryBrand"
                    name="deviceBatteryBrand"
                    value={formData.deviceBatteryBrand}
                    onChange={handleInputChange}
                    className="bg-slate-700 border-slate-600 text-white mt-1"
                    placeholder="Enter battery brand"
                  />
                </div>

                <div>
                  <Label htmlFor="deviceColor" className="text-gray-300">
                    Device Colour:
                  </Label>
                  <Input
                    type="text"
                    id="deviceColor"
                    name="deviceColor"
                    value={formData.deviceColor}
                    onChange={handleInputChange}
                    className="bg-slate-700 border-slate-600 text-white mt-1"
                    placeholder="Enter Device color"
                  />
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="deviceProblem" className="text-gray-300">
                Device Problem:
              </Label>
              <Textarea
                id="deviceProblem"
                name="deviceProblem"
                value={formData.deviceProblem}
                onChange={handleInputChange}
                required
                className="bg-slate-700 border-slate-600 text-white mt-1"
                placeholder="Describe the problem with your device"
                rows={3}
              />
            </div>

            {/* Terms and Conditions */}
            <div className="bg-slate-700 p-6 rounded-lg mt-8">
              <h3 className="text-xl font-semibold mb-4 text-center">NOTE</h3>
              <div className="space-y-3 text-sm text-gray-300">
                <div className="flex">
                  <span className="font-semibold mr-2">1.</span>
                  <span>We charge 1,000 naira for checking the device problem and is a non refundable.</span>
                </div>
                <div className="flex">
                  <span className="font-semibold mr-2">2.</span>
                  <span>It will take us approximately three working days to check the device and give you result.</span>
                </div>
                <div className="flex">
                  <span className="font-semibold mr-2">3.</span>
                  <span>
                    After checking the device, we will notify you about the device, and you must make payment before we
                    work on the device.
                  </span>
                </div>
                <div className="flex">
                  <span className="font-semibold mr-2">4.</span>
                  <span>
                    We do not have any device component here example IC, PCB etc so it will take a long time for you to 
                    get the device.
                  </span>
                </div>
                <div className="flex">
                  <span className="font-semibold mr-2">5.</span>
                  <span>It may take four weeks or less for us to finish the repair, please bare with us.</span>
                </div>
                <div className="flex">
                  <span className="font-semibold mr-2">6.</span>
                  <span>On no account should you call us everyday disturbing us about the device.</span>
                </div>
                <div className="flex">
                  <span className="font-semibold mr-2">7.</span>
                  <span>We will call you when we are done. We will refund your money if we cannot fix the device.</span>
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
              {formData.ownerName && formData.deviceBrand && formData.deviceModel && formData.deviceProblem && formData.customerSignature && (
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