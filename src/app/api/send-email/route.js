// src/app/api/send-email/route.js (Next.js 13+ App Router)
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request) {
  try {
    // Parse the request body
    const body = await request.json();
    const { name, email, phone, company, message, toEmail } = body;

    // Validate required fields
    if (!name || !email || !message || !toEmail) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create email transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail', // change as needed
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_APP_PASSWORD
      }
    });

    // Format email HTML content
    const htmlContent = `
      <h2>Contact Form Submission</h2>
      <p><strong>From:</strong> ${name} (${email})</p>
      <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
      <p><strong>Company:</strong> ${company || 'Not provided'}</p>
      <h3>Message:</h3>
      <p>${message.replace(/\n/g, '<br>')}</p>
    `;

    // Email options
    const mailOptions = {
      from: process.env.EMAIL_USERNAME,
      to: toEmail,
      replyTo: email,
      subject: `Contact Form Submission from ${name}`,
      html: htmlContent
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);

    return NextResponse.json(
      { success: true, messageId: info.messageId },
      { status: 200 }
    );
  } catch (error) {
    console.error('Email sending error:', error);
    return NextResponse.json(
      { error: 'Failed to send email', details: error.message },
      { status: 500 }
    );
  }
}