import { codelist } from "../data/bdscodelist.js";
import { BdsText, BdsSelect } from "./bdselements.js";
import { bdsoe } from "../data/bdsmodel.js";
import { xml2json, json2xml, flatten, unflatten, formatJson, formatXml } from "../utils/bdsutil.js";

export class BdsRoot extends HTMLElement {
  constructor() {
    super();
    this.bdsroot = {};
    this.order = parseInt(this.getAttribute("order"), 10);
    this.numpid = 1;
    this.lbl = `ProductIdentifier${this.numpid}`;
    this.recref = { name: "RecordReference", id: `A${this.order + 1}-RecordReference_0`, data: bdsoe[`A${this.order + 1}-RecordReference_0`] };
    this.ntftyp = { name: "NotificationType", id: `A${this.order + 2}-NotificationType_0`, data: bdsoe[`A${this.order + 2}-NotificationType_0`] };
    this.bdsroot[this.recref.id] = this.recref.data;
    this.bdsroot[this.ntftyp.id] = this.ntftyp.data;
    console.log(this.bdsroot);
  }

  connectedCallback() {
    this.addEventListener("change", (e) => {
      bdsoe[e.target.id] = e.target.value;
      this.bdsroot[e.target.id] = e.target.value;
      this.viewOnixFragment();
    });

    document.getElementById("rrf").addEventListener("click", (e) => {
      if (this.innerHTML === "") {
        this.innerHTML = `${BdsText(this.recref)} ${BdsSelect(this.ntftyp, codelist.cl001)}<p id="bdsroot" style="font-size:0.9rem;"></p>`;
        M.FormSelect.init(document.querySelectorAll("select"));
        this.viewOnixFragment();
      }
    });
  }

  viewOnixFragment = () => {
    let r = Object.fromEntries(Object.entries(this.bdsroot).sort());
    r = Object.entries(r).map((p) => {
      return [p[0].slice(p[0].indexOf("-") + 1), p[1]];
    });
    document.getElementById("bdsroot").innerHTML = formatXml("<Product>" + json2xml(unflatten(Object.fromEntries(r))) + "</Product>");
  };
}

window.customElements.define("bds-root", BdsRoot);
