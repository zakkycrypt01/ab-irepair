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
    
    // Colors
    const primaryBlue = [37, 99, 235] // Blue-600
    const lightBlue = [147, 197, 253] // Blue-300
    const darkGray = [51, 65, 85] // Slate-700
    const lightGray = [148, 163, 184] // Slate-400
    const successGreen = [34, 197, 94] // Green-500
    const warningOrange = [251, 146, 60] // Orange-400
    
    // Header Background
    doc.setFillColor(primaryBlue[0], primaryBlue[1], primaryBlue[2])
    doc.rect(0, 0, 210, 35, 'F')
    
    // Company Logo/Icon (simplified phone icon)
    doc.setFillColor(255, 255, 255)
    doc.rect(15, 8, 12, 18, 'F')
    doc.setFillColor(primaryBlue[0], primaryBlue[1], primaryBlue[2])
    doc.rect(17, 10, 8, 12, 'F')
    doc.setFillColor(255, 255, 255)
    doc.circle(21, 16, 2, 'F')
    
    // Header Title
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(24)
    doc.setFont('helvetica', 'bold')
    doc.text('ABTECH', 35, 20)
    doc.setFontSize(14)
    doc.setFont('helvetica', 'normal')
    doc.text('Phone Repair Agreement Slip', 35, 28)
    
    // Document ID and Date
    doc.setFontSize(10)
    doc.text(`Doc ID: ${Date.now().toString().slice(-8)}`, 150, 15)
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 150, 25)
    
    let yPosition = 50
    
    // Helper function for section headers
    const addSectionHeader = (title: string, color: number[]) => {
      doc.setFillColor(color[0], color[1], color[2])
      doc.rect(15, yPosition - 3, 180, 12, 'F')
      doc.setTextColor(255, 255, 255)
      doc.setFontSize(12)
      doc.setFont('helvetica', 'bold')
      doc.text(title, 20, yPosition + 5)
      yPosition += 20
    }
    
    // Helper function for field rows
    const addField = (label: string, value: string, isRequired = false) => {
      doc.setTextColor(darkGray[0], darkGray[1], darkGray[2])
      doc.setFontSize(10)
      doc.setFont('helvetica', 'bold')
      
      if (isRequired) {
        doc.setTextColor(220, 38, 38) // Red for required
        doc.text('*', 20, yPosition)
        doc.setTextColor(darkGray[0], darkGray[1], darkGray[2])
        doc.text(label, 25, yPosition)
      } else {
        doc.text(label, 20, yPosition)
      }
      
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(0, 0, 0)
      doc.text(value || 'Not provided', 80, yPosition)
      yPosition += 8
    }
    
    // Customer Information Section
    addSectionHeader('Customer Information', primaryBlue)
    addField('Full Name:', data.ownerName, true)
    addField('Phone Number:', data.ownerPhone, true)
    addField('Registration Date:', data.date, true)
    yPosition += 5
    
    // Device Information Section
    addSectionHeader('Device Information', lightBlue)
    addField('Brand:', data.phoneBrand, true)
    addField('Model:', data.phoneModel, true)
    addField('Serial Number:', data.phoneSerialNumber)
    addField('Color:', data.phoneColor)
    yPosition += 5
    
    // Battery Information Section
    addSectionHeader('Battery Information', successGreen)
    addField('Battery Type:', data.phoneBatteryType)
    addField('Battery Brand:', data.phoneBatteryBrand)
    yPosition += 5
    
    // Problem Description Section
    addSectionHeader('Problem Description', warningOrange)
    doc.setTextColor(0, 0, 0)
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    const problemLines = doc.splitTextToSize(data.phoneProblem, 170)
    doc.text(problemLines, 20, yPosition)
    yPosition += problemLines.length * 6 + 15
    
    // Terms and Conditions Section
    addSectionHeader('Terms and Conditions', darkGray)
    
    doc.setTextColor(0, 0, 0)
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
      // Alternate background colors for better readability
      if (index % 2 === 0) {
        doc.setFillColor(248, 250, 252) // Very light gray
        doc.rect(15, yPosition - 2, 180, 8, 'F')
      }
      
      const termLines = doc.splitTextToSize(term, 170)
      doc.text(termLines, 20, yPosition + 2)
      yPosition += Math.max(termLines.length * 4, 8) + 2
    })
    
    yPosition += 10
    
    // Signatures Section
    addSectionHeader('Digital Signatures', primaryBlue)
    
    // Customer signature box
    doc.setDrawColor(lightGray[0], lightGray[1], lightGray[2])
    doc.setFillColor(250, 250, 250)
    doc.rect(20, yPosition, 80, 20, 'FD')
    doc.setTextColor(darkGray[0], darkGray[1], darkGray[2])
    doc.setFontSize(8)
    doc.text('Customer Signature:', 22, yPosition - 2)
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(0, 0, 0)
    doc.text(data.customerSignature, 22, yPosition + 12)
    
    // Technician signature box
    doc.setFillColor(primaryBlue[0], primaryBlue[1], primaryBlue[2])
    doc.rect(110, yPosition, 80, 20, 'FD')
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(8)
    doc.text('Technician Signature:', 112, yPosition - 2)
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.text('ABTECH', 112, yPosition + 12)
    
    yPosition += 35
    
    // Footer
    doc.setFillColor(248, 250, 252)
    doc.rect(0, yPosition, 210, 20, 'F')
    doc.setTextColor(lightGray[0], lightGray[1], lightGray[2])
    doc.setFontSize(8)
    doc.setFont('helvetica', 'italic')
    doc.text('Customer agrees to all terms and conditions stated above.', 105, yPosition + 8, { align: 'center' })
    doc.text('This document was digitally generated and is legally binding.', 105, yPosition + 15, { align: 'center' })
    
    // Generate filename with timestamp
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