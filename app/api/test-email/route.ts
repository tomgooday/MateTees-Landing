import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

export async function POST(request: NextRequest) {
  try {
    const { testEmail } = await request.json()

    // Validate email
    if (!testEmail || !testEmail.includes('@')) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
    }

    // Check environment variables
    const envCheck = {
      SMTP_HOST: process.env.SMTP_HOST || 'smtp.sendgrid.net (default)',
      SMTP_PORT: process.env.SMTP_PORT || '587 (default)',
      SMTP_USER: process.env.SMTP_USER || 'apikey (default)',
      SMTP_PASS: process.env.SMTP_PASS ? '✅ Set' : '❌ Missing',
      FROM_EMAIL: process.env.FROM_EMAIL || 'noreply@matetees.com.au (default)',
    }

    // If SMTP_PASS is missing, return environment check without sending email
    if (!process.env.SMTP_PASS) {
      return NextResponse.json({
        success: false,
        message: 'Email configuration incomplete',
        envCheck,
        error: 'SMTP_PASS environment variable is missing'
      })
    }

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

    // Test email content
    const mailOptions = {
      from: process.env.FROM_EMAIL || 'noreply@matetees.com.au',
      to: testEmail,
      subject: 'MateTees Email Configuration Test',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #13211c; color: #f4f1e8; padding: 20px; text-align: center;">
            <h1 style="margin: 0; color: #c9ae6e;">MateTees</h1>
            <p style="margin: 10px 0 0 0; color: #c9ae6e;">Email Configuration Test</p>
          </div>
          
          <div style="padding: 20px; background-color: #f4f1e8;">
            <h2 style="color: #13211c; margin-top: 0;">✅ Email Test Successful!</h2>
            
            <p style="color: #13211c; line-height: 1.6;">
              This is a test email to verify that your MateTees email configuration is working correctly.
            </p>
            
            <div style="background-color: white; padding: 15px; border-radius: 5px; margin: 15px 0; border-left: 4px solid #4caf50;">
              <h3 style="color: #13211c; margin-top: 0;">Configuration Details:</h3>
              <ul style="color: #13211c; line-height: 1.6;">
                <li><strong>SMTP Host:</strong> ${envCheck.SMTP_HOST}</li>
                <li><strong>SMTP Port:</strong> ${envCheck.SMTP_PORT}</li>
                <li><strong>From Email:</strong> ${envCheck.FROM_EMAIL}</li>
                <li><strong>Test Time:</strong> ${new Date().toLocaleString()}</li>
              </ul>
            </div>
            
            <p style="color: #13211c; line-height: 1.6;">
              Your email system is now properly configured and ready to send confirmation emails to new subscribers!
            </p>
          </div>
          
          <div style="background-color: #13211c; color: #f4f1e8; padding: 15px; text-align: center; font-size: 12px;">
            <p style="margin: 0;">© 2025 MateTees. Revolutionizing Golf, globally.</p>
          </div>
        </div>
      `
    }

    // Send test email
    await transporter.sendMail(mailOptions)
    console.log(`✅ Test email sent to ${testEmail} via SendGrid`)

    return NextResponse.json({
      success: true,
      message: 'Test email sent successfully',
      envCheck,
      testEmail
    })

  } catch (error) {
    console.error('❌ Test email error:', error)
    return NextResponse.json({
      success: false,
      message: 'Failed to send test email',
      error: error instanceof Error ? error.message : 'Unknown error',
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

// GET endpoint to check environment variables without sending email
export async function GET() {
  const envCheck = {
    SMTP_HOST: process.env.SMTP_HOST || 'smtp.sendgrid.net (default)',
    SMTP_PORT: process.env.SMTP_PORT || '587 (default)',
    SMTP_USER: process.env.SMTP_USER || 'apikey (default)',
    SMTP_PASS: process.env.SMTP_PASS ? '✅ Set' : '❌ Missing',
    FROM_EMAIL: process.env.FROM_EMAIL || 'noreply@matetees.com.au (default)',
  }

  return NextResponse.json({
    success: !!process.env.SMTP_PASS,
    message: process.env.SMTP_PASS ? 'Email configuration ready' : 'Email configuration incomplete',
    envCheck
  })
}
