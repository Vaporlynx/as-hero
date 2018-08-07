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
        }
        
        #cardBody {
            height: inherit;
            width: inherit;
        }
    
        .spacedRow {
            display: flex;
            flex-direction: row;
        }
    
        .spacedColumn {
            display: flex;
            flex-direction: column;
        }

        // Bevel garbage
        .bevel.all {
            background: var(--bevelBgColor);
            background:
                -moz-linear-gradient(45deg,  transparent 10px, var(--bevelBgColor) 10px),
                -moz-linear-gradient(135deg, transparent 10px, var(--bevelBgColor) 10px),
                -moz-linear-gradient(225deg, transparent 10px, var(--bevelBgColor) 10px),
                -moz-linear-gradient(315deg, transparent 10px, var(--bevelBgColor) 10px);
            background:
                -o-linear-gradient(45deg,  transparent 10px, var(--bevelBgColor) 10px),
                -o-linear-gradient(135deg, transparent 10px, var(--bevelBgColor) 10px),
                -o-linear-gradient(225deg, transparent 10px, var(--bevelBgColor) 10px),
                -o-linear-gradient(315deg, transparent 10px, var(--bevelBgColor) 10px);
            background:
                -webkit-linear-gradient(45deg,  transparent 10px, var(--bevelBgColor) 10px),
                -webkit-linear-gradient(135deg, transparent 10px, var(--bevelBgColor) 10px),
                -webkit-linear-gradient(225deg, transparent 10px, var(--bevelBgColor) 10px),
                -webkit-linear-gradient(315deg, transparent 10px, var(--bevelBgColor) 10px);
        }
        .bevel.tlbr {
            background: var(--bevelBgColor);
            background:
                -moz-linear-gradient(45deg,  var(--bevelBgColor) 10px, var(--bevelBgColor) 10px),
                -moz-linear-gradient(135deg, transparent 10px, var(--bevelBgColor) 10px),
                -moz-linear-gradient(225deg, var(--bevelBgColor) 10px, var(--bevelBgColor) 10px),
                -moz-linear-gradient(315deg, transparent 10px, var(--bevelBgColor) 10px);
            background:
                -o-linear-gradient(45deg,  var(--bevelBgColor) 10px, var(--bevelBgColor) 10px),
                -o-linear-gradient(135deg, transparent 10px, var(--bevelBgColor) 10px),
                -o-linear-gradient(225deg, var(--bevelBgColor) 10px, var(--bevelBgColor) 10px),
                -o-linear-gradient(315deg, transparent 10px, var(--bevelBgColor) 10px);
            background:
                -webkit-linear-gradient(45deg,  var(--bevelBgColor) 10px, var(--bevelBgColor) 10px),
                -webkit-linear-gradient(135deg, transparent 10px, var(--bevelBgColor) 10px),
                -webkit-linear-gradient(225deg, var(--bevelBgColor) 10px, var(--bevelBgColor) 10px),
                -webkit-linear-gradient(315deg, transparent 10px, var(--bevelBgColor) 10px);
        }
        .bevel.trbl {
            background: var(--bevelBgColor);
            background:
                -moz-linear-gradient(45deg,  transparent 10px, var(--bevelBgColor) 10px),
                -moz-linear-gradient(135deg, var(--bevelBgColor) 10px, var(--bevelBgColor) 10px),
                -moz-linear-gradient(225deg, transparent 10px, var(--bevelBgColor) 10px),
                -moz-linear-gradient(315deg, var(--bevelBgColor) 10px, var(--bevelBgColor) 10px);
            background:
                -o-linear-gradient(45deg,  transparent 10px, var(--bevelBgColor) 10px),
                -o-linear-gradient(135deg, var(--bevelBgColor) 10px, var(--bevelBgColor) 10px),
                -o-linear-gradient(225deg, transparent 10px, var(--bevelBgColor) 10px),
                -o-linear-gradient(315deg, var(--bevelBgColor) 10px, var(--bevelBgColor) 10px);
            background:
                -webkit-linear-gradient(45deg,  transparent 10px, var(--bevelBgColor) 10px),
                -webkit-linear-gradient(135deg, var(--bevelBgColor) 10px, var(--bevelBgColor) 10px),
                -webkit-linear-gradient(225deg, transparent 10px, var(--bevelBgColor) 10px),
                -webkit-linear-gradient(315deg, var(--bevelBgColor) 10px, var(--bevelBgColor) 10px);
        }
        .bevel.tr {
            background: var(--bevelBgColor);
            background:
                -moz-linear-gradient(45deg,  var(--bevelBgColor) 10px, var(--bevelBgColor) 10px),
                -moz-linear-gradient(135deg, var(--bevelBgColor) 10px, var(--bevelBgColor) 10px),
                -moz-linear-gradient(225deg, transparent 10px, var(--bevelBgColor) 10px),
                -moz-linear-gradient(315deg, var(--bevelBgColor) 10px, var(--bevelBgColor) 10px);
            background:
                -o-linear-gradient(45deg,  var(--bevelBgColor) 10px, var(--bevelBgColor) 10px),
                -o-linear-gradient(135deg, var(--bevelBgColor) 10px, var(--bevelBgColor) 10px),
                -o-linear-gradient(225deg, transparent 10px, var(--bevelBgColor) 10px),
                -o-linear-gradient(315deg, var(--bevelBgColor) 10px, var(--bevelBgColor) 10px);
            background:
                -webkit-linear-gradient(45deg,  var(--bevelBgColor) 10px, var(--bevelBgColor) 10px),
                -webkit-linear-gradient(135deg, var(--bevelBgColor) 10px, var(--bevelBgColor) 10px),
                -webkit-linear-gradient(225deg, transparent 10px, var(--bevelBgColor) 10px),
                -webkit-linear-gradient(315deg, var(--bevelBgColor) 10px, var(--bevelBgColor) 10px);
        }
        .bevel.all, .bevel.trbl, .bevel.tlbr, .bevel.tr {
            background-position: bottom left, bottom right, top right, top left;
            -moz-background-size: 50% 50%;
            -webkit-background-size: 50% 50%;
            background-size: 50% 50%;
            background-repeat: no-repeat;
            margin-bottom: 15px;
            padding: 15px;
        }

        #header {
            justify-content: space-between;
            height: 10%;
            font-weight: bold;
            font-size: 125%;
        }

        #upperDetails {
            height: 40%;
            font-size: 130%;
        }

        #mainDetails {
            width: 70%;
        }
        #mainDetails div {
            height: 30%;
        }

        #lowerDetails {
            height: 50%;
            font-size: 140%;
        }

        #image {
            width: 30%;
            object-fit: contain;
            margin-left: 10px;
            padding-bottom: 15px;
        }

        #attributes {
            justify-content: space-around;
        }

        #damage {
            justify-content: space-around;
        }

        #name {
        }

        #pvContainer {
        }

        #structureSpecials {
            width: 60%;
        }
        
        #health {
            height: 40%;
            justify-content: space-between;
        }

        #special {
            height: 60%;
            word-wrap: break-word;
        }

        #criticalsContainer {
            width: 40%;
            display: flex;
            flex-direction: column;
            margin-left: 10px;
            align-items: center;
        }

        #criticals {
            width: 100%;
            height: 100%;
            display: flex;
        }
    </style>
    <div id="cardBody" class="spacedColumn">
        <div id="header" class="spacedRow">
            <div id="name" class="spacedColumn bevel trbl">
            </div>
            <vpl-label prefix="PV:" id="pvContainer" class="bevel trbl">
                <div id="pv" slot="content"></div>
            </vpl-label>
        </div>
        <div id="upperDetails" class="spacedRow">
            <div class="spacedColumn" id="mainDetails">
                <div id="attributes" class="spacedRow bevel trbl">
                    <vpl-label prefix="TP:">
                        <div id="type" slot="content">
                        </div>
                    </vpl-label>
                    <vpl-label prefix="SZ:">
                        <div id="size" slot="content">
                        </div>
                    </vpl-label>
                    <vpl-label prefix="TMM:">
                        <div id="tmm" slot="content">
                        </div>
                    </vpl-label>
                    <vpl-label prefix="MV:">
                        <div id="movement" slot="content">
                        </div>
                    </vpl-label>
                    <vpl-label prefix="Role:">
                        <div id="role" slot="content">
                        </div>
                    </vpl-label>
                    <vpl-label prefix="Skill:">
                        <div id="skill" slot="content">
                        </div>
                    </vpl-label>
                </div>
                <div id="damage" class="spacedRow bevel trbl">
                    <vpl-label prefix="S(+0)">
                        <div id="short" slot="content"></div>
                    </vpl-label>
                    <vpl-label prefix="M(+2)">
                        <div id="medium" slot="content"></div>
                    </vpl-label>
                    <vpl-label prefix="L(+4)">
                        <div id="long" slot="content"></div>
                    </vpl-label>
                </div>
                <div id="heat" class="spacedRow bevel trbl">
                    <vpl-label prefix="OV:">
                        <div id="overheat" slot="content"></div>
                    </vpl-label>
                    <vpl-label prefix="Heat Scale">
                        <vpl-pips id="heatScale" slot="content" total-pips="4" marked="0"></vpl-pips>
                    </vpl-label>
                </div>
            </div>
            <img id="image"></img>
        </div>
        <div id="lowerDetails" class="spacedRow">
            <div id="structureSpecials" class="spacedColumn">
                <div id="health" class="spacedColumn bevel trbl">
                    <vpl-label prefix="A">
                        <vpl-pips id="armor" slot="content" mode="subtractive"></vpl-pips>
                    </vpl-label>
                    <vpl-label prefix="S">
                        <vpl-pips id="structure" slot="content" mode="subtractive"></vpl-pips>
                    </vpl-label>    
                </div>
                <div id="special" class="bevel trbl"></div>
            </div>
            <vpl-label prefix="CRITICAL HITS"  id="criticalsContainer" class=" bevel trbl">
                <div id="criticals" slot="content"></div>
            </vpl-label>
        </div>
    </div>
