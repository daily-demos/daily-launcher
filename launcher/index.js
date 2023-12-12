const defaultRoomURL = "https://YOUR-DOMAIN.daily.co/YOUR-ROOM-NAME"
const hiddenClassName = "hidden";

window.addEventListener("DOMContentLoaded", () => {

    const roomURL = getRoomURL();
    console.log("roomurl:", roomURL)
    configureBrowserLaunch(roomURL);
    configureDesktopLaunch(roomURL);

    configureDownloadButtons();

    // Set up download buttons
    const parser = new UAParser(); // you need to pass the user-agent for nodejs
    const parserResults = parser.getResult();

    osName = parserResults.os.name;
    // Make all downloads visible by default, but if we detect an OS in the
    // user agent, hide the other download button.
    if (osName === "Mac OS") {
        const win = document.getElementById("win")
        win.classList.add(hiddenClassName)
    } else if (osName === "Windows") {
        const mac = document.getElementById("mac")
        mac.classList.add(hiddenClassName)
    }

});

function configureDownloadButtons() {
    // Mac
    const macArm = document.getElementById("macARMDownload")
    macArm.href = "https://daily-video-launcher.s3.us-west-2.amazonaws.com/daily-video-1.0.0-mac-arm64.dmg"

    const macIntel = document.getElementById("macIntelDownload")
    macIntel.href = "https://daily-video-launcher.s3.us-west-2.amazonaws.com/daily-video-1.0.0-mac-intel.dmg"

    const win = document.getElementById("windowsDownload")
    win.href = "https://daily-video-launcher.s3.us-west-2.amazonaws.com/daily-video-1.0.0-windows.exe"

    const dl = document.getElementById("download")
    dl.classList.remove(hiddenClassName)

}

function getRoomURL() {
    const urlParams = new URLSearchParams(window.location.search);
    let roomURL = urlParams.get("roomURL");
    if (!roomURL) {
        roomURL = defaultRoomURL
    }
    return roomURL
}

function configureDesktopLaunch(roomURL) {
    const url = `daily-vid://?roomURL=${roomURL}`
    const btn = document.getElementById("launchDesktop")
    btn.onclick = () => {
        window.location.href = url;
    }
    window.location.href = url;
}

function configureBrowserLaunch(roomURL) {
    const a = document.getElementById("launchBrowser")
    a.href = roomURL;
}

