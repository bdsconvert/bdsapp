import { codelist } from "../data/bdscodelist.js";
import { bdsoe } from "../data/bdsmodel.js";
import { BdsSelect, BdsText, BdsAddDelButtons } from "./bdselements.js";

export class BdsSubject extends HTMLElement {
  constructor() {
    super();
    this.order = parseInt(this.getAttribute("order"), 10);
    this.numpid = 1;
    this.lbl = `Subject${this.numpid}`;
    this.sbjsi = { name: "SubjectSchemeIdentifier", id: "", data: "" };
    this.sbjsv = { name: "sSubjectSchemeVersion", id: "", data: "" };
    this.sbjcd = { name: "SubjectCode", id: "", data: "" };
  }

  connectedCallback() {
    document.getElementById("sbj").addEventListener("click", (e) => {
      this.addSubjects();
    });

    this.addEventListener("change", (e) => {
      bdsoe[e.target.id] = e.target.value;
    });

    this.addEventListener("click", (e) => {
      if (e.target.id === "addSubject") {
        this.numpid++;
        this.addSubjects();
      } else if (e.target.id === "delSubject") {
        delete bdsoe[this.sbjsi.id];
        delete bdsoe[this.sbjsv.id];
        delete bdsoe[this.sbjcd.id];
        this.numpid--;
        this.addSubjects();
      }
    });
  }

  addSubjects = () => {
    this.innerHTML = "";
    for (let idx = 0; idx < this.numpid; idx++) {
      this.lbl = `Subject${idx + 1}`;
      this.sbjsi.id = `G${this.order + idx * 3 + 1}-DescriptiveDetail_0_Subject_${idx}_SubjectSchemeIdentifier_0`;
      this.sbjsi.data = bdsoe[this.sbjsi.id];
      this.sbjsv.id = `G${this.order + idx * 3 + 2}-DescriptiveDetail_0_Subject_${idx}_SubjectSchemeVersion_0`;
      this.sbjsv.data = bdsoe[this.sbjsv.id];
      this.sbjcd.id = `G${this.order + idx * 3 + 3}-DescriptiveDetail_0_Subject_${idx}_SubjectCode_0`;
      this.sbjcd.data = bdsoe[this.sbjcd.id];

      this.innerHTML += `
        <div id=${this.lbl}>
        <h6 class="center">${this.lbl}</h6>
          ${BdsSelect(this.sbjsi, codelist.cl027)}
          ${BdsText(this.sbjsv)}
          ${BdsText(this.sbjcd)}
        </div>
      `;
    }
    this.innerHTML += `${BdsAddDelButtons("Subject", "Subject")}`;
    M.FormSelect.init(document.querySelectorAll("select"));
  };
}

window.customElements.define("bds-subject", BdsSubject);
