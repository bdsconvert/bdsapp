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
      <h4 class="center">Onix Elements</h4>
      <div class="divider"></div>
        <bds-root order="0"></bds-root>
        <br/>
        <bds-pid order="2"></bds-pid>
        <br/>
        <bds-product-composition order="10"></bds-product-composition>
        <br/>
      <div class="center">${BdsButton("saveoe", "Show Onix Elements")}</div>
    `;
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
