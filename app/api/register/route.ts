import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import { addSubscriber } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const { email, optIn, timestamp } = await request.json()

    // Validate email
    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
    }

    // Store to Vercel Postgres database
    const subscriber = await addSubscriber(email, optIn)
    console.log('Stored subscriber:', subscriber)

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

    // Email content with Matees branding
    const mailOptions = {
      from: process.env.FROM_EMAIL || 'noreply@matees.com.au',
      to: 'info@matees.com.au, matt@matees.com.au',
      subject: 'New Early Access Member',
      html: `
        <div style="font-family: 'Rubik', Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #000f08; color: #ffffff; padding: 20px; text-align: center;">
            <div style="display: flex; align-items: center; justify-content: center; margin-bottom: 10px;">
              <div style="width: 40px; height: 40px; background-color: #ffffff; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 15px;">
                <span style="font-size: 20px; font-weight: bold; color: #318735; font-family: 'Rubik', Arial, sans-serif;">M</span>
              </div>
              <div>
                <h1 style="margin: 0; color: #ffffff; font-family: 'Rubik', Arial, sans-serif; font-weight: bold; font-size: 28px; font-style: italic;">Matees</h1>
                <p style="margin: 0; color: #ffffff; font-family: 'Rubik', Arial, sans-serif; font-size: 12px; font-weight: 400; font-style: italic;">GOLF > CONNECTED</p>
              </div>
            </div>
            <p style="margin: 10px 0 0 0; color: #318735; font-family: 'Rubik', Arial, sans-serif; font-weight: bold;">New Early Access Registration</p>
          </div>
          
          <div style="padding: 20px; background-color: #ffffff;">
            <h2 style="color: #000f08; margin-top: 0; font-family: 'Rubik', Arial, sans-serif; font-weight: bold;">New Member Signup</h2>
            
            <div style="background-color: #ffffff; padding: 15px; border-radius: 5px; margin: 15px 0; border: 1px solid #318735;">
              <p style="margin: 5px 0; font-family: 'Rubik', Arial, sans-serif; font-weight: 400;"><strong style="color: #000f08; font-weight: bold;">Email:</strong> ${userEmail}</p>
              <p style="margin: 5px 0; font-family: 'Rubik', Arial, sans-serif; font-weight: 400;"><strong style="color: #000f08; font-weight: bold;">Opt-in to communications:</strong> ${optIn ? '✅ Yes' : '❌ No'}</p>
              <p style="margin: 5px 0; font-family: 'Rubik', Arial, sans-serif; font-weight: 400;"><strong style="color: #000f08; font-weight: bold;">Registration time:</strong> ${new Date().toLocaleString()}</p>
            </div>
            
            <p style="color: #000f08; font-size: 14px; font-family: 'Rubik', Arial, sans-serif; font-weight: 400;">
              This user has signed up for early access to Matees. They'll be notified when the platform launches.
            </p>
          </div>
          
          <div style="background-color: #000f08; color: #ffffff; padding: 15px; text-align: center; font-size: 12px;">
            <p style="margin: 0; font-family: 'Rubik', Arial, sans-serif;">2025 Matees. Golf > Connected.</p>
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

    // Email content with Matees branding
    const mailOptions = {
      from: process.env.FROM_EMAIL || 'noreply@matees.com.au',
      to: userEmail,
      subject: 'Welcome to Matees - Early Access Confirmed!',
      html: `
        <div style="font-family: 'Rubik', Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #000f08; color: #ffffff; padding: 20px; text-align: center;">
            <div style="display: flex; align-items: center; justify-content: center; margin-bottom: 10px;">
              <div style="width: 40px; height: 40px; background-color: #ffffff; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 15px;">
                <span style="font-size: 20px; font-weight: bold; color: #318735; font-family: 'Rubik', Arial, sans-serif;">M</span>
              </div>
              <div>
                <h1 style="margin: 0; color: #ffffff; font-family: 'Rubik', Arial, sans-serif; font-weight: bold; font-size: 28px; font-style: italic;">Matees</h1>
                <p style="margin: 0; color: #ffffff; font-family: 'Rubik', Arial, sans-serif; font-size: 12px; font-weight: 400; font-style: italic;">GOLF > CONNECTED</p>
              </div>
            </div>
            <p style="margin: 10px 0 0 0; color: #318735; font-family: 'Rubik', Arial, sans-serif; font-weight: bold;">Early Access Registration Confirmed</p>
          </div>
          
          <div style="padding: 20px; background-color: #ffffff;">
            <h2 style="color: #000f08; margin-top: 0; font-family: 'Rubik', Arial, sans-serif; font-weight: bold;">Welcome to Matees! 🏌️‍♂️</h2>
            
            <p style="color: #000f08; line-height: 1.6; font-family: 'Rubik', Arial, sans-serif; font-weight: 400;">
              Thank you for joining the Matees early access list! We're excited to have you on board as we revolutionize social golf and connect golfers worldwide.
            </p>
            
            <div style="background-color: #ffffff; padding: 15px; border-radius: 5px; margin: 15px 0; border-left: 4px solid #318735; border: 1px solid #318735;">
              <h3 style="color: #000f08; margin-top: 0; font-family: 'Rubik', Arial, sans-serif; font-weight: bold;">What's Next?</h3>
              <ul style="color: #000f08; line-height: 1.6; font-family: 'Rubik', Arial, sans-serif; font-weight: 400;">
                <li>We'll notify you as soon as Matees launches</li>
                <li>You'll be among the first to discover new golf mates and courses</li>
                <li>Exclusive early access benefits and features</li>
              </ul>
            </div>
            
            ${optIn ? `
            <div style="background-color: #f0f8f0; padding: 15px; border-radius: 5px; margin: 15px 0; border-left: 4px solid #318735;">
              <p style="color: #1A6025; margin: 0; font-weight: bold; font-family: 'Rubik', Arial, sans-serif;">✅ You've opted in to receive updates and communications from Matees.</p>
            </div>
            ` : `
            <div style="background-color: #fff8e1; padding: 15px; border-radius: 5px; margin: 15px 0; border-left: 4px solid #d2232a;">
              <p style="color: #ae2024; margin: 0; font-family: 'Rubik', Arial, sans-serif;">You've chosen not to receive marketing communications. You'll only receive essential updates about platform launch.</p>
            </div>
            `}
            
            <p style="color: #000f08; line-height: 1.6; font-family: 'Rubik', Arial, sans-serif; font-weight: 400;">
              Stay tuned for exciting updates! In the meantime, follow us on social media to stay connected with the Matees community.
            </p>
            
            <div style="text-align: center; margin: 25px 0;">
              <p style="color: #318735; font-weight: bold; margin-bottom: 10px; font-family: 'Rubik', Arial, sans-serif;">Golf > Connected</p>
              <p style="color: #666; font-size: 14px; margin: 0; font-family: 'Rubik', Arial, sans-serif;">Registration confirmed on ${new Date().toLocaleDateString()}</p>
            </div>
          </div>
          
          <div style="background-color: #000f08; color: #ffffff; padding: 15px; text-align: center; font-size: 12px;">
            <p style="margin: 0; font-family: 'Rubik', Arial, sans-serif;">2025 Matees. Golf > Connected.</p>
            <p style="margin: 5px 0 0 0; font-size: 11px; font-family: 'Rubik', Arial, sans-serif;">
              If you have any questions, contact us at info@matees.com.au
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
