const { Popup } = require("./popup.js");

import { CONFIG_CHANNEL } from "../static/constants";

window.addEventListener("DOMContentLoaded", () => {
  localStorage.setItem("is_popup_active", "true");
});

window.addEventListener("beforeunload", function () {
  localStorage.clear();
  //informUnload();
  return "";
});

let popup = null;

const config_channel = new BroadcastChannel(CONFIG_CHANNEL);
config_channel.onmessage = (event) => {
  console.log(event);
  let { sip, password, server_address, port } = event.data;
  popup = new Popup({
    sip: sip,
    password: password,
    server_address: server_address,
    port: port,
  });

  main();
};

function main() {
  popup.connect(() => {
    document.querySelector("h2").textContent = "CONNECTED";
    document.querySelector(".ripple").remove();
  });
}
