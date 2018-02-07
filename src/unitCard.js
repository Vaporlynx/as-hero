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
        }
    </style>
    <div id="cardBody" class="spacedColumn">
        <div id="header" class="spacedRow">
            <div id="name" class="spacedColumn">
            </div>
            <div id="pv">
            </div>
        </div>
        <div id="upperDetails" class="spacedRow">
            <div class="spacedColumn">
                <div id="attributes" class="spacedRow">
                    <div id="type">
                    </div>
                    <div id="size">
                    </div>
                    <div id="tmm">
                    </div>
                    <div id="movement">
                    </div>
                    <div id="role">
                    </div>
                    <div id="skill">
                    </div>
                </div>
                <div id="damage" class="spacedRow">
                    <div id="short">
                    </div>
                    <div id="medium">
                    </div>
                    <div id="long">
                    </div>
                </div>
                <div id="heat" class="spacedRow">
                    <div id="overheat>
                    </div>
                    <div id="heatScale">
                    </div>
                </div>
            </div>
            <div id="pictureContainer">
            </div>
        </div>
        <div id="lowerDetails" class="spacedRow">
            <div id="structureSpecials" class="spacedRow">
                <div id="health" class="spacedColumn">
                <vpl-label suffix="A">
                    <vpl-pips id="armor"></vpl-pips>
                </vpl-label>
                <vpl-label suffix="S">
                    <vpl-pips id="structure"></vpl-pips>
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
        this.armorElem = this.shadowRoot.getElementById("armor");
        this.structureElem = this.shadowRoot.getElementById("structure");

        this._data = null;
    }

    set data(val) {
        // WTF? setting data before constructors have had a chance to run?
        setTimeout(() => {
            if (val !== this._data) {
                this._data = val;
                this.nameElem.textContent = `${val.name}`;
                this.armorElem.totalPips = val.armor;
                this.structureElem.totalPips = val.structure;
            }
        }, 1);
    }

    get data () {
        return this.data;
    }
}

customElements.define("unit-card", UnitCard);