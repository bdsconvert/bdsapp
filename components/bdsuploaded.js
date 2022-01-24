import { authObj, fbdb, GetWorqueueFiles, GetTitles, GetContents, SaveExportTemplate } from "../data/bdsfirebase.js";
import { formatJson, formatXml } from "../utils/bdsutil.js";
import { BDSExport } from "../views/bdsexport.js";

export class BdsUploaded extends HTMLElement {
  userfiles = [];
  fileid = "";
  constructor() {
    super();
    this.innerHTML = "";
  }
  connectedCallback() {
    this.UploadedFilesSearch("");

    this.addEventListener("change", (e) => {
      e.preventDefault();
      if (e.target.id === "searchuploaded") {
        console.log(`Seaching ${e.target.value}`);
        this.UploadedFilesSearch(e.target.value);
      } else if (e.target.id === "searchtitles") {
        console.log(`Seaching ${e.target.value}`);
        this.UploadedTitlesSearch(this.fileid, e.target.value);
      } else if (e.target.id === "template") {
        console.log(e.target.value);
        this.SelectTemplateFields(e.target.value);
      } else if (e.target.id === "createsavetemplate") {
        BDSExport.SaveTemplate(e.target.id);
      } else if (e.target.id === "download") {
        BDSExport.DownloadTemplate(e.target.id);
      }
    });

    this.addEventListener("click", (e) => {
      e.preventDefault();

      if (e.target.matches("[file-link]")) {
        this.fileid = e.target.id;
        this.UploadedTitlesSearch(this.fileid, "");
      } else if (e.target.matches("[rec-link]")) {
        this.DisplayContents(e.target.parentElement.id);
      }
      // Export click
      else if (e.target.matches("[export-link]")) {
        this.DisplayExportFields(e.target.id.slice(7));
      }
      // Export Select All click
      else if (e.target.matches("[select-all]")) {
        const selallid = document.getElementById("selectall");
        const selall = selallid.checked || selallid.indeterminate;
        // const indeterminate = selallid.indeterminate;
        if (selall) {
          selallid.indeterminate = false;
          selallid.checked = false;
          this.ClearExportFields();
        } else {
          selallid.checked = true;
          this.SelectAllExportFields();
        }
      }

      // Export Checkbox click
      else if (e.target.matches("[select-field]")) {
        const selid = e.target.parentElement.firstChild;
        selid.checked = selid.checked ? false : true;
        this.SelectExportFields();
      }

      // Save Template Click
      else if (e.target.id === "createsavetemplate") {
        this.SaveTemplate(e.target.id);
      }

      // Export Download Click
      else if (e.target.id === "download") {
        BDSExport.DownloadTemplate(e.target.id);
      }
    });
  }

  UploadedFilesSearch = (keyword) => {
    GetWorqueueFiles(keyword).then((uploadedfiles) => {
      this.userfiles = JSON.parse(localStorage.getItem(`userfiles`));
      this.innerHTML = this.DisplayUploadedFiles(keyword);
    });
  };

  DisplayUploadedFiles(keyword) {
    let uploaded = `<ul class="collection z-depth-1">`;
    uploaded += `
      <li class="collection-item row grey lighten-5">
          <span class="secondary-content input-field"><i class="material-icons prefix">search</i><input type="text" id="searchuploaded"><label for="search">Search Uploaded</label></span>
          </br/>
          <a href="/uploadfile" class="waves-effect uploadfile" upload-link><i class="material-icons left" page-link id="fileupload">file_upload</i>Upload Onix/Excel File</a>
          <br/><br/>
          <span>Showing results for: "${keyword}"</span>
      </li>
    `;
    this.userfiles.forEach((item) => {
      uploaded += `
        <li class="collection-item">
            <span style="font-size:1.25rem;font-weight:500">${item.filename}</span>
            <br />
            <span style="font-size:0.8rem;">File Type: (${item.filetype})</span>
            <a href="#" class="secondary-content">
              <i class="material-icons left" title="Export" id="Export-${item.filename}" export-link>send</i>
            </a>
            <a href="#" class="secondary-content">
              <i class="material-icons left" title="Titles" id="${item.filename}" file-link>list</i>
            </a> 
            <br />
            <span style="font-size:0.8rem;">Loaded: ${new Date(item.timestamp).toISOString()}</span>
        </li>
      `;
    });
    uploaded += "</ul>";
    return uploaded;
  }

