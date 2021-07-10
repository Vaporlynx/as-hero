const fs = require("fs").promises;

const request = require("request-promise-native");

let maxQuerySize = 30;
const requestTimeout = 60000;
const maxRequeueTime = 60000;

// TODO: pull this out into a different file.
// TODO: finish adding the other hundreds of weapon strings present in the mtf files
const parseWeaponString = (rawString, techBase) => {
    const split = rawString.split(" ");
    // intentional !=
    // eslint-disable-next-line eqeqeq
    if (split[0] != parseInt(split[0])) {
        split.splice(0, 0, 1);
    }
    const clan = rawString.toLowerCase().includes("cl") || techBase === "Clan";
    if (split[1].toLowerCase().indexOf("is") === 0 || split[1].toLowerCase().indexOf("cl") === 0) {
        split[1] = split[1].slice(2);
    }
    const [amount, ...remainingTokens] = split;
    const weaponString = remainingTokens.join("").toLowerCase().replace("(r)", "");


    let weaponCode = "";
    switch (weaponString) {
        case "largelaser": weaponCode = "LL"; break;
        case "mediumlaser": weaponCode = "ML"; break;
        case "smalllaser": weaponCode = "SL"; break;
        case "lrm5": weaponCode = "LRM5"; break;
        case "lrm10": weaponCode = "LRM10"; break;
        case "lrm15": weaponCode = "LRM15"; break;
        case "lrm20": weaponCode = "LRM20"; break;
        case "srm2": weaponCode = "SRM2"; break;
        case "srm4": weaponCode = "SRM4"; break;
        case "srm6": weaponCode = "SRM6"; break;
        case "ac2":
        case "ac/2":
        case "autocannon/2": weaponCode = "AC2"; break;
        case "ac5":
        case "ac/5":
        case "autocannon/5": weaponCode = "AC5"; break;
        case "ac10":
        case "ac/10":
        case "autocannon/10": weaponCode = "AC10"; break;
        case "ac20":
        case "ac/20":
        case "autocannon/20": weaponCode = "AC20"; break;
        case "mg":
        case "machinegun": weaponCode = "MG"; break;
        case "particlecannon":
        case "ppc" : weaponCode = "PPC"; break;
        case "flamer": weaponCode = "Flamer"; break;
        // Tech Level 2
        case "lbxac2":
        case "lb2-xac": weaponCode = "LBX2"; break;
        case "lbxac5":
        case "lb5-xac": weaponCode = "LBX5"; break;
        case "lbxac10":
        case "lb10-xac": weaponCode = "LBX10"; break;
        case "lbxac20":
        case "lb20-xac": weaponCode = "LBX20"; break;
        case "improvednarc": weaponCode = "INARC"; break;
        case "narcbeacon":
        case "narc": weaponCode = "NARC"; break;
        case "erlargelaser": weaponCode = "ERLL"; break;
        case "ermediumlaser": weaponCode = "ERML"; break;
        case "ersmalllaser": weaponCode = "ERSL"; break;
        case "largepulselaser": weaponCode = "LPL"; break;
        case "mediumpulselaser": weaponCode = "MPL"; break;
        case "smallpulselaser": weaponCode = "SPL"; break;
        case "ultraac2":
        case "ultraac/2": weaponCode = "UAC2"; break;
        case "ultraac5":
        case "ultraac/5": weaponCode = "UAC5"; break;
        case "ultraac10":
        case "ultraac/10": weaponCode = "UAC10"; break;
        case "ultraac20":
        case "ultraac/20": weaponCode = "UAC20"; break;
        case "erppc" : weaponCode = "ERPPC"; break;
        case "streaksrm2":
        case "streaksrm2(os)":
        case "ssrm2": weaponCode = "SSRM2"; break;
        case "streaksrm4":
        case "streaksrm4(os)":
        case "ssrm4": weaponCode = "SSRM4"; break;
        case "streaksrm6":
        case "streaksrm6(os)":
        case "ssrm6": weaponCode = "SSRM4"; break;
        case "antag":
        case "tag": weaponCode = "TAG"; break;
        case "sword": weaponCode = "Sword"; break;
        case "gaussrifle":
        case "gauss": weaponCode = "GR"; break;
        // Gross Excess
        case "lightmachinegun": weaponCode = "LMG"; break;
        case "heavymachinegun": weaponCode = "HMG"; break;
        case "lac/2":
        case "lac2": weaponCode = "LAC2"; break;
        case "lac/5":
        case "lac5": weaponCode = "LAC5"; break;
        case "heavyppc": weaponCode = "HPPC"; break;
        case "lightppc": weaponCode = "LPPC"; break;
        case "smallxpulselaser":
        case "smallx-pulselaser": weaponCode = "SXPL"; break;
        case "mediumxpulselaser":
        case "mediumx-pulselaser": weaponCode = "MXPL"; break;
        case "largexpulselaser":
        case "largex-pulselaser": weaponCode = "LXPL"; break;
        case "heavygaussrifle": weaponCode = "HGR"; break;
        case "hag/20": weaponCode = "HAG20"; break;
        case "hag/30": weaponCode = "HAG30"; break;
        case "hag/40": weaponCode = "HAG40"; break;
        case "snppc":
        case "snub-noseppc": weaponCode = "SPPC"; break;
        case "atm3": weaponCode = "ATM3"; break;
        case "atm6": weaponCode = "ATM6"; break;
        case "atm9": weaponCode = "ATM9"; break;
        case "atm12": weaponCode = "ATM12"; break;
        case "heavysmalllaser": weaponCode = "HSL"; break;
        case "heavymediumlaser": weaponCode = "HML"; break;
        case "heavylargelaser": weaponCode = "HLL"; break;
        case "rocketlauncher10": weaponCode = "RL10"; break;
        case "rocketlauncher15": weaponCode = "RL15"; break;
        case "rocketlauncher20": weaponCode = "RL20"; break;
        case "arrowiv":
        case "arrowivsystem": weaponCode = "ArrowIV"; break;
        case "plasmarifle": weaponCode = "PR"; break;
        case "sga": weaponCode = "LGA"; break;
        case "mga": weaponCode = "MGA"; break;
        case "hga": weaponCode = "HGA"; break;
        case "mml3": weaponCode = "MML3"; break;
        case "mml5": weaponCode = "MML5"; break;
        case "mml7": weaponCode = "MML7"; break;
        case "mml9": weaponCode = "MML9"; break;
        case "mrm10": weaponCode = "MRM10"; break;
        case "mrm20": weaponCode = "MRM20"; break;
        case "mrm30": weaponCode = "MRM30"; break;
        case "mrm40": weaponCode = "MRM40"; break;
        case "lightgaussrifle": weaponCode = "LGR"; break;
        case "rotaryac/2":
        case "rotaryac2": weaponCode = "RAC2"; break;
        case "rotaryac/5":
        case "rotaryac5": weaponCode = "RAC5"; break;
        case "ermicrolaser": weaponCode = "ERuL"; break;
        case "apgaussrifle": weaponCode = "APGR"; break;
        case "a-pod": weaponCode = "APOD"; break;
        case "b-pod": weaponCode = "BPOD"; break;
        // TODO: these are NOT weapons, rename to equipment or remove
        case "ecmsuite":
        case "guardianecm": weaponCode = "ECM"; break;
        case "ams":
        case "antimissilesystem": weaponCode = "AMS"; break;
        case "lams":
        case "laserarm": weaponCode = "LAMS"; break;
        case "c3slaveunit": weaponCode = "C3S"; break;
        case "c3masterwithtag":
        case "c3mastercomputer": weaponCode = "C3M"; break;
        case "improvedc3cpu": weaponCode = "C3I"; break;
        case "beagleactiveprobe": weaponCode = "BAP"; break;
        default: {
            weaponCode = "UNKNOWN";
        } break;
    }

    const parsedWeapons = new Array(amount);

    return parsedWeapons.fill(`${clan ? "CLAN" : "IS"}_${weaponCode}`);
};

