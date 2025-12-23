"use client";

import { useState, type FormEvent } from "react";
import { Upload, FileText, User, MapPin, Calendar, Phone, Clock, Shield, CheckCircle } from "lucide-react";

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
    <div className="min-h-screen bg-gray-950 text-gray-100 py-12 px-4 sm:px-6 lg:px-8 flex justify-center">
      <div className="w-full max-w-4xl bg-gray-900 shadow-2xl rounded-3xl overflow-hidden border border-gray-800">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-900 to-gray-900 p-8 text-center border-b border-gray-800">
          <h1 className="text-4xl font-extrabold text-white tracking-widest mb-2">ABTECH iREPAIR</h1>
          <p className="text-blue-200 font-medium">Gk M.M Castle, Opp sch new gate Jatapi office Minna Niger State.</p>
          <div className="mt-6 inline-block bg-gray-800/50 px-6 py-2 rounded-full border border-blue-500/30">
            <h2 className="text-xl font-bold text-blue-400 tracking-wide">APPRENTICE REGISTRATION FORM</h2>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">

          {/* Passport Upload Section */}
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="relative group">
              <div className={`w-32 h-32 rounded-full border-4 ${passport ? 'border-blue-500' : 'border-gray-700 hover:border-blue-400'} flex items-center justify-center overflow-hidden bg-gray-800 transition-colors duration-300 shadow-lg`}>
                {passport ? (
                  <img src={passport} alt="Passport" className="w-full h-full object-cover" />
                ) : (
                  <CameraIcon className="w-12 h-12 text-gray-500 group-hover:text-blue-400 transition-colors" />
                )}
              </div>
              <label className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-500 text-white p-2 rounded-full cursor-pointer shadow-md transition-transform hover:scale-110">
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
            <span className="text-sm text-gray-400 font-medium tracking-wide">Upload Passport Photograph</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

            {/* Apprentice Details */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-300 flex items-center gap-2 border-b border-gray-800 pb-2">
                <User className="w-5 h-5 text-blue-500" /> Apprentice Details
              </h3>

              <div className="space-y-4">
                <InputField label="Full Name" placeholder="e.g. John Doe" onChange={(v) => handleInputChange("Name", v)} />
                <InputField label="Residential Address" placeholder="Full home address" icon={<MapPin className="w-4 h-4" />} onChange={(v) => handleInputChange("Address", v)} />

                <div className="grid grid-cols-2 gap-4">
                  <InputField label="Age" type="number" placeholder="Years" onChange={(v) => handleInputChange("Age", v)} />
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Gender</label>
                    <select
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      onChange={e => handleInputChange("Sex", e.target.value)}
                    >
                      <option>Select</option>
                      <option>Male</option>
                      <option>Female</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <InputField label="State of Origin" placeholder="state" onChange={(v) => handleInputChange("State", v)} />
                  <InputField label="Nationality" placeholder="Currency" onChange={(v) => handleInputChange("Nationality", v)} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <InputField label="Phone Number" placeholder="080..." icon={<Phone className="w-4 h-4" />} onChange={(v) => handleInputChange("Phone", v)} />
                  <InputField label="Duration" placeholder="e.g. 6 Months" icon={<Calendar className="w-4 h-4" />} onChange={(v) => handleInputChange("Duration", v)} />
                </div>
              </div>
            </div>

            {/* Guarantor Details */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-300 flex items-center gap-2 border-b border-gray-800 pb-2">
                <Shield className="w-5 h-5 text-green-500" /> Guarantor Details
              </h3>

              <div className="space-y-4">
                <InputField
                  label="Guarantor Name"
                  placeholder="Full Name"
                  borderColor="border-green-500/30"
                  focusColor="focus:ring-green-500"
                  onChange={(v) => handleInputChange("GuarantorName", v)}
                />
                <InputField
                  label="Guarantor Address"
                  placeholder="Full Address"
                  borderColor="border-green-500/30"
                  focusColor="focus:ring-green-500"
                  icon={<MapPin className="w-4 h-4" />}
                  onChange={(v) => handleInputChange("GuarantorAddress", v)}
                />
                <InputField
                  label="Guarantor Phone"
                  placeholder="Phone Number"
                  borderColor="border-green-500/30"
                  focusColor="focus:ring-green-500"
                  icon={<Phone className="w-4 h-4" />}
                  onChange={(v) => handleInputChange("GuarantorPhone", v)}
                />
              </div>

              {/* Training Schedule Preferences */}
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-gray-300 flex items-center gap-2 border-b border-gray-800 pb-2 mb-4">
                  <Clock className="w-5 h-5 text-purple-500" /> Training Schedule
                </h3>
                <div className="flex flex-wrap gap-4">
                  <Checkbox label="Morning (9am - 12pm)" onChange={(c) => handleInputChange("Morning", c)} />
                  <Checkbox label="Afternoon (12pm - 3pm)" onChange={(c) => handleInputChange("Afternoon", c)} />
                  <Checkbox label="Evening (3pm - 6pm)" onChange={(c) => handleInputChange("Evening", c)} />
                </div>
              </div>
            </div>
          </div>

          {/* Rules Section */}
          <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50">
            <h3 className="font-bold text-center text-red-400 mb-4 flex items-center justify-center gap-2">
              <Shield className="w-4 h-4" /> RULES AND REGULATIONS
            </h3>
            <ul className="list-disc ml-6 space-y-2 text-sm text-gray-300">
              <li>DO NOT steal properties or work equipment belonging to the establishment or teacher.</li>
              <li>Respect and obey all instructions given by the Teacher.</li>
              <li>Maintain professional conduct; fighting or abuse toward the Teacher or customers is strictly prohibited.</li>
            </ul>
          </div>

          {/* Signatures */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <SignatureInput label="Guarantor's Signature" onChange={(v) => handleInputChange("GuarantorSign", v)} />
              <SignatureInput label="Apprentice's Signature" onChange={(v) => handleInputChange("ApprenticeSign", v)} />
            </div>
            <div className="flex justify-center">
              <SignatureInput label="Master's Signature" onChange={(v) => handleInputChange("MasterSign", v)} width="w-64" />
            </div>
          </div>

          <button
            type="submit"
            disabled={downloading}
            className={`w-full py-4 rounded-xl font-bold text-lg shadow-xl transition-all duration-300 flex items-center justify-center gap-2
              ${downloading
                ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white transform hover:translate-y-[-2px]"}`}
          >
            {downloading ? (
              <>Processing Request...</>
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
  borderColor?: string;
  focusColor?: string;
  onChange: (value: string) => void;
}

function InputField({ label, type = "text", placeholder, icon, borderColor = "border-gray-700", focusColor = "focus:ring-blue-500", onChange }: InputFieldProps) {
  return (
    <div className="flex flex-col gap-1 w-full">
      <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1">{label}</label>
      <div className="relative">
        <input
          type={type}
          placeholder={placeholder}
          className={`w-full bg-gray-800 border ${borderColor} rounded-lg px-4 py-3 ${icon ? 'pl-10' : 'pl-4'} text-gray-100 placeholder-gray-600 focus:outline-none focus:ring-2 ${focusColor} focus:border-transparent transition-all`}
          onChange={(e) => onChange(e.target.value)}
        />
        {icon && <div className="absolute left-3 top-3.5 text-gray-500">{icon}</div>}
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
    <label className="flex items-center gap-3 bg-gray-800 px-4 py-3 rounded-lg border border-gray-700 hover:border-blue-500/50 cursor-pointer transition-all group select-none">
      <div className="relative flex items-center">
        <input type="checkbox" className="peer sr-only" onChange={(e) => onChange(e.target.checked)} />
        <div className="w-5 h-5 border-2 border-gray-500 rounded peer-checked:bg-blue-500 peer-checked:border-blue-500 transition-all"></div>
        <CheckCircle className="absolute w-5 h-5 text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" />
      </div>
      <span className="text-gray-300 group-hover:text-white transition-colors text-sm">{label}</span>
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
      <span className="text-xs text-gray-500 uppercase tracking-wider">{label} & Date</span>
      <input
        type="text"
        className="w-full bg-transparent border-b-2 border-gray-700 focus:border-blue-500 px-2 py-1 text-center text-gray-200 outline-none transition-colors font-handwriting"
        placeholder="Sign here..."
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

function CameraIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"></path>
      <circle cx="12" cy="13" r="3"></circle>
    </svg>
  )
}
