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
      FROM_EMAIL: process.env.FROM_EMAIL || 'noreply@matees.com.au (default)',
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
      from: process.env.FROM_EMAIL || 'noreply@matees.com.au',
      to: testEmail,
      subject: 'Matees Email Configuration Test',
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
            <p style="margin: 10px 0 0 0; color: #318735; font-family: 'Rubik', Arial, sans-serif; font-weight: bold;">Email Configuration Test</p>
          </div>
          
          <div style="padding: 20px; background-color: #ffffff;">
            <h2 style="color: #000f08; margin-top: 0; font-family: 'Rubik', Arial, sans-serif; font-weight: bold;">✅ Email Test Successful!</h2>
            
            <p style="color: #000f08; line-height: 1.6; font-family: 'Rubik', Arial, sans-serif; font-weight: 400;">
              This is a test email to verify that your Matees email configuration is working correctly.
            </p>
            
            <div style="background-color: #ffffff; padding: 15px; border-radius: 5px; margin: 15px 0; border: 1px solid #318735;">
              <h3 style="color: #000f08; margin-top: 0; font-family: 'Rubik', Arial, sans-serif; font-weight: bold;">Configuration Details:</h3>
              <ul style="color: #000f08; line-height: 1.6; font-family: 'Rubik', Arial, sans-serif; font-weight: 400;">
                <li><strong>SMTP Host:</strong> ${envCheck.SMTP_HOST}</li>
                <li><strong>SMTP Port:</strong> ${envCheck.SMTP_PORT}</li>
                <li><strong>From Email:</strong> ${envCheck.FROM_EMAIL}</li>
                <li><strong>Test Time:</strong> ${new Date().toLocaleString()}</li>
              </ul>
            </div>
            
            <p style="color: #000f08; line-height: 1.6; font-family: 'Rubik', Arial, sans-serif; font-weight: 400;">
              Your email system is now properly configured and ready to send confirmation emails to new subscribers!
            </p>
          </div>
          
          <div style="background-color: #000f08; color: #ffffff; padding: 15px; text-align: center; font-size: 12px;">
            <p style="margin: 0; font-family: 'Rubik', Arial, sans-serif;">2025 Matees. Golf > Connected.</p>
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
        FROM_EMAIL: process.env.FROM_EMAIL || 'noreply@matees.com.au (default)',
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
    FROM_EMAIL: process.env.FROM_EMAIL || 'noreply@matees.com.au (default)',
  }

  return NextResponse.json({
    success: !!process.env.SMTP_PASS,
    message: process.env.SMTP_PASS ? 'Email configuration ready' : 'Email configuration incomplete',
    envCheck
  })
}
