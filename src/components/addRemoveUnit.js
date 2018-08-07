const template = document.createElement("template");
template.innerHTML = `
    <style>
        :host {
            display: flex;
            width: 200px;
            height: 50px;
            background-color: #3d3d4e;    
            position: absolute;
            bottom: 0px;
            right: 0px;
            justify-content: space-between;
        }

        .disabled {
            pointer-events: none;
        }

        div {
            width: 48px;
            height: 48px;
            background-color: blue;
            font-size: 48px;
        }

        #mech {
            width: 40px;
        }
    </style>

    <div id="add">+</div>
    <img src="/assets/mech.svg" id="mech"></img>
    <div id="remove">-</div>
`;

export default class addRemoveUnits extends HTMLElement {
    static get template() {
      return template;
    }

    constructor() {
        super();

        this.attachShadow({mode: "open"}).appendChild(this.constructor.template.content.cloneNode(true));

        this.addElem = this.shadowRoot.getElementById("add");
        this.addElem.addEventListener("pointerdown", () => {
            this.dispatchEvent(new CustomEvent("unitAdded"), {detail: {}});
        });
        this.removeElem = this.shadowRoot.getElementById("remove");
        this.removeElem.addEventListener("pointerdown", () => {
            this.dispatchEvent(new CustomEvent("unitRemoved"), {detail: {}});
        });
    }
}

customElements.define("vpl-add-remove-units", addRemoveUnits);