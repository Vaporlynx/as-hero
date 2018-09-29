const template = document.createElement("template");
template.innerHTML = `
    <style>
        #body {
            width: 200px;
            height: 150px;
            background-color: red;
        }
    </style>
    <div id="body"></div>
`;

export default class CustomizeUnit extends HTMLElement {
    static get template() {
      return template;
    }

    static get observedAttributes() {
        return [];
    }

    constructor() {
        super();

        this.attachShadow({mode: "open"}).appendChild(this.constructor.template.content.cloneNode(true));

        this.bodyElem = this.shadowRoot.getElementById("body");
    }
}

customElements.define("vpl-customize-unit", CustomizeUnit);