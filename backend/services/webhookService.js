const axios = require('axios');
const axiosRetry = require('axios-retry').default;
const fs = require('fs');
const path = require('path');

// Configure axios instance for webhooks
const webhookClient = axios.create({
  timeout: 10000, // 10 second timeout for webhook requests
  headers: {
    'Content-Type': 'application/json',
    'User-Agent': 'CRM-Webhook-Service/1.0'
  }
});

// Configure robust exponential backoff retry strategy
axiosRetry(webhookClient, {
  retries: 3,
  retryDelay: axiosRetry.exponentialDelay,
  retryCondition: (error) => {
    // Retry on network errors or 5xx server errors
    return axiosRetry.isNetworkOrIdempotentRequestError(error) || error.response?.status >= 500;
  },
  onRetry: (retryCount, error, requestConfig) => {
    console.warn(`[Webhook Retry] Attempt ${retryCount} for URL: ${requestConfig.url} | Error: ${error.message}`);
  }
});

/**
 * Log failed webhooks to a file (dead-letter queue alternative)
 * For production, consider moving this to a MongoDB collection.
 */
const logFailedWebhook = (url, payload, error) => {
  const logDir = path.join(__dirname, '..', 'scratch');
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }
  
  const logFile = path.join(logDir, 'failed_webhooks.log');
  const logEntry = {
    timestamp: new Date().toISOString(),
    url,
    payload,
    error: error.message,
    status: error.response?.status,
    data: error.response?.data
  };

  fs.appendFileSync(logFile, JSON.stringify(logEntry) + '\\n');
  console.error(`[Webhook Failed] Logged failed webhook to ${logFile}`);
};

/**
 * Send a webhook payload securely
 * @param {string} url - The target webhook URL
 * @param {Object} payload - The JSON payload to send
 */
const sendWebhook = async (url, payload) => {
  if (!url) {
    console.warn('[Webhook Warning] Attempted to send webhook but URL is missing.');
    return;
  }

  try {
    const response = await webhookClient.post(url, payload);
    console.log(`[Webhook Success] Sent to ${url} with status ${response.status}`);
    return response.data;
  } catch (error) {
    console.error(`[Webhook Final Failure] Failed to send webhook to ${url} after retries: ${error.message}`);
    logFailedWebhook(url, payload, error);
  }
};

module.exports = {
  sendWebhook
};
