import { codelist } from "../data/bdscodelist.js";
import { bdsoe } from "../data/bdsmodel.js";
import { BdsSelect, BdsText, BdsAddDelButtons } from "./bdselements.js";

export class BdsContributor extends HTMLElement {
  constructor() {
    super();
    this.order = parseInt(this.getAttribute("order"), 10);
    this.numpid = 1;
    this.lbl = `Contributor${this.numpid}`;
    this.conseq = { name: "SequenceNumber", id: "", data: "" };
    this.conrole = { name: "ContributorRole", id: "", data: "" };
    this.conname = { name: "PersonName", id: "", data: "" };
    this.conpni = { name: "PersonNameInverted", id: "", data: "" };
    this.connbk = { name: "NamesBeforeKey", id: "", data: "" };
    this.conkn = { name: "KeyNames", id: "", data: "" };

    this.addContributor();
  }

  connectedCallback() {
    this.addEventListener("change", (e) => {
      bdsoe[e.target.id] = e.target.value;
    });

    this.addEventListener("click", (e) => {
      if (e.target.id === "addContributor") {
        this.numpid++;
        this.addContributor();
      } else if (e.target.id === "delContributor") {
        delete bdsoe[this.conseq.id];
        delete bdsoe[this.conrole.id];
        delete bdsoe[this.conname.id];
        delete bdsoe[this.conpni.id];
        delete bdsoe[this.connbk.id];
        delete bdsoe[this.conkn.id];
        this.numpid--;
        this.addContributor();
      }
    });
  }

  addContributor = () => {
    this.innerHTML = "";
    for (let idx = 0; idx < this.numpid; idx++) {
      this.lbl = `Contributor${idx + 1}`;
      this.conseq.id = `E${this.order + idx * 6 + 1}-DescriptiveDetail_0_Contributor_${idx}_SequenceNumber_0`;
      this.conseq.data = bdsoe[this.conseq.id];
      this.conrole.id = `E${this.order + idx * 6 + 2}-DescriptiveDetail_0_Contributor_${idx}_ContributorRole_0`;
      this.conrole.data = bdsoe[this.conrole.id];
      this.conname.id = `E${this.order + idx * 6 + 3}-DescriptiveDetail_0_Contributor_${idx}_PersonName_0`;
      this.conname.data = bdsoe[this.conname.id];
      this.conpni.id = `E${this.order + idx * 6 + 4}-DescriptiveDetail_0_Contributor_${idx}_PersonNameInverted_0`;
      this.conpni.data = bdsoe[this.conpni.id];
      this.connbk.id = `E${this.order + idx * 6 + 5}-DescriptiveDetail_0_Contributor_${idx}_NamesBeforeKey_0`;
      this.connbk.data = bdsoe[this.connbk.id];
      this.conkn.id = `E${this.order + idx * 6 + 6}-DescriptiveDetail_0_Contributor_${idx}_KeyNames_0`;
      this.conkn.data = bdsoe[this.conkn.id];

      this.innerHTML += `
        <div id=${this.lbl}>
        <h6 class="center">${this.lbl}</h6>
          ${BdsText(this.conseq)}
          ${BdsSelect(this.conrole, codelist.cl017)}
          ${BdsText(this.conname)}
          ${BdsText(this.conpni)}
          ${BdsText(this.connbk)}
          ${BdsText(this.conkn)}
        </div>
      `;
    }
    this.innerHTML += `${BdsAddDelButtons("Contributor", "Contributor")}`;
    M.FormSelect.init(document.querySelectorAll("select"));
  };
}

window.customElements.define("bds-contributor", BdsContributor);
