import { codelist } from "../data/bdscodelist.js";
import { bdsoe } from "../data/bdsmodel.js";
import { BdsSelect, BdsText, BdsAddDelButtons } from "./bdselements.js";

export class BdsDesc extends HTMLElement {
  constructor() {
    super();
    this.order = parseInt(this.getAttribute("order"), 10);
    this.numdsc = 1;
    this.texttyp = { name: "TextType", id: "", data: "" };
    this.textaud = { name: "ContentAudience", id: "", data: "" };
    this.textdsc = { name: "Text", id: "", data: "" };
  }

  connectedCallback() {
    document.getElementById("dsc").addEventListener("click", (e) => {
      if (this.innerHTML === "") {
        this.addDesc();
      }
    });

    this.addEventListener("change", (e) => {
      bdsoe[e.target.id] = e.target.value;
    });

    this.addEventListener("click", (e) => {
      if (e.target.id === "addDesc") {
        this.numdsc++;
        this.addDesc();
      } else if (e.target.id === "delDesc") {
        delete bdsoe[this.texttyp.id];
        delete bdsoe[this.textaud.id];
        delete bdsoe[this.textdsc.id];
        this.numdsc--;
        this.addDesc();
      }
    });
  }

  addDesc = () => {
    this.innerHTML = "";
    for (let idx = 0; idx < this.numdsc; idx++) {
      this.lbl = `TextContent${idx + 1}`;
      this.texttyp.id = `J${this.order + idx * 3 + 1}-CollateralDetail_0_TextContent_${idx}_TextType_0`;
      this.texttyp.data = bdsoe[this.texttyp.id];
      this.textaud.id = `J${this.order + idx * 3 + 2}-CollateralDetail_0_TextContent_${idx}_ContentAudience_0`;
      this.textaud.data = bdsoe[this.textaud.id];
      this.textdsc.id = `J${this.order + idx * 3 + 3}-CollateralDetail_0_TextContent_${idx}_Text_0`;
      this.textdsc.data = bdsoe[this.textdsc.id];
      this.innerHTML += `
        ${BdsSelect(this.texttyp, codelist.cl153)}
        ${BdsSelect(this.textaud, codelist.cl154)}
        ${BdsText(this.textdsc)}

      `;
    }
    this.innerHTML += `${BdsAddDelButtons("Desc", "Desc")}`;
    M.FormSelect.init(document.querySelectorAll("select"));
  };
}

window.customElements.define("bds-desc", BdsDesc);
