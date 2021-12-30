import { BdsRoot } from "./bdsroot.js";
import { BdsPid } from "./bdspid.js";
import { BdsProductComposition } from "./bdspc.js";
import { BdsTitle } from "./bdstitle.js";
import { BdsContributor } from "./bdscontributor.js";
import { BdsButton } from "./bdselements.js";
import { bdsoe } from "../data/bdsmodel.js";
import { xml2json, json2xml, flatten, unflatten, formatJson, formatXml } from "../utils/bdsutil.js";

export class BdsOnixCreate extends HTMLElement {
  constructor() {
    super();
    this.innerHTML = `
      <ul class="collapsible" style="font-weight:500;font-size:1.25rem">
        <li>
          <div class="collapsible-header"><span style="width:100%;">Root</span><i class="material-icons right">expand_more</i></div>
          <div class="collapsible-body"><bds-root order="0"></bds-root></div>
        </li>
        <li>
          <div class="collapsible-header"><span style="width:100%;">ProductIdentifiers</span><i class="material-icons right">expand_more</i></div>
          <div class="collapsible-body"><bds-pid order="2"></bds-pid></div>
        </li>
        <li>
          <div class="collapsible-header"><span style="width:100%;">DetailDescription</span><i class="material-icons right">expand_more</i></div>
          <div class="collapsible-body"><bds-product-composition order="10"></bds-product-composition></div>
        </li>
        <li>
          <div class="collapsible-header"><span style="width:100%;">Title</span><i class="material-icons right">expand_more</i></div>
          <div class="collapsible-body"><bds-title order="0"></bds-title></div>
        </li>
        <li>
          <div class="collapsible-header"><span style="width:100%;">Contributor</span><i class="material-icons right">expand_more</i></div>
          <div class="collapsible-body"><bds-contributor order="0"></bds-contributor></div>
        </li>
      </ul>
      <div class="center">${BdsButton("saveoe", "Preview Onix")}</div>
    `;
    M.Collapsible.init(document.querySelectorAll(".collapsible"), { accordion: false });
  }

  connectedCallback() {
    this.addEventListener("click", (e) => {
      if (e.target.id === "saveoe") {
        const ov = document.getElementById("bdsoe");
        ov.innerHTML = `<div class='col s4'><div style="font-weight:500;font-size:1.25rem;text-align:center;">Table<br/></div><div class="divider"></div><br/>` + formatJson(JSON.stringify(Object.fromEntries(Object.entries(bdsoe).sort()), null, "\n")) + "</div>";
        let pid = Object.fromEntries(Object.entries(bdsoe).sort());
        pid = Object.entries(pid).map((p) => {
          return [p[0].slice(p[0].indexOf("-") + 1), p[1]];
        });
        ov.innerHTML += `<div class='col s8'><div style="font-weight:500;font-size:1.25rem;text-align:center;">Onix<br/></div><div class="divider"></div><br/>` + formatXml("<Product>" + json2xml(unflatten(Object.fromEntries(pid))) + "</Product>") + "</div>";
      }
    });
  }
}

window.customElements.define("bds-onix-create", BdsOnixCreate);
