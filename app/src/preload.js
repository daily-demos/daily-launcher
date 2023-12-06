const ipcRenderer = require("electron").ipcRenderer;

ipcRenderer.on("join-call", function (e, roomURL) {
  const event = new CustomEvent("join-call", {
    detail: {
      url: roomURL,
    },
  });
  console.debug("dispatching event", event);
  window.dispatchEvent(event);
});

// This is used mostly just for debugging, to pass main process log lines to renderer for output.
ipcRenderer.on("log", function (e, msg) {
  console.debug("Log from main process:", msg);
});
