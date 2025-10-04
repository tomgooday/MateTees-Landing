import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

export async function POST(request: NextRequest) {
  try {
    const { testEmail } = await request.json()

    // Validate email
    if (!testEmail || !testEmail.includes('@')) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
    }

    console.log('🔍 Debug: Starting email test for:', testEmail)

    // Check environment variables
    const envCheck = {
      SMTP_HOST: process.env.SMTP_HOST || 'smtp.sendgrid.net (default)',
      SMTP_PORT: process.env.SMTP_PORT || '587 (default)',
      SMTP_USER: process.env.SMTP_USER || 'apikey (default)',
      SMTP_PASS: process.env.SMTP_PASS ? '✅ Set' : '❌ Missing',
      FROM_EMAIL: process.env.FROM_EMAIL || 'noreply@matetees.com.au (default)',
    }

    console.log('🔍 Debug: Environment check:', envCheck)

    // If SMTP_PASS is missing, return environment check without sending email
    if (!process.env.SMTP_PASS) {
      console.log('❌ Debug: SMTP_PASS is missing')
      return NextResponse.json({
        success: false,
        message: 'Email configuration incomplete',
        envCheck,
        error: 'SMTP_PASS environment variable is missing'
      })
    }

    console.log('🔍 Debug: Creating transporter...')

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

    console.log('🔍 Debug: Transporter created successfully')

    // Test email content
    const mailOptions = {
      from: process.env.FROM_EMAIL || 'noreply@matees.com.au',
      to: testEmail,
      subject: 'Matees Email Debug Test',
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
            <p style="margin: 10px 0 0 0; color: #318735; font-family: 'Rubik', Arial, sans-serif; font-weight: bold;">Email Debug Test</p>
          </div>
          
          <div style="padding: 20px; background-color: #ffffff;">
            <h2 style="color: #000f08; margin-top: 0; font-family: 'Rubik', Arial, sans-serif; font-weight: bold;">🔍 Email Debug Test</h2>
            
            <p style="color: #000f08; line-height: 1.6; font-family: 'Rubik', Arial, sans-serif; font-weight: 400;">
              This is a debug test email to verify that the confirmation email functionality is working correctly.
            </p>
            
            <div style="background-color: #ffffff; padding: 15px; border-radius: 5px; margin: 15px 0; border: 1px solid #318735;">
              <h3 style="color: #000f08; margin-top: 0; font-family: 'Rubik', Arial, sans-serif; font-weight: bold;">Debug Information:</h3>
              <ul style="color: #000f08; line-height: 1.6; font-family: 'Rubik', Arial, sans-serif; font-weight: 400;">
                <li><strong>Test Email:</strong> ${testEmail}</li>
                <li><strong>From Email:</strong> ${process.env.FROM_EMAIL || 'noreply@matees.com.au'}</li>
                <li><strong>SMTP Host:</strong> ${process.env.SMTP_HOST || 'smtp.sendgrid.net'}</li>
                <li><strong>Test Time:</strong> ${new Date().toLocaleString()}</li>
              </ul>
            </div>
            
            <p style="color: #000f08; line-height: 1.6; font-family: 'Rubik', Arial, sans-serif; font-weight: 400;">
              If you received this email, the confirmation email functionality is working correctly!
            </p>
          </div>
          
          <div style="background-color: #000f08; color: #ffffff; padding: 15px; text-align: center; font-size: 12px;">
            <p style="margin: 0; font-family: 'Rubik', Arial, sans-serif;">2025 Matees. Golf > Connected.</p>
          </div>
        </div>
      `
    }

    console.log('🔍 Debug: Mail options prepared:', {
      from: mailOptions.from,
      to: mailOptions.to,
      subject: mailOptions.subject
    })

    // Send test email
    console.log('🔍 Debug: Attempting to send email...')
    const result = await transporter.sendMail(mailOptions)
    console.log('✅ Debug: Email sent successfully:', result)

    return NextResponse.json({
      success: true,
      message: 'Debug test email sent successfully',
      envCheck,
      testEmail,
      result: {
        messageId: result.messageId,
        response: result.response
      }
    })

  } catch (error) {
    console.error('❌ Debug: Email error:', error)
    return NextResponse.json({
      success: false,
      message: 'Failed to send debug test email',
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      envCheck: {
        SMTP_HOST: process.env.SMTP_HOST || 'smtp.sendgrid.net (default)',
        SMTP_PORT: process.env.SMTP_PORT || '587 (default)',
        SMTP_USER: process.env.SMTP_USER || 'apikey (default)',
        SMTP_PASS: process.env.SMTP_PASS ? '✅ Set' : '❌ Missing',
        FROM_EMAIL: process.env.FROM_EMAIL || 'noreply@matetees.com.au (default)',
      }
    }, { status: 500 })
  }
}
