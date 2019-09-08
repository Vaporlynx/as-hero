import * as unitHelper from "../../src/unitHelper.js";
import * as heavyGearWeapons from "../../defs/heavyGearWeapons.js";

const template = document.createElement("template");
template.innerHTML = `
    <style>
        :host {
            display: flex;
            height: 100%;
            background-color: var(--nonInteractiveElementBackgroundColor);
            color: var(--nonInteractiveElementBackgroundFontColor);
            padding: 10px;
            --bevelBgColor: var(--nonInteractiveElement2BackgroundColor);
            border: .1em solid;
            border-color: var(--nonInteractiveElementBackgroundColor);
            box-sizing: border-box;
            --fullPad: 0.2em;
        }

        .hidden {
            display: none;
        }
        
        #cardBody {
            height: 100%;
            width: 100%;
        }
        #cardBody > div:not(:last-child) {
            margin-bottom: var(--fullPad);
        }

        vpl-label {
            align-items: center;
        }
    
        .spacedRow {
            display: flex;
            flex-direction: row;
        }
    
        .spacedColumn {
            display: flex;
            flex-direction: column;
        }

        .bevel {
            background-color: var(--nonInteractiveElement2BackgroundColor);
            clip-path: polygon(0 0, calc(100% - var(--bevelOffset)) 0, 100% var(--bevelOffset), 100% 100%, var(--bevelOffset) 100%, 0 calc(100% - var(--bevelOffset)));
            padding: calc(var(--bevelOffset) / 2);
        }

        #header {
            justify-content: space-between;
            height: 10%;
            font-weight: bold;
            font-size: 125%;
            align-items: center;
        }
        #header > * {
            height: 100%;
            box-sizing: border-box;
        }
        #header > *:not(:last-child) {
            margin-right: var(--fullPad);
        }
        #upperDetails {
            height: 40%;
            font-size: 130%;
        }

        #mainDetails {
            width: 70%;
        }
        #mainDetails > div {
            height: 30%;
            align-items: center;
        }
        #mainDetails > div:not(:last-child) {
            margin-bottom: var(--fullPad);
        }

        #lowerDetails {
            height: 50%;
            font-size: 140%;
        }

        #image {
            width: 30%;
            object-fit: contain;
            margin-left: var(--fullPad);
        }

        #attributes {
            justify-content: space-around;
        }

        #noteContainer {
            width: 100%;
        }

        #tvContainer {
        }
        
        #health {
            height: 40%;
            justify-content: space-between;
        }
        #health vpl-label vpl-pips {
            flex-wrap: wrap;
        }
    </style>
    <div id="cardBody" class="spacedColumn">
        <div id="header" class="spacedRow">
            <div id="name" class="spacedColumn bevel">
            </div>
            <vpl-label prefix="UA" id="uaContainer" class="bevel">
                <div id="unitAvaliability" slot="content"></div>
            </vpl-label>
            <vpl-label prefix="TV:" id="tvContainer" class="bevel">
                <div id="tv" slot="content"></div>
            </vpl-label>
        </div>
        <div id="upperDetails" class="spacedRow">
            <img id="image"></img>
            <div class="spacedColumn" id="mainDetails">            
                <div id="attributes" class="spacedRow bevel">
                    <vpl-label prefix="Type">
                        <div id="type" slot="content">
                        </div>
                    </vpl-label>
                    <vpl-label prefix="MR:">
                        <div id="movement" slot="content">
                        </div>
                    </vpl-label>
                    <div id="skills">
                        <vpl-label prefix="GU">
                            <div id="gunnery" slot="content"></div>
                        </vpl-label>
                        <vpl-label prefix="PI">
                            <div id="piloting" slot="content"></div>
                        </vpl-label>
                        <vpl-label prefix="EW">
                            <div id="electronicWarfare" slot="content"></div>
                        </vpl-label>
                        <vpl-label prefix="A">
                            <div id="actions" slot="content"></div>
                        </vpl-label>
                    </div>
                    <div id="health" class="spacedColumn bevel">
                    <vpl-label prefix="Armor Rating">
                        <div id="armorRating" slot="content"></div>
                    </vpl-label>
                        <vpl-label prefix="H">
                            <vpl-pips id="hull" slot="content" mode="subtractive"></vpl-pips>
                        </vpl-label>
                        <vpl-label prefix="S">
                            <vpl-pips id="structure" slot="content" mode="subtractive"></vpl-pips>
                        </vpl-label>
                    </div>
                </div>
            </div>
        </div>
        <div id="lowerDetails" class="spacedColumn">
            <div>Traits</div>
            <div id="traits">
            </div>
            <table id="weaponsContainer">
                <th>Code</th>
                <th>Range</th>
                <th>Pen</th>
                <th>Traits</th>
                <th>Category</th>
            </table>
        </div>
        <vpl-label prefix="" id="noteContainer" class="bevel hidden">
            <div id="note" slot="content"></div>
        </vpl-label>
    </div>
`;

