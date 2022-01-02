import { codelist } from "../data/bdscodelist.js";
import { BdsText, BdsSelect } from "./bdselements.js";
import { bdsoe } from "../data/bdsmodel.js";

export class BdsRoot extends HTMLElement {
  constructor() {
    super();
    this.order = parseInt(this.getAttribute("order"), 10);
    this.numpid = 1;
    this.lbl = `ProductIdentifier${this.numpid}`;
    this.recref = {
      name: "RecordReference",
      id: `A${this.order + 1}-RecordReference_0`,
      data: bdsoe[`A${this.order + 1}-RecordReference_0`]
    };
    this.ntftyp = {
      name: "NotificationType",
      id: `A${this.order + 2}-NotificationType_0`,
      data: bdsoe[`A${this.order + 2}-NotificationType_0`]
    };
  }

  connectedCallback() {
    this.addEventListener("change", (e) => {
      bdsoe[e.target.id] = e.target.value;
    });

    document.getElementById("rrf").addEventListener("click", (e) => {
      if (this.innerHTML === "") {
        this.innerHTML = `${BdsText(this.recref)} ${BdsSelect(this.ntftyp, codelist.cl001)}`;
        M.FormSelect.init(document.querySelectorAll("select"));
      }
    });
  }
}

window.customElements.define("bds-root", BdsRoot);
