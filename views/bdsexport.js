import { authObj, fbdb } from "../data/bdsfirebase.js";
import {
  collection,
  //collectionGroup,
  query,
  where,
  limit,
  //arrayUnion,
  doc,
  getDocs,
  setDoc,
  updateDoc,
  onSnapshot
  //serverTimestamp
} from "https://www.gstatic.com/firebasejs/9.0.2/firebase-firestore.js";

export class BDSExport {
  fileid = "";
  fields = [];
  templates = {};
  constructor(fileid, fields, templates) {
    this.fileid = fileid.slice(7);
    //this.fields = fields.split(",");
    //this.templates = JSON.parse(templates);
    //console.log(this.templates);
    document.getElementById("bdsheader").innerHTML = ``;
    document.getElementById("bdscontent").innerHTML = this.DisplayExportFields();
  }

  DisplayExportFields = () => {
    const file = JSON.parse(localStorage.getItem("userfiles")).find((file) => file.filename === this.fileid);

    let flds = "";
    file.fields.forEach((field) => {
      flds += `
      <p>
        <label><input type="checkbox" value=${field} /><span>${field}</span></label>
      </p>
    `;
    });

    let tmplts = "";
    for (let key in file.templates) {
      //tmplts += `<option value=${key} id=${key} data-fileid="${this.fileid}" data-flds=${file.templates[key]}></options>`;
      tmplts += `<option value=${key} id=${key} data-fileid="${this.fileid}"></options>`;
    }

    const exp = `
    <div style="margin:2em;">
      <div><h5>Export ${this.fileid}</h5></div>
      <div class="divider"></div>
      <br/>
        <div class="row">
          <div class="col s4">
            <input list="templates" name="template" id="template" placeholder="Select/Create Template" />
            <datalist id="templates">
              ${tmplts}
            </datalist>
          </div>
          <div class="col s8 right-align">
            <a class="waves-effect waves-light btn" id="createsavetemplate" data-fileid="${this.fileid}"><i class="material-icons left">save</i>Create/Save Template</a>
            <a class="waves-effect waves-light btn" id="download"><i class="material-icons left">download</i>Export</a>
          </div>
        </div>
        <div class="row">
          <form action="#">
            <label><input type="checkbox" id="selectall" /><span>Select All</span></label>
          <div class="divider"></div>
          ${flds}
          </form>
        </div>
    </div>
  `;

    return exp;
  };

  static ClearExportFields = () => {
    const fields = document.querySelectorAll("p label input[type='checkbox']");
    fields.forEach((field) => {
      field.checked = false;
    });
  };

  static SelectAllExportFields = () => {
    const selectall = document.getElementById("selectall");
    const fields = document.querySelectorAll("p label input[type='checkbox']");
    fields.forEach((field) => {
      field.checked = selectall.checked ? true : false;
    });
  };

  static SelectExportFields = () => {
    const selectall = document.getElementById("selectall");
    const fields = document.querySelectorAll("p label input[type='checkbox']");
    const fieldschecked = document.querySelectorAll("p label input[type=checkbox]:checked");
    selectall.indeterminate = fieldschecked.length > 0 && fieldschecked.length !== fields.length ? true : false;
  };

  static SelectTemplateFields = (template) => {
    this.ClearExportFields();
    const tmplt = document.getElementById(`${template}`);
    if (tmplt) {
      const file = JSON.parse(localStorage.getItem("userfiles")).find((file) => file.filename === tmplt.dataset.fileid);
      //tmplt.dataset.flds.split(",").forEach((fld) => {
      file.templates[template].forEach((fld) => {
        document.querySelector(`input[value=${fld}]`).checked = true;
        this.SelectExportFields();
      });
    }
  };

  static SaveTemplate = async (id) => {
    const fileid = document.getElementById(id).dataset.fileid;
    const template = document.getElementById("template").value;
    const fieldschecked = document.querySelectorAll("p label input[type=checkbox]:checked");
    const flds = Array.from(fieldschecked).map((field) => field.value);
    const et = {};
    et[template] = flds;
    await setDoc(doc(collection(fbdb, authObj.bdsuser), fileid), { templates: et }, { merge: true });
  };

  static DownloadTemplate = async (id) => {
    const fieldschecked = document.querySelectorAll("p label input[type=checkbox]:checked");
    const flds = Array.from(fieldschecked).map((field) => field.value);
    console.log(flds);
  };

  // static ExportToCSV = (flds) => {
  //   let recs = [];
  //   userfile.titles.forEach((title) => {
  //     recs.push(
  //       new Promise((resolve) => {
  //         onSnapshot(query(collection(fbdb, authObj.bdsuser, userfile.FileName, "Titles", title.RecordReference, "Contents")), (docs) => {
  //           docs.forEach((doc) => {
  //             if (doc.id === "json") {
  //               resolve(JSON.parse(doc.data().json));
  //             }
  //           }); // docs.forEach
  //         }); // onSnapshot
  //       }) // new Promise
  //     ); // recs.push
  //   }); // titles.forEach

  //   let csv = "";
  //   Promise.all(recs).then((recs) => {
  //     const hdr = flds.join(", ");
  //     recs.forEach((rec) => {
  //       csv += "\r\n";
  //       flds.forEach((fld) => {
  //         csv += '"' + (rec[fld] ? rec[fld] : "") + '",';
  //       });
  //     });

  //     //Download
  //     const blob = new Blob([hdr + csv], { type: "data:text/csv;charset=utf-8;" });
  //     const link = document.createElement("a");
  //     if (link !== undefined) {
  //       const url = URL.createObjectURL(blob);
  //       link.setAttribute("href", url);
  //       link.style = "visibility:hidden";
  //       link.download = userfile.FileName + ".csv";
  //       document.body.appendChild(link);
  //       link.click();
  //       document.body.removeChild(link);
  //     }
  //   }); // Promise.all
  // };
}
