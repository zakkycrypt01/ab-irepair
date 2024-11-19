"use client"

import Link from 'next/link'
import Image from 'next/image'
import { Phone, MapPin, MessageCircle, Laptop, Smartphone, Cpu, Mail, Clock, Star, Menu, X, Sun, ShoppingBag, Headphones } from 'lucide-react'
import { useState } from 'react'

export default function HomePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <header className="bg-gray-800 py-4 sticky top-0 z-10">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">TechFix Solutions</h1>
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden" aria-label="Toggle menu">
            {isMenuOpen ? <X /> : <Menu />}
          </button>
          <nav className={`${isMenuOpen ? 'block' : 'hidden'} md:block absolute md:relative top-full left-0 w-full md:w-auto bg-gray-800 md:bg-transparent`}>
            <ul className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4 p-4 md:p-0">
              <li><Link href="#home" className="hover:text-blue-400">Home</Link></li>
              <li><Link href="#about" className="hover:text-blue-400">About</Link></li>
              <li><Link href="#services" className="hover:text-blue-400">Services</Link></li>
              <li><Link href="#contact" className="hover:text-blue-400">Contact</Link></li>
              <li><Link href="#testimonials" className="hover:text-blue-400">Testimonials</Link></li>
              <li><Link href="/sales" className="hover:text-blue-400">Shop</Link></li>
            </ul>
          </nav>
        </div>
      </header>

      <main>
        <section id="home" className="py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-6">Welcome to TechFix Solutions!</h2>
            <p className="text-xl mb-8">
              We specialize in expert laptop, phone, and PCB repairs with fast and reliable service. Your gadgets are in safe hands!
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center text-blue-400">
                <Phone className="mr-2" />
                <span>Call us: +234 812 345 6789</span>
              </div>
              <div className="flex items-center text-blue-400">
                <MapPin className="mr-2" />
                <span>Visit us: 123 Tech Avenue, Lagos</span>
              </div>
              <div className="flex items-center text-blue-400">
                <MessageCircle className="mr-2" />
                <span>Chat on WhatsApp</span>
              </div>
            </div>
            <div className="mt-8 text-center">
              <Link href="/sales" className="inline-flex items-center bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition duration-300">
                <ShoppingBag className="mr-2" />
                Shop Now
              </Link>
            </div>
          </div>
        </section>

        <section id="about" className="py-12 bg-gray-800">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-6">About Us</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <p className="mb-6">
                  At TechFix Solutions, we have over 5 years of experience in providing top-notch repair services for laptops, phones, and PCB boards. Our mission is to get your devices back to full functionality as quickly as possible, using high-quality parts and advanced tools.
                </p>
                <p className="mb-6">
                  Our team is led by our experienced manager, John Doe, who brings over 10 years of expertise in the tech repair industry.
                </p>
                <h3 className="text-2xl font-semibold mb-4">Why Choose Us?</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <div className="bg-blue-500 rounded-full p-2 mr-3">
                      <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span>Affordable Pricing</span>
                  </div>
                  <div className="flex items-center">
                    <div className="bg-blue-500 rounded-full p-2 mr-3">
                      <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span>Experienced Technicians</span>
                  </div>
                  <div className="flex items-center">
                    <div className="bg-blue-500 rounded-full p-2 mr-3">
                      <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span>Quick Turnaround Time</span>
                  </div>
                  <div className="flex items-center">
                    <div className="bg-blue-500 rounded-full p-2 mr-3">
                      <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span>Warranty on Repairs</span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="relative w-full h-0 pb-[100%] rounded-full overflow-hidden">
                  <Image
                    src="/placeholder.svg?height=300&width=300"
                    alt="TechFix Solutions team at work"
                    layout="fill"
                    objectFit="cover"
                    className="absolute inset-0"
                  />
                </div>
                <div className="relative w-full h-0 pb-[100%] rounded-full overflow-hidden">
                  <Image
                    src="/placeholder.svg?height=300&width=300"
                    alt="Our state-of-the-art repair facility"
                    layout="fill"
                    objectFit="cover"
                    className="absolute inset-0"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="services" className="py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-6">Our Services</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-800 rounded-lg p-6">
                <Laptop className="text-blue-400 w-12 h-12 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Laptop Repairs</h3>
                <ul className="space-y-2">
                  <li>Screen Replacement</li>
                  <li>Battery Replacement</li>
                  <li>Keyboard Repairs</li>
                  <li>Motherboard Diagnostics and Repair</li>
                </ul>
              </div>
              <div className="bg-gray-800 rounded-lg p-6">
                <Smartphone className="text-blue-400 w-12 h-12 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Phone Repairs</h3>
                <ul className="space-y-2">
                  <li>Cracked Screen Replacement</li>
                  <li>Charging Port Repairs</li>
                  <li>Battery Replacement</li>
                  <li>Water Damage Repairs</li>
                </ul>
              </div>
              <div className="bg-gray-800 rounded-lg p-6">
                <Cpu className="text-blue-400 w-12 h-12 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Dead Device Repair</h3>
                <ul className="space-y-2">
                  <li>Dead Laptop Revival</li>
                  <li>Dead Phone Recovery</li>
                  <li>Water Damage Restoration</li>
                  <li>Motherboard Repair</li>
                </ul>
              </div>
              <div className="bg-gray-800 rounded-lg p-6">
                <Sun className="text-blue-400 w-12 h-12 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Solar Installation</h3>
                <ul className="space-y-2">
                  <li>Residential Solar Panels</li>
                  <li>Commercial Solar Systems</li>
                  <li>Solar Inverter Installation</li>
                  <li>Solar Battery Storage</li>
                </ul>
              </div>
              <div className="bg-gray-800 rounded-lg p-6">
                <ShoppingBag className="text-blue-400 w-12 h-12 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Laptop Sales</h3>
                <ul className="space-y-2">
                  <li>New Laptops</li>
                  <li>Refurbished Laptops</li>
                  <li>Custom-Built Laptops</li>
                  <li>Laptop Upgrades</li>
                </ul>
              </div>
              <div className="bg-gray-800 rounded-lg p-6">
                <Headphones className="text-blue-400 w-12 h-12 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Phone Accessories</h3>
                <ul className="space-y-2">
                  <li>Cases and Covers</li>
                  <li>Screen Protectors</li>
                  <li>Chargers and Cables</li>
                  <li>Bluetooth Headsets</li>
                </ul>
              </div>
            </div>
            <div className="mt-8 text-center">
              <a href="#" className="inline-flex items-center bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300">
                <MessageCircle className="mr-2" />
                Need help? Chat on WhatsApp
              </a>
            </div>
          </div>
        </section>

        <section id="contact" className="py-12 bg-gray-800">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-6">Get in Touch</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-2xl font-semibold mb-4">Contact Information</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-blue-400">Main Office:</h4>
                    <div className="flex items-center mt-2">
                      <MapPin className="text-blue-400 mr-2" />
                      <span>123 Tech Avenue, Lagos</span>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-blue-400">Branch Office:</h4>
                    <div className="flex items-center mt-2">
                      <MapPin className="text-blue-400 mr-2" />
                      <span>456 Digital Street, Abuja</span>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Phone className="text-blue-400 mr-2" />
                    <span>+234 812 345 6789</span>
                  </div>
                  <div className="flex items-center">
                    <MessageCircle className="text-blue-400 mr-2" />
                    <a href="#" className="text-blue-400 hover:underline">Click here to chat on WhatsApp</a>
                  </div>
                  <div className="flex items-center">
                    <Mail className="text-blue-400 mr-2" />
                    <a href="mailto:contact@techfixsolutions.com" className="text-blue-400 hover:underline">contact@techfixsolutions.com</a>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-semibold mb-4">Business Hours</h3>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Clock className="text-blue-400 mr-2" />
                    <span>Monday - Friday: 9 AM - 6 PM</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="text-blue-400 mr-2" />
                    <span>Saturday: 10 AM - 4 PM</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="testimonials" className="py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-6">What Our Customers Say</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-800 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <Star className="text-yellow-400 w-6 h-6" />
                  <Star className="text-yellow-400 w-6 h-6" />
                  <Star className="text-yellow-400 w-6 h-6" />
                  <Star className="text-yellow-400 w-6 h-6" />
                  <Star className="text-yellow-400 w-6 h-6" />
                </div>
                <p className="mb-4">"Fantastic service! My laptop was fixed within 24 hours."</p>
                <p className="font-semibold">- John D.</p>
              </div>
              <div className="bg-gray-800 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <Star className="text-yellow-400 w-6 h-6" />
                  <Star className="text-yellow-400 w-6 h-6" />
                  <Star className="text-yellow-400 w-6 h-6" />
                  <Star className="text-yellow-400 w-6 h-6" />
                  <Star className="text-yellow-400 w-6 h-6" />
                </div>
                <p className="mb-4">"Affordable pricing and professional technicians. Highly recommended!"</p>
                <p className="font-semibold">- Grace O.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-gray-800 py-6">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2023 TechFix Solutions. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}