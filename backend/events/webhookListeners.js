const webhookEmitter = require('./webhookEmitter');
const { sendWebhook } = require('../services/webhookService');

// Map of event names to their corresponding Make.com webhook URL from environment
// Add more events here as the CRM grows
const WEBHOOK_URLS = {
  USER_SIGNUP: process.env.MAKE_SIGNUP_WEBHOOK,
  USER_LOGIN: process.env.MAKE_LOGIN_WEBHOOK,
  LEAD_CREATED: process.env.MAKE_LEAD_WEBHOOK,
  TASK_ASSIGNED: process.env.MAKE_TASK_WEBHOOK,
  DEAL_STATUS_UPDATED: process.env.MAKE_DEAL_WEBHOOK,
  CONTACT_SUBMITTED: process.env.MAKE_CONTACT_WEBHOOK,
  DOCUMENT_UPLOADED: process.env.MAKE_DOCUMENT_WEBHOOK,
  INVOICE_GENERATED: process.env.MAKE_INVOICE_WEBHOOK,
};

/**
 * Common payload formatter that adds timestamp and environment context
 */
const formatPayload = (event, data) => ({
  event,
  timestamp: new Date().toISOString(),
  environment: process.env.NODE_ENV || 'development',
  data
});

/**
 * Register all Webhook Event Listeners
 */
const initializeWebhookListeners = () => {
  console.log('[Webhook System] Initializing event listeners...');

  webhookEmitter.on('USER_SIGNUP', (user) => {
    const url = WEBHOOK_URLS.USER_SIGNUP;
    const payload = formatPayload('USER_SIGNUP', {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      companyName: user.companyName
    });
    sendWebhook(url, payload);
  });

  webhookEmitter.on('USER_LOGIN', (user) => {
    const url = WEBHOOK_URLS.USER_LOGIN;
    const payload = formatPayload('USER_LOGIN', {
      id: user._id,
      name: user.name,
      email: user.email
    });
    sendWebhook(url, payload);
  });

  webhookEmitter.on('LEAD_CREATED', (lead) => {
    const url = WEBHOOK_URLS.LEAD_CREATED;
    const payload = formatPayload('LEAD_CREATED', {
      id: lead._id,
      name: lead.name,
      email: lead.email,
      company: lead.company,
      status: lead.status
    });
    sendWebhook(url, payload);
  });

  webhookEmitter.on('TASK_ASSIGNED', (task) => {
    const url = WEBHOOK_URLS.TASK_ASSIGNED;
    const payload = formatPayload('TASK_ASSIGNED', {
      id: task._id,
      title: task.title,
      assignedTo: task.assignedTo,
      dueDate: task.dueDate,
      priority: task.priority
    });
    sendWebhook(url, payload);
  });

  webhookEmitter.on('DEAL_STATUS_UPDATED', (deal) => {
    const url = WEBHOOK_URLS.DEAL_STATUS_UPDATED;
    const payload = formatPayload('DEAL_STATUS_UPDATED', {
      id: deal._id,
      name: deal.name,
      stage: deal.stage,
      amount: deal.amount
    });
    sendWebhook(url, payload);
  });

  webhookEmitter.on('CONTACT_SUBMITTED', (contact) => {
    const url = WEBHOOK_URLS.CONTACT_SUBMITTED;
    const payload = formatPayload('CONTACT_SUBMITTED', {
      id: contact._id,
      name: contact.name,
      email: contact.email,
      company: contact.company,
      role: contact.role
    });
    sendWebhook(url, payload);
  });

  webhookEmitter.on('DOCUMENT_UPLOADED', (document) => {
    const url = WEBHOOK_URLS.DOCUMENT_UPLOADED;
    const payload = formatPayload('DOCUMENT_UPLOADED', {
      id: document._id,
      name: document.name,
      type: document.type,
      url: document.url
    });
    sendWebhook(url, payload);
  });

  webhookEmitter.on('INVOICE_GENERATED', (invoice) => {
    const url = WEBHOOK_URLS.INVOICE_GENERATED;
    const payload = formatPayload('INVOICE_GENERATED', {
      id: invoice._id,
      invoiceNumber: invoice.invoiceNumber,
      amount: invoice.amount,
      client: invoice.client,
      status: invoice.status
    });
    sendWebhook(url, payload);
  });
};

module.exports = {
  initializeWebhookListeners
};
