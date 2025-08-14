self.addEventListener('fetch', (event: FetchEvent) => {
    if (event.preloadResponse) {
      event.respondWith(
        event.preloadResponse
          .then((response) => response || fetch(event.request)) // Use preload response if available
          .catch(() => fetch(event.request)) // Fallback to network if preload fails
      );
    } else {
      // If no preloadResponse, fetch directly
      event.respondWith(fetch(event.request));
    }
  });
  
  self.addEventListener('activate', (event) => {
    event.waitUntil(
      (async () => {
        if ((self as any).registration.navigationPreload) {
          await (self as any).registration.navigationPreload.enable();
        }
      })()
    );
  });
  