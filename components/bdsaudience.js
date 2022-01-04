import { codelist } from "../data/bdscodelist.js";
import { BdsText, BdsSelect, BdsAddDelButtons } from "./bdselements.js";
import { bdsoe } from "../data/bdsmodel.js";

export class BdsAudience extends HTMLElement {
  constructor() {
    super();
    this.order = parseInt(this.getAttribute("order"), 10);
    this.numpid = 1;
    this.audtyp = { name: "AudienceCodeType", id: "", data: "" };
    this.audval = { name: "AudienceCodeValue", id: "", data: "" };
    this.audrq = { name: "AudienceRangeQualifier", id: "", data: "" };
    this.audrp = { name: "AudienceRangePrecision", id: "", data: "" };
    this.audrv = { name: "AudienceRangeValue", id: "", data: "" };
  }

  connectedCallback() {
    document.getElementById("aud").addEventListener("click", (e) => {
      if (this.innerHTML === "") {
        this.addAud();
      }
    });

    this.addEventListener("change", (e) => {
      bdsoe[e.target.id] = e.target.value;
    });

    this.addEventListener("click", (e) => {
      if (e.target.id === "addAUD") {
        this.numpid = this.numpid < 2 ? this.numpid + 1 : 2;
        this.addAud();
      } else if (e.target.id === "delAUD") {
        delete bdsoe[this.audrq.id];
        delete bdsoe[this.audrp.id];
        delete bdsoe[this.audrv.id];
        this.numpid--;
        this.addAud();
      }
    });
  }

  addAud = () => {
    this.audtyp.id = `H${this.order + 1}-DescriptiveDetail_0_Audience_0_AudienceCodeType_0`;
    this.audtyp.data = bdsoe[this.audtyp.id];
    this.audval.id = `H${this.order + 2}-DescriptiveDetail_0_Audience_0_AudienceCodeValue_0`;
    this.audval.data = bdsoe[this.audval.id];
    this.innerHTML = `
      ${BdsSelect(this.audtyp, codelist.cl029)}
      ${BdsText(this.audval)}
    `;

    for (let idx = 0; idx < this.numpid; idx++) {
      this.innerHTML += `<h6 class="center">AudienceRange${idx + 1}</h6>`;
      this.audrq.id = `H${this.order + idx * 2 + 3}-DescriptiveDetail_0_AudienceRange_${idx}_AudienceRangeQualifier_0`;
      this.audrq.data = bdsoe[this.audrq.id];
      this.innerHTML += `${BdsSelect(this.audrq, codelist.cl030)}`;
      this.audrp.id = `H${this.order + idx * 2 + 4}-DescriptiveDetail_0_AudienceRange_${idx}_AudienceRangePrecision_0`;
      this.audrp.data = bdsoe[this.audrp.id];
      this.innerHTML += `${BdsSelect(this.audrp, codelist.cl031)}`;
      this.audrv.id = `H${this.order + idx * 2 + 5}-DescriptiveDetail_0_AudienceRange_${idx}_AudienceRangeValue_0`;
      this.audrv.data = bdsoe[this.audrv.id];
      this.innerHTML += `${BdsText(this.audrv)}`;
    }
    this.innerHTML += `${BdsAddDelButtons("AUD", "AUD")}`;
    M.FormSelect.init(document.querySelectorAll("select"));
  };
}

window.customElements.define("bds-audience", BdsAudience);
