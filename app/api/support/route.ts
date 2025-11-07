import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

export async function POST(request: NextRequest) {
  try {
    const { name, email, subject, message } = await request.json()

    // Validate inputs
    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 })
    }

    if (!email.includes('@')) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
    }

    // Send support email notification
    await sendSupportEmail(name, email, subject, message)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Support form error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

async function sendSupportEmail(name: string, email: string, subject: string, message: string) {
  try {
    // Configure email transporter for SendGrid (same config as register)
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
      to: 'info@matees.com.au',
      replyTo: email, // Allow direct reply to the user
      subject: `Support Request: ${subject}`,
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
            <p style="margin: 10px 0 0 0; color: #318735; font-family: 'Rubik', Arial, sans-serif; font-weight: bold;">New Support Request</p>
          </div>
          
          <div style="padding: 20px; background-color: #ffffff;">
            <h2 style="color: #000f08; margin-top: 0; font-family: 'Rubik', Arial, sans-serif; font-weight: bold;">Support Message from Website</h2>
            
            <div style="background-color: #ffffff; padding: 15px; border-radius: 5px; margin: 15px 0; border: 1px solid #318735;">
              <p style="margin: 5px 0; font-family: 'Rubik', Arial, sans-serif; font-weight: 400;"><strong style="color: #000f08; font-weight: bold;">From:</strong> ${name}</p>
              <p style="margin: 5px 0; font-family: 'Rubik', Arial, sans-serif; font-weight: 400;"><strong style="color: #000f08; font-weight: bold;">Email:</strong> <a href="mailto:${email}" style="color: #318735;">${email}</a></p>
              <p style="margin: 5px 0; font-family: 'Rubik', Arial, sans-serif; font-weight: 400;"><strong style="color: #000f08; font-weight: bold;">Subject:</strong> ${subject}</p>
              <p style="margin: 5px 0; font-family: 'Rubik', Arial, sans-serif; font-weight: 400;"><strong style="color: #000f08; font-weight: bold;">Submitted:</strong> ${new Date().toLocaleString()}</p>
            </div>
            
            <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 15px 0;">
              <h3 style="color: #000f08; margin-top: 0; font-family: 'Rubik', Arial, sans-serif; font-weight: bold;">Message:</h3>
              <p style="color: #000f08; line-height: 1.6; white-space: pre-wrap; font-family: 'Rubik', Arial, sans-serif; font-weight: 400;">${message}</p>
            </div>
            
            <div style="background-color: #fff8e1; padding: 15px; border-radius: 5px; margin: 15px 0; border-left: 4px solid #318735;">
              <p style="color: #000f08; margin: 0; font-family: 'Rubik', Arial, sans-serif; font-weight: 400;">
                💡 <strong>Tip:</strong> You can reply directly to this email to respond to ${name}.
              </p>
            </div>
          </div>
          
          <div style="background-color: #000f08; color: #ffffff; padding: 15px; text-align: center; font-size: 12px;">
            <p style="margin: 0; font-family: 'Rubik', Arial, sans-serif;">2025 Matees. Golf > Connected.</p>
          </div>
        </div>
      `
    }

    // Send email
    await transporter.sendMail(mailOptions)
    console.log(`✅ Support email sent to info@matees.com.au from ${email} via SendGrid`)
  } catch (error) {
    console.error('❌ Support email error:', error)
    throw error // Throw to return error to user
  }
}

