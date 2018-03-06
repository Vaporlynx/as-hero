import * as urlHelper from "../../src/urlHelper.js";

const template = document.createElement("template");
template.innerHTML = `
    <style>
    </style>

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

        this.attachShadow({mode: "open"}).appendChild(this.constructor.template.content.cloneNode(true));

        this.rosterElem = this.shadowRoot.getElementById("roster");
    }
}

customElements.define("roster-page", rosterPage);