import { GetOnixFiles, GetTitles, SaveUserFile, SaveTitleContents } from "../data/bdsfirebase.js";
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
  // JSON.parse(localStorage.getItem("userfiles"))
  //   .filter((file) => file.filetype === "Dat")
  //   .map((file) => file.filename);
  onixcreatefiles = [];
  titles = [];
  constructor() {
    super();

    GetOnixFiles().then((onixfiles) => {
      this.onixcreatefiles = JSON.parse(localStorage.getItem("onixfiles"));
      this.innerHTML = this.addOnixFiles("");
      this.innerHTML += this.addOnixElements("");

      // Object.keys(bdsoe).forEach((key) => delete bdsoe[key]);
      // Object.assign(bdsrecs, JSON.parse(localStorage.getItem("bdsrecs")));
      // this.innerHTML += this.addOnixElements();
      M.Collapsible.init(document.querySelectorAll(".collapsible"), { accordion: true });
      M.FormSelect.init(document.querySelectorAll("select"), {});
    });
  }

  connectedCallback() {
    this.addEventListener("change", (e) => {
      if (e.target.id === "ocfile") {
        GetTitles(e.target.value, "", 25).then(() => {
          this.titles = JSON.parse(localStorage.getItem(`titles`)).map((title) => title.RecordReference);
          console.log(this.titles);
          this.innerHTML = this.addOnixFiles(e.target.value);
          this.innerHTML += this.addOnixElements();
          M.Collapsible.init(document.querySelectorAll(".collapsible"), { accordion: true });
          M.FormSelect.init(document.querySelectorAll("select"), {});
        });
      } else if (e.target.id === "onixrec") {
        Object.keys(bdsoe).forEach((key) => delete bdsoe[key]);
        Object.assign(bdsoe, bdsrecs[e.target.value]);
        this.innerHTML = this.addOnixFiles() + this.addOnixElements(e.target.value);
        M.Collapsible.init(document.querySelectorAll(".collapsible"), { accordion: true });
        M.FormSelect.init(document.querySelectorAll("select"), {});
      }
      //this.viewOnix();
      // this.saveOnix();
    });

    this.addEventListener("click", async (e) => {
      if (e.target.id === "createfile") {
        const newfile = document.getElementById("newfile").value;
        await SaveUserFile({
          filename: newfile,
          filetype: "Dat",
          timestamp: Date.now()
        });
        this.onixcreatefiles.push(newfile);
        this.innerHTML = this.addOnixFiles();
        M.FormSelect.init(document.querySelectorAll("select"), {});
      } else if (e.target.id === "saveoe") {
        //this.saveOnix("CreateOnix1.dat");
        //this.viewOnix();
      }
    });
  }

  addOnixFiles = (file) => {
    return `
    <br/>
    <div class="container row">
      <div class="col s6 push-s2">${BdsText({ id: "newfile", name: "Create a File", data: "" })}</div>
      <div class="col s6"><br/>${BdsButton("createfile", "Create")}</div>
    </div>
      <div class="container${BdsSelect2("ocfile", this.onixcreatefiles, file)}</div>
    `;
  };

  addOnixElements = (rec) => {
    let comps = "";
    components.forEach((comp) => {
      comps += `
        <li>
          <div class="collapsible-header grey lighten-5" id=${comp.id}><span style="width:100%;">${comp.header}</span><i class="material-icons right">expand_more</i></div>
          <div class="collapsible-body z-depth-4"><${comp.component} order="0"></${comp.component}></div>        
        </li>                             
      `;
    });
    //console.log(comps);

    return `
      <style>
      .collapsible-header{margin-top:0.5rem !important;}
      .collapsible-body{border:1px solid lightgrey !important;}
      </style>
      <div class="row" style="display:flex;flex-wrap:wrap;">
        <ul class="col s6 collapsible" style="font-weight:400;font-size:1.25rem">
          <!--<li>${BdsSelect2("onixrec", Object.keys(bdsrecs), rec)}</li>-->
          <li>${BdsSelect2("onixrec", this.titles, rec)}</li>
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

    // Save to localStorage
    if (bdsrecs[`${bdsoe["A1-RecordReference_0"]}`]) {
      Object.keys(`${bdsoe["A1-RecordReference_0"]}`).forEach((key) => delete bdsrecs[`${bdsoe["A1-RecordReference_0"]}`][key]);
    }
    if (bdsrecs) {
      bdsrecs[`${bdsoe["A1-RecordReference_0"]}`] = { ...bdsoe };
      localStorage.setItem("bdsrecs", JSON.stringify(bdsrecs));
    }
  };

  saveOnix = async (file) => {
    const bdsoeflat = { ...bdsoe };
    //let pid = Object.fromEntries(Object.entries(bdsoeflat).sort());
    // pid = Object.entries(pid).map((p) => {
    //   return [p[0].slice(p[0].indexOf("-") + 1), p[1]];
    // });
    //const bdsflat = Object.fromEntries(pid);

    let bdsflat = Object.fromEntries(Object.entries(bdsoeflat).sort());
    await SaveUserFile({
      filename: file,
      filetype: "Dat",
      timestamp: Date.now()
    });
    await SaveTitleContents(
      file,
      {
        RecordReference: bdsflat["A1-RecordReference_0"],
        Title: bdsflat["D3-DescriptiveDetail_0_TitleDetail_0_TitleElement_0_TitleText_0"],
        Author: bdsflat["E3-DescriptiveDetail_0_Contributor_0_PersonName_0"]
      },
      {
        json: JSON.stringify(bdsflat),
        xml: ""
      }
    );
    console.log(`Title/Contents saved for File: ${file}, RecordReference: ${bdsflat["D3-DescriptiveDetail_0_TitleDetail_0_TitleElement_0_TitleText_0"]}`);
  };
}

window.customElements.define("bds-onix-create", BdsOnixCreate);
