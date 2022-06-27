// We need to remove this file later.
const EventEmitter = require('events');
const eventEmitter = new EventEmitter();
const channel = new BroadcastChannel('window_popup_channel');

module.exports = {eventEmitter: eventEmitter, channel: channel};