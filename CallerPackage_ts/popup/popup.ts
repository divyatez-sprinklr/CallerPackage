const Wrapper = require("./wrapper");

import { MESSAGE_TYPE, AGENT_TYPE } from "../static/enums";
import { CLIENT_POPUP_CHANNEL } from "../static/constants";

interface MESSAGE {
    to: AGENT_TYPE;
    from: AGENT_TYPE;
    type: MESSAGE_TYPE;
    object: CALL_OBJECT;
}

interface CALL_OBJECT {
    sender?: string,
    receiver?: string,
    startTime?: string,
    endTime?: string,
    hold?: boolean,
    mute?: boolean,
}

interface CALLBACK {
  (): void
}

interface CONFIG {
    sip: string,
    password: string,
    server_address: string,
    port: string,
}

const EMPTY_CALL_OBJECT: CALL_OBJECT = {
    sender: "",
    receiver: "",
    startTime: "",
    endTime: "",
    hold: false,
    mute: false,
} 

export default class Popup {
    #callActive: boolean;
    #channel: BroadcastChannel;
    #callObject: CALL_OBJECT;
    #JsSIP_Wrapper: typeof Wrapper;

    constructor(config: CONFIG) {
        console.log("PopUp Instance Created");

        this.#callActive = false;
        this.#channel = new BroadcastChannel(CLIENT_POPUP_CHANNEL);
        this.#channel.onmessage = (messageEvent) => {
            this.#receiveEngine(messageEvent.data);
        };
        this.#callObject = EMPTY_CALL_OBJECT;
        this.#JsSIP_Wrapper = new Wrapper(config);
  }

  connect(callback: CALLBACK): void {
    setTimeout(() => {
      this.#JsSIP_Wrapper.connect(callback);
    }, 1000);
  }

  informUnload(): void {
    // this.#JsSIP_Wrapper.call_terminate(); // function used inside connect()
    this.#channel.postMessage({
      to: AGENT_TYPE.PARENT,
      from: AGENT_TYPE.POPUP,
      type: MESSAGE_TYPE.POPUP_CLOSED,
      object: EMPTY_CALL_OBJECT,
    });
  }

  #sendEngine(message: MESSAGE): void {
    this.#channel.postMessage(message);
  }

  #resetCallObject(): void {
    this.#setCallObject(EMPTY_CALL_OBJECT);
  }

  #setCallObject(callObject: CALL_OBJECT): void {
    if (!callObject.sender) {
      this.#callObject.sender = callObject.sender;
    }
    if (!callObject.receiver) {
      this.#callObject.receiver = callObject.receiver;
    }
    if (!callObject.startTime) {
      this.#callObject.startTime = callObject.startTime;
    }
    if (!callObject.endTime) {
      this.#callObject.endTime = callObject.endTime;
    }
    if (!callObject.hold) {
      this.#callObject.hold = callObject.hold;
    }
    if (!callObject.mute) {
      this.#callObject.mute = callObject.mute;
    }
  }

  handleOutgoingCallStart(callObject: CALL_OBJECT): void {
    console.log("HandleOutgoingCallStart");
    this.#sendEngine({
      to: AGENT_TYPE.WRAPPER,
      from: AGENT_TYPE.POPUP,
      type: MESSAGE_TYPE.REQUEST_OUTGOING_CALL_START,
      object: { receiver: callObject.receiver , sender: null, startTime: null, endTime: null, hold: null, mute: null },
    });
  }

  handleOutgoingCallEnd(): void {
    console.log("handleOutgoingCallEnd");
    this.#sendEngine({
      to: AGENT_TYPE.WRAPPER,
      from: AGENT_TYPE.POPUP,
      type: MESSAGE_TYPE.REQUEST_OUTGOING_CALL_END,
      object: EMPTY_CALL_OBJECT,
    });
  }

  handleCallHold(): void {
    console.log("handleCallHold");
    this.#sendEngine({
      to: AGENT_TYPE.WRAPPER,
      from:  AGENT_TYPE.POPUP,
      type: MESSAGE_TYPE.REQUEST_CALL_HOLD,
      object: EMPTY_CALL_OBJECT,
    });
  }

  handleCallUnhold(): void {
    console.log("handleCallUnhold");
    this.#sendEngine({
      to: AGENT_TYPE.WRAPPER,
      from: AGENT_TYPE.POPUP,
      type: MESSAGE_TYPE.REQUEST_CALL_UNHOLD,
      object: EMPTY_CALL_OBJECT,
    });
  }

  handleCallMute(): void {
    console.log("handleCallMute");
    this.#sendEngine({
      to: AGENT_TYPE.WRAPPER,
      from: AGENT_TYPE.POPUP,
      type: MESSAGE_TYPE.REQUEST_CALL_MUTE,
      object: EMPTY_CALL_OBJECT,
    });
  }

  handleCallUnmute(): void {
    console.log("handleCallUnmute");
    this.#sendEngine({
      to: AGENT_TYPE.WRAPPER,
      from: AGENT_TYPE.POPUP,
      type: MESSAGE_TYPE.REQUEST_CALL_UNMUTE,
      object: EMPTY_CALL_OBJECT,
    });
  }

  handleSessionDetails(): void {
    console.log("handleSessionDetails");
    this.#sendEngine({
      to: AGENT_TYPE.PARENT,
      from: AGENT_TYPE.POPUP,
      type: MESSAGE_TYPE.ACK_SESSION_DETAILS,
      object: this.#callObject,
    });
  }

  #receiveEngine(message): void {
    if (message.to == AGENT_TYPE.POPUP) {
      console.log("Recieved:", message);
      if (message.type ==  MESSAGE_TYPE.REQUEST_OUTGOING_CALL_START) {
        this.handleOutgoingCallStart(message.object);
      } else if (message.type == MESSAGE_TYPE.REQUEST_OUTGOING_CALL_END) {
        this.handleOutgoingCallEnd();
      } else if (message.type == MESSAGE_TYPE.REQUEST_CALL_HOLD) {
        this.handleCallHold();
      } else if (message.type == MESSAGE_TYPE.REQUEST_CALL_UNHOLD) {
        this.handleCallUnhold();
      } else if (message.type == MESSAGE_TYPE.REQUEST_CALL_MUTE) {
        this.handleCallMute();
      } else if (message.type == MESSAGE_TYPE.REQUEST_CALL_UNMUTE) {
        this.handleCallUnmute();
      } else if (message.type == MESSAGE_TYPE.REQUEST_SESSION_DETAILS) {
        this.handleSessionDetails();
      } else {
        console.log("UNKNOWN TYPE: ", message);
      }
    }
  }
}
