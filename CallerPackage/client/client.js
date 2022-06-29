//This is parent window
// We need to add communication listeners and emittters for dialer window to listen
// This all need to be done in an object, so that user can instantiate it.
// Later remove constant also.

const EventEmitter = require("events");

class Message {
  constructor(to, from, type, object) {
    this.to = to;
    this.from = from;
    this.type = type;
    this.object = object;
  }
}

class CallerPackage {
  constructor() {
    this.eventEmitter = new EventEmitter();
    this.channel = new BroadcastChannel("client_popup_channel");
    this.channel.onmessage = (messageEvent) => {
      this.receiveEngine(messageEvent.data);
    };
  }

  receiveEngine(message) {
    if (message.to == "ALL") {
      console.log(message);
      if (message.type == "INFORM_SOCKET_CONNECTED") {
        this.eventEmitter.emit(message.type);
      } else if (message.type == "INFORM_SOCKET_DISCONNECTED") {
        this.eventEmitter.emit(message.type);
      } else if (message.type == "INFORM_CONNECTION_ONLINE") {
        this.eventEmitter.emit(message.type);
      } else if (message.type == "INFORM_CONNECTION_OFFLINE") {
        this.eventEmitter.emit(message.type);
      } else if (message.type == "ACK_OUTGOING_CALL_START") {
        this.eventEmitter.emit(message.type);
      } else if (message.type == "ACK_OUTGOING_CALL_END") {
        this.eventEmitter.emit(message.type);
      } else if (message.type == "INFORM_INCOMING_CALL") {
        this.eventEmitter.emit(message.type);
      } else if (message.type == "ACK_INCOMING_CALL_START") {
        this.eventEmitter.emit(message.type);
      } else if (message.type == "ACK_INCOMING_CALL_END") {
        this.eventEmitter.emit(message.type);
      } else if (message.type == "ACK_CALL_HOLD") {
        this.eventEmitter.emit(message.type);
      } else if (message.type == "ACK_CALL_MUTE") {
        this.eventEmitter.emit(message.type);
      } else if (message.type == "POPUP_CLOSED") {
        this.eventEmitter.emit(message.type);
      } else if (message.type == "PING_SESSION_DETAILS") {
        this.eventEmitter.emit(message.type);
      } else if (message.type == "PING_POPUP_ALIVE") {
        this.eventEmitter.emit(message.type);
      } else if (message.type == "ACK_SESSION_DETAILS") {
        this.eventEmitter.emit(message.type);
      } else {
        console.log("UNKNOWN TYPE: ", message);
        this.eventEmitter.emit(message.type);
      }
    }
  }

  sendEngine(message) {
    console.log("Sending");
    this.channel.postMessage("Posting from obj");

    if (message.type == "REQUEST_OUTGOING_CALL_START") {
      this.postHandler(message);
    } else if (message.type == "REQUEST_OUTGOING_CALL_END") {
      this.postHandler(message);
    } else if (message.type == "REQUEST_INCOMING_CALL_START") {
      this.postHandler(message);
    } else if (message.type == "REQUEST_INCOMING_CALL_END") {
      this.postHandler(message);
    } else if (message.type == "REQUEST_CALL_HOLD") {
      this.postHandler(message);
    } else if (message.type == "REQUEST_CALL_MUTE") {
      this.postHandler(message);
    } else if (message.type == "REQUEST_SESSION_DETAILS") {
      this.postHandler(message);
    }
  }

  postHandler(message) {
    this.channel.postMessage(message);
  }

  ping() {
    setInterval(() => {
      console.log("client: pinging...");
      this.channel.postMessage(
        new Message("ALL", "CLIENT", "DEBUG", "sending from client")
      );
    }, 1000);
   }
}

module.exports = { CallerPackage: CallerPackage };
