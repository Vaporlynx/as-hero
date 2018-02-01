const template = document.createElement("template");
template.innerHTML = `
    <style>
        :host {
            width: 400px;
            height: 25px;
            display: flex;
            background-color: #a7adbf;
        }
        #cardBody {
            height: 100%;
            width: 100%;
        }
    </style>
    <div id="cardBody" class="spaced-column">
        <div id="header" class="spaced-row">
            <div id="name" class="spaced-column">
            </div>
            <div id="pv">
            </div>
        </div>
        <div id="upperDetails" class="spaced-row">
            <div class="spaced-column">
                <div id="attributes" class="spaced-row">
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
                <div id="damage" class="spaced-row">
                    <div id="short">
                    </div>
                    <div id="medium">
                    </div>
                    <div id="long">
                    </div>
                </div>
                <div id="heat" class="spaced-row">
                    <div id="overheat>
                    </div>
                    <div id="heatScale">
                    </div>
                </div>
            </div>
            <div id="pictureContainer">
            </div>
        </div>
        <div id="lowerDetails" class="spaced-row">
            <div id="stuctureSpecials" class="spaced-row">
                <div id="health" class="spaced-column">
                    <div id="armor" class="spaced-row">
                    </div>
                    <div id="stucture" class="spaced-row"
                    </div>
                </div>
            </div>
            <div id="criticals" class="spaced-column">
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

        this.cardBodyElem = this.shadowRoot.getElementById("cardBody");

        this._data = null;
    }

    set data(val) {
        if (val !== this._data) {
            this._data = val;
            this.cardBodyElem.textContent = `${val.name}`;
        }
    }

    get data () {
        return this.data;
    }
}
customElements.define("unit-card", UnitCard);