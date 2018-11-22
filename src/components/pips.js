const template = document.createElement("template");
template.innerHTML = `
    <style>
        :host {
            display: flex;
            --activePipColor: var(--interactiveElementBackgroundColorActive);
            --inactivePipColor: var(--interactiveElementBackgroundColor);
            --hoverPipColor: var(--interactiveElementHoverBackgroundColor);
            --pipIndent: .2em;
            --pipHeight: 1em;
            --pipWidth: 1em;
        }

        .disabled {
            pointer-events: none;
        }

        #pipsContainer {
            display: flex;
        }

        .pip {
            height: var(--pipHeight);
            width: var(--pipWidth);
            background-color: var(--inactivePipColor);
            clip-path: polygon(var(--pipIndent) 0, calc(100% - var(--pipIndent)) 0, 100% var(--pipIndent), calc(100% - var(--pipIndent)) 100%, var(--pipIndent) 100%, 0 calc(100% - var(--pipIndent)));
            padding: calc(var(--pipIndent) / 2);
        }
        .pip:hover {
            background-color: var(--hoverPipColor);
        }

        .checked {
            background-color: var(--activePipColor);
        }
    </style>
    <div id="pipsContainer"></div>
`;

export default class pips extends HTMLElement {
    static get template() {
      return template;
    }

    static get observedAttributes() {
        return ["total-pips", "mode", "marked"];
    }

    constructor() {
        super();

        this.attachShadow({mode: "open"}).appendChild(this.constructor.template.content.cloneNode(true));

        this.pipsContainerElem = this.shadowRoot.getElementById("pipsContainer");

        this._totalPips = 0;
        this._mode = "individual";
        this._marked = 0;
    }

    attributeChangedCallback(name, oldValue, newValue) {
        switch (name) {
            case "total-pips": this.totalPips = newValue; break;
            case "mode": this.mode = newValue; break;
            case "marked": this.marked = parseInt(newValue); break;
        }
    }

    set totalPips (val) {
        if (val !== this._totalPips) {
            while (this.pipsContainerElem.hasChildNodes()) {
                this.pipsContainerElem.removeChild(this.pipsContainerElem.lastChild);
            }

            this._totalPips = val;
            for (let i = 0; i < val; i++) {
                const pip = document.createElement("div");
                pip.classList.add("pip");
                if (this.mode === "individual") {
                    pip.addEventListener("click", event => {
                        const index = [...this.pipsContainerElem.children].indexOf(event.target) + 1;
                        const offset = this.marked === index ? -1 : 0;
                        this.marked = index + offset;
                        this.dispatchEvent(new CustomEvent("change", {detail: {value: this.marked}}));
                    });
                }
                else {
                    pip.classList.add("disabled");
                }
                pip.checked = true;
                this.pipsContainerElem.appendChild(pip);
            }
            if (["additive", "subtractive"].includes(this.mode)) {
                this.addEventListener("click", event => {
                    this.marked = event.offsetX > this.clientWidth / 2 ? this.marked + 1 : this.marked - 1;
                    this.dispatchEvent(new CustomEvent("change", {detail: {value: this.marked}}));
                });
            }
            if (this.mode === "subtractive") {
                this.marked = this.totalPips;
            }
        }
    }

    get totalPips () {
        return this._totalPips;
    }

    set marked (val) {
        val = Math.max(0, Math.min(val, this.totalPips));
        for (let i = 0; i < this.totalPips; i++) {
            this.pipsContainerElem.children[i].classList.toggle("checked", false);
        }
        for (let i = 0; i < val; i++) {
            this.pipsContainerElem.children[i].classList.toggle("checked", true);
        }
        this._marked = val;
    }

    get marked () {
        return this._marked;
    }

    set mode (val) {
        if (this._mode !== val) {
            this._mode = val;
            // Trigger rebuild if needed
            if (this.totalPips !== 0) {
                this.totalPips = this.totalPips;
            }
        }
    }

    get mode () {
        return this._mode;
    }

}

customElements.define("vpl-pips", pips);