import {default as rosterPage} from "./roster.js";

export default class gearRosterPage extends rosterPage {
    constructor() {
        super();

        this.unitCard = "unit-card";
        this.rosterCounterpart = "roster";
        this.searchPage = "gear-search";
    }
}

customElements.define("gear-roster-page", gearRosterPage);