"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import { Users, MapPin, Calendar, Trophy, TrendingUp, Heart, Menu, X, Apple, Smartphone } from "lucide-react"

export default function PostLaunch() {
  const [email, setEmail] = useState("")
  const [optIn, setOptIn] = useState(true)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set())
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => new Set(prev).add(entry.target.id))
          }
        })
      },
      { threshold: 0.1 }
    )

    document.querySelectorAll('[data-animate]').forEach((el) => {
      observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          optIn,
          timestamp: new Date().toISOString()
        }),
      })

      if (response.ok) {
        setIsSubmitted(true)
        setEmail("")
        setOptIn(true)
      } else {
        alert("There was an error registering. Please try again.")
      }
    } catch (error) {
      console.error('Registration error:', error)
      alert("There was an error registering. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      const headerOffset = 80
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      })
      setMobileMenuOpen(false)
    }
  }

  const navLinks = [
    { label: 'Origin Story', id: 'origin-section' },
    { label: 'About Us', id: 'about-section' },
    { label: 'Why Matees', id: 'benefits-section' },
    { label: 'How It Works', id: 'how-it-works-section' },
    { label: 'Support', id: 'support-section' },
  ]

  const benefits = [
    {
      icon: Users,
      title: "Discover Golf Mates",
      description: "Connect with golfers in your area who share your passion. Expand your golfing circle beyond your regular 3-4 mates."
    },
    {
      icon: MapPin,
      title: "Explore New Courses",
      description: "Break out of your routine and discover amazing courses you've never played. Every round becomes an adventure."
    },
    {
      icon: Calendar,
      title: "Find Available Tee Times",
      description: "Never miss out on a round again. When your usual courses are fully booked, find available tee times nearby."
    },
    {
      icon: Trophy,
      title: "Join Friendly Competitions",
      description: "Participate in local tournaments and social events. Challenge yourself and meet fellow golf enthusiasts."
    },
    {
      icon: TrendingUp,
      title: "Improve Your Game",
      description: "Playing with different golfers on various courses naturally elevates your skills and course management."
    },
    {
      icon: Heart,
      title: "Build a Golf Community",
      description: "Be part of a vibrant community that celebrates the social side of golf. Make lasting friendships on and off the course."
    }
  ]

  return (
    <div className="min-h-screen flex flex-col matetees-bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[var(--matetees-black)] border-b border-[var(--matetees-light-green)] shadow-xl">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo - Left Aligned */}
            <a href="https://www.matees.app" className="flex-shrink-0">
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

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => scrollToSection(link.id)}
                  className="text-white hover:text-[var(--matetees-light-green)] transition-colors duration-200 font-medium"
                  style={{ fontFamily: 'Rubik, sans-serif' }}
                >
                  {link.label}
                </button>
              ))}
            </nav>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-white hover:text-[var(--matetees-light-green)] transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <nav className="md:hidden mt-4 pb-4 space-y-3 border-t border-[var(--matetees-light-green)] pt-4">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => scrollToSection(link.id)}
                  className="block w-full text-left text-white hover:text-[var(--matetees-light-green)] transition-colors duration-200 font-medium py-2"
                  style={{ fontFamily: 'Rubik, sans-serif' }}
                >
                  {link.label}
                </button>
              ))}
            </nav>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        
        {/* Hero Section with Background Image */}
        <div className="relative min-h-[600px] md:min-h-[700px] flex items-center justify-center overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <Image 
              alt="Golfers enjoying Matees app" 
              fill
              className="object-cover object-center"
              src="/Hero.png" 
              priority
              quality={100}
            />
            {/* Gradient Overlay - darker at bottom for text readability */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/60"></div>
          </div>
          
          {/* Hero Content */}
          <div className="relative z-10 text-center space-y-6 px-6 animate-fade-in">
            <div className="flex justify-center mb-4 animate-slide-down">
              <Image 
                alt="Matees Icon" 
                width={150} 
                height={150} 
                decoding="async" 
                className="object-contain drop-shadow-2xl" 
                src="/Matees lcon white_RGB.svg" 
                style={{ color: 'transparent' }}
              />
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl text-white font-bold drop-shadow-2xl animate-slide-up" style={{ fontFamily: 'Rubik, sans-serif', textShadow: '0 4px 12px rgba(0,0,0,0.5)' }}>
              Revolutionising Social Golf
            </h1>
            <p className="text-2xl md:text-3xl text-white font-medium max-w-3xl mx-auto drop-shadow-lg animate-slide-up-delay" style={{ fontFamily: 'Rubik, sans-serif', textShadow: '0 2px 8px rgba(0,0,0,0.5)' }}>
              Play more golf with Matees!
            </p>
            
            {/* Download CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6 animate-slide-up-delay-2">
              <Button 
                className="bg-white text-[var(--matetees-black)] hover:bg-white/90 font-bold px-6 py-6 text-base shadow-2xl flex items-center gap-2 group" 
                style={{ fontFamily: 'Rubik, sans-serif' }}
              >
                <Apple className="w-6 h-6 group-hover:scale-110 transition-transform" />
                <div className="text-left">
                  <div className="text-xs opacity-80">Download on the</div>
                  <div className="text-lg font-bold leading-tight">App Store</div>
                </div>
              </Button>
              <Button 
                className="bg-[var(--matetees-light-green)] text-white hover:bg-[var(--matetees-dark-green)] font-bold px-6 py-6 text-base shadow-2xl flex items-center gap-2 group" 
                style={{ fontFamily: 'Rubik, sans-serif' }}
              >
                <Smartphone className="w-6 h-6 group-hover:scale-110 transition-transform" />
                <div className="text-left">
                  <div className="text-xs opacity-90">Get it on</div>
                  <div className="text-lg font-bold leading-tight">Google Play</div>
                </div>
              </Button>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-6 space-y-16 py-16">

          {/* Problem Statement Section */}
          <div 
            id="problem-section"
            data-animate
            className={`max-w-4xl mx-auto transition-all duration-1000 ${
              visibleSections.has('problem-section') 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-10'
            }`}
          >
            <Card className="bg-gradient-to-br from-[var(--matetees-dark-green)] to-[var(--matetees-light-green)] border-none shadow-2xl">
              <CardContent className="p-8 md:p-12 space-y-6">
                <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-8" style={{ fontFamily: 'Rubik, sans-serif' }}>
                  The Challenge Every Social Golfer Faces
                </h2>
                
                <div className="space-y-5 text-white">
                  <p className="text-base md:text-lg leading-relaxed" style={{ fontFamily: 'Rubik, sans-serif', fontWeight: '400' }}>
                    The problem for social golfers is their golfing circle tends to be small, very small - Just 3-4 mates, and most golfers tend to play the same small handful of courses over and over too.
                  </p>
                  <p className="text-base md:text-lg leading-relaxed" style={{ fontFamily: 'Rubik, sans-serif', fontWeight: '400' }}>
                    All good, we like our mates, we like our courses... But what happens when your mates or courses aren't available when you are? You have time to play, you want to play, but have no-one to play with or can't get a tee time!
                  </p>
                  <div className="pt-6 border-t border-white/30">
                    <p className="text-xl md:text-2xl font-bold text-center" style={{ fontFamily: 'Rubik, sans-serif' }}>
                      The solution = Matees
                    </p>
                    <p className="text-base md:text-lg text-center mt-3" style={{ fontFamily: 'Rubik, sans-serif', fontWeight: '400' }}>
                      An app to help people discover more golf mates, more golf courses, more tee times.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Origin Story Section */}
          <div 
            id="origin-section"
            data-animate
            className={`max-w-4xl mx-auto transition-all duration-1000 ${
              visibleSections.has('origin-section') 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-10'
            }`}
          >
            <h2 className="text-2xl md:text-4xl font-bold text-center text-[var(--matetees-black)] mb-8" style={{ fontFamily: 'Rubik, sans-serif' }}>
              Origin Story
            </h2>
            <p className="text-center text-[var(--matetees-black)] mb-8 text-lg" style={{ fontFamily: 'Rubik, sans-serif' }}>
              Discover how the idea for Matees came to life
            </p>
            <Card className="border-2 border-[var(--matetees-light-green)] shadow-xl overflow-hidden">
              <CardContent className="p-0">
                {/* Video Placeholder - Replace with actual video */}
                <div className="relative aspect-video bg-[var(--matetees-dark-green)] flex items-center justify-center">
                  <div className="text-center space-y-4 p-8">
                    <div className="w-20 h-20 mx-auto rounded-full bg-[var(--matetees-light-green)] flex items-center justify-center">
                      <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                    </div>
                    <p className="text-white text-lg" style={{ fontFamily: 'Rubik, sans-serif' }}>
                      Video: The Matees Origin Story
                    </p>
                    <p className="text-white/80 text-sm" style={{ fontFamily: 'Rubik, sans-serif' }}>
                      (Video will be embedded here)
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* About Us Section */}
          <div 
            id="about-section"
            data-animate
            className={`max-w-5xl mx-auto transition-all duration-1000 ${
              visibleSections.has('about-section') 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-10'
            }`}
          >
            <h2 className="text-2xl md:text-4xl font-bold text-center text-[var(--matetees-black)] mb-4" style={{ fontFamily: 'Rubik, sans-serif' }}>
              A Bit About Us
            </h2>
            <p className="text-center text-[var(--matetees-black)] mb-12 text-lg" style={{ fontFamily: 'Rubik, sans-serif' }}>
              Meet the founders behind Matees
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
              {/* Matt Barraclough */}
              <Card className="border-2 border-[var(--matetees-light-green)] hover:shadow-xl transition-all duration-300">
                <CardContent className="p-8 text-center space-y-4">
                  <div className="w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-[var(--matetees-light-green)] bg-gray-200">
                    <Image
                      src="/Matt.jpeg"
                      alt="Matt Barraclough"
                      width={128}
                      height={128}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <h3 className="text-2xl font-bold text-[var(--matetees-black)]" style={{ fontFamily: 'Rubik, sans-serif' }}>
                    Matt Barraclough
                  </h3>
                  <p className="text-[var(--matetees-dark-green)] font-semibold" style={{ fontFamily: 'Rubik, sans-serif' }}>
                    Co-Founder
                  </p>
                  <p className="text-[var(--matetees-black)] leading-relaxed" style={{ fontFamily: 'Rubik, sans-serif', fontWeight: '400' }}>
                    Matt is a passionate golfer who understands the challenges of finding playing partners and exploring new courses. With a background in technology and community building, he co-founded Matees to help golfers connect and play more rounds.
                  </p>
                </CardContent>
              </Card>

              {/* Tom Gooday */}
              <Card className="border-2 border-[var(--matetees-light-green)] hover:shadow-xl transition-all duration-300">
                <CardContent className="p-8 text-center space-y-4">
                  <div className="w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-[var(--matetees-light-green)] bg-gray-200">
                    <Image
                      src="/Tom.jpeg"
                      alt="Tom Gooday"
                      width={128}
                      height={128}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <h3 className="text-2xl font-bold text-[var(--matetees-black)]" style={{ fontFamily: 'Rubik, sans-serif' }}>
                    Tom Gooday
                  </h3>
                  <p className="text-[var(--matetees-dark-green)] font-semibold" style={{ fontFamily: 'Rubik, sans-serif' }}>
                    Co-Founder
                  </p>
                  <p className="text-[var(--matetees-black)] leading-relaxed" style={{ fontFamily: 'Rubik, sans-serif', fontWeight: '400' }}>
                    Tom brings his entrepreneurial spirit and love for golf to Matees. With experience in product development and user experience, he's dedicated to creating an app that makes golf more accessible and social for everyone.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Benefits Grid */}
          <div 
            id="benefits-section"
            data-animate
            className={`max-w-6xl mx-auto transition-all duration-1000 ${
              visibleSections.has('benefits-section') 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-10'
            }`}
          >
            <h2 className="text-2xl md:text-4xl font-bold text-center text-[var(--matetees-black)] mb-12" style={{ fontFamily: 'Rubik, sans-serif' }}>
              Why Golfers Love Matees
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {benefits.map((benefit, index) => {
                const Icon = benefit.icon
                const isVisible = visibleSections.has('benefits-section')
                return (
                  <Card 
                    key={index} 
                    className={`border-2 border-[var(--matetees-light-green)] hover:shadow-xl hover:scale-105 transition-all duration-500 ${
                      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                    }`}
                    style={{ 
                      transitionDelay: `${index * 100}ms` 
                    }}
                  >
                    <CardContent className="p-6 space-y-4">
                      <div className="w-14 h-14 rounded-full bg-[var(--matetees-light-green)] flex items-center justify-center">
                        <Icon className="w-7 h-7 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-[var(--matetees-black)]" style={{ fontFamily: 'Rubik, sans-serif' }}>
                        {benefit.title}
                      </h3>
                      <p className="text-[var(--matetees-black)] leading-relaxed" style={{ fontFamily: 'Rubik, sans-serif', fontWeight: '400' }}>
                        {benefit.description}
                      </p>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>

          {/* How It Works Section */}
          <div 
            id="how-it-works-section"
            data-animate
            className={`max-w-4xl mx-auto bg-[var(--matetees-white)] rounded-2xl p-8 md:p-12 border-2 border-[var(--matetees-light-green)] transition-all duration-1000 ${
              visibleSections.has('how-it-works-section') 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-10'
            }`}
          >
            <h2 className="text-2xl md:text-4xl font-bold text-center text-[var(--matetees-black)] mb-10" style={{ fontFamily: 'Rubik, sans-serif' }}>
              Getting Started is Easy
            </h2>
            
            <div className="space-y-8">
              <div className="flex gap-6 items-start">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[var(--matetees-light-green)] text-white flex items-center justify-center text-xl font-bold" style={{ fontFamily: 'Rubik, sans-serif' }}>
                  1
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[var(--matetees-black)] mb-2" style={{ fontFamily: 'Rubik, sans-serif' }}>
                    Download the App
                  </h3>
                  <p className="text-[var(--matetees-black)]" style={{ fontFamily: 'Rubik, sans-serif', fontWeight: '400' }}>
                    Get Matees on your mobile device and create your golfer profile in minutes.
                  </p>
                </div>
              </div>

              <div className="flex gap-6 items-start">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[var(--matetees-light-green)] text-white flex items-center justify-center text-xl font-bold" style={{ fontFamily: 'Rubik, sans-serif' }}>
                  2
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[var(--matetees-black)] mb-2" style={{ fontFamily: 'Rubik, sans-serif' }}>
                    Connect with Golfers
                  </h3>
                  <p className="text-[var(--matetees-black)]" style={{ fontFamily: 'Rubik, sans-serif', fontWeight: '400' }}>
                    Browse local golfers, view their profiles, and send invitations to play a round together.
                  </p>
                </div>
              </div>

              <div className="flex gap-6 items-start">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[var(--matetees-light-green)] text-white flex items-center justify-center text-xl font-bold" style={{ fontFamily: 'Rubik, sans-serif' }}>
                  3
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[var(--matetees-black)] mb-2" style={{ fontFamily: 'Rubik, sans-serif' }}>
                    Book & Play
                  </h3>
                  <p className="text-[var(--matetees-black)]" style={{ fontFamily: 'Rubik, sans-serif', fontWeight: '400' }}>
                    Find available tee times, book your spot, and enjoy more rounds at more courses with more mates!
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Call to Action Section */}
          <div 
            id="cta-section"
            data-animate
            className={`max-w-4xl mx-auto transition-all duration-1000 ${
              visibleSections.has('cta-section') 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-10'
            }`}
          >
            <Card className="bg-[var(--matetees-light-green)] border-none shadow-2xl hover:shadow-3xl transition-shadow duration-300">
              <CardContent className="p-8 md:p-12 text-center space-y-6">
                <h2 className="text-2xl md:text-4xl font-bold text-white" style={{ fontFamily: 'Rubik, sans-serif' }}>
                  Ready to Transform Your Golf Experience?
                </h2>
                <p className="text-lg text-white max-w-2xl mx-auto" style={{ fontFamily: 'Rubik, sans-serif', fontWeight: '400' }}>
                  Join thousands of golfers who are already expanding their golfing horizons with Matees.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                  <Button className="bg-white text-[var(--matetees-light-green)] hover:bg-[var(--matetees-white)]/90 font-bold px-8 py-6 text-lg" style={{ fontFamily: 'Rubik, sans-serif' }}>
                    Download on iOS
                  </Button>
                  <Button className="bg-[var(--matetees-dark-green)] text-white hover:bg-[var(--matetees-black)] font-bold px-8 py-6 text-lg" style={{ fontFamily: 'Rubik, sans-serif' }}>
                    Download on Android
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Email Signup Form */}
          <div 
            id="email-section"
            data-animate
            className={`max-w-md mx-auto transition-all duration-1000 ${
              visibleSections.has('email-section') 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-10'
            }`}
          >
            <Card className="bg-white border-2 border-[var(--matetees-light-green)] shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-6">
                {!isSubmitted ? (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <h3 className="text-xl font-bold text-[var(--matetees-black)] text-center" style={{ fontFamily: 'Rubik, sans-serif' }}>
                      Stay Updated
                    </h3>
                    <p className="text-sm text-[var(--matetees-black)] text-center" style={{ fontFamily: 'Rubik, sans-serif' }}>
                      Get the latest news, updates, and exclusive offers from Matees
                    </p>

                    <Input
                      type="email"
                      placeholder="Enter your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="border-[var(--matetees-light-green)] focus:border-[var(--matetees-light-green)] focus:ring-[var(--matetees-light-green)] text-[var(--matetees-black)]"
                      style={{ fontFamily: 'Rubik, sans-serif' }}
                    />

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="opt-in"
                        checked={optIn}
                        onCheckedChange={(checked) => setOptIn(checked as boolean)}
                        className="border-[var(--matetees-light-green)] data-[state=checked]:bg-[var(--matetees-light-green)] data-[state=checked]:border-[var(--matetees-light-green)]"
                      />
                      <label htmlFor="opt-in" className="text-xs text-[var(--matetees-black)] cursor-pointer" style={{ fontFamily: 'Rubik, sans-serif' }}>
                        Opt-in to all communication and updates
                      </label>
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
                          Processing...
                        </div>
                      ) : (
                        "Subscribe"
                      )}
                    </Button>
                  </form>
                ) : (
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 mx-auto bg-[var(--matetees-light-green)] rounded-full flex items-center justify-center">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-[var(--matetees-black)] mb-2" style={{ fontFamily: 'Rubik, sans-serif' }}>Thank You!</h3>
                      <p className="text-sm text-[var(--matetees-black)]" style={{ fontFamily: 'Rubik, sans-serif' }}>
                        You've been subscribed to our updates. We'll keep you in the loop!
                      </p>
                    </div>
                    <Button
                      onClick={() => setIsSubmitted(false)}
                      className="w-full bg-[var(--matetees-light-green)] hover:bg-[var(--matetees-dark-green)] text-white font-bold py-2"
                      style={{ fontFamily: 'Rubik, sans-serif' }}
                    >
                      Subscribe Another Email
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Support Section */}
          <div 
            id="support-section"
            data-animate
            className={`max-w-4xl mx-auto transition-all duration-1000 ${
              visibleSections.has('support-section') 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-10'
            }`}
          >
            <Card className="border-2 border-[var(--matetees-light-green)] shadow-xl">
              <CardContent className="p-8 md:p-12 text-center space-y-6">
                <div className="w-16 h-16 mx-auto rounded-full bg-[var(--matetees-light-green)] flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-[var(--matetees-black)]" style={{ fontFamily: 'Rubik, sans-serif' }}>
                  Need Help or Have Questions?
                </h2>
                <p className="text-lg text-[var(--matetees-black)] max-w-2xl mx-auto" style={{ fontFamily: 'Rubik, sans-serif', fontWeight: '400' }}>
                  Our support team is here to help! Whether you have questions about the app, need technical assistance, or want to provide feedback, we're just a message away.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                  <a href="/support">
                    <Button className="bg-[var(--matetees-light-green)] hover:bg-[var(--matetees-dark-green)] text-white font-bold px-8 py-6 text-lg" style={{ fontFamily: 'Rubik, sans-serif' }}>
                      Visit Support Center
                    </Button>
                  </a>
                  <a href="mailto:info@matees.com.au">
                    <Button className="bg-white border-2 border-[var(--matetees-light-green)] text-[var(--matetees-light-green)] hover:bg-[var(--matetees-light-green)] hover:text-white font-bold px-8 py-6 text-lg" style={{ fontFamily: 'Rubik, sans-serif' }}>
                      Email Us
                    </Button>
                  </a>
                </div>
                <p className="text-sm text-[var(--matetees-black)]/70" style={{ fontFamily: 'Rubik, sans-serif' }}>
                  Contact us at: <a href="mailto:info@matees.com.au" className="text-[var(--matetees-light-green)] hover:underline font-semibold">info@matees.com.au</a>
                </p>
              </CardContent>
            </Card>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[var(--matetees-black)] text-white py-6 flex-shrink-0 mt-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm" style={{ fontFamily: 'Rubik, sans-serif' }}>
              © 2025 Matees. Golf > Connected.
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
              <a href="mailto:info@matees.com.au" className="text-sm hover:text-[var(--matetees-light-green)] transition-colors" style={{ fontFamily: 'Rubik, sans-serif' }}>
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

