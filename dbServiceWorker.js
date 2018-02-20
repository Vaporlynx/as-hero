self.addEventListener("fetch", event => {
  const url = new URL(event.request.url);
  if (url.pathname.includes("mul-images")) {
    event.respondWith(new Promise(async (resolve, reject) => {
      // TODO: find a better way to cache these images.  the built in cache looks like it has massive bloat
      // Suspect there is a CORS issue with just fetching the images and then storing the binary data
      const cachedData = await caches.match(event.request);
      if (cachedData) {
        resolve(cachedData);
      }
      else {
        const response = await fetch(event.request);
        const cache = await caches.open("v1");
        cache.put(event.request, response.clone());
        resolve(response);
      }
    }));
  }
  // TODO: cache searches to the MUL  they are very slow and very likely dont change often
  // else if ()
  // TODO: create a local DB of units from the MUL. Provide data from these first, then append MUL data when we get it
  // else if ()
  else {
    event.respondWith(fetch(event.request));
  }
});