import { GetTitles, GetContents } from "../data/bdsfirebase.js";
import { json2xml, unflatten, downloadfile } from "../utils/bdsutil.js";

export class BdsDownload extends HTMLElement {
  constructor() {
    super();
    this.recs = [];
    this.fileid = this.getAttribute("fileid");
    this.recid = this.getAttribute("recid");
    this.DownloadOnixFile(this.fileid);
    this.innerHTML = `
      <span class="right" style="margin:1rem;cursor:pointer;"><i class="material-icons modal-close">close</i></span>
      <br/>
      <h5 class="center" style="margin:1rem;border-bottom:1px solid lightgrey;">Downloading ${this.fileid}</h5>
    `;
  }

  DownloadOnixFile(fileid) {
    let titles = [];
    this.innerHTML += `<br/> Download Started`;

    GetTitles(fileid, "", 0).then(() => {
      titles = JSON.parse(localStorage.getItem(`titles`));
      titles.forEach((title) => {
        this.recs.push(
          new Promise(async (resolve) => {
            GetContents(fileid, title.RecordReference).then(() => {
              const ttl = JSON.parse(localStorage.getItem(`json`));
              let json = Object.fromEntries(Object.entries(ttl).sort());
              // arrays of key values
              json = Object.entries(json).map((p) => {
                return [p[0].slice(p[0].indexOf("-") + 1), p[1]];
              });
              // this.innerHTML += `${formatXml("<Product>" + json2xml(unflatten(Object.fromEntries(json))) + "</Product>")}`;
              this.innerHTML += `<br/> Generating Onix for ${title.RecordReference}...`;
              resolve("<Product>" + json2xml(unflatten(Object.fromEntries(json))) + "</Product>");
            });
          })
        );
      }); // end for each
      Promise.all(this.recs).then((recs) => {
        const onix = `
          <ONIXMessage release="3.0" xmlns="http://ns.editeur.org/onix/3.0/reference">
            ${recs.join("\r\n")}
          </ONIXMessage>
        `;
        // Download
        downloadfile(fileid + ".xml", onix, "data:text/xml;charset=utf-8;");
        this.innerHTML += `<br/> Download Complete`;
      });
    });
  }
}
window.customElements.define("bds-download", BdsDownload);
