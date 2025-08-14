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
    // Configure email transporter for SendGrid
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.sendgrid.net',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.SMTP_USER || 'apikey',
        pass: process.env.SMTP_PASS,
      },
    })

    // Email content with MateTees branding
    const mailOptions = {
      from: process.env.FROM_EMAIL || 'noreply@matetees.co.au',
      to: 'info@matetees.co.au',
      subject: 'New Early Access Member',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #13211c; color: #f4f1e8; padding: 20px; text-align: center;">
            <h1 style="margin: 0; color: #c9ae6e;">MateTees</h1>
            <p style="margin: 10px 0 0 0; color: #c9ae6e;">New Early Access Registration</p>
          </div>
          
          <div style="padding: 20px; background-color: #f4f1e8;">
            <h2 style="color: #13211c; margin-top: 0;">New Member Signup</h2>
            
            <div style="background-color: white; padding: 15px; border-radius: 5px; margin: 15px 0;">
              <p style="margin: 5px 0;"><strong style="color: #13211c;">Email:</strong> ${userEmail}</p>
              <p style="margin: 5px 0;"><strong style="color: #13211c;">Opt-in to communications:</strong> ${optIn ? '✅ Yes' : '❌ No'}</p>
              <p style="margin: 5px 0;"><strong style="color: #13211c;">Registration time:</strong> ${new Date().toLocaleString()}</p>
            </div>
            
            <p style="color: #13211c; font-size: 14px;">
              This user has signed up for early access to MateTees. They'll be notified when the platform launches.
            </p>
          </div>
          
          <div style="background-color: #13211c; color: #f4f1e8; padding: 15px; text-align: center; font-size: 12px;">
            <p style="margin: 0;">© 2025 MateTees. Revolutionizing Golf, globally.</p>
          </div>
        </div>
      `
    }

    // Send email
    await transporter.sendMail(mailOptions)
    console.log('✅ Notification email sent to info@matetees.co.au via SendGrid')
  } catch (error) {
    console.error('❌ Email notification error:', error)
    // Don't fail the registration if email fails
  }
}
