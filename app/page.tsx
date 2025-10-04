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
  const [isLoading, setIsLoading] = useState(false)
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  useEffect(() => {
    // Target date: November 9th, 2025 3pm Sydney time (AEDT)
    const targetDate = new Date("2025-11-09T15:00:00+11:00")

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
    setIsLoading(true)
    
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
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col matetees-bg-white">
      {/* Header */}
      <header className="flex items-center px-8 py-4 border-b border-[var(--matetees-light-green)] shadow-xl bg-[var(--matetees-black)] flex-shrink-0">
        <div className="flex items-center">
          <div className="mr-4 w-14 h-14 bg-white rounded-full flex items-center justify-center">
            <span className="text-2xl font-bold text-[var(--matetees-light-green)]" style={{ fontFamily: 'Rubik, sans-serif', fontWeight: '700' }}>M</span>
          </div>
          <a href="/dashboard">
            <div className="flex flex-col">
              <span className="text-3xl font-bold tracking-wide text-white flex-1 cursor-pointer" style={{ fontFamily: 'Rubik, sans-serif', fontWeight: '700', fontSize: '30px', lineHeight: '36px', letterSpacing: '0.8px', fontStyle: 'italic' }}>Matees</span>
              <span className="text-sm font-medium text-white" style={{ fontFamily: 'Rubik, sans-serif', fontWeight: '400', fontSize: '12px', letterSpacing: '0.5px', fontStyle: 'italic' }}>GOLF > CONNECTED</span>
            </div>
          </a>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-6 pt-2 pb-8">
        <div className="max-w-4xl w-full text-center space-y-4">
          <div className="flex justify-center mb-4">
            <Image 
              alt="Golf Tees" 
              width={80} 
              height={80} 
              decoding="async" 
              className="object-contain" 
              src="/Matees tees_RGB.png" 
              style={{ color: 'transparent' }}
            />
          </div>
          <div className="space-y-2">
            <h1 className="text-lg md:text-2xl lg:text-3xl text-[var(--matetees-light-green)] font-bold text-center" style={{ fontFamily: 'Rubik, sans-serif' }}>Revolutionizing Social Golf</h1>
          </div>

          {/* Explanation Section */}
          <div className="max-w-3xl mx-auto space-y-4 text-left">
            <p className="text-base text-[var(--matetees-black)] leading-relaxed" style={{ fontFamily: 'Rubik, sans-serif', fontWeight: '400' }}>
              The problem for social golfers is their golfing circle tends to be small, very small - Just 3-4 mates, and, most golfers tend to play the same small handful of courses over and over too.
            </p>
            <p className="text-base text-[var(--matetees-black)] leading-relaxed" style={{ fontFamily: 'Rubik, sans-serif', fontWeight: '400' }}>
              All good, we like our mates, we like our courses. . . But what happens when your mates or courses aren't available when you are? You have time to play, you want to play, but have no-one to play with or can't get a tee time!
            </p>
            <p className="text-base text-[var(--matetees-black)] leading-relaxed" style={{ fontFamily: 'Rubik, sans-serif', fontWeight: '400' }}>
              The solution = Matees - An app to help people discover more golf mates, more golf courses, more tee times.
            </p>
            <p className="text-lg text-[var(--matetees-light-green)] font-bold text-center" style={{ fontFamily: 'Rubik, sans-serif' }}>
              Play more golf with Matees!
            </p>
          </div>

          {/* Countdown Timer */}
          <div className="space-y-3">
            <h3 className="text-lg text-[var(--matetees-black)] font-bold" style={{ fontFamily: 'Rubik, sans-serif' }}>Launch Countdown</h3>
            <div className="grid grid-cols-4 gap-2 max-w-sm mx-auto">
              <Card className="bg-[var(--matetees-dark-green)] border-[var(--matetees-light-green)] py-2">
                <CardContent className="p-1 text-center">
                  <div className="text-lg md:text-xl font-bold text-white" style={{ fontFamily: 'Rubik, sans-serif' }}>{timeLeft.days}</div>
                  <div className="text-xs text-white" style={{ fontFamily: 'Rubik, sans-serif' }}>Days</div>
                </CardContent>
              </Card>
              <Card className="bg-[var(--matetees-dark-green)] border-[var(--matetees-light-green)] py-2">
                <CardContent className="p-1 text-center">
                  <div className="text-lg md:text-xl font-bold text-white" style={{ fontFamily: 'Rubik, sans-serif' }}>{timeLeft.hours}</div>
                  <div className="text-xs text-white" style={{ fontFamily: 'Rubik, sans-serif' }}>Hours</div>
                </CardContent>
              </Card>
              <Card className="bg-[var(--matetees-dark-green)] border-[var(--matetees-light-green)] py-2">
                <CardContent className="p-1 text-center">
                  <div className="text-lg md:text-xl font-bold text-white" style={{ fontFamily: 'Rubik, sans-serif' }}>{timeLeft.minutes}</div>
                  <div className="text-xs text-white" style={{ fontFamily: 'Rubik, sans-serif' }}>Minutes</div>
                </CardContent>
              </Card>
              <Card className="bg-[var(--matetees-dark-green)] border-[var(--matetees-light-green)] py-2">
                <CardContent className="p-1 text-center">
                  <div className="text-lg md:text-xl font-bold text-white" style={{ fontFamily: 'Rubik, sans-serif' }}>{timeLeft.seconds}</div>
                  <div className="text-xs text-white" style={{ fontFamily: 'Rubik, sans-serif' }}>Seconds</div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Email Signup Form */}
          <Card className="max-w-sm mx-auto bg-white border-[var(--matetees-light-green)] shadow-lg py-3">
            <CardContent className="p-3">
              {!isSubmitted ? (
                <form onSubmit={handleSubmit} className="space-y-2">
                  <h3 className="text-lg font-bold text-[var(--matetees-black)] mb-2" style={{ fontFamily: 'Rubik, sans-serif' }}>Register for Early Access</h3>

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
                    className="w-full bg-[var(--matetees-light-green)] hover:bg-[var(--matetees-dark-green)] text-white font-bold py-2 disabled:opacity-70"
                    style={{ fontFamily: 'Rubik, sans-serif' }}
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Processing...
                      </div>
                    ) : (
                      "Join the Waitlist"
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
                      You've been added to our early access list. We'll be in touch soon with updates about Matees!
                    </p>
                  </div>
                  <Button
                    onClick={() => setIsSubmitted(false)}
                    className="w-full bg-[var(--matetees-light-green)] hover:bg-[var(--matetees-dark-green)] text-white font-bold py-2"
                    style={{ fontFamily: 'Rubik, sans-serif' }}
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
      <footer className="bg-[var(--matetees-black)] text-white py-4 flex-shrink-0">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-xs" style={{ fontFamily: 'Rubik, sans-serif' }}>2025 Matees. Golf > Connected.</p>
        </div>
      </footer>
    </div>
  )
}
