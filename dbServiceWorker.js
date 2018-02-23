// TODO: turn unit cache into an indexDB (ewwwwww)
let unitDB = null;
const currentRequests = {};
const unitTypes = ["BM", "IM", "PM", "CV", "SV", "AF", "CF", "DS", "DA", "SC", "MS", "CI", "BA"];
const validSearchParams = [
  "name",
  "type",
  "minPV",
  "maxPV",
];
const unitPreCache = ["atlas", "awesome", "catapult"];

// const getNested = (source, props) => {
//   let property = source;
//   for (const prop of props) {
//     if (!property === undefined && !property[prop] === undefined) {
//       property = property[prop];
//     }
//     else {
//       property = undefined;
//       break;
//     }
//   }
//   return property;
// };

const dbConnection = indexedDB.open("unitDB", 1);
dbConnection.onerror = event => {
  console.log("error opening db");
};

dbConnection.onupgradeneeded = event => {
  for (const unitType of unitTypes) {
    event.target.result.createObjectStore(unitType, {keyPath: "name"});
  }
};

const getUnit = (type, name) => {
  return new Promise((resolve, reject) => {
    if (unitDB) {
      const request = unitDB.transaction(type).objectStore(type).get(name);
      request.onerror = event => {
        reject(`Failed to get read transaction for type: ${type}, name: ${name}`);
      };
      request.onsuccess = event => {
        resolve(request.result);
      };
    }
    else {
      reject("Unit database not initialized!");
    }
  });
};

const getUnits = type => {
  return new Promise((resolve, reject) => {
    if (unitDB) {
      const request = unitDB.transaction(type).objectStore(type).getAll();
      request.onerror = event => {
        reject(`Failed to get read transaction for type: ${type}`);
      };
      request.onsuccess = event => {
        resolve(request.result);
      };
    }
    else {
      reject("Unit database not initialized!");
    }
  });
};

const setUnit = (type,  data) => {
  return new Promise((resolve, reject) => {
    if (unitDB) {
      try {
        const request = unitDB.transaction(type, "readwrite").objectStore(type).put(data);
        request.onsuccess = event => {
          resolve();
        };
      }
      catch (err) {
        reject(`setUnit failed for: ${type}, name: ${data.name}`);
      }
    }
    else {
      reject("Unit database not initialized!");
    }
  });
};

const serveOrFetch = request => {
  return new Promise(async (resolve, reject) => {
    const cachedData = await caches.match(request);
    if (cachedData) {
      resolve(cachedData);
    }
    else {
      const response = await fetch(request);
      const cache = await caches.open("urlCache");
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
      const units = await getUnits(type);
      for (const unit of units) {
        unitsSearched++;
        let valid = true;
        if (searchParams.name && !unit.name.toLowerCase().includes(searchParams.name)) {
          valid = false;
        }
        if (searchParams.minPV && unit.pv <= searchParams.minPV) {
          valid = false;
        }
        if (searchParams.maxPV && unit.pv >= searchParams.maxPV) {
          valid = false;
        }
        if (valid) {
          results.push(unit);
        }
      }
    }
    console.log(`UnitsSearched: ${unitsSearched}`);
    const response = new Response(JSON.stringify(results));
    resolve(response);
      const queryString = Object.keys(searchParams).reduce((queryString, key) => {
        return `${queryString}${key}=${searchParams[key]}`;
      }, "?");
      currentRequests[url] = fetch(`http://masterunitlist.info/Unit/QuickList${queryString}`)
        .then(request => request.text()).then(unParsed => JSON.parse(unParsed).Units).then(data => {
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
          // Base omnimechs have no type for some reason
          if (unit.type !== null) {
            setUnit(unit.type, unit);
          }
        }
      });
  });
};

dbConnection.onsuccess = async event => {
  unitDB = event.target.result;
  for (const unit of unitPreCache) {
    const url = new URL(`http://internaldb/?name=${unit}`);
    await searchUnits(url);
  }
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