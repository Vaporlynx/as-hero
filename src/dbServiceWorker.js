// url
const imageCache = {};

// type/name/variant
const unitCache = {};

self.addEventListener("install", event => {
});

self.addEventListener("fetch", async event => {
    const url = new URL(event.request);
    if (url.hostname === "db") {
        if (url.pathname.includes("/unit/")) {
            let entry = unitCache;
            const splitUrl = url.pathname.replace("/unit/", "").split("/");
            const searchParams = url.search.replace("?", "").split("&");
            for (const property of splitUrl) {
                if (entry[property]) {
                    entry = entry[property];
                }
                else {
                    await fetch();
                }
            }
            return entry;
        }
        else {
            return null;
        }
    }
    else if (url.path.includes("mul-images")) {
        if (!imageCache[url]) {
            imageCache[url] = fetch(event.request);
        }
        return imageCache[url];
    }
    else {
        return fetch(event.request);
    }
});