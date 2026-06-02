const nodemailer = require('nodemailer');

const createTransporter = () => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    return null;
  }
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

const sendEmailDirectly = async (recipient, subject, text) => {
  const transporter = createTransporter();
  
  if (transporter) {
    try {
      await transporter.sendMail({
        from: `"Nexus CRM" <${process.env.EMAIL_USER}>`,
        to: recipient,
        subject,
        text,
      });
      return true;
    } catch (error) {
      console.error("Failed to send email:", error);
      return false;
    }
  } else {
    console.log(`Simulation: Email to ${recipient} | Subject: ${subject} | Body: ${text}`);
    return true;
  }
};

module.exports = { sendEmailDirectly };
