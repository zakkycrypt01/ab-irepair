"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronLeft, FileText, Smartphone, Download, User, Battery, AlertTriangle, PenTool, CheckCircle, Shield } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import jsPDF from 'jspdf'

export default function DeviceRegistrationPage() {
  const [formData, setFormData] = useState({
    ownerName: "",
    ownerDevice: "", // This seems to be mapped to Phone Number in the original code logic
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

  // Helper for input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    // For checkbox, we need to cast safely or handle separately, but this standard way works for text/textarea
    // We'll handle checkbox in its specific onCheckedChange handler for shadcn
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }

  const generatePDF = (data: typeof formData) => {
    const doc = new jsPDF()
    let yPosition = 20

    // Header
    doc.setTextColor(0, 0, 0)
    doc.setFontSize(22)
    doc.setFont('helvetica', 'bold')
    doc.text('ABTECH iREPAIR', 105, yPosition, { align: 'center' })
    yPosition += 10
    doc.setFontSize(16)
    doc.text('Device Repair Agreement', 105, yPosition, { align: 'center' })
    yPosition += 15

    // Document info
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, yPosition)
    doc.text(`ID: ${Date.now().toString().slice(-8)}`, 160, yPosition)
    yPosition += 12

    // Divide Line
    doc.setLineWidth(0.5)
    doc.line(20, yPosition, 190, yPosition)
    yPosition += 10

    // Helper function for simple field rows
    const addField = (label: string, value: string, xOffset = 20) => {
      doc.setFontSize(11)
      doc.setFont('helvetica', 'bold')
      doc.text(label, xOffset, yPosition)
      doc.setFont('helvetica', 'normal')
      doc.text(value || 'N/A', xOffset + 40, yPosition)
    }

    // Helper function for section headers
    const addSectionHeader = (title: string) => {
      yPosition += 8
      doc.setFillColor(240, 240, 240)
      doc.rect(20, yPosition - 6, 170, 8, 'F')
      doc.setFontSize(12)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(0, 50, 100) // Dark blue
      doc.text(title, 25, yPosition)
      doc.setTextColor(0, 0, 0) // Reset
      yPosition += 10
    }

    // Customer Information
    addSectionHeader('Customer Information')
    addField('Name:', data.ownerName)
    yPosition += 7
    addField('Phone:', data.ownerDevice)
    yPosition += 7
    addField('Date:', data.date)
    yPosition += 5

    // Device Information
    addSectionHeader('Device Details')
    addField('Brand:', data.deviceBrand)
    addField('Model:', data.deviceModel, 110)
    yPosition += 7
    addField('Serial No:', data.deviceSerialNumber)
    addField('Color:', data.deviceColor, 110)
    yPosition += 5

    // Battery Information
    addSectionHeader('Battery Info')
    addField('Type:', data.deviceBatteryType)
    addField('Brand:', data.deviceBatteryBrand, 110)
    yPosition += 5

    // Problem Description
    addSectionHeader('Problem Description')
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    const problemLines = doc.splitTextToSize(data.deviceProblem, 170)
    doc.text(problemLines, 20, yPosition)
    yPosition += problemLines.length * 5 + 5

    // Terms and Conditions
    addSectionHeader('Terms and Conditions')
    doc.setFontSize(8)
    doc.setFont('helvetica', 'normal')

    const terms = [
      '1. Diagnostic fee of ₦1,000 is non-refundable.',
      '2. Diagnosis takes approximately 3 working days.',
      '3. Payment is required before repair work commences.',
      '4. Component availability (IC, PCB, etc.) may affect repair duration.',
      '5. Repair may take up to 4 weeks depending on complexity.',
      '6. Please refrain from frequent calls during the repair period.',
      '7. Full refund guaranteed if the device cannot be fixed.'
    ]

    terms.forEach((term) => {
      doc.text(term, 20, yPosition)
      yPosition += 4
    })

    yPosition += 10

    // Signatures
    doc.line(20, yPosition, 190, yPosition)
    yPosition += 5

    doc.setFontSize(10)
    doc.setFont('helvetica', 'bold')
    doc.text('Customer Signature:', 20, yPosition + 10)
    doc.setFont('helvetica', 'italic')
    doc.text(data.customerSignature, 60, yPosition + 10)

    doc.setFont('helvetica', 'bold')
    doc.text('Technician:', 120, yPosition + 10)
    doc.setFont('helvetica', 'normal')
    doc.text('ABTECH OFFICIAL', 150, yPosition + 10)

    // Footer
    doc.setFontSize(8)
    doc.setFont('helvetica', 'italic')
    doc.text('This document is digitally generated by ABTECH iREPAIR System.', 105, 280, { align: 'center' })

    // Generate filename
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5)
    const filename = `ABTECH_Repair_${data.ownerName.replace(/\s+/g, '_')}_${timestamp}.pdf`

    // Save the PDF
    doc.save(filename)
  }

  const sendToTelegram = async (data: typeof formData) => {
    const BOT_TOKEN = process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN
    const CHAT_ID = process.env.NEXT_PUBLIC_TELEGRAM_CHAT_ID

    // If no tokens, simulate success for UI demo purposes (or fail gracefully)
    if (!BOT_TOKEN || !CHAT_ID) {
      console.warn("Telegram tokens missing. Skipping Telegram send.")
      return true
    }

    const message = `
🔧 *New Device Registration*
    
👤 *Customer:* ${data.ownerName}
📱 *Phone:* ${data.ownerDevice}
📅 *Date:* ${data.date}

🛠 *Device:* ${data.deviceBrand} ${data.deviceModel}
🔢 *S/N:* ${data.deviceSerialNumber || 'N/A'}
🎨 *Color:* ${data.deviceColor || 'N/A'}

🔋 *Battery:* ${data.deviceBatteryType || 'N/A'} (${data.deviceBatteryBrand || 'N/A'})

⚠️ *Problem:*
${data.deviceProblem}

✍️ *Signature:* ${data.customerSignature}
    `.trim()

    try {
      const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: CHAT_ID,
          text: message,
          parse_mode: 'Markdown'
        }),
      })

      if (!response.ok) throw new Error('Failed to send telegram message')
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

    const form = e.currentTarget
    const submitButton = form.querySelector('button[type="submit"]') as HTMLButtonElement

    try {
      if (submitButton) {
        submitButton.disabled = true
        submitButton.textContent = 'Processing...'
      }

      const success = await sendToTelegram(formData)

      // We proceed even if telegram fails (to allow download)
      generatePDF(formData)

      alert("Registration submitted successfully! Your agreement PDF is downloading.")

      // Reset form
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

    } catch (error) {
      console.error('Submission error:', error)
      alert("An error occurred. Please try again.")
    } finally {
      if (submitButton) {
        submitButton.disabled = false
        submitButton.innerHTML = 'Submit Registration'
      }
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <header className="border-b border-border sticky top-0 bg-background/95 backdrop-blur z-20">
        <div className="container mx-auto px-4 h-16 flex items-center">
          <Link href="/" className="text-muted-foreground hover:text-green-500 transition-colors flex items-center text-sm font-medium group">
            <ChevronLeft className="mr-1 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>
          <div className="ml-auto flex items-center gap-2">
            <div className="bg-green-500/10 text-green-600 px-3 py-1 rounded-full text-xs font-bold border border-green-500/20">
              OFFICIAL USE
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-10 max-w-4xl">
        <div className="bg-card border border-border shadow-2xl rounded-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">

          {/* Header Banner */}
          <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-8 text-center border-b border-border relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-green-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

            <div className="relative z-10 flex flex-col items-center">
              <div className="bg-background/10 p-4 rounded-full mb-4 backdrop-blur-sm">
                <Smartphone className="h-8 w-8 text-blue-400" />
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">Device Repair Intake</h1>
              <p className="text-slate-400 max-w-md mx-auto">
                Official registration form for new device repairs. Please fill out all details accurately.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-10">
            {/* Section: Customer Info */}
            <div className="space-y-6">
              <h2 className="text-xl font-bold flex items-center gap-2 border-b border-border pb-2 text-foreground">
                <User className="h-5 w-5 text-blue-500" /> Customer Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="ownerName">Owner's Name</Label>
                  <Input
                    id="ownerName"
                    name="ownerName"
                    value={formData.ownerName}
                    onChange={handleInputChange}
                    required
                    placeholder="Full Name"
                    className="bg-background"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ownerDevice">Phone Number</Label>
                  <Input
                    id="ownerDevice"
                    name="ownerDevice"
                    type="tel"
                    value={formData.ownerDevice}
                    onChange={handleInputChange}
                    required
                    placeholder="Checkup contact number"
                    className="bg-background"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    name="date"
                    type="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    required
                    className="bg-background"
                  />
                </div>
              </div>
            </div>

            {/* Section: Device Info */}
            <div className="space-y-6">
              <h2 className="text-xl font-bold flex items-center gap-2 border-b border-border pb-2 text-foreground">
                <Smartphone className="h-5 w-5 text-green-500" /> Device Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="deviceBrand">Brand</Label>
                  <Input
                    id="deviceBrand"
                    name="deviceBrand"
                    value={formData.deviceBrand}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g. Apple, Samsung"
                    className="bg-background"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="deviceModel">Model</Label>
                  <Input
                    id="deviceModel"
                    name="deviceModel"
                    value={formData.deviceModel}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g. iPhone 13 Pro"
                    className="bg-background"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="deviceSerialNumber">Serial Number / IMEI</Label>
                  <Input
                    id="deviceSerialNumber"
                    name="deviceSerialNumber"
                    value={formData.deviceSerialNumber}
                    onChange={handleInputChange}
                    placeholder="Optional"
                    className="bg-background"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="deviceColor">Color</Label>
                  <Input
                    id="deviceColor"
                    name="deviceColor"
                    value={formData.deviceColor}
                    onChange={handleInputChange}
                    placeholder="Device Color"
                    className="bg-background"
                  />
                </div>
              </div>
            </div>

            {/* Section: Battery Info */}
            <div className="space-y-6">
              <h2 className="text-xl font-bold flex items-center gap-2 border-b border-border pb-2 text-foreground">
                <Battery className="h-5 w-5 text-yellow-500" /> Battery Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="deviceBatteryType">Battery Type</Label>
                  <Input
                    id="deviceBatteryType"
                    name="deviceBatteryType"
                    value={formData.deviceBatteryType}
                    onChange={handleInputChange}
                    placeholder="e.g. Li-ion"
                    className="bg-background"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="deviceBatteryBrand">Battery Brand</Label>
                  <Input
                    id="deviceBatteryBrand"
                    name="deviceBatteryBrand"
                    value={formData.deviceBatteryBrand}
                    onChange={handleInputChange}
                    placeholder="If known"
                    className="bg-background"
                  />
                </div>
              </div>
            </div>

            {/* Section: Problem Description */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold flex items-center gap-2 border-b border-border pb-2 text-foreground">
                <AlertTriangle className="h-5 w-5 text-red-500" /> Problem Description
              </h2>
              <Textarea
                id="deviceProblem"
                name="deviceProblem"
                value={formData.deviceProblem}
                onChange={handleInputChange}
                required
                placeholder="Please describe the issue in detail..."
                rows={4}
                className="bg-background resize-none"
              />
            </div>

            {/* Terms and Agreements */}
            <div className="bg-muted/30 rounded-xl p-6 border border-border">
              <h3 className="font-bold text-base mb-4 flex items-center gap-2">
                <Shield className="h-4 w-4" /> Terms of Service
              </h3>
              <ul className="space-y-3 text-sm text-muted-foreground list-decimal pl-4">
                <li><strong className="text-foreground">Diagnostic Fee:</strong> A non-refundable fee of ₦1,000 applies for troubleshooting.</li>
                <li><strong className="text-foreground">Turnaround Time:</strong> Diagnosis takes approx. 3 working days. Repairs may take up to 4 weeks depending on parts availability.</li>
                <li><strong className="text-foreground">Payment:</strong> Full payment is required before repair work begins.</li>
                <li><strong className="text-foreground">Communication:</strong> We will contact you with updates. Please avoid frequent check-in calls.</li>
                <li><strong className="text-foreground">Warranty:</strong> We offer a refund if the device cannot be fixed.</li>
              </ul>
            </div>

            <div className="flex items-start space-x-3 pt-2">
              <Checkbox
                id="agreeToTerms"
                checked={formData.agreeToTerms}
                onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, agreeToTerms: !!checked }))}
                className="mt-1"
              />
              <Label htmlFor="agreeToTerms" className="text-sm cursor-pointer leading-tight">
                I have read and agree to the terms and conditions stated above.
              </Label>
            </div>

            {/* Signatures */}
            <div className="border-t border-border pt-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <Label htmlFor="customerSignature">Customer Signature</Label>
                  <div className="relative">
                    <Input
                      id="customerSignature"
                      name="customerSignature"
                      value={formData.customerSignature}
                      onChange={handleInputChange}
                      required
                      placeholder="Type full name to sign"
                      className="bg-background pr-10 font-handwriting text-lg"
                    />
                    <PenTool className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Technician Signature</Label>
                  <div className="h-10 flex items-center px-4 rounded-md bg-muted/50 border border-border text-muted-foreground font-bold">
                    ABTECH OFFICIAL
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
              <Button
                type="submit"
                size="lg"
                className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white font-bold px-8 shadow-lg hover:shadow-xl transition-all"
                disabled={!formData.agreeToTerms}
              >
                <FileText className="mr-2 h-5 w-5" />
                Submit Registration
              </Button>

              {/* Optional: Preview Button logic could go here */}
            </div>

          </form>
        </div>
      </main>
    </div>
  )
}