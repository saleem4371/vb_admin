export const requestPermission = async () => {
  if ("Notification" in window) {
    const permission = await Notification.requestPermission();
    return permission;
  }
};

export const showBrowserNotification = (title, body) => {
  if (Notification.permission === "granted") {
    new Notification(title, {
      body,
      icon: "/images.jpeg",
    });
  }
};