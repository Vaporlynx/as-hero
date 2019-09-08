import {default as rosterPage} from "./roster.js";

const template = document.createElement("template");
template.innerHTML = `${rosterPage.template.innerHTML}
    <style>
        .cardContainer {
            display: flex;
            flex-direction: row;
        }
    </style>`
;

export default class gearRosterPage extends rosterPage {

    static get template() {
        return template;
      }

    constructor() {
        super();

        this.unitCard = "gear-unit-card";
        this.rosterCounterpart = "roster";
        this.searchPage = "gear-search";
    }

    async buildRoster(units) {
        while (this.rosterElem.hasChildNodes()) {
            this.rosterElem.removeChild(this.rosterElem.lastChild);
        }
        if (units.length) {
            try {
                const unParsed = await window.fetch(`/sw-units?unitIds=${units.map(i => i.id).join(",")}`);
                // Map to HG format
                const unitDefs = (JSON.parse(await unParsed.text())).map(def => {
                    const ECM = (def.special || "").split(",").filter(i => ["ecm", "prb", "rcn"].includes(i.toLowerCase()));
                    const armorRating = Math.round(def.armor / 2 + 5);
                    const torsoWeapons = [];
                    const limbWeapons = [
                        {code: "Punch", range: 0, pen: armorRating - 1, traits: ["Link"], category: "Melee"},
                        {code: "Kick", range: 0, pen: armorRating, traits: ["AE:2"], category: "Melee"},
                    ];
                    for (const [location, weapons] of Object.entries(def.weapons)) {
                        if (["ct", "rt", "lt", "h"].includes(location)) {
                            torsoWeapons.push(...weapons);
                        }
                        else {
                            limbWeapons.push(...weapons);
                        }
                    }
                    const actions = 1 + def.heatsinks / 10;
                    const autopilot = actions - Math.floor(actions) >= 0.5;
                    return {
                        id: def.id,
                        name: def.name,
                        type: "Torso",
                        movement: "-",
                        unitAvaliability: "",
                        gunnery: 5,
                        piloting: 6,
                        electronicWarfare: 6 - ECM.length,
                        armorRating,
                        totalHull: 5,
                        totalStructure: 3,
                        image: def.image,
                        weapons: torsoWeapons,
                        actions: Math.floor(actions),
                        traits: `Battlemech Crits, Neurohelmet Control, Battery Fire${autopilot ? ", Autopilot" : ""}`,
                        limb: {
                            name: def.name,
                            type: "Limbs",
                            movement: `G:${Math.round(parseInt(def.movement) * 0.66)}`,
                            unitAvaliability: "",
                            gunnery: 5,
                            piloting: 5,
                            electronicWarfare: 6,
                            armorRating: Math.round(def.armor / 2 + 4),
                            totalHull: 4,
                            totalStructure: 2,
                            image: def.image,
                            weapons: limbWeapons,
                            actions: "0*",
                            traits: "Battlemech Crits, Arms, Battery Fire",
                        },
                    };
                });

                units.sort((a, b) => a.squad > b.squad ? 1 : -1).forEach((unit, index) => {
                    const def = unitDefs.find(def => def.id === unit.id);
                    if (def) {
                        const cardContainer = document.createElement("div");
                        cardContainer.classList.add("cardContainer");
                        const card = document.createElement(this.unitCard);
                        cardContainer.appendChild(card);
                        card.data = Object.assign({}, def, unit);
                        card.addEventListener("dataUpdated", event => {
                            this.units[index] = event.detail.data;
                            this.pushUnits(this.units);
                        });
                        if (def.limb) {
                            const limbCard = document.createElement(this.unitCard);
                            cardContainer.appendChild(limbCard);
                            limbCard.data = Object.assign({}, def.limb, unit);
                            limbCard.addEventListener("dataUpdated", event => {
                                this.units[index] = event.detail.data;
                                this.pushUnits(this.units);
                            });
                        }
                        this.rosterElem.appendChild(cardContainer);
                    }
                });
            }
            catch (err) {
                globals.handleError(`Error getting unit: ${err}`);
            }
        }
    }
}

customElements.define("gear-roster-page", gearRosterPage);