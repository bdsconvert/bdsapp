import { codelist } from "../data/bdscodelist.js";
import { BdsSelect, BdsAddDelButtons } from "./bdselements.js";
import { bdsoe } from "../data/bdsmodel.js";

export class BdsProductComposition extends HTMLElement {
  constructor() {
    super();
    this.order = parseInt(this.getAttribute("order"), 10);
    this.numpid = 1;
    this.pctyp = { name: "ProductComposition", id: `C${this.order + 1}-DescriptiveDetail_0_ProductComposition_0`, data: "" };
    this.pftyp = { name: "ProductForm", id: `C${this.order + 2}-DescriptiveDetail_0_ProductForm_0`, data: "" };
    this.pfdtyp = { name: "ProductFormDetail", id: "", data: "" };
  }

  connectedCallback() {
    document.getElementById("pcf").addEventListener("click", (e) => {
      if (this.innerHTML === "") {
        this.addPC();
      }
    });

    this.addEventListener("change", (e) => {
      bdsoe[e.target.id] = e.target.value;
    });

    this.addEventListener("click", (e) => {
      if (e.target.id === "addPFD") {
        this.numpid++;
        this.addPC();
      } else if (e.target.id === "delPFD") {
        delete bdsoe[this.pfdtyp.id];
        this.numpid--;
        this.addPC();
      }
    });
  }

  addPC = () => {
    this.pctyp.data = bdsoe[this.pctyp.id];
    this.pftyp.data = bdsoe[this.pftyp.id];
    this.innerHTML = `
      ${BdsSelect(this.pctyp, codelist.cl002)}
      ${BdsSelect(this.pftyp, codelist.cl150)}
    `;
    for (let idx = 0; idx < this.numpid; idx++) {
      this.lbl = `ProductFormDetail${this.numpid}`;
      this.pfdtyp.id = `C${this.order + idx + 3}-DescriptiveDetail_0_ProductFormDetail_${idx}`;
      this.pfdtyp.data = bdsoe[this.pfdtyp.id];
      this.innerHTML += `${BdsSelect(this.pfdtyp, codelist.cl175)}`;
    }
    this.innerHTML += `${BdsAddDelButtons("PFD", "PFD")}`;
    M.FormSelect.init(document.querySelectorAll("select"));
  };
}

window.customElements.define("bds-product-composition", BdsProductComposition);
