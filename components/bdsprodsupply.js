// import { codelist } from "../data/bdscodelist.js";
// import { bdsoe } from "../data/bdsmodel.js";
import { BdsSelect, BdsText, BdsButton, BdsAddDelButtons } from "./bdselements.js";
import { BdsMarket } from "./bdsmarket.js";
import { BdsSupply } from "./bdssupply.js";
import { BdsPrice } from "./bdsprice.js";

const psdcomponents = [
  { header: "Market", id: "mkt", component: "bds-market" },
  { header: "Supplier", id: "sup", component: "bds-supply" },
  { header: "Price", id: "prc", component: "bds-price" }
];

export class BdsProdsupply extends HTMLElement {
  constructor() {
    super();
    this.order = parseInt(this.getAttribute("order"), 10);
    this.numpsd = 1;
    //this.psmkt = { name: "SupplierRole", id: "", data: "" };
    this.addPSDComponents(); //`<bds-market order="0"></bds-market>`;
  }

  connectedCallback() {
    this.addEventListener("change", (e) => {
      console.log(e.target);
    });

    this.addEventListener("click", (e) => {
      if (e.target.id === "addPSD") {
        this.numpsd++;
        this.addPSDComponents();
      }
    });
  }

  addPSDComponents = () => {
    let comps = "";
    for (let idx = 0; idx < this.numpsd; idx++) {
      comps += `<h6 class="center"><strong>ProductSupply${idx + 1}</strong></h6>`;
      psdcomponents.forEach((comp) => {
        comps += `
          <li>
            <div class="collapsible-header grey lighten-5" id=${comp.id}${idx + 1}><span style="width:100%;">${comp.header}</span><i class="material-icons right">expand_more</i></div>
            <div class="collapsible-body z-depth-4"><${comp.component} order="0" index="${idx + 1}"></${comp.component}></div>        
          </li>                             
        `;
      });
    } // for numpsd

    this.psd = `
        <style>
        .collapsible-header{margin-bottom:0.5rem !important;}
        .collapsible-body{border:1px solid lightgrey !important;}
        </style>
        <ul class="collapsible" style="font-weight:400;font-size:1.25rem">
          ${comps}
        </ul>
      `;
    this.innerHTML = `${this.psd}${BdsButton("AddPSD", "AddPSD")}`;
    M.Collapsible.init(document.querySelectorAll(".collapsible"), { accordion: true });
  };
}
window.customElements.define("bds-prodsupply", BdsProdsupply);
