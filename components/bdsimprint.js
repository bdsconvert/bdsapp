import { codelist } from "../data/bdscodelist.js";
import { bdsoe } from "../data/bdsmodel.js";
import { BdsSelect, BdsText, BdsAddDelButtons } from "./bdselements.js";

export class BdsImprint extends HTMLElement {
  constructor() {
    super();
    this.order = parseInt(this.getAttribute("order"), 10);
    this.numimp = 1;
    this.imptyp = { name: "ImprintIDType", id: "", data: "" };
    this.impitn = { name: "IDTypeName", id: "", data: "" };
    this.impval = { name: "IDValue", id: "", data: "" };
    this.impnam = { name: "ImprintName", id: "", data: "" };
  }

  connectedCallback() {
    document.getElementById("imp").addEventListener("click", (e) => {
      if (this.innerHTML === "") {
        this.addIMP();
      }
    });

    this.addEventListener("change", (e) => {
      bdsoe[e.target.id] = e.target.value;
    });

    this.addEventListener("click", (e) => {
      if (e.target.id === "addIMP") {
        this.numimp++;
        this.addIMP();
      } else if (e.target.id === "delIMP") {
        delete bdsoe[this.imptyp.id];
        delete bdsoe[this.impitn.id];
        delete bdsoe[this.impval.id];
        delete bdsoe[this.impnam.id];
        this.numimp--;
        this.addIMP();
      }
    });
  }

  addIMP = () => {
    this.innerHTML = "";
    for (let idx = 0; idx < this.numimp; idx++) {
      this.lbl = `Imprint${idx + 1}`;
      this.imptyp.id = `K${this.order + idx * 4 + 1}-PublishingDetail_0_Imprint_${idx}_ImprintIdentifier_0_ImprintIDType_0`;
      this.imptyp.data = bdsoe[this.imptyp.id];
      this.impitn.id = `K${this.order + idx * 4 + 2}-PublishingDetail_0_Imprint_${idx}_ImprintIdentifier_0_IDTypeName_0`;
      this.impitn.data = bdsoe[this.impitn.id];
      this.impval.id = `K${this.order + idx * 4 + 3}-PublishingDetail_0_Imprint_${idx}_ImprintIdentifier_0_IDValue_0`;
      this.impval.data = bdsoe[this.impval.id];
      this.impnam.id = `K${this.order + idx * 4 + 4}-PublishingDetail_0_Imprint_${idx}_ImprintName_0`;
      this.impnam.data = bdsoe[this.impnam.id];
      this.innerHTML += `
        <h6 class="center">${this.lbl}</h6>
        ${BdsSelect(this.imptyp, codelist.cl044)}
        ${BdsText(this.impitn)}
        ${BdsText(this.impval)}
        ${BdsText(this.impnam)}
      `;
    }
    this.innerHTML += `${BdsAddDelButtons("IMP", "IMP")}`;
    M.FormSelect.init(document.querySelectorAll("select"));
  };
}

window.customElements.define("bds-imprint", BdsImprint);
