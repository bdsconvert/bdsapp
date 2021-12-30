import { BdsRoot } from "./bdsroot.js";
import { BdsPid } from "./bdspid.js";
import { BdsProductComposition } from "./bdspc.js";
import { BdsButton } from "./bdselements.js";
import { bdsoe } from "../data/bdsmodel.js";
import { xml2json, json2xml, flatten, unflatten, formatJson, formatXml } from "../utils/bdsutil.js";

export class BdsOnixCreate extends HTMLElement {
  constructor() {
    super();
    this.innerHTML = `
      <ul class="collapsible expandable">
        <li class="grey lighten-5">
          <div class="row collapsible-header grey lighten-4">
            <h5 class="col s11">Root</h5>
            <i class="col s1 material-icons"><br/>expand_more</i>
          </div>
          <div class="collapsible-body"><bds-root order="0"></bds-root></div>
        </li>
        <li class="grey lighten-5">
          <div class="row collapsible-header grey lighten-4">
            <h5 class="col s11">ProductIdentifiers</h5>
            <i class="col s1 material-icons"><br/>expand_more</i>
          </div>
          <div class="collapsible-body"><bds-pid order="2"></bds-pid></div> 
        </li>
        <li class="grey lighten-5">
          <div class="row collapsible-header grey lighten-4">
            <h5 class="col s11">DetailDescription</h5>
            <i class="col s1 material-icons"><br/>expand_more</i>
          </div>
          <div class="collapsible-body"><bds-product-composition order="10"></bds-product-composition></div> 
        </li>
        <br/>
      </ul>
      <div class="center">${BdsButton("saveoe", "Show Onix Elements")}</div>
    `;
    M.Collapsible.init(document.querySelectorAll(".collapsible"), { accordion: false });
  }

  connectedCallback() {
    this.addEventListener("click", (e) => {
      if (e.target.id === "saveoe") {
        const ov = document.getElementById("bdsoe");
        ov.innerHTML = formatJson(JSON.stringify(Object.fromEntries(Object.entries(bdsoe).sort()), null, "\n"));
        let pid = Object.fromEntries(Object.entries(bdsoe).sort());
        pid = Object.entries(pid).map((p) => {
          return [p[0].slice(p[0].indexOf("-") + 1), p[1]];
        });
        ov.innerHTML += formatXml("<Product>" + json2xml(unflatten(Object.fromEntries(pid))) + "</Product>");
      }
    });
  }
}

window.customElements.define("bds-onix-create", BdsOnixCreate);
