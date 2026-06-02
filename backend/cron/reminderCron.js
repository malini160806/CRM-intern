const cron = require('node-cron');
const Lead = require('../models/Lead');
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

const sendReminderEmail = async (userEmail, leadName, daysAgo) => {
  const transporter = createTransporter();
  const subject = `Reminder: Follow up with ${leadName}`;
  const text = `Reminder: Follow up with Lead ${leadName}. Last contacted ${daysAgo} days ago.\n\nPlease log into Nexus CRM to update the lead's status or add new follow-up notes.`;

  if (transporter) {
    await transporter.sendMail({
      from: `"AI CRM Reminders" <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject,
      text,
    });
  } else {
    console.log(`Simulation: Reminder email sent to ${userEmail} for Lead ${leadName}`);
  }
};

const startReminderCron = () => {
  // Run every day at 8:00 AM
  cron.schedule('0 8 * * *', async () => {
    console.log('Running daily lead reminder cron job...');
    try {
      // Find leads that need follow-up
      const targetStatuses = ['Warm', 'Cold', 'Hot / High Potential'];
      
      // Fetch settings
      const SystemSetting = require('../models/SystemSetting');
      const settingsRaw = await SystemSetting.find({});
      const settings = settingsRaw.reduce((acc, s) => { acc[s.key] = s.value; return acc; }, {});
      
      const getDaysDelay = (status) => {
        if (status === 'Hot / High Potential') return parseInt(settings.reminderDaysHot) || 1;
        if (status === 'Warm') return parseInt(settings.reminderDaysWarm) || 2;
        if (status === 'Cold') return parseInt(settings.reminderDaysCold) || 3;
        return 2;
      };

      const leads = await Lead.find({
        status: { $in: targetStatuses }
      }).populate('assignedTo');

      let remindersSent = 0;

      for (const lead of leads) {
        if (lead.assignedTo && lead.assignedTo.email) {
          const daysAgo = Math.floor((new Date() - lead.updatedAt) / (1000 * 60 * 60 * 24));
          const configuredDelay = getDaysDelay(lead.status);
          
          if (daysAgo >= configuredDelay) {
            await sendReminderEmail(lead.assignedTo.email, lead.name, daysAgo);
            remindersSent++;
          }
        }
      }

      console.log(`Cron completed: Sent ${remindersSent} reminders for stale leads.`);
    } catch (error) {
      console.error('Error in reminder cron job:', error);
    }
  });
};

module.exports = { startReminderCron };
