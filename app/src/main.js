const { app, BrowserWindow } = require("electron");
const path = require("node:path");

const gotTheLock = app.requestSingleInstanceLock();
const protocolName = "daily-vid";
let mainWindow = null;
let roomURL = null;

const args = process.argv;

// Set up the protocol
if (process.defaultApp) {
  if (args.length >= 2) {
    app.setAsDefaultProtocolClient(protocolName, process.execPath, [
      path.resolve(args[1]),
    ]);
  }
} else {
  app.setAsDefaultProtocolClient(protocolName);
}

// Set up Windows and Mac window event handlers
setupWindowsHandler();
setupMacHandler();

/**
 * Create the main window
 */
function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });
  win.loadFile(path.join(__dirname, "index.html")).then(() => {
    mainWindow = win;
    const roomURL = findRoomURL(args);
    if (roomURL) {
      win.webContents.send(
        "log",
        `Found room URL after window creation. Joining.`,
      );
      joinRoom(roomURL);
    }
  });
}

/**
 * Join a Daily room
 * @param roomURL
 */
function joinRoom(roomURL) {
  if (!mainWindow) {
    // If main window does not yet exist, the app wasn't ready
    // try again in 1 second
    setTimeout(() => {
      joinRoom(roomURL);
    }, 1000);
    return;
  }
  mainWindow.webContents.send("log", `maybe joining room ${roomURL}`);

  if (roomURL) {
    mainWindow.webContents.send("join-call", roomURL);
  }
}

app.on("window-all-closed", () => {
  app.quit();
});

app.whenReady().then(() => {
  createWindow();
});

function setupWindowsHandler() {
  if (!gotTheLock) {
    app.quit();
  } else {
    app.on("second-instance", (event, commandLine, workingDirectory) => {
      if (mainWindow) {
        mainWindow.focus();
      }
      const roomURL = findRoomURL(commandLine);
      if (roomURL) {
        joinRoom(roomURL);
      }
    });
  }
}

/**
 * Set up the Mac window event handler when opened from a URL
 */
function setupMacHandler() {
  app.on("open-url", (event, url) => {
    event.preventDefault();
    if (mainWindow) {
      mainWindow.focus();
    }
    // Extract parameters from the URL
    roomURL = getRoomURL(url);
    if (roomURL) {
      joinRoom(roomURL);
    }
  });
}

function getRoomURL(url) {
  const params = new URL(url).searchParams;
  return params.get("roomURL");
}

function findRoomURL(args) {
  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    try {
      const roomURL = getRoomURL(arg);
      if (roomURL) {
        return roomURL;
      }
    } catch (e) {
      mainWindow.webContents.send("log", "Parsed arg, but found no room URL");
    }
  }
}
