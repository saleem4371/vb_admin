export const requestPermission = async () => {
  if (!("Notification" in window)) return "unsupported";

  let permission = Notification.permission;

  if (permission !== "granted") {
    permission = await Notification.requestPermission();
  }

  return permission;
};

export const showBrowserNotification = (title, body) => {
  if (!("Notification" in window)) return;

  if (Notification.permission === "granted") {
    const notification = new Notification(title, {
      body,
      icon: "/images.jpeg",
      vibrate: [200, 100, 200], // 📳 mobile vibration
    });

    // 🔊 play sound
    try {
      const audio = new Audio("/notification.mp3");
      audio.play();
    } catch (e) {}

    // 👆 click action (focus tab)
    notification.onclick = () => {
      window.focus();
      notification.close();
    };
  }
};