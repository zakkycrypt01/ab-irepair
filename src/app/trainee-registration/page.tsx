"use client";

import { useState, type FormEvent } from "react";
import Link from 'next/link';
import { Upload, FileText, User, MapPin, Calendar, Phone, Clock, Shield, CheckCircle, ChevronLeft, Camera } from "lucide-react";

interface FormData {
  [key: string]: string | boolean;
}

export default function TraineeRegistrationForm() {
  const [passport, setPassport] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({});
  const [downloading, setDownloading] = useState(false);

  const handleInputChange = (key: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setDownloading(true);
    try {
      const res = await fetch("/api/trainee-registration-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ formData, passport }),
      });
      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "trainee_registration.pdf";
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
      }
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground py-12 px-4 sm:px-6 lg:px-8 flex justify-center">
      <div className="w-full max-w-4xl bg-card border border-border shadow-xl rounded-xl overflow-hidden">

        {/* Navigation */}
        <div className="p-4 border-b border-border">
          <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-green-500 transition-colors">
            <ChevronLeft className="w-4 h-4 mr-1" /> Back to Home
          </Link>
        </div>

        {/* Header Section */}
        <div className="bg-muted/30 p-8 text-center border-b border-border">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-2">ABTECH iREPAIR</h1>
          <p className="text-muted-foreground font-medium mb-6">Gk M.M Castle, Opp sch new gate Jatapi office Minna Niger State.</p>
          <div className="inline-block bg-primary/10 px-6 py-2 rounded-full border border-primary/20">
            <h2 className="text-lg font-bold text-primary tracking-wide">APPRENTICE REGISTRATION FORM</h2>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-10">

          {/* Passport Upload Section */}
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="relative group">
              <div className={`w-32 h-32 rounded-full border-4 ${passport ? 'border-green-500' : 'border-border group-hover:border-green-400'} flex items-center justify-center overflow-hidden bg-muted transition-all duration-300 shadow-lg`}>
                {passport ? (
                  <img src={passport} alt="Passport" className="w-full h-full object-cover" />
                ) : (
                  <Camera className="w-10 h-10 text-muted-foreground group-hover:text-green-500 transition-colors" />
                )}
              </div>
              <label className="absolute bottom-0 right-0 bg-green-600 hover:bg-green-500 text-white p-2.5 rounded-full cursor-pointer shadow-md transition-transform hover:scale-110">
                <Upload className="w-4 h-4" />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={e => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = ev => setPassport(ev.target?.result as string);
                      reader.readAsDataURL(file);
                    }
                  }}
                />
              </label>
            </div>
            <span className="text-sm text-muted-foreground font-medium">Upload Passport Photograph</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

            {/* Apprentice Details */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold flex items-center gap-2 border-b border-border pb-2 text-foreground">
                <User className="w-5 h-5 text-blue-500" /> Apprentice Details
              </h3>

              <div className="space-y-4">
                <InputField label="Full Name" placeholder="e.g. John Doe" onChange={(v) => handleInputChange("Name", v)} />
                <InputField label="Residential Address" placeholder="Full home address" icon={<MapPin className="w-4 h-4" />} onChange={(v) => handleInputChange("Address", v)} />

                <div className="grid grid-cols-2 gap-4">
                  <InputField label="Age" type="number" placeholder="Years" onChange={(v) => handleInputChange("Age", v)} />
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Gender</label>
                    <div className="relative">
                      <select
                        className="w-full bg-background border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-green-500 transition-all appearance-none"
                        onChange={e => handleInputChange("Sex", e.target.value)}
                      >
                        <option value="">Select</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </select>
                      <div className="absolute right-3 top-3.5 pointer-events-none text-muted-foreground">
                        <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <InputField label="State of Origin" placeholder="state" onChange={(v) => handleInputChange("State", v)} />
                  <InputField label="Nationality" placeholder="Country" onChange={(v) => handleInputChange("Nationality", v)} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <InputField label="Phone Number" placeholder="080..." icon={<Phone className="w-4 h-4" />} onChange={(v) => handleInputChange("Phone", v)} />
                  <InputField label="Duration" placeholder="e.g. 6 Months" icon={<Calendar className="w-4 h-4" />} onChange={(v) => handleInputChange("Duration", v)} />
                </div>
              </div>
            </div>

            {/* Guarantor Details */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold flex items-center gap-2 border-b border-border pb-2 text-foreground">
                <Shield className="w-5 h-5 text-green-500" /> Guarantor Details
              </h3>

              <div className="space-y-4">
                <InputField
                  label="Guarantor Name"
                  placeholder="Full Name"
                  onChange={(v) => handleInputChange("GuarantorName", v)}
                />
                <InputField
                  label="Guarantor Address"
                  placeholder="Full Address"
                  icon={<MapPin className="w-4 h-4" />}
                  onChange={(v) => handleInputChange("GuarantorAddress", v)}
                />
                <InputField
                  label="Guarantor Phone"
                  placeholder="Phone Number"
                  icon={<Phone className="w-4 h-4" />}
                  onChange={(v) => handleInputChange("GuarantorPhone", v)}
                />
              </div>

              {/* Training Schedule Preferences */}
              <div className="mt-8">
                <h3 className="text-lg font-semibold flex items-center gap-2 border-b border-border pb-2 mb-4 text-foreground">
                  <Clock className="w-5 h-5 text-purple-500" /> Training Schedule
                </h3>
                <div className="flex flex-col gap-3">
                  <Checkbox label="Morning (9am - 12pm)" onChange={(c) => handleInputChange("Morning", c)} />
                  <Checkbox label="Afternoon (12pm - 3pm)" onChange={(c) => handleInputChange("Afternoon", c)} />
                  <Checkbox label="Evening (3pm - 6pm)" onChange={(c) => handleInputChange("Evening", c)} />
                </div>
              </div>
            </div>
          </div>

          {/* Rules Section */}
          <div className="bg-red-500/5 rounded-xl p-6 border border-red-500/20">
            <h3 className="font-bold text-center text-red-600 dark:text-red-400 mb-4 flex items-center justify-center gap-2 uppercase tracking-wide">
              <Shield className="w-5 h-5" /> Rules and Regulations
            </h3>
            <ul className="list-disc ml-6 space-y-2 text-sm text-foreground/80">
              <li>DO NOT steal properties or work equipment belonging to the establishment or teacher.</li>
              <li>Respect and obey all instructions given by the Teacher.</li>
              <li>Maintain professional conduct; fighting or abuse toward the Teacher or customers is strictly prohibited.</li>
            </ul>
          </div>

          {/* Signatures */}
          <div className="bg-muted/10 border border-border rounded-xl p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <SignatureInput label="Guarantor's Signature" onChange={(v) => handleInputChange("GuarantorSign", v)} />
              <SignatureInput label="Apprentice's Signature" onChange={(v) => handleInputChange("ApprenticeSign", v)} />
            </div>
            <div className="flex justify-center">
              <SignatureInput label="Master's Signature" onChange={(v) => handleInputChange("MasterSign", v)} width="w-72" />
            </div>
          </div>

          <button
            type="submit"
            disabled={downloading}
            className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg transition-all duration-300 flex items-center justify-center gap-2
              ${downloading
                ? "bg-muted text-muted-foreground cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700 text-white transform hover:translate-y-[-1px]"}`}
          >
            {downloading ? (
              <>Generating PDF...</>
            ) : (
              <>
                <FileText className="w-5 h-5" /> Submit & Download Registration PDF
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

// Helper Components

interface InputFieldProps {
  label: string;
  type?: string;
  placeholder?: string;
  icon?: React.ReactNode;
  onChange: (value: string) => void;
}

function InputField({ label, type = "text", placeholder, icon, onChange }: InputFieldProps) {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider ml-1">{label}</label>
      <div className="relative group">
        <input
          type={type}
          placeholder={placeholder}
          className={`w-full bg-background border border-border rounded-lg px-4 py-3 ${icon ? 'pl-10' : 'pl-4'} text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all`}
          onChange={(e) => onChange(e.target.value)}
        />
        {icon && <div className="absolute left-3 top-3.5 text-muted-foreground group-focus-within:text-green-500 transition-colors">{icon}</div>}
      </div>
    </div>
  );
}

interface CheckboxProps {
  label: string;
  onChange: (checked: boolean) => void;
}

function Checkbox({ label, onChange }: CheckboxProps) {
  return (
    <label className="flex items-center gap-3 bg-card px-4 py-3 rounded-lg border border-border hover:border-green-500 cursor-pointer transition-all group select-none">
      <div className="relative flex items-center">
        <input type="checkbox" className="peer sr-only" onChange={(e) => onChange(e.target.checked)} />
        <div className="w-5 h-5 border-2 border-muted-foreground rounded peer-checked:bg-green-500 peer-checked:border-green-500 transition-all"></div>
        <CheckCircle className="absolute w-3.5 h-3.5 top-0.5 left-0.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" />
      </div>
      <span className="text-foreground group-hover:text-green-500 transition-colors text-sm font-medium">{label}</span>
    </label>
  );
}

interface SignatureInputProps {
  label: string;
  width?: string;
  onChange: (value: string) => void;
}

function SignatureInput({ label, onChange, width = "w-full" }: SignatureInputProps) {
  return (
    <div className={`flex flex-col items-center gap-2 ${width}`}>
      <span className="text-xs text-muted-foreground uppercase tracking-wider">{label} & Date</span>
      <input
        type="text"
        className="w-full bg-transparent border-b-2 border-border focus:border-green-500 px-2 py-1 text-center text-foreground outline-none transition-colors font-handwriting"
        placeholder="Sign here..."
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
