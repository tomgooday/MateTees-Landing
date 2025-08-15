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

    // Send confirmation email to the user
    console.log('🔍 Debug: Attempting to send confirmation email to:', email)
    try {
      await sendConfirmationEmail(email, optIn)
      console.log('✅ Debug: Confirmation email sent successfully to:', email)
    } catch (error) {
      console.error('❌ Debug: Confirmation email failed for:', email, error)
    }

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
      from: process.env.FROM_EMAIL || 'noreply@matetees.com.au',
      to: 'info@matetees.com.au, matt@matetees.com.au',
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
    console.log('✅ Notification email sent to info@matetees.com.au and matt@matetees.com.au via SendGrid')
  } catch (error) {
    console.error('❌ Email notification error:', error)
    // Don't fail the registration if email fails
  }
}

async function sendConfirmationEmail(userEmail: string, optIn: boolean) {
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
      from: process.env.FROM_EMAIL || 'noreply@matetees.com.au',
      to: userEmail,
      subject: 'Welcome to MateTees - Early Access Confirmed!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #13211c; color: #f4f1e8; padding: 20px; text-align: center;">
            <h1 style="margin: 0; color: #c9ae6e;">MateTees</h1>
            <p style="margin: 10px 0 0 0; color: #c9ae6e;">Early Access Registration Confirmed</p>
          </div>
          
          <div style="padding: 20px; background-color: #f4f1e8;">
            <h2 style="color: #13211c; margin-top: 0;">Welcome to MateTees! 🏌️‍♂️</h2>
            
            <p style="color: #13211c; line-height: 1.6;">
              Thank you for joining the MateTees early access list! We're excited to have you on board as we revolutionize the golf experience globally.
            </p>
            
            <div style="background-color: white; padding: 15px; border-radius: 5px; margin: 15px 0; border-left: 4px solid #c9ae6e;">
              <h3 style="color: #13211c; margin-top: 0;">What's Next?</h3>
              <ul style="color: #13211c; line-height: 1.6;">
                <li>We'll notify you as soon as MateTees launches</li>
                <li>You'll be among the first to experience our innovative golf platform</li>
                <li>Exclusive early access benefits and features</li>
              </ul>
            </div>
            
            ${optIn ? `
            <div style="background-color: #e8f5e8; padding: 15px; border-radius: 5px; margin: 15px 0; border-left: 4px solid #4caf50;">
              <p style="color: #2e7d32; margin: 0; font-weight: bold;">✅ You've opted in to receive updates and communications from MateTees.</p>
            </div>
            ` : `
            <div style="background-color: #fff3cd; padding: 15px; border-radius: 5px; margin: 15px 0; border-left: 4px solid #ffc107;">
              <p style="color: #856404; margin: 0;">You've chosen not to receive marketing communications. You'll only receive essential updates about platform launch.</p>
            </div>
            `}
            
            <p style="color: #13211c; line-height: 1.6;">
              Stay tuned for exciting updates! In the meantime, follow us on social media to stay connected with the MateTees community.
            </p>
            
            <div style="text-align: center; margin: 25px 0;">
              <p style="color: #13211c; font-weight: bold; margin-bottom: 10px;">Revolutionizing Golf, Globally</p>
              <p style="color: #666; font-size: 14px; margin: 0;">Registration confirmed on ${new Date().toLocaleDateString()}</p>
            </div>
          </div>
          
          <div style="background-color: #13211c; color: #f4f1e8; padding: 15px; text-align: center; font-size: 12px;">
            <p style="margin: 0;">© 2025 MateTees. Revolutionizing Golf, globally.</p>
            <p style="margin: 5px 0 0 0; font-size: 11px;">
              If you have any questions, contact us at info@matetees.com.au
            </p>
          </div>
        </div>
      `
    }

    // Send email
    await transporter.sendMail(mailOptions)
    console.log(`✅ Confirmation email sent to ${userEmail} via SendGrid`)
  } catch (error) {
    console.error(`❌ Confirmation email error for ${userEmail}:`, error)
    // Don't fail the registration if email fails
  }
}
