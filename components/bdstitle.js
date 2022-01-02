import { codelist } from "../data/bdscodelist.js";
import { BdsText, BdsSelect } from "./bdselements.js";
import { bdsoe } from "../data/bdsmodel.js";

export class BdsTitle extends HTMLElement {
  constructor() {
    super();
    this.order = parseInt(this.getAttribute("order"), 20);
    this.numpid = 1;
    this.titletyp = {
      name: "TitleType",
      id: `D${this.order + 1}-DescriptiveDetail_0_TitleDetail_0_TitleType_0`,
      data: bdsoe[`D${this.order + 1}-DescriptiveDetail_0_TitleDetail_0_TitleType_0`]
    };
    this.titleel = {
      name: "TitleElementLevel",
      id: `D${this.order + 2}-DescriptiveDetail_0_TitleDetail_0_TitleElement_0_TitleElementLevel_0`,
      data: bdsoe[`D${this.order + 2}-DescriptiveDetail_0_TitleDetail_0_TitleElement_0_TitleElementLevel_0`]
    };
    this.titletxt = {
      name: "TitleText",
      id: `D${this.order + 3}-DescriptiveDetail_0_TitleDetail_0_TitleElement_0_TitleText_0`,
      data: bdsoe[`D${this.order + 3}-DescriptiveDetail_0_TitleDetail_0_TitleElement_0_TitleText_0`]
    };
    this.titlest = {
      name: "Subtitle",
      id: `D${this.order + 4}-DescriptiveDetail_0_TitleDetail_0_TitleElement_0_Subtitle_0`,
      data: bdsoe[`D${this.order + 4}-DescriptiveDetail_0_TitleDetail_0_TitleElement_0_Subtitle_0`]
    };
  }

  connectedCallback() {
    document.getElementById("ttl").addEventListener("click", (e) => {
      if (this.innerHTML === "") {
        this.innerHTML = `
          ${BdsSelect(this.titletyp, codelist.cl015)}
          ${BdsSelect(this.titleel, codelist.cl149)}
          ${BdsText(this.titletxt)}
          ${BdsText(this.titlest)}      
        `;
        M.FormSelect.init(document.querySelectorAll("select"));
      }
    });

    this.addEventListener("change", (e) => {
      bdsoe[e.target.id] = e.target.value;
    });
  }
}

window.customElements.define("bds-title", BdsTitle);
