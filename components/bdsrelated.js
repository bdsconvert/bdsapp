import { codelist } from "../data/bdscodelist.js";
import { bdsoe } from "../data/bdsmodel.js";
import { BdsSelect, BdsText, BdsAddDelButtons } from "./bdselements.js";

export class BdsRelated extends HTMLElement {
  constructor() {
    super();
    this.order = parseInt(this.getAttribute("order"), 10);
    this.numrel = 1;
    this.relprc = { name: "ProductRelationCode", id: "", data: "" };
    this.relpid = { name: "ProductIDType", id: "", data: "" };
    this.relpiv = { name: "IDValue", id: "", data: "" };
    this.relpfc = { name: "ProductForm", id: "", data: "" };
    this.relpfd = { name: "ProductFormDetail", id: "", data: "" };
  }

  connectedCallback() {
    document.getElementById("rel").addEventListener("click", (e) => {
      if (this.innerHTML === "") {
        this.addREL();
      }
    });

    this.addEventListener("change", (e) => {
      bdsoe[e.target.id] = e.target.value;
    });

    this.addEventListener("click", (e) => {
      if (e.target.id === "addREL") {
        this.numrel++;
        this.addREL();
      } else if (e.target.id === "delREL") {
        delete bdsoe[this.relprc.id];
        delete bdsoe[this.relpid.id];
        delete bdsoe[this.relpiv.id];
        delete bdsoe[this.relpfc.id];
        delete bdsoe[this.relpfd.id];
        this.numrel--;
        this.addREL();
      }
    });
  }

  addREL = () => {
    this.innerHTML = "";
    for (let idx = 0; idx < this.numrel; idx++) {
      this.lbl = `RelatedProduct${idx + 1}`;
      this.relprc.id = `O${this.order + idx * 6 + 1}-RelatedMaterial_0_RelatedProduct_${idx}_ProductRelationCode_0`;
      this.relprc.data = bdsoe[this.relprc.id];
      this.relpid.id = `O${this.order + idx * 6 + 2}-RelatedMaterial_0_RelatedProduct_${idx}_ProductIdentifier_0_ProductIDType_0`;
      this.relpid.data = bdsoe[this.relpid.id];
      this.relpiv.id = `O${this.order + idx * 6 + 3}-RelatedMaterial_0_RelatedProduct_${idx}_ProductIdentifier_0_IDValue_0`;
      this.relpiv.data = bdsoe[this.relpiv.id];
      this.relpfc.id = `O${this.order + idx * 6 + 4}-RelatedMaterial_0_RelatedProduct_${idx}_ProductForm`;
      this.relpfc.data = bdsoe[this.relpfc.id];
      this.relpfd.id = `O${this.order + idx * 6 + 5}-RelatedMaterial_0_RelatedProduct_${idx}_ProductFormDetail`;
      this.relpfd.data = bdsoe[this.relpfd.id];
      this.innerHTML += `
        <h6 class="center">${this.lbl}</h6>
        ${BdsSelect(this.relprc, codelist.cl051)}
        ${BdsSelect(this.relpid, codelist.cl005)}
        ${BdsText(this.relpiv)}
        ${BdsSelect(this.relpfc, codelist.cl150)}
        ${BdsSelect(this.relpfd, codelist.cl175)}
      `;
    }
    this.innerHTML += `${BdsAddDelButtons("REL", "REL")}`;
    M.FormSelect.init(document.querySelectorAll("select"));
  };
}

window.customElements.define("bds-related", BdsRelated);
