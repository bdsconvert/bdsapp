import { codelist } from "../data/bdscodelist.js";
import { bdsoe } from "../data/bdsmodel.js";
import { BdsSelect, BdsAddDelButtons } from "./bdselements.js";

export class BdsMarket extends HTMLElement {
  constructor() {
    super();
    this.order = parseInt(this.getAttribute("order"), 10);
    this.nummkt = 1;
    this.mktsci = { name: "CountriesIncluded", id: "", data: "" };
    this.mktsri = { name: "RegionsIncluded", id: "", data: "" };
    this.mktsce = { name: "CountriesExcluded", id: "", data: "" };
    this.mktsre = { name: "RegionsExcluded", id: "", data: "" };
  }

  connectedCallback() {
    document.getElementById("mkt").addEventListener("click", (e) => {
      if (this.innerHTML === "") {
        this.addMKT();
      }
    });

    this.addEventListener("change", (e) => {
      bdsoe[e.target.id] = e.target.value;
    });

    this.addEventListener("click", (e) => {
      if (e.target.id === "addMKT") {
        this.nummkt++;
        this.addMKT();
      } else if (e.target.id === "delMKT") {
        delete bdsoe[this.mktsci.id];
        delete bdsoe[this.mktsri.id];
        delete bdsoe[this.mktsce.id];
        delete bdsoe[this.mktsre.id];
        this.nummkt--;
        this.addMKT();
      }
    });
  }

  addMKT = () => {
    this.innerHTML = "";
    for (let idx = 0; idx < this.nummkt; idx++) {
      this.lbl = `Market${idx + 1}`;
      this.mktsci.id = `P${this.order + idx * 6 + 2}-ProductSupply_0_Market_${idx}_Territory_0_CountriesIncluded`;
      this.mktsci.data = bdsoe[this.mktsci.id];
      this.mktsri.id = `P${this.order + idx * 6 + 3}-ProductSupply_0_Market_${idx}_Territory_0_RegionsIncluded`;
      this.mktsri.data = bdsoe[this.mktsri.id];
      this.mktsce.id = `P${this.order + idx * 6 + 4}-ProductSupply_0_Market_${idx}_Territory_0_CountriesExcluded`;
      this.mktsce.data = bdsoe[this.mktsce.id];
      this.mktsre.id = `P${this.order + idx * 6 + 5}-ProductSupply_0_Market_${idx}_Territory_0_RegionsExcluded`;
      this.mktsre.data = bdsoe[this.mktsre.id];
      this.innerHTML += `
        <h6 class="center">${this.lbl}</h6>
        ${BdsSelect(this.mktsci, codelist.cl091)}
        ${BdsSelect(this.mktsri, codelist.cl049)}
        ${BdsSelect(this.mktsce, codelist.cl091)}
        ${BdsSelect(this.mktsre, codelist.cl049)}
      `;
    }
    this.innerHTML += `${BdsAddDelButtons("MKT", "MKT")}`;
    M.FormSelect.init(document.querySelectorAll("select"));
  };
}

window.customElements.define("bds-market", BdsMarket);
