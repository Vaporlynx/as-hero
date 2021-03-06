import * as urlHelper from "../../src/urlHelper.js";
import * as unitHelper from "../../src/unitHelper.js";

const template = document.createElement("template");
template.innerHTML = `
    <style>
        :host {
            display: grid;
            grid-template: 32px / 1fr;
            grid-template-areas: "controls"
                                "roster";
            overflow: hidden;
            height: 100vh;
            width: 100vw;

            --cardRows: 1;
            --cardSizeOffset: 0.95;
        }

        #controls {
            grid-area: controls;
            display: flex;
        }

        #roster {
            display: flex;
            width: 100vw;
            height: 100vh;
            overflow: auto;
            flex-wrap: wrap;
            grid-area: roster;
            justify-content: center;
        }

        #roster > unit-card {
            margin: 5px;
            width: 768px;
            height: 549px;
            position: relative;
            --pipSize: 16px;
            --bevelOffset: 24px;
        }

        #modeToggle {
            justify-self: flex-end;
            display: none;
        }
        #modeToggle > img {
            height: 26px;
        }
    </style>

    <div id="controls">
        <button id="search">Search</button>
        <vpl-label prefix="PV Total:" id="label">
            <div id="pvTotal" slot="content"></div>
        </vpl-label>
        <button id="modeToggle" class="layeredImageContainer">
            <img src="./assets/gear.svg">
        </button>
    </div>
    <div id="roster"> </div>
`;

export default class rosterPage extends HTMLElement {
    static get template() {
      return template;
    }

    static get observedAttributes() {
    }

    constructor() {
        super();

        this.unitCard = "unit-card";
        this.rosterCounterpart = "gear-roster";
        this.searchPage = "search";

        this.attachShadow({mode: "open"}).appendChild(this.constructor.template.content.cloneNode(true));

        this.rosterElem = this.shadowRoot.getElementById("roster");

        this.pvTotalElem = this.shadowRoot.getElementById("pvTotal");

        this._units = [];

        this.handleUrlUpdated = event => {
            const units = this.pullUnits();
            const encodedUnits = units.map(unit => unitHelper.encode(unit));
            if (this.units.length !== units.length || !this.units.map(unit => unitHelper.encode(unit)).every((unit, index) => unit === encodedUnits[index])) {
                this.units = units;
                this.buildRoster(units);
            }
        };
        this.buildRoster(this.units = this.pullUnits());

        this.searchElem = this.shadowRoot.getElementById("search");
        this.searchElem.addEventListener("pointerdown", event => {
            urlHelper.setParams({
                page: this.searchPage,
            });
        });

        this.modeToggleElem = this.shadowRoot.getElementById("modeToggle");
        this.modeToggleElem.addEventListener("pointerdown", event => {
            urlHelper.setParams({
                page: this.rosterCounterpart,
            });
        });
    }

    connectedCallback() {
        window.addEventListener("urlUpdated", this.handleUrlUpdated);
    }

    disconnectedCallback() {
        window.removeEventListener("urlUpdated", this.handleUrlUpdated);
    }

    get units() {
        return this._units;
    }
    set units(val) {
        this._units = val;
    }

    pullUnits() {
        const params = urlHelper.getParams();
        return params.units ? params.units.map(i => unitHelper.decode(i)) : [];
    }

    pushUnits(units) {
        urlHelper.setParams({units: units.map(i => unitHelper.encode(i))});
    }

    async buildRoster(units) {
        while (this.rosterElem.hasChildNodes()) {
            this.rosterElem.removeChild(this.rosterElem.lastChild);
        }
        let pvTotal = 0;
        if (units.length) {
            try {
                const unParsed = await window.fetch(`/sw-units?unitIds=${units.map(i => i.id).join(",")}`);
                const unitDefs = JSON.parse(await unParsed.text());

                units.sort((a, b) => a.squad > b.squad ? 1 : -1).forEach((unit, index) => {
                    const def = unitDefs.find(def => def.id === unit.id);
                    if (def) {
                        const card = document.createElement(this.unitCard);
                        card.data = Object.assign({}, def, unit);
                        pvTotal += unitHelper.calculatePointValue(def.pv, unit.skill);
                        card.addEventListener("dataUpdated", event => {
                            this.units[index] = event.detail.data;
                            this.pushUnits(this.units);
                        });
                        this.rosterElem.appendChild(card);
                    }
                });
            }
            catch (err) {
                globals.handleError(`Error getting unit: ${err}`);
            }
        }
        this.pvTotalElem.innerText = pvTotal;
    }
}

customElements.define("roster-page", rosterPage);