import { codelist } from "../data/bdscodelist.js";
import { BdsText, BdsSelect } from "./bdselements.js";
import { BdsButton, BdsSelect2 } from "./bdselements.js";
import { bdsoe, bdsrecs } from "../data/bdsmodel.js";
import { xml2json, json2xml, flatten, unflatten, formatJson, formatXml } from "../utils/bdsutil.js";
import { BdsRoot } from "./bdsroot.js";
import { BdsPid } from "./bdspid.js";
import { BdsProductComposition } from "./bdspc.js";
import { BdsTitle } from "./bdstitle.js";
import { BdsContributor } from "./bdscontributor.js";
import { BdsEditionLanguage } from "./bdseditionlang.js";
import { BdsSubject } from "./bdssbj.js";
import { BdsAudience } from "./bdsaudience.js";
import { BdsComplexity } from "./bdscomplexity.js";
import { BdsDesc } from "./bdsdesc.js";
import { BdsImprint } from "./bdsimprint.js";
import { BdsPublisher } from "./bdspub.js";
import { BdsPubDetail } from "./bdspubdetail.js";
import { BdsSalesRight } from "./bdssalesright.js";
import { BdsRelated } from "./bdsrelated.js";
import { BdsMarket } from "./bdsmarket.js";
import { BdsProdsupply } from "./bdsprodsupply.js";

const components = [
  { header: "Record Reference", id: "rrf", component: "bds-root" },
  { header: "Identifiers", id: "pid", component: "bds-pid" },
  { header: "Composition", id: "pcf", component: "bds-product-composition" },
  { header: "Title", id: "ttl", component: "bds-title" },
  { header: "Contributors", id: "cnt", component: "bds-contributor" },
  { header: "Edition & Language", id: "eln", component: "bds-edition-language" },
  { header: "Subjects", id: "sbj", component: "bds-subject" },
  { header: "Audience", id: "aud", component: "bds-audience" },
  { header: "Complexity", id: "csi", component: "bds-complexity" },
  { header: "Description", id: "dsc", component: "bds-desc" },
  { header: "Imprint", id: "imp", component: "bds-imprint" },
  { header: "Publisher", id: "pub", component: "bds-publisher" },
  { header: "Publisher Detail", id: "pbd", component: "bds-pubdetail" },
  { header: "Sales Rights", id: "srt", component: "bds-salesright" },
  { header: "Related Product", id: "rel", component: "bds-related" },
  { header: "Product Supply", id: "psd", component: "bds-prodsupply" }
];

export class BdsOnixCreate extends HTMLElement {
  constructor() {
    super();
    Object.keys(bdsoe).forEach((key) => delete bdsoe[key]);
    Object.assign(bdsrecs, JSON.parse(localStorage.getItem("bdsrecs")));
    this.innerHTML = this.addOnixElements();
    M.Collapsible.init(document.querySelectorAll(".collapsible"), { accordion: true });
    M.FormSelect.init(document.querySelectorAll("select"), {});
  }

  connectedCallback() {
    this.addEventListener("change", (e) => {
      if (e.target.id === "onixrecs") {
        Object.keys(bdsoe).forEach((key) => delete bdsoe[key]);
        Object.assign(bdsoe, bdsrecs[e.target.value]);
        this.innerHTML = this.addOnixElements(e.target.value);
        M.Collapsible.init(document.querySelectorAll(".collapsible"), { accordion: true });
        M.FormSelect.init(document.querySelectorAll("select"), {});
      }
      this.viewOnix();
      this.saveOnix();
    });

    this.addEventListener("click", (e) => {
      if (e.target.id === "saveoe") {
        this.saveOnix();
        //this.viewOnix();
      }
    });
  }

  addOnixElements = (rec) => {
    let comps = "";
    components.forEach((comp) => {
      comps += `
        <li>
          <div class="collapsible-header grey lighten-5" id=${comp.id}><span style="width:100%;">${comp.header}</span><i class="material-icons right">expand_more</i></div>
          <div class="collapsible-body"><${comp.component} order="0"></${comp.component}></div>        
        </li>                             
      `;
    });
    //console.log(comps);

    return `
      <style>
      .collapsible-header{margin-bottom:0.5rem !important;}
      .collapsible-body{border:1px solid lightgrey !important;}
      </style>
      <div class="row" style="display:flex;flex-wrap:wrap;">
        <ul class="col s6 collapsible" style="font-weight:400;font-size:1.25rem">
          <li>${BdsSelect2(Object.keys(bdsrecs), rec)}</li>
          ${comps}
        </ul>
        <ul class="col s6 collapsible">
          <li class="center" style="padding:1rem">${BdsButton("saveoe", "Save Onix")}</li>
          <li><div class="divider"></div></li>
          <li><p id="bdsoe" style="overflow-wrap:break-word"></p></li>
        </ul>
      </div>
    `;
  };

