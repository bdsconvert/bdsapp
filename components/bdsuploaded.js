import { authObj, fbdb, GetWorqueueFiles, GetTitles, GetContents } from "../data/bdsfirebase.js";
import { formatJson, formatXml } from "../utils/bdsutil.js";

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
} // Class End
window.customElements.define("bds-uploaded", BdsUploaded);
