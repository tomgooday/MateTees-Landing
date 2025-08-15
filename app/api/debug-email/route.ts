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
      from: process.env.FROM_EMAIL || 'noreply@matetees.com.au',
      to: testEmail,
      subject: 'MateTees Email Debug Test',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #13211c; color: #f4f1e8; padding: 20px; text-align: center;">
            <h1 style="margin: 0; color: #c9ae6e;">MateTees</h1>
            <p style="margin: 10px 0 0 0; color: #c9ae6e;">Email Debug Test</p>
          </div>
          
          <div style="padding: 20px; background-color: #f4f1e8;">
            <h2 style="color: #13211c; margin-top: 0;">🔍 Email Debug Test</h2>
            
            <p style="color: #13211c; line-height: 1.6;">
              This is a debug test email to verify that the confirmation email functionality is working correctly.
            </p>
            
            <div style="background-color: white; padding: 15px; border-radius: 5px; margin: 15px 0; border-left: 4px solid #4caf50;">
              <h3 style="color: #13211c; margin-top: 0;">Debug Information:</h3>
              <ul style="color: #13211c; line-height: 1.6;">
                <li><strong>Test Email:</strong> ${testEmail}</li>
                <li><strong>From Email:</strong> ${process.env.FROM_EMAIL || 'noreply@matetees.com.au'}</li>
                <li><strong>SMTP Host:</strong> ${process.env.SMTP_HOST || 'smtp.sendgrid.net'}</li>
                <li><strong>Test Time:</strong> ${new Date().toLocaleString()}</li>
              </ul>
            </div>
            
            <p style="color: #13211c; line-height: 1.6;">
              If you received this email, the confirmation email functionality is working correctly!
            </p>
          </div>
          
          <div style="background-color: #13211c; color: #f4f1e8; padding: 15px; text-align: center; font-size: 12px;">
            <p style="margin: 0;">© 2025 MateTees. Revolutionizing Golf, globally.</p>
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
