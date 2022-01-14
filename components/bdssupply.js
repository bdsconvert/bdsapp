import { codelist } from "../data/bdscodelist.js";
import { bdsoe } from "../data/bdsmodel.js";
import { BdsSelect, BdsText, BdsAddDelButtons } from "./bdselements.js";

export class BdsSupply extends HTMLElement {
  constructor() {
    super();
    this.order = parseInt(this.getAttribute("order"), 10);
    this.index = parseInt(this.getAttribute("index"), 10);
    this.numsup = 1;
    this.suprol = { name: "SupplierRole", id: "", data: "" };
    this.supidt = { name: "SupplierIDType", id: "", data: "" };
    this.supidn = { name: "IDTypeName", id: "", data: "" };
    this.supidv = { name: "IDValue", id: "", data: "" };
    this.supnam = { name: "SupplierName", id: "", data: "" };
    this.suppav = { name: "ProductAvailability", id: "", data: "" };
    this.supdtr = { name: "SupplyDateRole", id: "", data: "" };
    this.supdte = { name: "Date", id: "", data: "" };
  }

  connectedCallback() {
    console.log("ConnectedCallback called!");
    document.getElementById(`sup${this.index}`).addEventListener("click", (e) => {
      if (this.innerHTML === "") {
        this.addSUP();
      }
    });

    this.addEventListener("change", (e) => {
      bdsoe[e.target.id] = e.target.value;
    });

    this.addEventListener("click", (e) => {
      if (e.target.id === "addSUP") {
        this.numsup++;
        this.addSUP();
      } else if (e.target.id === "delSRT") {
        delete bdsoe[this.suprol.id];
        delete bdsoe[this.supidt.id];
        delete bdsoe[this.supidn.id];
        delete bdsoe[this.supidv.id];
        delete bdsoe[this.supnam.id];
        delete bdsoe[this.suppav.id];
        delete bdsoe[this.supdtr.id];
        delete bdsoe[this.supdte.id];
        this.numsup--;
        this.addSUP();
      }
    });
  }

  addSUP = () => {
    this.innerHTML = "";
    for (let idx = 0; idx < this.numsup; idx++) {
      // this.lbl = `Supply${idx + 1}`;
      this.suprol.id = `Q${this.order + idx * 8 + 1}-ProductSupply_${this.index - 1}_SupplyDetail_0_Supplier_0_SupplierRole_0`;
      this.suprol.data = bdsoe[this.suprol.id];
      this.supidt.id = `Q${this.order + idx * 8 + 2}-ProductSupply_${this.index - 1}_SupplyDetail_0_Supplier_0_SupplierIDType_0`;
      this.supidt.data = bdsoe[this.supidt.id];
      this.supidn.id = `Q${this.order + idx * 8 + 3}-ProductSupply_${this.index - 1}_SupplyDetail_0_Supplier_0_IDTypeName_0`;
      this.supidn.data = bdsoe[this.supidn.id];
      this.supidv.id = `Q${this.order + idx * 8 + 4}-ProductSupply_${this.index - 1}_SupplyDetail_0_Supplier_0_IDValue_0`;
      this.supidv.data = bdsoe[this.supidv.id];
      this.supnam.id = `Q${this.order + idx * 8 + 5}-ProductSupply_${this.index - 1}_SupplyDetail_0_Supplier_0_SupplierName_0`;
      this.supnam.data = bdsoe[this.supnam.id];
      this.suppav.id = `Q${this.order + idx * 8 + 6}-ProductSupply_${this.index - 1}_SupplyDetail_0_ProductAvailability_0`;
      this.suppav.data = bdsoe[this.suppav.id];
      this.supdtr.id = `Q${this.order + idx * 8 + 7}-ProductSupply_${this.index - 1}_SupplyDetail_0_SupplyDate_0_SupplyDateRole_0`;
      this.supdtr.data = bdsoe[this.supdtr.id];
      this.supdte.id = `Q${this.order + idx * 8 + 8}-ProductSupply_${this.index - 1}_SupplyDetail_0_SupplyDate_0_Date_0`;
      this.supdte.data = bdsoe[this.supdte.id];
      this.innerHTML += `
        ${BdsSelect(this.suprol, codelist.cl093)}
        ${BdsSelect(this.supidt, codelist.cl092)}
        ${BdsText(this.supidn)}
        ${BdsText(this.supidv)}
        ${BdsText(this.supnam)}
        ${BdsSelect(this.suppav, codelist.cl065)}
        ${BdsSelect(this.supdtr, codelist.cl166)}
        ${BdsText(this.supdte)}
      `;
    }

    // this.innerHTML += `${BdsAddDelButtons("SRT", "SRT")}`;
    M.FormSelect.init(document.querySelectorAll("select"));
  };
}

window.customElements.define("bds-supply", BdsSupply);
