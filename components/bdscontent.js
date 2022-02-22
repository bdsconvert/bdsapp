import { GetContents } from "../data/bdsfirebase.js";
import { xml2json, formatJson, formatXml } from "../utils/bdsutil.js";

export class BdsContent extends HTMLElement {
  constructor() {
    super();
    this.fileid = this.getAttribute("fileid");
    this.recid = this.getAttribute("recid");
    this.title = this.getAttribute("ttl");
    this.innerHTML = `
      <span class="right" style="margin:1em;cursor:pointer;"><i class="material-icons" content-close>close</i></span><h5 class="center">${this.title}</h5>
      <ul id="contenttab" class="tabs">
        <li class="tab"><a href="#onix${this.recid}" class="onix">Onix</a></li>
        <li class="tab"><a href="#table${this.recid}" class="table">Table</a></li>
      </ul>
      <div id="onix${this.recid}" style="overflow:scroll;height:50vh;margin:1em;"></div>
      <div id="table${this.recid}" style="overflow:scroll;height:50vh;margin:1em;"></div>     
    `;
    M.Tabs.init(document.querySelectorAll(".tabs"));

    GetContents(this.fileid, this.recid).then(() => {
      document.getElementById(`onix${this.recid}`).innerHTML = formatXml(localStorage.getItem(`xml`));
      document.getElementById(`table${this.recid}`).innerHTML = formatJson(localStorage.getItem(`json`));
      // console.log(xml2json(nodes[0], "\t"));
    });
  }

  connectedCallback() {
    this.addEventListener("click", (e) => {
      // e.preventDefault();
      if (e.target.matches("[content-close]")) {
        M.Modal.getInstance(document.querySelector("#bdscontents")).close();
      }
    });
  }
} // class end
window.customElements.define("bds-content", BdsContent);
