import { codelist } from "../data/bdscodelist.js";
import { bdsoe } from "../data/bdsmodel.js";
import { BdsSelect, BdsText, BdsAddDelButtons } from "./bdselements.js";

export class BdsPubDetail extends HTMLElement {
  constructor() {
    super();
    this.order = parseInt(this.getAttribute("order"), 10);
    this.numpbd = 1;
    this.pubdcp = { name: "CountryOfPublication", id: "", data: "" };
    this.pubdps = { name: "PublishingStatus", id: "", data: "" };
    this.pubddr = { name: "PublishingDateRole", id: "", data: "" };
    this.pubddt = { name: "PublishingDate", id: "", data: "" };
    this.pubdct = { name: "CopyrightType", id: "", data: "" };
    this.pubdcy = { name: "CopyrightYear", id: "", data: "" };
  }

  connectedCallback() {
    document.getElementById("pbd").addEventListener("click", (e) => {
      if (this.innerHTML === "") {
        this.addPBD();
      }
    });

    this.addEventListener("change", (e) => {
      bdsoe[e.target.id] = e.target.value;
    });

    this.addEventListener("click", (e) => {
      if (e.target.id === "addPBD") {
        this.numpbd++;
        this.addPBD();
      } else if (e.target.id === "delPBD") {
        delete bdsoe[this.pubdcp.id];
        delete bdsoe[this.pubdps.id];
        delete bdsoe[this.pubddr.id];
        delete bdsoe[this.pubddt.id];
        delete bdsoe[this.pubdct.id];
        delete bdsoe[this.pubdcy.id];
        this.numpbd--;
        this.addPBD();
      }
    });
  }

  addPBD = () => {
    this.innerHTML = "";
    for (let idx = 0; idx < this.numpbd; idx++) {
      this.lbl = `PublisherDetail${idx + 1}`;
      this.pubdcp.id = `M${this.order + idx * 6 + 1}-PublishingDetail_0_CountryOfPublication_${idx}`;
      this.pubdcp.data = bdsoe[this.pubdcp.id];
      this.pubdps.id = `M${this.order + idx * 6 + 2}-PublishingDetail_0_PublishingStatus_${idx}`;
      this.pubdps.data = bdsoe[this.pubdps.id];
      this.pubddr.id = `M${this.order + idx * 6 + 3}-PublishingDetail_0_PublishingDate_0_PublishingDateRole_${idx}`;
      this.pubddr.data = bdsoe[this.pubddr.id];
      this.pubddt.id = `M${this.order + idx * 6 + 4}-PublishingDetail_0_PublishingDate_0_Date_${idx}`;
      this.pubddt.data = bdsoe[this.pubddt.id];
      this.pubdct.id = `M${this.order + idx * 6 + 5}-PublishingDetail_0_CopyrightStatement_0_CopyrightType_${idx}`;
      this.pubdct.data = bdsoe[this.pubdct.id];
      this.pubdcy.id = `M${this.order + idx * 6 + 6}-PublishingDetail_0_CopyrightStatement_0_CopyrightYear_${idx}`;
      this.pubdcy.data = bdsoe[this.pubdcy.id];
      this.innerHTML += `
        <h6 class="center">${this.lbl}</h6>
        ${BdsSelect(this.pubdcp, codelist.cl091)}
        ${BdsSelect(this.pubdps, codelist.cl064)}
        ${BdsSelect(this.pubddr, codelist.cl163)}
        ${BdsText(this.pubddt)}
        ${BdsSelect(this.pubdct, codelist.cl219)}
        ${BdsText(this.pubdcy)}
      `;
    }
    //this.innerHTML += `${BdsAddDelButtons("PBD", "PBD")}`;
    M.FormSelect.init(document.querySelectorAll("select"));
  };
}

window.customElements.define("bds-pubdetail", BdsPubDetail);
