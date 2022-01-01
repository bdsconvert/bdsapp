import { BdsButton, BdsSelect2 } from "./bdselements.js";
import { bdsoe, bdsrecs } from "../data/bdsmodel.js";
import {
  xml2json,
  json2xml,
  flatten,
  unflatten,
  formatJson,
  formatXml
} from "../utils/bdsutil.js";
import { BdsRoot } from "./bdsroot.js";
import { BdsPid } from "./bdspid.js";
import { BdsProductComposition } from "./bdspc.js";
import { BdsTitle } from "./bdstitle.js";
import { BdsContributor } from "./bdscontributor.js";
import { BdsEditionLanguage } from "./bdseditionlang.js";
import { BdsSubject } from "./bdssbj.js";

export class BdsOnixCreate extends HTMLElement {
  constructor() {
    super();
    Object.assign(bdsrecs, JSON.parse(localStorage.getItem("bdsrecs")));
    //let recs = BdsSelect2(Object.keys(bdsrecs));
    this.innerHTML = this.addOnixElements();
    M.Collapsible.init(document.querySelectorAll(".collapsible"), {
      accordion: false
    });
  }

  connectedCallback() {
    this.addEventListener("change", (e) => {
      if (e.target.id === "onixrecs") {
        Object.keys(bdsoe).forEach((key) => delete bdsoe[key]);
        Object.assign(bdsoe, bdsrecs[e.target.value]);
        console.log(bdsoe);
        this.innerHTML = this.addOnixElements(e.target.value);
        M.Collapsible.init(document.querySelectorAll(".collapsible"), {
          accordion: false
        });
      }
    });

    this.addEventListener("click", (e) => {
      if (e.target.id === "saveoe") {
        //localStorage.setItem("bdsoe", JSON.stringify(bdsoe));
        if (bdsrecs[`${bdsoe["A1-RecordReference_0"]}`])
          Object.keys(`${bdsoe["A1-RecordReference_0"]}`).forEach(
            (key) => delete bdsrecs[`${bdsoe["A1-RecordReference_0"]}`][key]
          );
        bdsrecs[`${bdsoe["A1-RecordReference_0"]}`] = { ...bdsoe };
        console.log(bdsrecs);
        localStorage.setItem("bdsrecs", JSON.stringify(bdsrecs));
        const ov = document.getElementById("bdsoe");
        //ov.innerHTML = `<div class='col s5'><div style="font-weight:500;font-size:1.25rem;text-align:center;">Table<br/></div><div class="divider"></div><br/>` + formatJson(JSON.stringify(Object.fromEntries(Object.entries(bdsoe).sort()), null, "\n")) + "</div>";
        let pid = Object.fromEntries(Object.entries(bdsoe).sort());
        pid = Object.entries(pid).map((p) => {
          return [p[0].slice(p[0].indexOf("-") + 1), p[1]];
        });
        ov.innerHTML =
          `<div class='col s12'><div style="font-weight:500;font-size:1.25rem;text-align:center;">Onix<br/></div><div class="divider"></div><br/>` +
          formatXml(
            "<Product>" +
              json2xml(unflatten(Object.fromEntries(pid))) +
              "</Product>"
          ) +
          "</div>";
      }
    });
  }

  addOnixElements = (rec) => {
    return `
      ${BdsSelect2(Object.keys(bdsrecs), rec)}
      <ul class="collapsible" style="font-weight:400;font-size:1.25rem">
        <li>
          <div class="collapsible-header"><span style="width:100%;">Record Reference</span><i class="material-icons right">expand_more</i></div>
          <div class="collapsible-body"><bds-root order="0"></bds-root></div>
        </li>
        <li>
          <div class="collapsible-header"><span style="width:100%;">Identifiers</span><i class="material-icons right">expand_more</i></div>
          <div class="collapsible-body"><bds-pid order="2"></bds-pid></div>
        </li>
        <li>
          <div class="collapsible-header"><span style="width:100%;">Composition</span><i class="material-icons right">expand_more</i></div>
          <div class="collapsible-body"><bds-product-composition order="10"></bds-product-composition></div>
        </li>
        <li>
          <div class="collapsible-header"><span style="width:100%;">Title</span><i class="material-icons right">expand_more</i></div>
          <div class="collapsible-body"><bds-title order="0"></bds-title></div>
        </li>
        <li>
          <div class="collapsible-header"><span style="width:100%;">Contributors</span><i class="material-icons right">expand_more</i></div>
          <div class="collapsible-body"><bds-contributor order="0"></bds-contributor></div>
        </li>
        <li>
          <div class="collapsible-header"><span style="width:100%;">Edition & Language</span><i class="material-icons right">expand_more</i></div>
          <div class="collapsible-body"><bds-edition-language order="0"></bds-edition-language></div>
        </li>
        <li>
          <div class="collapsible-header"><span style="width:100%;">Subjects</span><i class="material-icons right">expand_more</i></div>
          <div class="collapsible-body"><bds-subject order="0"></bds-subject></div>
        </li>
      </ul>
      <div class="center">${BdsButton("saveoe", "Preview Onix")}</div>
    `;
  };
}

window.customElements.define("bds-onix-create", BdsOnixCreate);
