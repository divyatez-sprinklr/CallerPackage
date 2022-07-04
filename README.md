# CallerPackage

# CallerPackage

Caller Package is

## Getting Started
```
let config = {
	sip: sample1234, 
    password: samplePassword, 
    server_address: 12.34.56.78, 
    port: 7654/ws
}

const callerPackage = new CallerPackage(config);



```


## Attributes 

### config
```
{
	sip: , 
    password: , 
    server_address: , 
    port: 
}
```
#### Example:

```
{
	sip: sample1234, 
    password: samplePassword, 
    server_address: 12.34.56.78, 
    port: 7654/ws
}
```


## Methods

# Rename this----------
###  connectToServer()
This method is used to connect to popup.
If popup is already active it will connect to that, otherwise it will start a new popup window.
##### Arguments
- callback function

---

### call()
This method is called to invoke call procedure.
##### Arguments
- number 
##### Example:

```
callerPackage.call('9838949386****');
```

---

### endOut()
This method is called to end outgoing call.
```
callerPackage.endOut();
```
---

### endIn()
This method is called to end incoming call.
```
callerPackage.endOut();
```

---

### hold()
This method is called to hold ongoing call.
```
callerPackage.hold();
```

---

### unhold()
This method is called to unhold ongoing call.
```
callerPackage.unhold();
```

---

### mute()
This method is called to mute ongoing call.
```
callerPackage.mute();
```

---

### unmute()
This method is called to unmute ongoing call.
```
callerPackage.unmute();
```

---


## Events
Syntax for all events is as follow.
```
callerPackage.on(event,callback);
```
#### Example
```
callerPackage.on('INFORM_SOCKET_CONNECTED',()=>{
    console.log('Socket is connected');
});
```

### INFORM_SOCKET_CONNECTED
    Fired when socket is connected in popup window.
### INFORM_SOCKET_DISCONNECTED
    Fired when socket is disconnected in popup window.
### ACK_OUTGOING_CALL_START
    Fired when outgoing call is connected.
### ACK_OUTGOING_CALL_END
    Fired when outgoing call is ended.
### ACK_OUTGOING_CALL_FAIL
    Fired when outgoing call is failed.
### ACK_CALL_HOLD
    Fired when call is put on hold.
### ACK_CALL_UNHOLD
    Fired when call is put on unhold.
### ACK_CALL_MUTE
    Fired when call is put on mute.
### ACK_CALL_UNMUTE
    Fired when call is put on unmute.
### ACK_SESSION_DETAILS
    Fired when session details is recieved.
#### Example
```
callerPackage.on('ACK_SESSION_DETAILS',()=>{
        console.log('Session details fetched from popup');
        let sessionDetails = callerPackage.getCallObject();
        console.log(sessionDetails);
});
```
//// Not Working ### POPUP_CLOSED

```
browserify ./src/app.js -o ./dist/bundle.js
Then -> Live Server

## For convenience
Download "run on save" extention.
Open its setting.json in settings>extentions>Run On Save> edit in settings.json
Paste following:-
{
    "workbench.startupEditor": "none",
    "window.zoomLevel": 1,
    "emeraldwalk.runonsave": {
        "commands": [
            {
                "match": "\\.js$",
                "cmd": "browserify ./src/app.js -o ./dist/bundle.js "
            }
        ]
    }
}

Now command will auto run with save.
```

```
browserify src/popup/popup.js -o src/child_bundle.js 
browserify src/client/client.js -o src/parent_bundle.js
```