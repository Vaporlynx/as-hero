const unitCache = {};
const unitTypes = ["BM", "IM", "PM", "CV", "SV", "AF", "CF", "DS", "DA", "SC", "MS", "CI", "BA"];
const validSearchParams = [
  "name",
  "type",
  "minPV",
  "maxPV",
];

const serveOrFetch = request => {
  return new Promise(async (resolve, reject) => {
    const cachedData = await caches.match(request);
    if (cachedData) {
      resolve(cachedData);
    }
    else {
      const response = await fetch(request);
      const cache = await caches.open("v1");
      cache.put(request, response.clone());
      resolve(response);
    }
  });
};

const searchUnits = url => {
  const searchParams = {};
  for (const key of validSearchParams) {
    const value = url.searchParams.get(key);
    if (value) {
      searchParams[key] = value;
    }
  }
  return new Promise(async (resolve, reject) => {
    const results = [];
    for (const type of searchParams.types || unitTypes) {
      const unitsByType = unitCache[type] || [];
      for (const unitClasses of unitsByType) {
        for (const unit of unitClasses) {
          if (searchParams.name && !unit.name.includes(searchParams.name)) {
            break;
          }
          if (searchParams.minPV && unit.pv <= searchParams.minPV) {
            break;
          }
          if (searchParams.maxPV && unit.pv >= searchParams.maxPV) {
            break;
          }
          results.push(unit);
        }
      }
    }

    if (!results.length) {
      // TODO: reduce searchParams into a string of query params
      // const queryString = Object.keys(searchParams).reduce();
      const unParsed = await fetch(`http://masterunitlist.info/Unit/QuickList${url.search}`);
      const data = JSON.parse(await unParsed.text()).Units;
      for (const datum of data) {
        const unit = {
          name: datum.Name,
          pv: datum.BFPointValue,
          armor: datum.BFArmor,
          structure: datum.BFStructure,
          damage: {
            short: datum.BFDamageShort,
            medium: datum.BFDamageMedium,
            long: datum.BFDamageLong,
          },
          movement: datum.BFMove,
          image: datum.ImageUrl,
          type: datum.BFType,
          size: datum.BFSize,
          role: datum.Role.Name,
          skill: datum.Skill || 4,
          special: datum.BFAbilities,
          class: datum.Class,
          variant: datum.Variant,
        };
        // TODO: create a getter/setter that works with this nested structure
        if (!unitCache[unit.type][unit.class][unit.variant]) {
          unitCache[unit.type][unit.class][unit.variant] = unit;
        }
        results.push(unit);
      }
    }
    const response = new Response(JSON.stringify(results));
    resolve(response);
  });
};

self.addEventListener("fetch", event => {
  const url = new URL(event.request.url);
  if (url.pathname.includes("mul-images")) {
    event.respondWith(serveOrFetch(event.request));
  }
  else if (url.pathname === "/Unit/QuickList") {
    event.respondWith(serveOrFetch(event.request));
  }
  else if (url.hostname === "internaldb") {
    event.respondWith(searchUnits(url));
  }
});