export default class GearUnitCard extends HTMLElement {
    static get template() {
      return template;
    }

    constructor() {
        super();

        this.attachShadow({mode: "open"}).appendChild(this.constructor.template.content.cloneNode(true));

        this.nameElem = this.shadowRoot.getElementById("name");
        this.unitAvaliabilityElem = this.shadowRoot.getElementById("unitAvaliability");
        this.tvElem = this.shadowRoot.getElementById("tv");
        this.typeElem = this.shadowRoot.getElementById("type");
        this.movementElem = this.shadowRoot.getElementById("movement");
        this.gunneryElem = this.shadowRoot.getElementById("gunnery");
        this.pilotingElem = this.shadowRoot.getElementById("piloting");
        this.electronicWarfareElem = this.shadowRoot.getElementById("electronicWarfare");

        this.actionsElem = this.shadowRoot.getElementById("actions");

        this.armorRatingElem = this.shadowRoot.getElementById("armorRating");
        this.hullElem = this.shadowRoot.getElementById("hull");
        this.structureElem = this.shadowRoot.getElementById("structure");

        this.noteContainerElem = this.shadowRoot.getElementById("noteContainer");
        this.noteElem = this.shadowRoot.getElementById("note");
        this.imageElem = this.shadowRoot.getElementById("image");

        this.traitsElem = this.shadowRoot.getElementById("traits");
        this.weaponsContainerElem = this.shadowRoot.getElementById("weaponsContainer");

        this.hullElem.addEventListener("change", event => this.handleUnitAttributesChanged(event));
        this.structureElem.addEventListener("change", event => this.handleUnitAttributesChanged(event));

        this._data = null;
    }

    set data(val) {
        setTimeout(() => {
            if (val !== this._data) {
                this._data = val;
                this.nameElem.textContent = val.name;
                if (val.squad) {
                    this.style.borderColor = `#${val.squad}`;
                }
                this.typeElem.textContent = val.type;
                this.movementElem.textContent = val.movement;
                this.unitAvaliabilityElem.textContent = val.unitAvaliability;
                this.gunneryElem.textContent = val.gunnery;
                this.pilotingElem.textContent = val.piloting;
                this.electronicWarfareElem.textContent = val.electronicWarfare;
                this.actionsElem.textContent = val.actions;
                this.armorRatingElem.textContent = val.armorRating;
                this.hullElem.totalPips = val.totalHull;
                this.hullElem.marked = val.hull;
                this.structureElem.totalPips = val.totalStructure;
                this.structureElem.marked = val.structure;
                this.imageElem.src = val.image;
                this.traitsElem.textContent = val.traits;
                if (val.weapons.length) {
                    for (const weapon of val.weapons) {
                        const def = (typeof weapon === "string" ? heavyGearWeapons.weapons.find(i => i.BTCode === weapon) : weapon);
                        if (def) {
                            const row = document.createElement("tr");
                            row.innerHTML = `
                                <td>${def.code}</td>
                                <td>${def.range}</td>
                                <td>${def.pen}</td>
                                <td>${def.traits.join(", ")}</td>
                                <td>${def.category}</td>
                            `;
                            this.weaponsContainerElem.appendChild(row);
                        }
                    }
                }
                if (val.note) {
                    this.noteElem.textContent = val.note;
                    this.noteContainerElem.classList.remove("hidden");
                }
            }
        }, 1);
    }

    get data () {
        return this._data;
    }

    handleUnitAttributesChanged (event) {
        this.data[event.target.id] = event.detail.value;
        this.dispatchEvent(new CustomEvent("dataUpdated", {detail: {data: this.data}}));
    }
}

customElements.define("gear-unit-card", GearUnitCard);