  viewOnix = () => {
    const ov = document.getElementById("bdsoe");
    //ov.innerHTML = `<div class='col s5'><div style="font-weight:500;font-size:1.25rem;text-align:center;">Table<br/></div><div class="divider"></div><br/>` + formatJson(JSON.stringify(Object.fromEntries(Object.entries(bdsoe).sort()), null, "\n")) + "</div>";
    let pid = Object.fromEntries(Object.entries(bdsoe).sort());
    //console.log(pid);
    pid = Object.entries(pid).map((p) => {
      return [p[0].slice(p[0].indexOf("-") + 1), p[1]];
    });
    //ov.innerHTML = `<div class='col s12'><div style="font-weight:500;font-size:1.25rem;text-align:center;">Onix<br/></div><div class="divider"></div><br/>` + formatXml("<Product>" + json2xml(unflatten(Object.fromEntries(pid))) + "</Product>") + "</div>";
    ov.innerHTML = formatXml("<Product>" + json2xml(unflatten(Object.fromEntries(pid))) + "</Product>");
  };

  saveOnix = () => {
    if (bdsrecs[`${bdsoe["A1-RecordReference_0"]}`]) {
      Object.keys(`${bdsoe["A1-RecordReference_0"]}`).forEach((key) => delete bdsrecs[`${bdsoe["A1-RecordReference_0"]}`][key]);
    }
    if (bdsrecs) {
      bdsrecs[`${bdsoe["A1-RecordReference_0"]}`] = { ...bdsoe };
      localStorage.setItem("bdsrecs", JSON.stringify(bdsrecs));
    }
  };
}

window.customElements.define("bds-onix-create", BdsOnixCreate);

/*<li>
<div class="collapsible-header grey lighten-4" id="rrf"><span style="width:100%;">Record Reference</span><i class="material-icons right">expand_more</i></div>
<div class="collapsible-body"><bds-root order="0"></bds-root></div>        
</li>                             
<li>
<div class="collapsible-header grey lighten-4" id="pid"><span style="width:100%;">Identifiers</span><i class="material-icons right">expand_more</i></div>
<div class="collapsible-body"><bds-pid order="2"></bds-pid></div>
</li>
<li>
<div class="collapsible-header grey lighten-4" id="pcf"><span style="width:100%;">Composition</span><i class="material-icons right">expand_more</i></div>
<div class="collapsible-body"><bds-product-composition order="10"></bds-product-composition></div>
</li>
<li>
<div class="collapsible-header grey lighten-4" id="ttl"><span style="width:100%;">Title</span><i class="material-icons right">expand_more</i></div>
<div class="collapsible-body"><bds-title order="0"></bds-title></div>
</li>
<li>
<div class="collapsible-header grey lighten-4" id="cnt"><span style="width:100%;">Contributors</span><i class="material-icons right">expand_more</i></div>
<div class="collapsible-body"><bds-contributor order="0"></bds-contributor></div>
</li>
<li>
<div class="collapsible-header grey lighten-4" id="eln"><span style="width:100%;">Edition & Language</span><i class="material-icons right">expand_more</i></div>
<div class="collapsible-body"><bds-edition-language order="0"></bds-edition-language></div>
</li>
<li>
<div class="collapsible-header grey lighten-4" id="sbj"><span style="width:100%;">Subjects</span><i class="material-icons right">expand_more</i></div>
<div class="collapsible-body"><bds-subject order="0"></bds-subject></div>
</li>
<li>
<div class="collapsible-header grey lighten-4" id="aud"><span style="width:100%;">Audience</span><i class="material-icons right">expand_more</i></div>
<div class="collapsible-body"><bds-audience order="0"></bds-audience></div>
</li>
<li>
<div class="collapsible-header grey lighten-4" id="csi"><span style="width:100%;">Complexity</span><i class="material-icons right">expand_more</i></div>
<div class="collapsible-body"><bds-complexity order="0"></bds-complexity></div>
</li>
<li>
<div class="collapsible-header grey lighten-4" id="dsc"><span style="width:100%;">Description</span><i class="material-icons right">expand_more</i></div>
<div class="collapsible-body"><bds-desc order="0"></bds-desc></div>
</li>
<li>
<div class="collapsible-header grey lighten-4" id="imp"><span style="width:100%;">Imprint</span><i class="material-icons right">expand_more</i></div>
<div class="collapsible-body"><bds-imprint order="10"></bds-imprint></div>
</li>
<li>
<div class="collapsible-header grey lighten-4" id="pub"><span style="width:100%;">Publisher</span><i class="material-icons right">expand_more</i></div>
<div class="collapsible-body"><bds-publisher order="10"></bds-publisher></div>
</li>
<li>
<div class="collapsible-header grey lighten-4" id="pbd"><span style="width:100%;">PublisherDetail</span><i class="material-icons right">expand_more</i></div>
<div class="collapsible-body"><bds-pubdetail order="10"></bds-pubdetail></div>
</li>
<li>
<div class="collapsible-header grey lighten-4" id="srt"><span style="width:100%;">SalesRights</span><i class="material-icons right">expand_more</i></div>
<div class="collapsible-body"><bds-salesright order="10"></bds-salesright></div>
</li>
<li>
<div class="collapsible-header grey lighten-4" id="rel"><span style="width:100%;">RelatedProduct</span><i class="material-icons right">expand_more</i></div>
<div class="collapsible-body"><bds-related order="10"></bds-related></div>
</li> 
*/
