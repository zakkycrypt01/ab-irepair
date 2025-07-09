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
    
    // Modern color palette
    const colors = {
      primary: [59, 130, 246],     // Blue-500
      secondary: [139, 69, 19],    // Brown-600
      accent: [16, 185, 129],      // Emerald-500
      warning: [245, 158, 11],     // Amber-500
      text: [31, 41, 55],          // Gray-800
      lightBg: [249, 250, 251],    // Gray-50
      border: [209, 213, 219]      // Gray-300
    }
    
    let yPosition = 15
    
    // Modern header with gradient-like effect
    doc.setFillColor(colors.primary[0], colors.primary[1], colors.primary[2])
    doc.rect(0, 0, 210, 40, 'F')
    
    // Header accent line
    doc.setFillColor(colors.accent[0], colors.accent[1], colors.accent[2])
    doc.rect(0, 35, 210, 5, 'F')
    
    // Company name
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(22)
    doc.setFont('helvetica', 'bold')
    doc.text('ABTECH', 20, 25)
    
    // Subtitle
    doc.setFontSize(12)
    doc.setFont('helvetica', 'normal')
    doc.text('Phone Repair Agreement', 20, 32)
    
    // Document info with modern styling
    yPosition = 55
    doc.setFillColor(colors.lightBg[0], colors.lightBg[1], colors.lightBg[2])
    doc.rect(15, yPosition - 5, 180, 12, 'F')
    
    doc.setTextColor(colors.text[0], colors.text[1], colors.text[2])
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, yPosition)
    doc.text(`Document ID: ${Date.now().toString().slice(-8)}`, 150, yPosition)
    yPosition += 20
    
    // Helper function for colorful field rows
    const addField = (label: string, value: string) => {
      // Alternating row background
      if (yPosition % 20 < 10) {
        doc.setFillColor(colors.lightBg[0], colors.lightBg[1], colors.lightBg[2])
        doc.rect(15, yPosition - 3, 180, 8, 'F')
      }
      
      doc.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2])
      doc.setFontSize(10)
      doc.setFont('helvetica', 'bold')
      doc.text(label, 20, yPosition)
      
      doc.setTextColor(colors.text[0], colors.text[1], colors.text[2])
      doc.setFont('helvetica', 'normal')
      doc.text(value || 'Not provided', 80, yPosition)
      yPosition += 6
    }
    
    // Helper function for colorful section headers
    const addSectionHeader = (title: string, color: number[] = colors.primary) => {
      yPosition += 5
      
      // Modern section header with colored background
      doc.setFillColor(color[0], color[1], color[2])
      doc.rect(15, yPosition - 4, 180, 14, 'F')
      
      // Left accent line
      doc.setFillColor(colors.accent[0], colors.accent[1], colors.accent[2])
      doc.rect(15, yPosition - 4, 4, 14, 'F')
      
      doc.setTextColor(255, 255, 255)
      doc.setFontSize(12)
      doc.setFont('helvetica', 'bold')
      doc.text(title, 25, yPosition + 3)
      yPosition += 18
    }
    
    // Customer Information
    addSectionHeader('👤 Customer Information', colors.primary)
    addField('Name:', data.ownerName)
    addField('Phone:', data.ownerPhone)
    addField('Date:', data.date)
    
    // Device Information
    addSectionHeader('📱 Device Information', colors.secondary)
    addField('Brand:', data.phoneBrand)
    addField('Model:', data.phoneModel)
    addField('Serial Number:', data.phoneSerialNumber)
    addField('Color:', data.phoneColor)
    
    // Battery Information
    addSectionHeader('🔋 Battery Information', colors.accent)
    addField('Type:', data.phoneBatteryType)
    addField('Brand:', data.phoneBatteryBrand)
    
    // Problem Description
    addSectionHeader('⚠️ Problem Description', colors.warning)
    doc.setFillColor(colors.lightBg[0], colors.lightBg[1], colors.lightBg[2])
    doc.rect(15, yPosition - 3, 180, (data.phoneProblem.length / 35) * 4 + 10, 'F')
    
    doc.setTextColor(colors.text[0], colors.text[1], colors.text[2])
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    const problemLines = doc.splitTextToSize(data.phoneProblem, 170)
    doc.text(problemLines, 20, yPosition)
    yPosition += problemLines.length * 4 + 10
    
    // Terms and Conditions
    addSectionHeader('📋 Terms and Conditions', [220, 38, 38])
    
    // Terms background
    doc.setFillColor(255, 252, 252)
    doc.rect(15, yPosition - 3, 180, 60, 'F')
    
    // Warning border
    doc.setDrawColor(220, 38, 38)
    doc.setLineWidth(2)
    doc.rect(15, yPosition - 3, 180, 60)
    
    doc.setTextColor(colors.text[0], colors.text[1], colors.text[2])
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
    
    terms.forEach((term, index) => {
      // Number highlighting
      doc.setTextColor(220, 38, 38)
      doc.setFont('helvetica', 'bold')
      doc.text(`${index + 1}.`, 20, yPosition)
      
      doc.setTextColor(colors.text[0], colors.text[1], colors.text[2])
      doc.setFont('helvetica', 'normal')
      const termLines = doc.splitTextToSize(term.substring(2), 165)
      doc.text(termLines, 27, yPosition)
      yPosition += termLines.length * 4 + 2
    })
    
    yPosition += 8
    
    // Signatures
    addSectionHeader('✍️ Digital Signatures', colors.accent)
    
    // Modern signature boxes
    // Customer signature box
    doc.setFillColor(colors.lightBg[0], colors.lightBg[1], colors.lightBg[2])
    doc.rect(20, yPosition, 80, 16, 'F')
    doc.setDrawColor(colors.primary[0], colors.primary[1], colors.primary[2])
    doc.setLineWidth(1)
    doc.rect(20, yPosition, 80, 16)
    
    doc.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2])
    doc.setFontSize(8)
    doc.setFont('helvetica', 'bold')
    doc.text('CUSTOMER SIGNATURE', 22, yPosition - 2)
    
    doc.setTextColor(colors.text[0], colors.text[1], colors.text[2])
    doc.setFontSize(11)
    doc.setFont('helvetica', 'normal')
    doc.text(data.customerSignature, 25, yPosition + 10)
    
    // Technician signature box
    doc.setFillColor(colors.accent[0], colors.accent[1], colors.accent[2])
    doc.rect(110, yPosition, 80, 16, 'F')
    
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(8)
    doc.setFont('helvetica', 'bold')
    doc.text('TECHNICIAN SIGNATURE', 112, yPosition - 2)
    
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.text('ABTECH', 112, yPosition + 10)
    
    yPosition += 25
    
    // Modern footer with gradient effect
    doc.setFillColor(colors.lightBg[0], colors.lightBg[1], colors.lightBg[2])
    doc.rect(0, yPosition, 210, 15, 'F')
    
    doc.setTextColor(colors.text[0], colors.text[1], colors.text[2])
    doc.setFontSize(8)
    doc.setFont('helvetica', 'italic')
    doc.text('This document was digitally generated and is legally binding.', 105, yPosition + 8, { align: 'center' })
    
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