  UploadedTitlesSearch = (fileid, keyword) => {
    GetTitles(fileid, keyword, 10).then(() => {
      this.titles = JSON.parse(localStorage.getItem(`titles`));
      this.innerHTML = this.DisplayUploadedTitles(fileid, keyword);
    });
  };

  DisplayUploadedTitles = (fileid, keyword) => {
    let titlesHtml = `<ul class="collection container">`;
    titlesHtml += `
      <li class="collection-item row">
        <a href="#" class="col s2"><strong><i class="material-icons left" wk-link>arrow_back</i>Go Back</strong></a>
        <span class="col s8 pull-2 center" style="font-size:1.2rem;font-weight:500">${fileid}</span>
        <span class="secondary-content input-field" style="margin:0;"><i class="material-icons prefix">search</i><input type="text" id="searchtitles" data-fileid=${fileid}><label for="search">Search Titles</label></span>
        <br/><br/>Showing results for: "${keyword}"
      </li>
    `;
    this.titles.forEach((title) => {
      titlesHtml += `
        <li class="collection-item row">
            <div class="col s9">
              <span style="font-size:1.25rem;font-weight:500">${title.Title}</span>
              <br/>
              <span style="font-size:0.8rem;">By ${title.Author}</span>          
              <br/>
              <span style="font-size:0.8rem;">${title.RecordReference}</span>
            </div>
            <div class="col s3 right-align">
              <br/>
              <a href="#bdscontents" class="modal-trigger" title="View Content" id=${title.RecordReference} data-filename="${title.Title}" data-fileid=${fileid}>
                <i class="material-icons left-align" style="font-size:2rem;font-weight:500" rec-link>code</i>
                <i class="material-icons left-align" rec-link>arrow_right</i>
                <i class="material-icons left-align" style="font-size:2rem;font-weight:500" rec-link>toc</i>
              </a>
            </div>
        </li>      
      `;
    });
    titlesHtml += `</ul>`;
    return titlesHtml;
  };

  DisplayContents = (recid) => {
    const rec = document.getElementById(`${recid}`);
    const fileid = rec.dataset.fileid;
    const content = document.querySelector(".modal");
    content.innerHTML = `<span class="right" style="margin:1em;cursor:pointer;"><i class="material-icons" content-close>close</i></span><h5 class="center">${rec.dataset.filename}</h5>`;
    content.innerHTML += `
        <ul id="contenttab" class="tabs">
          <li class="tab"><a href="#onix${fileid}" class="onix">Onix</a></li>
          <li class="tab"><a href="#table${fileid}" class="table">Table</a></li>
        </ul>
      <div id="onix${fileid}" style="overflow:scroll;height:50vh;margin:1em;"></div>
      <div id="table${fileid}" style="overflow:scroll;height:50vh;margin:1em;"></div>    
    `;
    M.Tabs.init(document.querySelectorAll(".tabs"));

    GetContents(fileid, recid).then(() => {
      document.getElementById(`onix${fileid}`).innerHTML = formatXml(localStorage.getItem(`xml`));
      document.getElementById(`table${fileid}`).innerHTML = formatJson(localStorage.getItem(`json`));
    });
  };

