const unitCache = {};
const unitTypes = ["BM", "IM", "PM", "CV", "SV", "AF", "CF", "DS", "DA", "SC", "MS", "CI", "BA"];
const validSearchParams = [
  "name",
  "type",
  "minPV",
  "maxPV",
];

const getNested = (source, props) => {
  let property = source;
  for (const prop of props) {
    if (!property === undefined && !property[prop] === undefined) {
      property = property[prop];
    }
    else {
      property = undefined;
      break;
    }
  }
  return property;
};

// TODO: it looks like there is a bug with this where it overwrites the base object
const setNested = (source, props, value) => {
  let property = source;
  for (let i = 0; i < props.length - 1; i++) {
    if (!property[props[i]]) {
      property[props[i]] = {};
    }
    property = property[props[i]];
  }
  property[props[props.length - 1]] = value;
};

const spreadObject = source => {
  const spread = [];
  for (const key of Object.keys(source)) {
    spread.push(source[key]);
  }
  return spread;
}

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
    let unitsSearched = 0;
    for (const type of searchParams.types || unitTypes) {
      const unitsByType = unitCache[type] || {};
      for (const unitClasses of spreadObject(unitsByType)) {
        for (const unit of spreadObject(unitClasses)) {
          unitsSearched++;
          if (searchParams.name && !unit.name.toLowerCase().includes(searchParams.name)) {
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
    console.log(`UnitsSearched: ${unitsSearched}`);
    const response = new Response(JSON.stringify(results));
    resolve(response);
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
        if (!getNested(unitCache, [unit.type, unit.class, unit.variant])) {
          setNested(unitCache, [unit.type, unit.class, unit.variant], unit);
        }
      }
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