import nodemailer from 'nodemailer';

/**
 * Creates a nodemailer transporter using Gmail SMTP with App Password
 * This is the simplest approach for backend email sending
 */
const createTransporter = () => {
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    throw new Error('GMAIL_USER and GMAIL_APP_PASSWORD must be set');
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });

  return transporter;
};

/**
 * Sends an email with an attachment using Gmail SMTP
 */
export const sendEmailWithAttachment = async (
  to: string,
  subject: string,
  text: string,
  attachment: Buffer,
  filename: string
) => {
  try {
    console.log('Creating email transporter...');
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.GMAIL_USER,
      to,
      subject,
      text,
      attachments: [
        {
          filename,
          content: attachment,
          contentType: 'application/pdf',
        },
      ],
    };

    console.log(`Sending email to ${to}...`);
    await transporter.sendMail(mailOptions);

    console.log(`Email with attachment sent successfully to ${to}`);
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send email with attachment.');
  }
};

/**
 * Sends an error notification email
 */
export const sendErrorEmail = async (to: string, subject: string, text: string) => {
  try {
    console.log('Creating email transporter for error notification...');
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.GMAIL_USER,
      to,
      subject,
      text,
    };

    console.log(`Sending error notification to ${to}...`);
    await transporter.sendMail(mailOptions);

    console.log(`Error email sent successfully to ${to}`);
  } catch (error) {
    console.error('Error sending error email:', error);
  }
};
