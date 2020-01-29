import * as unitHelper from "../../src/unitHelper.js";

const template = document.createElement("template");
template.innerHTML = `
    <style>
        :host {
            display: flex;
            background-color: var(--nonInteractiveElementBackgroundColor);
            color: var(--nonInteractiveElementBackgroundFontColor);
        }
    </style>
    <div id="name">
    </div>
    <div id="role"> 
    </div>
    <div id="size"> 
    </div>
    <div id="move">
    </div>
    <div id="health">
    </div>
    <div id="damage">
    </div>
    <div id="skill">
    </div>
    <div id="notes">
    </div>
    <div id="pv">
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
        this.roleElem = this.shadowRoot.getElementById("role");
        this.sizeElem = this.shadowRoot.getElementById("size");
        this.moveElem = this.shadowRoot.getElementById("move");
        this.healthElem = this.shadowRoot.getElementById("health");
        this.damageElem = this.shadowRoot.getElementById("damage");
        this.skillElem = this.shadowRoot.getElementById("skill");
        this.notesElem = this.shadowRoot.getElementById("notes");
        this.pvElem = this.shadowRoot.getElementById("pv");

        this._data = null;
    }

    set data(val) {
        if (val !== this._data) {
            this._data = val;
            this.nameElem.textContent = val.name;
            this.noteElem.textContent = val.note;
            this.sizeElem.textContent = val.size;
            this.moveElem.textContent = val.movement;
            this.roleElem.textContent = val.role;
            this.skillElem.textContent = val.skill;
            this.damageElem.textContent = `${val.damage.short || "-"}/${val.damage.medium || "-"}/${val.damage.long || "-"}`;
            this.healthElem.textContent = `${val.totalArmor}/${val.totalStructure}`;
            this.pvElem.textContent = unitHelper.calculatePointValue(val.pv, val.skill);
        }
    }

    get data () {
        return this._data;
    }

    handleUnitAttributesChanged (event) {
        this.data[event.target.id] = event.detail.value;
        this.dispatchEvent(new CustomEvent("dataUpdated", {detail: {data: this.data}}));
    }
}

customElements.define("unit-card", UnitCard);