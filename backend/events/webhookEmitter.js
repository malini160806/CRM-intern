const EventEmitter = require('events');

class WebhookEmitter extends EventEmitter {}

// Export a singleton instance of the event emitter
const webhookEmitter = new WebhookEmitter();

module.exports = webhookEmitter;