const parseMtfs = () => new Promise(resolve => {
    const units = new Map();
    const weapons = new Set();
    const getMtfs = rootDirectory => new Promise((resolve, reject) => {
        fs.readdir(rootDirectory).then(async directories => {
            try {
                for (const directory of directories) {
                    // Do we need to dig deeper?
                    if (directory.includes(".")) {
                        const unparsedMtf = await fs.readFile(`${rootDirectory}/${directory}`, {encoding: "utf8"});
                        if (unparsedMtf) {
                            const split = unparsedMtf.split("\n");
                            const unit = {weapons: {}};
                            split.map((line, index) => {
                                if (index === 1) {
                                    unit.class = line;
                                    unit.variant = split[index + 1];
                                    unit.name = `${unit.class.trim()} ${unit.variant.trim()}`;
                                    if (unit.class.toLowerCase().includes("uller")) {
                                        console.log("asdf");
                                    }
                                }

                                const [key, value] = (line.split(":")).map(i => i.trim());
                                if (!!key && !!value) {
                                    switch (key) {
                                        case "Era": unit.year = parseInt(value); break;
                                        case "Mass": unit.weight = parseInt(value); break;
                                        case "TechBase": unit.techBase = value; break;
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
                                                if (weapon && locationString) {
                                                    const parsedWeapons = parseWeaponString(weapon, unit.techBase);
                                                    const location = locationString.split(" ").map(i => i[0].toLowerCase()).join("");
                                                    for (const weapon of parsedWeapons) {
                                                        if (!unit.weapons[location]) {
                                                            unit.weapons[location] = [];
                                                        }
                                                        unit.weapons[location].push(weapon);
                                                        weapons.add(weapon);
                                                    }
                                                }
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
                            console.log(`Failed to parse mtf: ${rootDirectory}/${directory}`);
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
        console.log(`weapons: ${weapons}`);
        resolve(units);
    }).catch(err => {
        console.log("Failed to parse mtfs, skipping.");
        resolve(null);
    });
});

const goodWords = new Set();

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
            }, requestTimeout);
            const workingString = `${searchString}`;
            try {
                const unParsed = await request(`http://masterunitlist.info/Unit/QuickList?name=${workingString}`);
                completed = true;
                const parsed = JSON.parse(unParsed);
                const totalFound = parsed.Units.length;
                if (parsed && parsed.Units) {
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
                    const additionalWords = [];
                    if (totalFound > 99) {
                        for (const letter of letters) {
                            additionalWords.push(`${searchString}${letter}`);
                            additionalWords.push(`${letter}${searchString}`);
                            additionalWords.push(`${searchString} ${letter}`);
                            additionalWords.push(`${letter} ${searchString}`);
                        }
                    }
                    else if (totalFound > 90) {
                        goodWords.add(searchString);
                    }
                    resolve(additionalWords);
                }
                else {
                    resolve([]);
                }
            }
            catch (err) {
                reject(err);
            }
        });
    };
    console.log(`Searching, started at ${new Date().toString()}`);
    try {
        const wordPool = new Set();
        const searchedWords = new Set();
        for (const vowel of ["a", "e", "i", "o", "u", "y"]) {
            for (const letter of letters) {
                wordPool.add(`${vowel}${letter}`);
            }
        }

        let requeueWaitTime = 1;
        const queryQueue = [];

        const logInterval = setInterval(() => {
            console.log(`Pending words: ${wordPool.size}, searched words: ${searchedWords.size}, sleep time: ${requeueWaitTime} ms`);
        }, 5000);
        const manageInterval = setInterval(() => {
            const delta = Math.min(Math.max(maxQuerySize - queryQueue.length, 0), wordPool.size);
            if (delta) {
                const batch = [...wordPool].slice(0, delta);
                for (const word of batch) {
                    queryQueue.push(word);
                    wordPool.delete(word);
                    searchByString(word).then(additionalWords => {
                        setTimeout(() => {
                            requeueWaitTime = Math.floor(Math.max(1, requeueWaitTime * 0.9));
                            for (const additionalWord of [...additionalWords]) {
                                if (!searchedWords.has(additionalWord)) {
                                    wordPool.add(additionalWord);
                                }
                            }
                            searchedWords.add(word);
                            queryQueue.splice(queryQueue.indexOf(word), 1);
                        }, requeueWaitTime);
                    }).catch(err => {
                        if (err === "TIMEOUT_REACHED" || err.statusCode) {
                            requeueWaitTime = Math.ceil(Math.min(requeueWaitTime * 1.25, maxRequeueTime));
                        }
                        queryQueue.splice(queryQueue.indexOf(word), 1);
                        wordPool.add(word);
                    });
                }
            }
            if (!wordPool.size && !queryQueue.length) {
                resolve(unitsByType);
                clearInterval(logInterval);
                clearInterval(manageInterval);
            }
        }, 5000);
    }
    catch (err) {
        reject(err);
    }
});

Promise.all([getUnits(), parseMtfs()]).then(async ([unitsByType, mtfs]) => {
    try {
        for (const key of Object.keys(unitsByType)) {
            const units = Object.values(unitsByType[key]);
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
                    else {
                        console.log(`Failed to find mtf for ${unit.nm}`);
                    }
                }
            }
            await fs.writeFile(`${__dirname}/../defs/${key}-def.json`, JSON.stringify(units));
        }
        console.log(`Finished writing defs at ${new Date().toString()}`);
        console.log(`Good words: ${[...goodWords].join(", ")}`);
    }
    catch (err) {
        console.log(`Failed to write data: ${err}`);
    }
}).catch(err => {
    console.log(`Error: ${err}`);
}) ;
