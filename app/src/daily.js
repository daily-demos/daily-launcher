const hiddenClassName = "hidden";

window.addEventListener("DOMContentLoaded", () => {
  const form = getJoinForm();
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const url = document.getElementById("roomURL").value;
    joinCall(url);
  });
});

window.addEventListener("join-call", (event) => {
  console.log("got event", event);
  const url = event?.detail?.url;
  if (!url) return;
  joinCall(url);
});

function joinCall(url) {
  hideJoinForm();

  const container = document.getElementById("container");

  const callFrame = window.DailyIframe.createFrame(container, {
    showLeaveButton: true,
    iframeStyle: {
      position: "fixed",
      width: "calc(100% - 1rem)",
      height: "calc(100% - 1rem)",
    },
  });

  callFrame.on("left-meeting", () => {
    callFrame.destroy();
    showJoinForm();
  });
  callFrame.join({ url: url });
}

function hideJoinForm() {
  const form = getJoinForm();
  form.classList.add(hiddenClassName);
}

function showJoinForm() {
  const form = getJoinForm();
  form.classList.remove(hiddenClassName);
}

function getJoinForm() {
  return document.getElementById("joinForm");
}
