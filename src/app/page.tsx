"use client"

import Link from 'next/link'
import Image from 'next/image'
import { Phone, MapPin, MessageCircle, Laptop, Smartphone, Cpu, Mail, Clock, Star, Menu, X, Sun, ShoppingBag, Headphones, FileText, CheckCircle2, ArrowRight } from 'lucide-react'
import { useState } from 'react'

import pics1 from "/public/images/placeholder1.jpg"
import pics2 from "/public/images/placeholder2.jpg"


export default function HomePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl md:text-2xl font-bold bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text text-transparent">
              ABTECH iREPAIR
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            <Link href="#home" className="transition-colors hover:text-green-500">Home</Link>
            <Link href="#about" className="transition-colors hover:text-green-500">About</Link>
            <Link href="#services" className="transition-colors hover:text-green-500">Services</Link>
            <Link href="#contact" className="transition-colors hover:text-green-500">Contact</Link>
            <Link href="#testimonials" className="transition-colors hover:text-green-500">Testimonials</Link>
            <Link href="/sales" className="text-foreground/60 transition-colors hover:text-green-500">Shop</Link>
            <div className="pl-4">
              <Link href="#contact" className="inline-flex h-9 items-center justify-center rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white shadow transition-colors hover:bg-green-700 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50">
                Book Repair
              </Link>
            </div>
          </nav>

          {/* Mobile Menu Toggle */}
          <button className="md:hidden p-2 text-foreground" onClick={toggleMenu} aria-label="Toggle menu">
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Nav */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-border bg-background p-4 animate-in slide-in-from-top-2">
            <nav className="grid gap-4 text-lg font-medium">
              <Link href="#home" onClick={toggleMenu} className="hover:text-green-500">Home</Link>
              <Link href="#about" onClick={toggleMenu} className="hover:text-green-500">About</Link>
              <Link href="#services" onClick={toggleMenu} className="hover:text-green-500">Services</Link>
              <Link href="#contact" onClick={toggleMenu} className="hover:text-green-500">Contact</Link>
              <Link href="#testimonials" onClick={toggleMenu} className="hover:text-green-500">Testimonials</Link>
              <Link href="/sales" onClick={toggleMenu} className="hover:text-green-500">Shop</Link>
              <Link href="#contact" onClick={toggleMenu} className="mt-2 inline-flex items-center justify-center rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-green-700">
                Book Repair
              </Link>
            </nav>
          </div>
        )}
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section id="home" className="relative py-12 md:py-24 lg:py-32 overflow-hidden bg-gradient-to-b from-background to-secondary/20">
          <div className="container px-4 md:px-6 mx-auto relative z-10">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="flex flex-col justify-center space-y-4 text-center lg:text-left">
                <div className="inline-block rounded-lg bg-green-500/10 px-3 py-1 text-sm text-green-500 w-fit mx-auto lg:mx-0">
                  Premium Tech Repair Services
                </div>
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                  Revive Your Gadgets with <span className="text-green-500">Expert Care</span>
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl mx-auto lg:mx-0">
                  Specialized repairs for Laptops, Phones, and PCBs. Fast turnaround, quality parts, and expert technicians you can trust.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
                  <Link href="/device-registration" className="inline-flex h-12 items-center justify-center rounded-lg bg-green-600 px-8 text-sm font-medium text-white shadow transition-colors hover:bg-green-700 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
                    <FileText className="mr-2 h-4 w-4" /> Register Device
                  </Link>
                  <Link href="/sales" className="inline-flex h-12 items-center justify-center rounded-lg border border-input bg-background px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
                    <ShoppingBag className="mr-2 h-4 w-4" /> Shop Now
                  </Link>
                </div>
                <div className='flex gap-4 justify-center lg:justify-start pt-4 text-sm text-muted-foreground'>
                  <div className='flex items-center'><CheckCircle2 className='w-4 h-4 mr-1 text-green-500' /> 5+ Years Exp.</div>
                  <div className='flex items-center'><CheckCircle2 className='w-4 h-4 mr-1 text-green-500' /> Fast Service</div>
                  <div className='flex items-center'><CheckCircle2 className='w-4 h-4 mr-1 text-green-500' /> Warranty</div>
                </div>
              </div>
              <div className="mx-auto lg:order-last w-full flex justify-center lg:justify-end">
                <div className="relative w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] lg:w-[450px] lg:h-[450px]">
                  {/* Decorative Elements */}
                  <div className="absolute top-0 right-0 w-3/4 h-3/4 bg-gradient-to-tr from-green-500/20 to-blue-500/20 rounded-full blur-3xl -z-10" />
                  <div className="absolute bottom-0 left-0 w-3/4 h-3/4 bg-gradient-to-tr from-blue-500/20 to-purple-500/20 rounded-full blur-3xl -z-10" />

                  {/* Image 1 - Top Left */}
                  <div className="absolute top-0 left-0 w-[65%] h-[65%] rounded-2xl overflow-hidden shadow-2xl z-10 animate-in fade-in zoom-in duration-700">
                    <Image src={pics1} alt="Technician working" fill className="object-cover hover:scale-105 transition-transform duration-500" />
                  </div>

                  {/* Image 2 - Bottom Right */}
                  <div className="absolute bottom-0 right-0 w-[65%] h-[65%] rounded-2xl overflow-hidden shadow-2xl border-4 border-background z-20 animate-in fade-in zoom-in duration-700 delay-200">
                    <Image src={pics2} alt="Modern repair lab" fill className="object-cover hover:scale-105 transition-transform duration-500" />
                  </div>

                  {/* Floating Badge */}
                  <div className="absolute bottom-[10%] -left-[10%] z-30 bg-card p-4 rounded-xl shadow-xl border border-border/50 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500 hidden sm:block">
                    <div className="flex items-center gap-3">
                      <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-full">
                        <CheckCircle2 className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm font-bold">Official Warranty</p>
                        <p className="text-xs text-muted-foreground">On all repairs</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* About / Why Choose Us Section */}
        <section id="about" className="py-12 md:py-24 bg-muted/40">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Why Choose ABTECH?</h2>
              <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                We combine technical expertise with customer-centric service to deliver the best repair experience.
              </p>
            </div>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { icon: CheckCircle2, title: "Expert Technicians", desc: "Led by industry veterans with over 10 years of experience." },
                { icon: Clock, title: "Quick Turnaround", desc: "Most repairs are completed within 24-48 hours." },
                { icon: Sun, title: "Affordable Pricing", desc: "Competitive rates without compromising on quality parts." },
                { icon: Star, title: "Warranty Assured", desc: "We stand by our work with a guarantee on all repairs." },
              ].map((feature, i) => (
                <div key={i} className="flex flex-col items-center text-center p-6 bg-card rounded-xl shadow-sm border border-border/50 hover:shadow-md transition-shadow">
                  <div className="p-3 bg-green-500/10 rounded-full mb-4">
                    <feature.icon className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.desc}</p>
                </div>
              ))}
            </div>
            <div className="mt-12 text-center">
              <p className="text-muted-foreground italic max-w-2xl mx-auto">
                "At ABTECH iREPAIR, our mission is to get your devices back to full functionality as quickly as possible. Led by Haliru Abdullah, our team brings precision and passion to every repair."
              </p>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section id="services" className="py-12 md:py-24">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <div className="inline-block rounded-lg bg-blue-500/10 px-3 py-1 text-sm text-blue-500">
                Our Expertise
              </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Comprehensive Services</h2>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { icon: Laptop, title: "Laptop Repairs", items: ["Screen Replacement", "Battery Upgrade", "Keyboard Fix", "Motherboard Repair"] },
                { icon: Smartphone, title: "Phone Repairs", items: ["Cracked Screen", "Charging Port", "Battery Swap", "Water Damage"] },
                { icon: Cpu, title: "PCB & Motherboard", items: ["Advanced Diagnostics", "Chip-level Repair", "Data Recovery", "Microsoldering"] },
                { icon: Sun, title: "Solar Installation", items: ["Home Systems", "Inverter Setup", "Battery Storage", "Maintenance"] },
                { icon: ShoppingBag, title: "Sales & Upgrades", items: ["New & Used Laptops", "Custom Builds", "Accessories", "Trade-ins"] },
                { icon: Headphones, title: "Accessories", items: ["Protective Cases", "Screen Guards", "Cables & Pars", "Audio Gear"] },
              ].map((service, i) => (
                <div key={i} className="group relative overflow-hidden rounded-lg border border-border bg-card p-6 shadow-sm transition-all hover:shadow-lg hover:-translate-y-1">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-2 bg-secondary rounded-lg group-hover:bg-blue-500/10 group-hover:text-blue-500 transition-colors">
                      <service.icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-bold">{service.title}</h3>
                  </div>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    {service.items.map((item, j) => (
                      <li key={j} className="flex items-center">
                        <span className="mr-2 h-1.5 w-1.5 rounded-full bg-green-500" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div className="mt-12 text-center">
              <Link href="/trainee-registration" className="inline-flex items-center justify-center rounded-lg bg-secondary px-8 py-3 text-sm font-medium text-secondary-foreground shadow-sm hover:bg-secondary/80 outline-dashed outline-2 outline-offset-2 outline-gray-300">
                <FileText className="mr-2 h-4 w-4" /> Become a Trainee Technician
              </Link>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section id="testimonials" className="py-12 md:py-24 bg-muted/40">
          <div className="container px-4 md:px-6 mx-auto">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-center mb-12">What Our Customers Say</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
              {[
                { name: "Haliru A.", text: "Fantastic service! My laptop was fixed within 24 hours. The team was professional and explained everything clearly." },
                { name: "Grace O.", text: "Affordable pricing and professional technicians. Highly recommended! They saved my phone from water damage." },
                { name: "Mohammed B.", text: "I bought a refurbished laptop here and it works like new. Great value for money and excellent after-sales support." },
              ].map((t, i) => (
                <div key={i} className="flex flex-col p-6 bg-background rounded-xl shadow-sm border border-border">
                  <div className="flex mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4 flex-1">"{t.text}"</p>
                  <div className="font-semibold text-sm">{t.name}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-green-600 text-white">
          <div className="container px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to fix your device?</h2>
            <p className="mb-8 text-green-100 max-w-xl mx-auto">Don't let a broken gadget slow you down. Contact us today for a quick quote or visit our repair center.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="https://wa.link/yexqzh" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center bg-white text-green-600 px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors">
                <MessageCircle className="mr-2" /> Chat on WhatsApp
              </a>
              <Link href="#contact" className="inline-flex items-center justify-center bg-green-700 text-white px-8 py-3 rounded-lg font-bold hover:bg-green-800 transition-colors border border-green-500">
                Contact Us
              </Link>
            </div>
          </div>
        </section>

        <section id="contact" className="py-12 md:py-24 bg-muted/30">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Get in Touch</h2>
              <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed">
                Have a question or need a repair? Visit us or drop a message.
              </p>
            </div>
            <div className="grid lg:grid-cols-2 gap-12 items-start">
              <div className="space-y-8">
                <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
                  <h3 className="text-xl font-bold mb-6">Contact Information</h3>
                  <div className="space-y-6">
                    <div className="flex items-start group">
                      <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-lg mr-4 group-hover:scale-110 transition-transform">
                        <MapPin className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-bold">Main Office</h3>
                        <p className="text-muted-foreground text-sm mt-1">Gk M.M Castle, Opp sch new gate Jatapi office,<br />Minna, Niger State</p>
                      </div>
                    </div>
                    <div className="flex items-start group">
                      <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-lg mr-4 group-hover:scale-110 transition-transform">
                        <MapPin className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-bold">Branch Office</h3>
                        <p className="text-muted-foreground text-sm mt-1">Lokoja</p>
                      </div>
                    </div>
                    <div className="flex items-center group">
                      <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-lg mr-4 group-hover:scale-110 transition-transform">
                        <Phone className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-bold">Phone</h3>
                        <p className="text-muted-foreground text-sm mt-1">+234 8101765592</p>
                      </div>
                    </div>
                    <div className="flex items-center group">
                      <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-lg mr-4 group-hover:scale-110 transition-transform">
                        <Clock className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-bold">Business Hours</h3>
                        <p className="text-muted-foreground text-sm mt-1">Mon - Fri: 9 AM - 6 PM</p>
                        <p className="text-muted-foreground text-sm">Sat: 10 AM - 4 PM</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Form & Map Tabs (Visual Only for now) */}
              <div className="space-y-6">
                <div className="bg-card p-2 rounded-xl border border-border shadow-lg h-[400px] overflow-hidden relative group">
                  <div className="absolute inset-0 bg-muted animate-pulse group-hover:hidden transition-opacity duration-700" />
                  <iframe
                    src="https://maps.google.com/maps?q=9.5413129,6.4694688&t=&z=18&ie=UTF8&iwloc=&output=embed"
                    width="100%"
                    height="100%"
                    style={{ border: 0, filter: 'grayscale(0.2) contrast(1.1)' }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="ABTECH Minna Branch Location"
                    className="rounded-lg group-hover:filter-none transition-all duration-500"
                  />
                  <div className="absolute bottom-4 right-4 bg-background/90 backdrop-blur px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm border border-border">
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-3 h-3 text-red-500" /> View Larger Map
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border bg-card">
        <div className="container px-4 md:px-6 mx-auto py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="col-span-2 md:col-span-1">
              <Link href="/" className="mb-4 inline-block">
                <span className="text-xl font-bold bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text text-transparent">
                  ABTECH iREPAIR
                </span>
              </Link>
              <p className="text-sm text-muted-foreground mb-4">
                Your trusted partner for expert device repairs and tech solutions.
              </p>
              <div className="flex space-x-4">
                {/* Social Placeholders */}
                <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center hover:bg-green-500 hover:text-white transition-colors cursor-pointer">
                  <span className="sr-only">Facebook</span>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" /></svg>
                </div>
                <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center hover:bg-green-500 hover:text-white transition-colors cursor-pointer">
                  <span className="sr-only">Twitter</span>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" /></svg>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Services</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#services" className="hover:text-green-500 transition-colors">Laptop Repair</Link></li>
                <li><Link href="#services" className="hover:text-green-500 transition-colors">Phone Repair</Link></li>
                <li><Link href="#services" className="hover:text-green-500 transition-colors">Solar Installation</Link></li>
                <li><Link href="/sales" className="hover:text-green-500 transition-colors">Shop Accessories</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#contact" className="hover:text-green-500 transition-colors">Contact Us</Link></li>
                <li><Link href="#" className="hover:text-green-500 transition-colors">FAQ</Link></li>
                <li><Link href="#" className="hover:text-green-500 transition-colors">Return Policy</Link></li>
                <li><Link href="#" className="hover:text-green-500 transition-colors">Warranty Terms</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Newsletter</h3>
              <p className="text-sm text-muted-foreground mb-4">Subscribe to get updates on new stock and sales.</p>
              <div className="flex gap-2">
                <input type="email" placeholder="Email" className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" />
                <button className="h-9 w-9 flex items-center justify-center rounded-md bg-green-600 text-white hover:bg-green-700 transition-colors">
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="border-t border-border/50 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} ABTECH iREPAIR. All rights reserved.</p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <Link href="#" className="hover:text-foreground">Privacy</Link>
              <Link href="#" className="hover:text-foreground">Terms</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}