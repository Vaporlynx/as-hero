const template = document.createElement("template");
template.innerHTML = `
    <style>
        :host {
            width: 700px;
            height: 500px;
            display: flex;
            background-color: #a7adbf;
        }
        #cardBody {
            height: 100%;
            width: 100%;
        }
    
        .spacedRow {
            display: flex;
            flex-direction: row;
        }
    
        .spacedColumn {
            display: flex;
            flex-direction: column;
        }

        #header {
            height: 50px;
            justify-content: space-between;
        }

        #upperDetails {
            height: 200px;
        }

        #mainDetails {
            width: 400px;
        }

        #image {
            object-fit: contain;
            height: inherit;
        }
    </style>
    <div id="cardBody" class="spacedColumn">
        <div id="header" class="spacedRow">
            <div id="name" class="spacedColumn">
            </div>
            <vpl-label prefix="PV:">
            <div id="pv" slot="content">
            </div>
        </div>
        <div id="upperDetails" class="spacedRow">
            <div class="spacedColumn" id="mainDetails">
                <div id="attributes" class="spacedRow">
                    <div id="type">
                    </div>
                    <div id="size">
                    </div>
                    <div id="tmm">
                    </div>
                    <vpl-label prefix="MV:">
                        <div id="movement" slot="content">
                        </div>
                    </vpl-label>
                    <div id="role">
                    </div>
                    <div id="skill">
                    </div>
                </div>
                <div id="damage" class="spacedRow">
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
                <div id="heat" class="spacedRow">
                    <div id="overheat>
                    </div>
                    <div id="heatScale">
                    </div>
                </div>
            </div>
            <img id="image"></img>
        </div>
        <div id="lowerDetails" class="spacedRow">
            <div id="structureSpecials" class="spacedRow">
                <div id="health" class="spacedColumn">
                <vpl-label prefix="A">
                    <vpl-pips id="armor" slot="content"></vpl-pips>
                </vpl-label>
                <vpl-label prefix="S">
                    <vpl-pips id="structure" slot="content"></vpl-pips>
                </vpl-label>    
                </div>
            </div>
            <div id="criticals" class="spacedColumn">
                <div>
                    Critical Hits
                </div>
            </div>
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

        this.movementElem = this.shadowRoot.getElementById("movement");

        this.shortElem = this.shadowRoot.getElementById("short");
        this.mediumElem = this.shadowRoot.getElementById("medium");
        this.longElem = this.shadowRoot.getElementById("long");

        this.armorElem = this.shadowRoot.getElementById("armor");
        this.structureElem = this.shadowRoot.getElementById("structure");

        this.imageElem = this.shadowRoot.getElementById("image");

        this._data = null;
    }

    set data(val) {
        // WTF? setting data before constructors have had a chance to run?
        setTimeout(() => {
            if (val !== this._data) {
                this._data = val;
                this.nameElem.textContent = val.name;
                this.pvElem.textContent = val.pv;
                this.armorElem.totalPips = val.armor;
                this.structureElem.totalPips = val.structure;
                this.shortElem.textContent = val.damage.short;
                this.mediumElem.textContent = val.damage.medium;
                this.longElem.textContent = val.damage.long;
                this.movementElem.textContent = val.movement;
                this.imageElem.src = val.image;
            }
        }, 1);
    }

    get data () {
        return this.data;
    }
}

customElements.define("unit-card", UnitCard);