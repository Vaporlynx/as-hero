const fs = require("fs").promises;

const request = require("request-promise-native");

const parseMtfs = () => new Promise((resolve, _) => {
    const units = new Map();
    const getMtfs = rootDirectory => new Promise((resolve, reject) => {
        fs.readdir(rootDirectory).then(async directories => {
            try {
                for (const directory of directories) {
                    // Do we need to dig deeper?
                    if (directory.includes(".")) {
                            const unparsedMtf = await fs.readFile(`${rootDirectory}/${directory}`, {encoding: "utf8"});
                            const split = unparsedMtf.split("\n");
                            const unit = {weapons: {}};
                            split.map((line, index) => {
                                if (index === 1) {
                                    unit.class = line;
                                    unit.variant = split[index + 1];
                                    unit.name = `${unit.class} ${unit.variant}`;
                                }

                                const [key, value] = (line.split(":")).map(i => i.trim());
                                if (!!key && !!value) {
                                    switch (key) {
                                        case "Era": unit.year = parseInt(value); break;
                                        case "Mass": unit.weight = parseInt(value); break;
                                        case "Heat Sinks": {
                                            if (value.includes("Double")) {
                                                unit.heatSinks = parseInt(value.split(" ")[0]) * 2;
                                            }
                                            else {
                                                unit.heatSinks = parseInt(value.split(" ")[0]);
                                            }
                                        } break;
                                        case "Weapons": {
                                            split.slice(index + 1, index + 1 + parseInt(value)).map(line => {
                                                const [weapon, locationString] = line.split(", ");
                                                const location = locationString.split(" ").map(i => i[0].toLowerCase()).join("");
                                                unit.weapons[location] = weapon;
                                            });
                                        } break;
                                    }
                                }
                            });
                            if (unit.name) {
                                units.set(unit.name, unit);
                            }
                    }
                    else {
                        await getMtfs(`${rootDirectory}/${directory}`);
                    }
                }
                resolve(null);
            }
            catch (err) {
                reject(err);
            }
        });
    });

    getMtfs("./mtf").then(() => {
        resolve(units);
    }).catch(err => {
        console.log("Failed to parse mtfs, skipping.");
        resolve(null);
    });
});

const getUnits = () => new Promise(async(resolve, reject) => {

    const letters = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
    const unitsByType = {};

    const searchByString = searchString => {
        return new Promise(async (resolve, reject) => {
            let completed = false;
            setTimeout(() => {
                if (!completed) {
                    reject("TIMEOUT_REACHED");
                }
            }, 60000);
            const workingString = `${searchString}`;
            try {
                const unParsed = await request(`http://masterunitlist.info/Unit/QuickList?name=${workingString}`);
                completed = true;
                const parsed = JSON.parse(unParsed);
                let totalFound = parsed.Units.length;
                if (parsed && parsed.Units) {
                    console.log(`${workingString} returned ${parsed.Units.length} results`);
                    for (const Unit of parsed.Units) {
                        const unit = {
                            id: Unit.Id,
                            nm: Unit.Name,
                            pv: Unit.BFPointValue,
                            ar: Unit.BFArmor,
                            st: Unit.BFStructure,
                            da: {
                                s: Unit.BFDamageShort,
                                m: Unit.BFDamageMedium,
                                l: Unit.BFDamageLong,
                            },
                            mv: Unit.BFMove,
                            img: Unit.ImageUrl,
                            tp: Unit.BFType,
                            sz: Unit.BFSize,
                            rl: Unit.Role.Name,
                            spc: Unit.BFAbilities,
                            cl: Unit.Class,
                            vnt: Unit.Variant,
                            ov: Unit.BFOverheat,
                            meta: {
                                pd: parseInt(Unit.DateIntroduced),
                                tl: Unit.Technology.Id,
                            },
                        };
                        if (!unitsByType[unit.tp]) {
                            unitsByType[unit.tp] = {};
                        }
                        unitsByType[unit.tp][unit.nm] = unit;
                    }
                    // Need to dig deeper!
                    if (totalFound > 99) {
                        for (const letter of letters) {
                            totalFound += await searchByString(`${searchString}${letter}`);
                            totalFound += await searchByString(`${letter}${searchString}`);
                        }
                    }
                    resolve(totalFound);
                }
                else {
                    resolve(0);
                }
            }
            catch (err) {
                reject(err);
            }
        });
    };
    console.log(`Searching, started at ${new Date().toString()}`);
    try {
        const words = [];
        for (const vowel of ["a", "e", "i", "o", "u", "y"]) {
            for (const letter of letters) {
                words.push(`${vowel}${letter}`);
            }
        }
        const queryQueue = [];
        const manageQueue = () => {
            if (words.length) {
                if (queryQueue.length < 10) {
                    const word = words.pop();
                    queryQueue.push(word);
                    searchByString(word).then(() => queryQueue.splice(queryQueue.indexOf(word), 1)).catch(err => {
                        console.log(`Search failed for: ${word}, err: ${err}`);
                        queryQueue.splice(queryQueue.indexOf(word), 1);
                        setTimeout(() => {
                            words.push(word);
                        }, 100);
                    });
                }
            }
            else if (queryQueue.length === 0) {
                return;
            }
            setTimeout(async () => {
                if (words.length || queryQueue.length) {
                    manageQueue();
                }
                else {
                    console.log(`Searching, finished at ${new Date().toString()}`);
                    resolve(unitsByType);
                }
            }, 1000);
        };
        manageQueue();
    }
    catch (err) {
        reject(err);
    }
});

Promise.all([getUnits(), parseMtfs()]).then(async ([unitsByType, mtfs]) => {
    try {
        for (const key of Object.keys(unitsByType)) {
            const units = unitsByType[key];
            if (mtfs) {
                for (const unit of units) {
                    const mtf = mtfs.get(unit.nm);
                    if (mtf) {
                        unit.wp = mtf.weapons;
                        unit.hs = mtf.heatSinks;
                        if (mtf.year !== unit.meta.pd) {
                            console.log(`Year mismatch for ${unit.nm}, ${unit.meta.pd} vs ${mtf.year}`);
                        }
                    }
                }
            }
            await fs.writeFile(`${__dirname}/../defs/${key}-def.json`, JSON.stringify(units));
        }
        console.log(`Finished writing defs at ${new Date().toString()}`);
    }
    catch (err) {
        console.log(`Failed to write data: ${err}`);
    }
}).catch(err => {
    console.log(`Error: ${err}`);
}) ;
