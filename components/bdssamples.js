import { authObj, GetWorqueueFiles, GetTitles, GetContents, SaveExportTemplate } from "../data/bdsfirebase.js";
import { downloadfile } from "../utils/bdsutil.js";
import { BdsFileUpload } from "./bdsfileupload.js";
import { BdsContent } from "./bdscontent.js";
import { BdsDownload } from "./bdsdownload.js";

export class BdsSamples extends HTMLElement {
  constructor() {
    super();
    this.sampletype = this.getAttribute("sampletype");
    if (this.sampletype === "Excel") {
      this.innerHTML = `
      <iframe 
        src="https://onedrive.live.com/embed?cid=56998D3D2BC898D5&resid=56998D3D2BC898D5%21941&authkey=APSwPwNypwc8cOU&em=2" 
        width="100%" height="360" frameborder="0" scrolling="no">
      </iframe>    
    `;
    } else {
      this.innerHTML = `
        <iframe src="https://bdsconvert.github.io/bdsapp/assets/BDSSampleExcelImport.xml" 
                width="100%" height="360" frameborder="0" scrolling="no">
        </iframe>
      `;
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
