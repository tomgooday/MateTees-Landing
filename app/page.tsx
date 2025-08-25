"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"

export default function MateTees() {
  // MateTees landing page with email registration
  const [email, setEmail] = useState("")
  const [optIn, setOptIn] = useState(true)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  useEffect(() => {
    // Target date: October 31st, 2025 8pm Sydney time (AEDT)
    const targetDate = new Date("2025-10-31T20:00:00+11:00")

    const timer = setInterval(() => {
      const now = new Date().getTime()
      const distance = targetDate.getTime() - now

      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        })
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      // Store to database and send email notification
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
        setOptIn(true) // Reset to default state
      } else {
        alert("There was an error registering. Please try again.")
      }
    } catch (error) {
      console.error('Registration error:', error)
      alert("There was an error registering. Please try again.")
    }
  }

  return (
    <div className="min-h-screen flex flex-col matetees-bg-ivory">
      {/* Header */}
      <header className="flex items-center px-8 py-4 border-b border-[var(--matetees-gold)] shadow-xl bg-[var(--matetees-dark-green)] flex-shrink-0">
        <Image 
          alt="Matees Logo" 
          width={56} 
          height={56} 
          decoding="async" 
          className="mr-4 w-14 h-14 object-contain" 
          src="/tees.png" 
          style={{ color: 'transparent' }}
        />
        <a href="/dashboard">
          <span className="text-3xl font-bold tracking-wide matetees-text-gold flex-1 cursor-pointer" style={{ fontFamily: 'Playfair Display', fontSize: '30px', lineHeight: '36px', letterSpacing: '0.8px' }}>Matees</span>
        </a>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-6 pt-4 pb-8 overflow-y-auto">
        <div className="max-w-4xl w-full text-center space-y-4">
          <div className="space-y-2">
            <h1 className="text-lg md:text-2xl lg:text-3xl matetees-text-gold font-semibold text-center">Revolutionizing Social Golf</h1>
          </div>

          {/* Explanation Section */}
          <div className="max-w-3xl mx-auto space-y-4 text-left">
            <p className="text-base matetees-text-dark leading-relaxed">
              The problem for social golfers is their golfing circle tends to be small, very small - Just 3-4 mates, and, most golfers tend to play the same small handful of courses over and over too.
            </p>
            <p className="text-base matetees-text-dark leading-relaxed">
              All good, we like our mates, we like our courses. . . But what happens when your mates or courses aren't available when you are? You have time to play, you want to play, but have no-one to play with or can't get a tee time!
            </p>
            <p className="text-base matetees-text-dark leading-relaxed">
              The solution = Matees - An app to help people discover more golf mates, more golf courses, more tee times.
            </p>
            <p className="text-lg matetees-text-gold font-semibold text-center">
              Play more golf with Matees!
            </p>
          </div>

          {/* Countdown Timer */}
          <div className="space-y-3">
            <h3 className="text-lg matetees-text-dark font-semibold" style={{ fontFamily: 'Source Sans 3', fontWeight: '600' }}>Launch Countdown</h3>
            <div className="grid grid-cols-4 gap-2 max-w-sm mx-auto">
              <Card className="matetees-bg-dark border-[var(--matetees-gold)] py-2">
                <CardContent className="p-1 text-center">
                  <div className="text-lg md:text-xl font-bold matetees-text-gold">{timeLeft.days}</div>
                  <div className="text-xs matetees-text-ivory">Days</div>
                </CardContent>
              </Card>
              <Card className="matetees-bg-dark border-[var(--matetees-gold)] py-2">
                <CardContent className="p-1 text-center">
                  <div className="text-lg md:text-xl font-bold matetees-text-gold">{timeLeft.hours}</div>
                  <div className="text-xs matetees-text-ivory">Hours</div>
                </CardContent>
              </Card>
              <Card className="matetees-bg-dark border-[var(--matetees-gold)] py-2">
                <CardContent className="p-1 text-center">
                  <div className="text-lg md:text-xl font-bold matetees-text-gold">{timeLeft.minutes}</div>
                  <div className="text-xs matetees-text-ivory">Minutes</div>
                </CardContent>
              </Card>
              <Card className="matetees-bg-dark border-[var(--matetees-gold)] py-2">
                <CardContent className="p-1 text-center">
                  <div className="text-lg md:text-xl font-bold matetees-text-gold">{timeLeft.seconds}</div>
                  <div className="text-xs matetees-text-ivory">Seconds</div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Email Signup Form */}
          <Card className="max-w-sm mx-auto matetees-bg-off-white border-[var(--matetees-gold)] shadow-lg py-3">
            <CardContent className="p-3">
              {!isSubmitted ? (
                <form onSubmit={handleSubmit} className="space-y-2">
                  <h3 className="text-lg font-semibold matetees-text-dark mb-2">Register for Early Access</h3>

                  <Input
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="border-[var(--matetees-gold)] focus:border-[var(--matetees-gold)] focus:ring-[var(--matetees-gold)] matetees-text-dark"
                  />

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="opt-in"
                      checked={optIn}
                      onCheckedChange={(checked) => setOptIn(checked as boolean)}
                      className="border-[var(--matetees-gold)] data-[state=checked]:bg-[var(--matetees-gold)] data-[state=checked]:border-[var(--matetees-gold)]"
                    />
                    <label htmlFor="opt-in" className="text-xs matetees-text-dark cursor-pointer">
                      Opt-in to all communication and updates
                    </label>
                  </div>

                  <Button
                    type="submit"
                    className="w-full matetees-btn-primary hover:matetees-btn-primary font-semibold py-2"
                  >
                    Join the Waitlist
                  </Button>
                </form>
              ) : (
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 mx-auto bg-[var(--matetees-gold)] rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold matetees-text-dark mb-2">Thank You!</h3>
                    <p className="text-sm matetees-text-dark">
                      You've been added to our early access list. We'll be in touch soon with updates about Matees!
                    </p>
                  </div>
                  <Button
                    onClick={() => setIsSubmitted(false)}
                    className="text-xs matetees-btn-secondary hover:matetees-btn-secondary"
                  >
                    Register Another Email
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="matetees-bg-dark matetees-text-ivory py-4 flex-shrink-0">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-xs">© 2025 Matees. Revolutionizing Social Golf.</p>
        </div>
      </footer>
    </div>
  )
}