`;

export default class UnitCard extends HTMLElement {
    static get template() {
      return template;
    }

    constructor() {
        super();

        this.attachShadow({mode: "open"}).appendChild(this.constructor.template.content.cloneNode(true));

        this.nameElem = this.shadowRoot.getElementById("name");
        this.pvElem = this.shadowRoot.getElementById("pv");
        this.typeElem = this.shadowRoot.getElementById("type");
        this.sizeElem = this.shadowRoot.getElementById("size");
        this.movementModifierElem = this.shadowRoot.getElementById("tmm");
        this.movementElem = this.shadowRoot.getElementById("movement");
        this.roleElem = this.shadowRoot.getElementById("role");
        this.skillElem = this.shadowRoot.getElementById("skill");
        this.shortElem = this.shadowRoot.getElementById("short");
        this.mediumElem = this.shadowRoot.getElementById("medium");
        this.longElem = this.shadowRoot.getElementById("long");

        this.armorElem = this.shadowRoot.getElementById("armor");
        this.structureElem = this.shadowRoot.getElementById("structure");

        this.overheatElem = this.shadowRoot.getElementById("overheat");

        this.specialElem = this.shadowRoot.getElementById("special");

        this.criticalsElem = this.shadowRoot.getElementById("criticals");

        this.imageElem = this.shadowRoot.getElementById("image");

        this._data = null;
    }

    set data(val) {
        // TODO: fix bug where setting this immediately breaks the pips
        setTimeout(() => {
            if (val !== this._data) {
                this._data = val;
                this.nameElem.textContent = val.name;
                this.typeElem.textContent = val.type;
                this.sizeElem.textContent = val.size;
                this.movementElem.textContent = val.movement;
                this.roleElem.textContent = val.role;
                this.skillElem.textContent = val.skill;
                this.shortElem.textContent = val.damage.short;
                this.mediumElem.textContent = val.damage.medium;
                this.longElem.textContent = val.damage.long;
                this.armorElem.totalPips = val.armor;
                this.structureElem.totalPips = val.structure;
                this.overheatElem.textContent = val.overheat || 0;
                this.specialElem.textContent = `Special: ${val.special.split(",").join(", ")}`;
                this.imageElem.src = val.image;
                let critElem = null;
                switch (val.type) {
                    case "BM": critElem = document.createElement("vpl-mech-crit-chart"); break;
                }
                if (critElem) {
                    this.criticalsElem.appendChild(critElem);
                }
                // TODO: look and see if these numbers are driven by a formula, use that if they are.
                let skillMod = 1;
                switch (val.skill) {
                    case 0: skillMod = 2.63; break;
                    case 1: skillMod = 2.24; break;
                    case 2: skillMod = 1.82; break;
                    case 3: skillMod = 1.38; break;
                    case 4: skillMod = 1.0; break;
                    case 5: skillMod = 0.86; break;
                    case 6: skillMod = 0.77; break;
                    case 7: skillMod = 0.68; break;
                }
                this.pvElem.textContent = Math.round(val.pv * skillMod);
                let tmm = 1;
                const movement = parseInt(val.movement);
                if (movement < 5) {
                    tmm = 0
                }
                else if (movement < 9) {
                    tmm = 1;
                }
                else if (movement < 13) {
                    tmm = 2;
                }
                else if (movement < 19) {
                    tmm = 3;
                }
                else if (movement < 35) {
                    tmm = 4;
                }
                else if (movement >= 35) {
                    tmm = 5;
                }
                this.movementModifierElem.textContent = tmm;
            }
        }, 1);
    }

    get data () {
        return this._data;
    }
}

customElements.define("unit-card", UnitCard);