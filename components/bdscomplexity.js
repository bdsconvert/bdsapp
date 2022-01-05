import { codelist } from "../data/bdscodelist.js";
import { bdsoe } from "../data/bdsmodel.js";
import { BdsCombo, BdsAddDelButtons } from "./bdselements.js";

export class BdsComplexity extends HTMLElement {
  constructor() {
    super();
    this.order = parseInt(this.getAttribute("order"), 10);
    this.numcsi = 1;
    this.csitype = { name: "ComplexitySchemeIdentifier", id: "", data: "" };
    this.csicode = { name: "ComplexityCode", id: "", data: "" };
  }

  connectedCallback() {
    document.getElementById("csi").addEventListener("click", (e) => {
      if (this.innerHTML === "") {
        this.addCSI();
      }
    });

    this.addEventListener("change", (e) => {
      bdsoe[e.target.id] = e.target.value;
    });

    this.addEventListener("click", (e) => {
      if (e.target.id === "addCSI") {
        this.numcsi++;
        this.addCSI();
      } else if (e.target.id === "delCSI") {
        delete bdsoe[this.csitype.id];
        delete bdsoe[this.csicode.id];
        this.numcsi--;
        this.addCSI();
      }
    });
  }

  addCSI = () => {
    this.innerHTML = "";
    for (let idx = 0; idx < this.numcsi; idx++) {
      this.lbl = `Complexity${idx + 1}`;
      this.csitype.id = `I${this.order + idx * 2 + 1}-DescriptiveDetail_0_Complexity_${idx}_ComplexitySchemeIdentifier_0`;
      this.csitype.data = bdsoe[this.csitype.id];
      this.csicode.id = `I${this.order + idx * 2 + 2}-DescriptiveDetail_0_Complexity_${idx}_ComplexityCode_0`;
      this.csicode.data = bdsoe[this.csicode.id];
      this.innerHTML += `${BdsCombo(this.lbl, this.csitype, this.csicode, codelist.cl032)}`;
    }
    this.innerHTML += `${BdsAddDelButtons("CSI", "CSI")}`;
    M.FormSelect.init(document.querySelectorAll("select"));
  };
}

window.customElements.define("bds-complexity", BdsComplexity);
