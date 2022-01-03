import { codelist } from "../data/bdscodelist.js";
import { BdsSelect } from "./bdselements.js";
import { bdsoe } from "../data/bdsmodel.js";

export class BdsEditionLanguage extends HTMLElement {
  constructor() {
    super();
    this.order = parseInt(this.getAttribute("order"), 10);
    this.numpid = 1;
    this.edittyp = { name: "EditionType", id: `F${this.order + 1}-DescriptiveDetail_0_EditionType_0`, data: "" };
    this.langrole = { name: "LanguageRole", id: `F${this.order + 2}-DescriptiveDetail_0_LanguageRole_0`, data: "" };
    this.langcode = { name: "LanguageCode", id: `F${this.order + 3}-DescriptiveDetail_0_LanguageCode_0`, data: "" };
  }

  connectedCallback() {
    document.getElementById("eln").addEventListener("click", (e) => {
      if (this.innerHTML === "") {
        this.edittyp.data = bdsoe[this.edittyp.id];
        this.langrole.data = bdsoe[this.langrole.id];
        this.langcode.data = bdsoe[this.langcode.id];
        this.innerHTML = `
        ${BdsSelect(this.edittyp, codelist.cl021)}
        ${BdsSelect(this.langrole, codelist.cl022)}
        ${BdsSelect(this.langcode, codelist.cl074)}
      `;
        M.FormSelect.init(document.querySelectorAll("select"));
      }
    });

    this.addEventListener("change", (e) => {
      bdsoe[e.target.id] = e.target.value;
    });
  }
}

window.customElements.define("bds-edition-language", BdsEditionLanguage);
