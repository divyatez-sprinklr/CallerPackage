/* Here we need to make logic for popup alongside of jsSip. 
No need for making it object oriented . Just write it normally.
We do can divide functions in modules for cleanliness. */

// const {eventEmitter,channel} = require('./popup_constants');

const EventEmitter = require("events");

class Message {
  constructor(to, from, type, object) {
    this.to = to;
    this.from = from;
    this.type = type;
    this.object = object;
  }
}

class Popup {
  constructor() {
    this.eventEmitter = new EventEmitter();
    this.channel = new BroadcastChannel("client_popup_channel");
    this.channel.onmessage = (messageEvent) => {
      this.receiveEngine(messageEvent.data);
    };
  }

  receiveEngine(message) {
    if (message.to == "ALL" || message.to == "POPUP") {
      if (message.type == "REQUEST_OUTGOING_CALL_START") {
      } else if (message.type == "REQUEST_OUTGOING_CALL_END") {
      } else if (message.type == "REQUEST_INCOMING_CALL_START") {
      } else if (message.type == "REQUEST_INCOMING_CALL_END") {
      } else if (message.type == "REQUEST_CALL_HOLD") {
      } else if (message.type == "REQUEST_CALL_MUTE") {
      } else if (message.type == "REQUEST_SESSION_DETAILS") {
      } else {
        console.log("UNKNOWN TYPE: ", message);
      }
    }
  }

  sendEngine(message) {
    console.log("Sending from popup");
    this.channel.postMessage("Posting from popup");

    if (message.type == "INFORM_SOCKET_CONNECTED") {
      this.postHandler(message);
    } else if (message.type == "INFORM_SOCKET_DISCONNECTED") {
      this.postHandler(message);
    } else if (message.type == "INFORM_CONNECTION_ONLINE") {
      this.postHandler(message);
    } else if (message.type == "INFORM_CONNECTION_OFFLINE") {
      this.postHandler(message);
    } else if (message.type == "INFORM_INCOMING_CALL") {
      this.postHandler(message);
    } else if (message.type == "ACK_OUTGOING_CALL_START") {
      this.postHandler(message);
    } else if (message.type == "ACK_OUTGOING_CALL_END") {
      this.postHandler(message);
    } else if (message.type == "ACK_INCOMING_CALL_START") {
      this.postHandler(message);
    } else if (message.type == "ACK_INCOMING_CALL_END") {
      this.postHandler(message);
    } else if (message.type == "ACK_CALL_HOLD") {
      this.postHandler(message);
    } else if (message.type == "ACK_CALL_MUTE") {
      this.postHandler(message);
    } else if (message.type == "POPUP_CLOSED") {
      this.postHandler(message);
    } else if (message.type == "PING_SESSION_DETAILS") {
      this.postHandler(message);
    } else if (message.type == "PING_POPUP_ALIVE") {
      this.postHandler(message);
    } else if (message.type == "ACK_SESSION_DETAILS") {
      this.postHandler(message);
    }
  }

  postHandler(message) {
    this.channel.postMessage(message);
  }

  ping() {
    setInterval(() => {
      console.log("popup: pinging...");
      this.channel.postMessage(
        new Message("ALL", "POPUP", "DEBUG", "sending from popup")
      );
    }, 2500);
  }
}

const popup = new Popup();
popup.ping();
