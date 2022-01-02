import { codelist } from "../data/bdscodelist.js";
import { bdsoe } from "../data/bdsmodel.js";
import { BdsCombo, BdsAddDelButtons } from "./bdselements.js";

export class BdsPid extends HTMLElement {
  constructor() {
    super();
    this.order = parseInt(this.getAttribute("order"), 10);
    this.numpid = 1;
    this.lbl = `ProductIdentifier${this.numpid}`;
    this.pidtyp = {
      name: "ProductIDType",
      id: "",
      data: ""
    };
    this.pidval = {
      name: "IDValue",
      id: "",
      data: ""
    };
  }

  connectedCallback() {
    document.getElementById("pid").addEventListener("click", (e) => {
      if (this.innerHTML === "") {
        this.addPID();
      }
    });

    this.addEventListener("change", (e) => {
      bdsoe[e.target.id] = e.target.value;
    });

    this.addEventListener("click", (e) => {
      if (e.target.id === "addPID") {
        this.numpid++;
        this.addPID();
      } else if (e.target.id === "delPID") {
        delete bdsoe[this.pidtyp.id];
        delete bdsoe[this.pidval.id];
        this.numpid--;
        this.addPID();
      }
    });
  }

  addPID = () => {
    this.innerHTML = "";
    for (let idx = 0; idx < this.numpid; idx++) {
      this.lbl = `ProductIdentifier${idx + 1}`;
      this.pidtyp.id = `B${this.order + idx * 2 + 1}-ProductIdentifier_${idx}_ProductIDType_0`;
      this.pidtyp.data = bdsoe[this.pidtyp.id];
      this.pidval.id = `B${this.order + idx * 2 + 2}-ProductIdentifier_${idx}_IDValue_0`;
      this.pidval.data = bdsoe[this.pidval.id];
      this.innerHTML += `${BdsCombo(this.lbl, this.pidtyp, this.pidval, codelist.cl005)}`;
    }
    this.innerHTML += `${BdsAddDelButtons("PID", "PID")}`;
    M.FormSelect.init(document.querySelectorAll("select"));
  };
}

window.customElements.define("bds-pid", BdsPid);
