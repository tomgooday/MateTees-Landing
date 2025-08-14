import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

// Database storage (you can replace this with your preferred database)
const subscribers: Array<{email: string, optIn: boolean, timestamp: string}> = []

export async function POST(request: NextRequest) {
  try {
    const { email, optIn, timestamp } = await request.json()

    // Validate email
    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
    }

    // Store to database (replace with your actual database)
    subscribers.push({ email, optIn, timestamp })
    console.log('Stored subscriber:', { email, optIn, timestamp })

    // Send email notification to info@matetees.co.au
    await sendNotificationEmail(email, optIn)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

async function sendNotificationEmail(userEmail: string, optIn: boolean) {
  try {
    // Configure email transporter (you'll need to set up your email service)
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })

    // Email content
    const mailOptions = {
      from: process.env.SMTP_USER,
      to: 'info@matetees.co.au',
      subject: 'New Early Access Member',
      html: `
        <h2>New Early Access Registration</h2>
        <p><strong>Email:</strong> ${userEmail}</p>
        <p><strong>Opt-in to communications:</strong> ${optIn ? 'Yes' : 'No'}</p>
        <p><strong>Registration time:</strong> ${new Date().toLocaleString()}</p>
        <hr>
        <p>This user has signed up for early access to MateTees.</p>
      `
    }

    // Send email
    await transporter.sendMail(mailOptions)
    console.log('Notification email sent to info@matetees.co.au')
  } catch (error) {
    console.error('Email notification error:', error)
    // Don't fail the registration if email fails
  }
}
