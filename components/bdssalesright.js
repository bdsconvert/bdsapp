import { codelist } from "../data/bdscodelist.js";
import { bdsoe } from "../data/bdsmodel.js";
import { BdsSelect, BdsText, BdsAddDelButtons } from "./bdselements.js";

export class BdsSalesRight extends HTMLElement {
  constructor() {
    super();
    this.order = parseInt(this.getAttribute("order"), 10);
    this.numsrt = 1;
    this.pubsrt = { name: "SalesRightsType", id: "", data: "" };
    this.pubsci = { name: "CountriesIncluded", id: "", data: "" };
    this.pubsri = { name: "RegionsIncluded", id: "", data: "" };
    this.pubsce = { name: "CountriesExcluded", id: "", data: "" };
    this.pubsre = { name: "RegionsExcluded", id: "", data: "" };
    this.pubrow = { name: "ROWSalesRightsType", id: "", data: "" };
  }

  connectedCallback() {
    document.getElementById("srt").addEventListener("click", (e) => {
      if (this.innerHTML === "") {
        this.addSRT();
      }
    });

    this.addEventListener("change", (e) => {
      bdsoe[e.target.id] = e.target.value;
    });

    this.addEventListener("click", (e) => {
      if (e.target.id === "addSRT") {
        this.numsrt++;
        this.addSRT();
      } else if (e.target.id === "delSRT") {
        delete bdsoe[this.pubsrt.id];
        delete bdsoe[this.pubsci.id];
        delete bdsoe[this.pubsri.id];
        delete bdsoe[this.pubsce.id];
        delete bdsoe[this.pubsre.id];
        //delete bdsoe[this.pubrow.id];
        this.numsrt--;
        this.addSRT();
      }
    });
  }

  addSRT = () => {
    this.innerHTML = "";
    for (let idx = 0; idx < this.numsrt; idx++) {
      this.lbl = `SalesRights${idx + 1}`;
      this.pubsrt.id = `N${this.order + idx * 6 + 1}-PublishingDetail_0_SalesRights_${idx}_SalesRightsType_0`;
      this.pubsrt.data = bdsoe[this.pubsrt.id];
      this.pubsci.id = `N${this.order + idx * 6 + 2}-PublishingDetail_0_SalesRights_${idx}_Territory_0_CountriesIncluded`;
      this.pubsci.data = bdsoe[this.pubsci.id];
      this.pubsri.id = `N${this.order + idx * 6 + 3}-PublishingDetail_0_SalesRights_${idx}_Territory_0_RegionsIncluded`;
      this.pubsri.data = bdsoe[this.pubsri.id];
      this.pubsce.id = `N${this.order + idx * 6 + 4}-PublishingDetail_0_SalesRights_${idx}_Territory_0_CountriesExcluded`;
      this.pubsce.data = bdsoe[this.pubsce.id];
      this.pubsre.id = `N${this.order + idx * 6 + 5}-PublishingDetail_0_SalesRights_${idx}_Territory_0_RegionsExcluded`;
      this.pubsre.data = bdsoe[this.pubsre.id];
      this.innerHTML += `
        <h6 class="center">${this.lbl}</h6>
        ${BdsSelect(this.pubsrt, codelist.cl046)}
        ${BdsSelect(this.pubsci, codelist.cl091)}
        ${BdsSelect(this.pubsri, codelist.cl049)}
        ${BdsSelect(this.pubsce, codelist.cl091)}
        ${BdsSelect(this.pubsre, codelist.cl049)}
      `;
      this.pubrow.id = `N${this.order + 6}-PublishingDetail_0_ROWSalesRightsType`;
      this.pubrow.data = bdsoe[this.pubrow.id];
    }
    this.innerHTML += `${BdsSelect(this.pubrow, codelist.cl046)}`;

    this.innerHTML += `${BdsAddDelButtons("SRT", "SRT")}`;
    M.FormSelect.init(document.querySelectorAll("select"));
  };
}

window.customElements.define("bds-salesright", BdsSalesRight);
