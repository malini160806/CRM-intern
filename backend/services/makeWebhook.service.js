const { sendWebhook } = require('./webhookService');

/**
 * Trigger centralized Make.com webhook with a specific event and payload.
 * Supports robust automatic retries, dead-letter logging, and event metadata.
 * 
 * @param {string} event - The CRM event name (e.g. 'signup', 'lead_assigned', 'salesperson_assigned')
 * @param {Object} payload - The event-specific detail properties
 * @returns {Promise<any>}
 */
const triggerWebhook = async (event, payload) => {
  const url = process.env.MAKE_CRM_WEBHOOK_URL || process.env.MAKE_SIGNUP_WEBHOOK;
  
  if (!url) {
    console.warn(`[Webhook Warning] Cannot trigger event '${event}' - Centralized webhook URL (MAKE_CRM_WEBHOOK_URL) is not configured.`);
    return;
  }

  // Ensure payload has the event property and standard metadata
  const fullPayload = {
    event,
    ...payload,
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  };

  console.log(`[Webhook Service] Triggering centralized event: '${event}'`);
  return await sendWebhook(url, fullPayload);
};

module.exports = {
  triggerWebhook
};
