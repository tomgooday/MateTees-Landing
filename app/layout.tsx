import type React from "react"
import type { Metadata } from "next"
import { Rubik } from "next/font/google"
import "./globals.css"

const rubik = Rubik({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-rubik",
  weight: ["400", "700"],
})

export const metadata: Metadata = {
  title: "Matees - GOLF > CONNECTED",
  description:
    "The future of golf social networking. Connect with golfers worldwide, discover new courses, and find more tee times.",
  generator: "v0.app",
  icons: {
    icon: '/favicon.jpg',
    shortcut: '/favicon.jpg',
    apple: '/favicon.jpg',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${rubik.variable} antialiased`}>
      <body className="font-sans">{children}</body>
    </html>
  )
}
