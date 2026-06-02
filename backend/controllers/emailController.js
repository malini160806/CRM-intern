const ScheduledEmail = require('../models/ScheduledEmail');
const nodemailer = require('nodemailer');

// Helper to create transport (Requires user to add EMAIL_USER and EMAIL_PASS to .env)
const createTransporter = () => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn("Real email credentials missing. Simulation mode active.");
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

// @desc    Send email
// @route   POST /api/email/send
// @access  Private
const sendEmail = async (req, res, next) => {
  const { content, recipient } = req.body;

  try {
    const transporter = createTransporter();
    
    if (transporter) {
      await transporter.sendMail({
        from: `"AI CRM" <${process.env.EMAIL_USER}>`,
        to: recipient,
        subject: content.split('\n')[0].replace('Subject: ', ''),
        text: content,
      });
      res.json({ success: true, message: 'Real email sent successfully!' });
    } else {
      console.log(`Simulation: Sending email to ${recipient}:`, content);
      await new Promise(resolve => setTimeout(resolve, 1000));
      res.json({ success: true, message: 'Simulation: Email sent successfully!' });
    }
  } catch (error) {
    console.error("Email error:", error);
    res.status(500).json({ message: 'Failed to send email. Check your credentials.' });
  }
};

// @desc    Schedule email
// @route   POST /api/email/schedule
// @access  Private
const scheduleEmail = async (req, res, next) => {
  const { content, recipient, scheduleTime } = req.body;

  try {
    const scheduled = await ScheduledEmail.create({
      user: req.user._id,
      recipient,
      content,
      scheduleTime,
    });

    res.json({ success: true, message: `Email scheduled for ${new Date(scheduleTime).toLocaleString()}`, data: scheduled });
  } catch (error) {
    next(error);
  }
};

// @desc    Get scheduled emails
// @route   GET /api/email/scheduled
// @access  Private
const getScheduledEmails = async (req, res, next) => {
  try {
    const emails = await ScheduledEmail.find({ user: req.user._id, status: 'scheduled' }).sort({ scheduleTime: 1 });
    res.json(emails);
  } catch (error) {
    next(error);
  }
};

module.exports = { sendEmail, scheduleEmail, getScheduledEmails };