  DisplayExportFields = (fileid) => {
    const file = JSON.parse(localStorage.getItem("userfiles")).find((file) => file.filename === fileid);

    let flds = "";
    file.fields.forEach((field) => {
      flds += `
      <p>
        <label><input type="checkbox" value=${field} /><span select-field>${field}</span></label>
      </p>
    `;
    });

    let tmplts = "";
    for (let key in file.templates) {
      //tmplts += `<option value=${key} id=${key} data-fileid="${this.fileid}" data-flds=${file.templates[key]}></options>`;
      tmplts += `<option value=${key} id=${key} data-fileid="${fileid}"></options>`;
    }

    const exp = `
    <div style="margin:2em;">
      <div class="row">
        <a href="#" class="col s2"><strong><i class="material-icons left" wk-link>arrow_back</i>Go Back</strong></a>
        <span class="col s8 pull-2 center" style="font-size:1.2rem;font-weight:500">${fileid}</span>
      </div>
      <!--<div><h5>Export ${fileid}</h5></div>-->
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
            <a class="waves-effect waves-light btn" id="createsavetemplate" data-fileid="${fileid}"><i class="material-icons left">save</i>Create/Save Template</a>
            <a class="waves-effect waves-light btn" id="download" data-fileid="${fileid}"><i class="material-icons left">download</i>Export</a>
          </div>
        </div>
        <div class="row">
          <form action="#">
          <label for="selectall"><input type="checkbox" id="selectall"/><span select-all>Select All</span></label>
          <div class="divider"></div>
          ${flds}
          </form>
        </div>
    </div>
  `;
    this.innerHTML = exp;
  };

  ClearExportFields = () => {
    const fields = document.querySelectorAll("p label input[type='checkbox']");
    fields.forEach((field) => {
      field.checked = false;
    });
  };

  SelectTemplateFields = (template) => {
    this.ClearExportFields();
    const tmplt = document.getElementById(`${template}`);
    if (tmplt) {
      const file = JSON.parse(localStorage.getItem("userfiles")).find((file) => file.filename === tmplt.dataset.fileid);
      file.templates[template].forEach((fld) => {
        document.querySelector(`input[value=${CSS.escape(fld)}]`).checked = true;
        this.SelectExportFields();
      });
    }
  };

  SelectExportFields = () => {
    const selectall = document.getElementById("selectall");
    const fields = document.querySelectorAll("p label input[type='checkbox']");
    const fieldschecked = document.querySelectorAll("p label input[type=checkbox]:checked");
    selectall.indeterminate = fieldschecked.length > 0 && fieldschecked.length !== fields.length ? true : false;
  };

  SelectAllExportFields = () => {
    const selectall = document.getElementById("selectall");
    const fields = document.querySelectorAll("p label input[type='checkbox']");
    fields.forEach((field) => {
      field.checked = selectall.checked ? true : false;
    });
  };

  SaveTemplate = async (id) => {
    const fileid = document.getElementById(id).dataset.fileid;
    const template = document.getElementById("template").value;
    const fieldschecked = document.querySelectorAll("p label input[type=checkbox]:checked");
    const flds = Array.from(fieldschecked).map((field) => field.value);
    const et = {};
    et[template] = flds;
    await SaveExportTemplate(fileid, et);
  };

  DownloadTemplate = async (id) => {
    const fieldschecked = document.querySelectorAll("p label input[type=checkbox]:checked");
    const flds = Array.from(fieldschecked).map((field) => field.value);

    // Get Titles
    const fileid = document.getElementById(id).dataset.fileid;
    await GetTitles(fileid, "", 100);
    const titles = JSON.parse(localStorage.getItem(`titles`));
    let recs = [];
    let hdr = "";
    let csv = "";
    titles.forEach((doc) => {
      recs.push(
        new Promise(async (resolve) => {
          await GetContents(fileid, doc.RecordReference);
          const content = JSON.parse(localStorage.getItem(`json`));
          csv = "";
          flds.forEach((fld) => {
            csv += ',"' + (content[fld] ? content[fld] : "") + '"';
          });
          resolve(csv.slice(1));
        })
      );
    });

    Promise.all(recs).then((recs) => {
      csv = recs.join("\r\n");
      hdr = flds.join(",") + "\r\n";
      //Download
      const blob = new Blob([hdr + csv], { type: "data:text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      if (link !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.style = "visibility:hidden";
        link.download = fileid + ".csv";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    });
  };
} // Class End
window.customElements.define("bds-uploaded", BdsUploaded);