export function register() {
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      const swUrl = `/sw.js`;
      navigator.serviceWorker
        .register(swUrl)
        .then((_) => {
          // Changed 'registration' to '_' to indicate unused parameter
          // No need to use the registration object in this case
          console.log("ServiceWorker registered");
        })
        .catch((error) => {
          console.error("Error during service worker registration:", error);
        });
    });
  }
}

export function unregister() {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.ready
      .then((registration) => {
        registration.unregister();
      })
      .catch((error) => {
        console.error("Error during service worker unregistration:", error);
      });
  }
}
