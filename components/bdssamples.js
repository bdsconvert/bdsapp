import { authObj, GetWorqueueFiles, GetTitles, GetContents, SaveExportTemplate } from "../data/bdsfirebase.js";
import { formatXml, downloadfile } from "../utils/bdsutil.js";
import { BdsFileUpload } from "./bdsfileupload.js";
import { BdsContent } from "./bdscontent.js";
import { BdsDownload } from "./bdsdownload.js";

export class BdsSamples extends HTMLElement {
  constructor() {
    super();
    this.sampletype = this.getAttribute("sampletype");
    switch (this.sampletype) {
      case "eoExcel":
        this.innerHTML = `
        <iframe 
          width="100%" height="346" frameborder="0" scrolling="no" 
          src="https://onedrive.live.com/embed?resid=56998D3D2BC898D5%21941&authkey=%21APSwPwNypwc8cOU&em=2&wdAllowInteractivity=False&wdDownloadButton=True&wdInConfigurator=True">
        </iframe>   
        `;
        break;

      case "eoOnix":
        fetch("https://bdsconvert.github.io/bdsapp/assets/BDSSampleExcelImport.xml")
          .then((response) => response.text())
          .then((data) => {
            this.innerHTML = `<div style="overflow:scroll;height:50vh;padding:1em;border:1px solid lightgrey;">${formatXml(data)}</div>`;
          });
        break;

      case "oeExcel":
        this.innerHTML = `
        <iframe 
          src="https://onedrive.live.com/embed?resid=56998D3D2BC898D5%21944&authkey=%21ANo09HqLVnv6Sw4&em=2&wdAllowInteractivity=False&wdDownloadButton=True&wdInConfigurator=True" 
          width="100%" height="330" frameborder="0" scrolling="no">
        </iframe>
          `;
        break;

      case "oeOnix":
        break;

      default:
        break;
    }
  }
  connectedCallback() {
    this.addEventListener("click", (e) => {
      e.preventDefault();
    });
  }

  // <ul class="collection">
  // <li class="collection-item">
  //   <span>Onix Sample File</span>
  //   <a href="#bdsdownload" class="secondary-content" title="Download">
  //     <i class="material-icons right">download</i>
  //   </a>
  //   <a href="#bdscontents" class="modal-trigger secondary-content" title="View Content">
  //     <i class="material-icons right">list</i>
  //   </a>
  // </li>
  // <li class="collection-item">
  //   <span>Excel Sample File</span>
  //   <a href="#bdsdownload" class="secondary-content" title="Download">
  //     <i class="material-icons right">download</i>
  //   </a>
  //   <a href="#bdscontents" class="modal-trigger secondary-content" title="View Content" >
  //     <i class="material-icons right">list</i>
  //   </a>
  // </li>
  // </ul>
} //Class End
window.customElements.define("bds-samples", BdsSamples);
