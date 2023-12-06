const defaultRoomURL = "https://lizashul.daily.co/hacktheplanet"

window.addEventListener("DOMContentLoaded", () => {

    // Get query parameters
    const urlParams = new URLSearchParams(window.location.search);
    let roomURL = urlParams.get("roomURL");
    if (!roomURL) {
        roomURL = defaultRoomURL
    }

    const p = document.getElementById("msg")
    const url = `daily-vid://?roomURL=${roomURL}`
    p.innerHTML = `Daily Video should open automatically. If it doesn't, <a href="${url}">click here</a> to launch.`
    window.location.href= url
});
