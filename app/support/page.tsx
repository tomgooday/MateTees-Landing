"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import Image from "next/image"
import { Mail, MessageSquare, Clock, HelpCircle, Shield, Users, MapPin, Smartphone } from "lucide-react"

export default function Support() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  })
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      const response = await fetch('/api/support', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setIsSubmitted(true)
        setFormData({ name: "", email: "", subject: "", message: "" })
      } else {
        alert("There was an error submitting your request. Please try emailing us directly at info@matees.com.au.")
      }
    } catch (error) {
      console.error('Support form error:', error)
      alert("There was an error submitting your request. Please try emailing us directly at info@matees.com.au.")
    } finally {
      setIsLoading(false)
    }
  }

  const faqs = [
    {
      question: "What is Matees?",
      answer: "Matees is a social golf networking app that helps golfers discover more golf mates, explore new courses, and find available tee times. We solve the common problem of having a small golfing circle and playing the same courses repeatedly by connecting you with fellow golf enthusiasts in your area."
    },
    {
      question: "How does Matees work?",
      answer: "It's simple! Download the app, create your golfer profile, browse local golfers and courses, send invitations to play, and book tee times together. You can connect with golfers who match your skill level, availability, and course preferences."
    },
    {
      question: "Is Matees free to use?",
      answer: "Matees is free to use (with a code) for now. In time we plan to charge for using the app."
    },
    {
      question: "What platforms is Matees available on?",
      answer: "Matees is available on both iOS (App Store) and Android (Google Play). Simply download the app on your mobile device to get started."
    },
    {
      question: "How do I create an account?",
      answer: "Download the Matees app from the App Store or Google Play, open it, and follow the simple registration process. You'll need to provide basic information like your name, email, and golfing preferences to create your profile."
    },
    {
      question: "Is my personal information safe?",
      answer: "Absolutely. We take your privacy and security seriously. Your personal information is encrypted and stored securely. We never share your data with third parties without your consent. You control what information is visible on your profile."
    },
    {
      question: "How do I find golfers near me?",
      answer: "The app uses your location (with your permission) to show you golfers and courses in your area. You can filter by distance, skill level, availability, and other preferences to find the perfect playing partners."
    },
    {
      question: "Can I suggest new courses to be added?",
      answer: "Yes! We're always looking to expand our course directory. If you know of a course that's not listed, please contact us at info@matees.com.au with the course details, and we'll work to add it."
    },
    {
      question: "How do I report inappropriate behavior?",
      answer: "User safety is our top priority. If you encounter any inappropriate behavior, please contact us immediately at info@matees.com.au with details about the incident."
    },
    {
      question: "Can I delete my account?",
      answer: "Yes, you can delete your account at any time from the app settings. All your personal data will be permanently removed from our systems in accordance with our privacy policy."
    },
    {
      question: "I'm having technical issues with the app. What should I do?",
      answer: "First, try restarting the app or reinstalling it. Make sure you have the latest version from the App Store or Google Play. If the issue persists, contact our support team at info@matees.com.au with details about the problem, including your device type and OS version."
    },
    {
      question: "How do I update my profile information?",
      answer: "Open the Matees app, go to your profile settings, and you can edit your information, photos, golfing preferences, and availability at any time."
    },
    {
      question: "Can I use Matees when traveling?",
      answer: "Absolutely! Matees is perfect for traveling golfers. You can update your location and connect with local golfers wherever you are, making it easy to play golf in new cities and countries."
    },
    {
      question: "How do I provide feedback or suggest new features?",
      answer: "We love hearing from our users! Send your feedback, suggestions, or feature requests to info@matees.com.au. Your input helps us make Matees better for everyone."
    }
  ]

  return (
    <div className="min-h-screen flex flex-col matetees-bg-white">
      {/* Header */}
      <header className="bg-[var(--matetees-black)] border-b border-[var(--matetees-light-green)] shadow-xl">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <a href="/" className="flex-shrink-0">
              <Image 
                alt="Matees Logo" 
                width={120} 
                height={40} 
                decoding="async" 
                className="cursor-pointer" 
                src="/Matees logo all white_RGB.png" 
                style={{ color: 'transparent' }}
              />
            </a>
            <nav className="flex items-center gap-6">
              <a href="/postlaunch" className="text-white hover:text-[var(--matetees-light-green)] transition-colors" style={{ fontFamily: 'Rubik, sans-serif' }}>
                Home
              </a>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 py-16 px-6">
        <div className="max-w-6xl mx-auto space-y-16">
          
          {/* Hero Section */}
          <div className="text-center space-y-4">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 rounded-full bg-[var(--matetees-light-green)] flex items-center justify-center">
                <HelpCircle className="w-10 h-10 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-[var(--matetees-black)]" style={{ fontFamily: 'Rubik, sans-serif' }}>
              Support & Help Center
            </h1>
            <p className="text-xl text-[var(--matetees-dark-green)] max-w-3xl mx-auto" style={{ fontFamily: 'Rubik, sans-serif' }}>
              We're here to help! Find answers to common questions or get in touch with our support team.
            </p>
          </div>

          {/* Contact Methods */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <Card className="border-2 border-[var(--matetees-light-green)]">
              <CardContent className="p-6 text-center space-y-3">
                <div className="w-12 h-12 mx-auto rounded-full bg-[var(--matetees-light-green)] flex items-center justify-center">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-[var(--matetees-black)]" style={{ fontFamily: 'Rubik, sans-serif' }}>
                  Email Support
                </h3>
                <a 
                  href="mailto:info@matees.com.au" 
                  className="text-[var(--matetees-light-green)] hover:text-[var(--matetees-dark-green)] font-semibold"
                  style={{ fontFamily: 'Rubik, sans-serif' }}
                >
                  info@matees.com.au
                </a>
              </CardContent>
            </Card>

            <Card className="border-2 border-[var(--matetees-light-green)]">
              <CardContent className="p-6 text-center space-y-3">
                <div className="w-12 h-12 mx-auto rounded-full bg-[var(--matetees-light-green)] flex items-center justify-center">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-[var(--matetees-black)]" style={{ fontFamily: 'Rubik, sans-serif' }}>
                  Response Time
                </h3>
                <p className="text-[var(--matetees-black)]" style={{ fontFamily: 'Rubik, sans-serif' }}>
                  We typically respond within 24 hours
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-[var(--matetees-light-green)]">
              <CardContent className="p-6 text-center space-y-3">
                <div className="w-12 h-12 mx-auto rounded-full bg-[var(--matetees-light-green)] flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-[var(--matetees-black)]" style={{ fontFamily: 'Rubik, sans-serif' }}>
                  Contact Form
                </h3>
                <p className="text-[var(--matetees-black)]" style={{ fontFamily: 'Rubik, sans-serif' }}>
                  Fill out the form below
                </p>
              </CardContent>
            </Card>
          </div>

          {/* FAQ Section */}
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-[var(--matetees-black)] mb-8" style={{ fontFamily: 'Rubik, sans-serif' }}>
              Frequently Asked Questions
            </h2>
            
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem 
                  key={index} 
                  value={`item-${index}`}
                  className="border-2 border-[var(--matetees-light-green)] rounded-lg px-6 bg-white"
                >
                  <AccordionTrigger className="text-left font-bold text-[var(--matetees-black)] hover:text-[var(--matetees-light-green)]" style={{ fontFamily: 'Rubik, sans-serif' }}>
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-[var(--matetees-black)] leading-relaxed" style={{ fontFamily: 'Rubik, sans-serif' }}>
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          {/* Contact Form */}
          <div className="max-w-2xl mx-auto">
            <Card className="border-2 border-[var(--matetees-light-green)] shadow-xl">
              <CardContent className="p-8">
                <h2 className="text-2xl md:text-3xl font-bold text-center text-[var(--matetees-black)] mb-6" style={{ fontFamily: 'Rubik, sans-serif' }}>
                  Send Us a Message
                </h2>
                
                {!isSubmitted ? (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-semibold text-[var(--matetees-black)] mb-2" style={{ fontFamily: 'Rubik, sans-serif' }}>
                        Your Name *
                      </label>
                      <Input
                        id="name"
                        type="text"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                        className="border-[var(--matetees-light-green)] focus:border-[var(--matetees-light-green)] focus:ring-[var(--matetees-light-green)]"
                        style={{ fontFamily: 'Rubik, sans-serif' }}
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-semibold text-[var(--matetees-black)] mb-2" style={{ fontFamily: 'Rubik, sans-serif' }}>
                        Email Address *
                      </label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                        className="border-[var(--matetees-light-green)] focus:border-[var(--matetees-light-green)] focus:ring-[var(--matetees-light-green)]"
                        style={{ fontFamily: 'Rubik, sans-serif' }}
                      />
                    </div>

                    <div>
                      <label htmlFor="subject" className="block text-sm font-semibold text-[var(--matetees-black)] mb-2" style={{ fontFamily: 'Rubik, sans-serif' }}>
                        Subject *
                      </label>
                      <Input
                        id="subject"
                        type="text"
                        placeholder="How can we help?"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        required
                        className="border-[var(--matetees-light-green)] focus:border-[var(--matetees-light-green)] focus:ring-[var(--matetees-light-green)]"
                        style={{ fontFamily: 'Rubik, sans-serif' }}
                      />
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-semibold text-[var(--matetees-black)] mb-2" style={{ fontFamily: 'Rubik, sans-serif' }}>
                        Message *
                      </label>
                      <Textarea
                        id="message"
                        placeholder="Tell us about your question or issue..."
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        required
                        rows={6}
                        className="border-[var(--matetees-light-green)] focus:border-[var(--matetees-light-green)] focus:ring-[var(--matetees-light-green)]"
                        style={{ fontFamily: 'Rubik, sans-serif' }}
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-[var(--matetees-light-green)] hover:bg-[var(--matetees-dark-green)] text-white font-bold py-3"
                      style={{ fontFamily: 'Rubik, sans-serif' }}
                    >
                      {isLoading ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Sending...
                        </div>
                      ) : (
                        "Send Message"
                      )}
                    </Button>

                    <p className="text-xs text-center text-[var(--matetees-black)]/70" style={{ fontFamily: 'Rubik, sans-serif' }}>
                      Or email us directly at <a href="mailto:info@matees.com.au" className="text-[var(--matetees-light-green)] hover:underline">info@matees.com.au</a>
                    </p>
                  </form>
                ) : (
                  <div className="text-center space-y-4 py-8">
                    <div className="w-16 h-16 mx-auto bg-[var(--matetees-light-green)] rounded-full flex items-center justify-center">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-[var(--matetees-black)] mb-2" style={{ fontFamily: 'Rubik, sans-serif' }}>
                        Message Sent!
                      </h3>
                      <p className="text-[var(--matetees-black)]" style={{ fontFamily: 'Rubik, sans-serif' }}>
                        Thank you for contacting us. We'll get back to you within 24 hours.
                      </p>
                    </div>
                    <Button
                      onClick={() => setIsSubmitted(false)}
                      className="bg-[var(--matetees-light-green)] hover:bg-[var(--matetees-dark-green)] text-white font-bold"
                      style={{ fontFamily: 'Rubik, sans-serif' }}
                    >
                      Send Another Message
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Additional Resources */}
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-center text-[var(--matetees-black)] mb-8" style={{ fontFamily: 'Rubik, sans-serif' }}>
              Additional Resources
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-2 border-[var(--matetees-light-green)] hover:shadow-xl transition-shadow">
                <CardContent className="p-6 space-y-3">
                  <Shield className="w-10 h-10 text-[var(--matetees-light-green)]" />
                  <h3 className="text-xl font-bold text-[var(--matetees-black)]" style={{ fontFamily: 'Rubik, sans-serif' }}>
                    Privacy Policy
                  </h3>
                  <p className="text-[var(--matetees-black)]" style={{ fontFamily: 'Rubik, sans-serif' }}>
                    Learn how we protect and handle your personal information.
                  </p>
                  <a href="https://www.matees.com.au/privacy" target="_blank" rel="noopener noreferrer" className="inline-block text-[var(--matetees-light-green)] hover:text-[var(--matetees-dark-green)] font-semibold" style={{ fontFamily: 'Rubik, sans-serif' }}>
                    Read Privacy Policy →
                  </a>
                </CardContent>
              </Card>

              <Card className="border-2 border-[var(--matetees-light-green)] hover:shadow-xl transition-shadow">
                <CardContent className="p-6 space-y-3">
                  <Users className="w-10 h-10 text-[var(--matetees-light-green)]" />
                  <h3 className="text-xl font-bold text-[var(--matetees-black)]" style={{ fontFamily: 'Rubik, sans-serif' }}>
                    Terms of Service
                  </h3>
                  <p className="text-[var(--matetees-black)]" style={{ fontFamily: 'Rubik, sans-serif' }}>
                    Review our terms and conditions for using Matees.
                  </p>
                  <a href="https://www.matees.com.au/terms" target="_blank" rel="noopener noreferrer" className="inline-block text-[var(--matetees-light-green)] hover:text-[var(--matetees-dark-green)] font-semibold" style={{ fontFamily: 'Rubik, sans-serif' }}>
                    Read Terms of Service →
                  </a>
                </CardContent>
              </Card>
            </div>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[var(--matetees-black)] text-white py-6 flex-shrink-0 mt-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm" style={{ fontFamily: 'Rubik, sans-serif' }}>
              © 2025 Matees. Golf &gt; Connected.
            </p>
            <div className="flex gap-6">
              <a href="/support" className="text-sm hover:text-[var(--matetees-light-green)] transition-colors" style={{ fontFamily: 'Rubik, sans-serif' }}>
                Support
              </a>
              <a href="https://www.matees.com.au/privacy" target="_blank" rel="noopener noreferrer" className="text-sm hover:text-[var(--matetees-light-green)] transition-colors" style={{ fontFamily: 'Rubik, sans-serif' }}>
                Privacy Policy
              </a>
              <a href="https://www.matees.com.au/terms" target="_blank" rel="noopener noreferrer" className="text-sm hover:text-[var(--matetees-light-green)] transition-colors" style={{ fontFamily: 'Rubik, sans-serif' }}>
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

