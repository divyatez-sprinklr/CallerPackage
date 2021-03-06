#  CallerPackage

Caller Package is used to handle cross-window calling services, using JsSIP. This library moved the intra-window calling logic to a popup window.
This makes the state of the popup window independent of the state of the parent window, overall mitigating the issues caused by this previously like refresh causing call end, etc.

##  Requirements

* JsSIP : https://www.npmjs.com/package/jssip
```
$ npm install --save jssip
```
* path: https://www.npmjs.com/package/path
```
$ npm install --save path
```
</br>

##  Installation
npm: https://www.npmjs.com/package/callerpackage-sprinklr
```
$ npm i callerpackage-sprinklr
```
##  Getting Started

After installation of the package, create an instance of it.
```
const callerPackage = new CallerPackage();
```
Then call callerPackage.connect with params as config and a callback function.
```
callerPackage.connect({
		sip:,
		password: ,
		server_address:,
		port: ,
	},
	callback()
);
```
After this popup window will be created, if it's not already active.

<div align="center" style="display:flex; flex-direction:row;justify-content:center; gap:20px;">

<img src="https://raw.githubusercontent.com/divyatez-sprinklr/CallerPackage/main/readme_media/connecting.png" height="300">

<img src="https://raw.githubusercontent.com/divyatez-sprinklr/CallerPackage/main/readme_media/connected.png" height="300">

</div>

---
##  Events
The syntax for all events is as follows.
```
callerPackage.on(event,callback);
```

####  Example
```
callerPackage.on('INFORM_SOCKET_CONNECTED',()=>{
console.log('Socket is connected');

});

```

###  INFORM_SOCKET_CONNECTED

> Fired when the socket is connected in the popup window.

---


###  INFORM_SOCKET_DISCONNECTED

>Fired when the socket is disconnected in the popup window.

---


###  ACK_OUTGOING_CALL_START

>Fired when an outgoing call is connected.
>Update Call begin and timer in parent window UI after getting this.

---

###  ACK_OUTGOING_CALL_END

>Fired when an outgoing call is ended.
>Update Call end in parent window UI after getting this.
---


###  ACK_OUTGOING_CALL_FAIL

>Fired when an outgoing call failed.
>Update Fail call attempt in parent window UI after getting this.
---

###  ACK_CALL_HOLD

>Fired when the call is put on hold.
>Update Hold in parent window UI after getting this.
---

###  ACK_CALL_UNHOLD

>Fired when the call is put on un-hold.
>Update Unhold in parent window UI after getting this.
---

###  ACK_CALL_MUTE

> Fired when the call is put on mute.
> Update Mute in parent window UI after getting this.

---

###  ACK_CALL_UNMUTE

> Fired when the call is put on unmute.
> Update Unmute in parent window UI after getting this.
---

###  ACK_SESSION_DETAILS

>Fired when session details are received.
>Use this to retrieve and update Dialer. 
>####  Example
>```
> // This is session details , use this to store  details in parent window, and update UI accordingly.
> // Use start_time to handle timer.
>let callObject = {
> sender: "",
> receiver: "",
> startTime: "",
> endTime: "",
> hold: false,
> mute: false,
> };
>callerPackage.on('ACK_SESSION_DETAILS',()=>{
>let sessionDetails = callerPackage.getCallObject();
>	console.log(sessionDetails);
>});
>```
---


##  Methods

###  connect()

This method is used to connect to the popup.

If the popup is already active it will connect to that, otherwise, it will start a new popup window.

#####  Arguments
- config = {
			sip:,
			password: ,
			server_address:,
			port: ,
	},
- callback function

#####  Example:

```

callerPackage.connect({
		sip: 1000,
		password: 2000_pass ,
		server_address: 117.220.120.39,
		port: 7443/ws,
	},() => {
updateSocketConnectedInUI();
});

```
---

###  call()

This method is called to invoke the calling procedure.

#####  Arguments

- number

#####  Example:
```
// Request to start call
callerPackage.call('9838949386****');

// Confirmation on call established
callerPackage.on("ACK_OUTGOING_CALL_START", () => {
	updateConfirmCallUI();
});

// Confirmation on session fail
callerPackage.on("ACK_OUTGOING_CALL_FAIL", () => {
	updateSessionFailUI();
});
```
---

###  terminate()

This method is called to terminate the call.
```
// Request to terminate call
callerPackage.terminate();

// Confirmation on call termination
callerPackage.on("ACK_OUTGOING_CALL_END", () => {
	updateCallEndUI();
});
```
---

###  hold()

This method is called to hold ongoing call.
```
// Request to hold call
callerPackage.hold();

// Confirmation on call hold
callerPackage.on("ACK_CALL_HOLD", () => {
	updateCallHoldUI();
});
```
---
###  unhold()

This method is called to unhold ongoing call.
```
// Request to unhold call
callerPackage.unhold();

// Confirmation on call unhold
callerPackage.on("ACK_CALL_UNHOLD", () => {
	updateCallUnholdUI();
});
```
---
###  mute()
This method is called to mute ongoing call.
```
// Request to mute call
callerPackage.mute();

// Confirmation on call mute
callerPackage.on("ACK_CALL_MUTE", () => {
	updateCallMuteUI();
});
```
---
###  unmute()
This method is called to unmute the ongoing call.
```
// Request to unmute call
callerPackage.unmute();

// Confirmation on call unmute
callerPackage.on("ACK_CALL_UNMUTE", () => {
	updateCallUnmuteUI();
});
```

---

#### getCallObject()

This method is used to fetch call object from callerPackage.
Whenever ```ACK_SESSION_DETAILS``` event is triggered, fetch the details into a local callObject.
Fired when session details is recieved.
##### callObject
This is session details, use this to store  details in the parent window, 
Use this to retrieve and update UI accordingly.
For Example: 
* Use start_time to handle the timer on the dialer.
* Use end_time to show logs.
* use the receiver to update the name.
```
let callObject = {
 sender: "",
 receiver: "",
 startTime: "",
 endTime: "",
 hold: false,
 mute: false,
 };
```

```
callerPackage.on('ACK_SESSION_DETAILS',()=>{
let sessionDetails = callerPackage.getCallObject();
	console.log(sessionDetails);
});
```
---


</br>
