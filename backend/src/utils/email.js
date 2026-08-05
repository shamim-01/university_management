import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: process.env.SMTP_PORT || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER || 'test@test.com',
    pass: process.env.SMTP_PASS || 'test',
  },
});

export const sendEmail = async options => {
  try {
    console.log('📧 Email would be sent to:', options.email);
    console.log('📧 Subject:', options.subject);
    console.log('📧 HTML:', options.html?.substring(0, 100) + '...');

    if (process.env.SMTP_USER && process.env.SMTP_USER !== 'test@test.com') {
      const mailOptions = {
        from: `University Management <${process.env.SMTP_USER}>`,
        to: options.email,
        subject: options.subject,
        html: options.html,
      };
      const info = await transporter.sendMail(mailOptions);
      console.log('✅ Email sent:', info.messageId);
      return info;
    }

    return { messageId: 'test-email-id' };
  } catch (error) {
    console.error('❌ Email error:', error.message);

    return { messageId: 'fallback-email-id' };
  }
};

export const sendPasswordResetEmail = async (email, resetToken) => {
  const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password/${resetToken}`;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f4f4f4;">
      <div style="background: white; padding: 30px; border-radius: 10px;">
        <h2 style="color: #333;">Password Reset Request</h2>
        <p>You requested to reset your password. Click the button below to reset it:</p>
        <a href="${resetUrl}" style="display: inline-block; padding: 12px 24px; background-color: #4F46E5; color: white; text-decoration: none; border-radius: 4px; margin: 20px 0;">
          Reset Password
        </a>
        <p>If you didn't request this, please ignore this email.</p>
        <p>This link will expire in 10 minutes.</p>
        <hr style="border: 1px solid #eee; margin: 20px 0;">
        <p style="color: #666; font-size: 12px;">University Management System</p>
      </div>
    </div>
  `;

  await sendEmail({
    email,
    subject: 'Password Reset Request',
    html,
  });
};
