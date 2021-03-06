import { GetOnixFiles, GetTitles, GetContents } from "../data/bdsfirebase.js";
import { BdsDownload } from "./bdsdownload.js";
export class BdsCreated extends HTMLElement {
  fileid = "";
  constructor() {
    super();
    this.innerHTML = "";
  }

  connectedCallback() {
    this.CreatedFilesSearch("");
    this.addEventListener("change", (e) => {
      e.preventDefault();
      if (e.target.id === "searchcreated") {
        console.log(`Seaching ${e.target.value}`);
        this.CreatedFilesSearch(e.target.value);
      } else if (e.target.id === "searchcreatedtitles") {
        console.log(`Seaching ${e.target.value}`);
        this.CreatedTitlesSearch(this.fileid, e.target.value);
      }
    });

    this.addEventListener("click", (e) => {
      e.preventDefault();
      if (e.target.matches("[otitles-link]")) {
        this.fileid = e.target.id;
        this.CreatedTitlesSearch(this.fileid, "");
      } else if (e.target.matches("[download-link]")) {
        document.getElementById("bdsdownload").innerHTML = `<bds-download fileid="${e.target.id.slice(9)}" recid=""></bds-download>`;
      } else if (e.target.matches("[oedit-link]")) {
        this.innerHTML = `<div class="card"><div class="card-content"><bds-onix-create fileid="${this.fileid}" recid="${e.target.id}"></bds-onix-create></div></div>`;
      } else if (e.target.matches("[onew-link]")) {
        this.innerHTML = `<div class="card"><div class="card-content"><bds-onix-create fileid="${this.fileid}" recid=""></bds-onix-create></div></div>`;
      } else if (e.target.matches("[created-link]")) {
        this.CreatedFilesSearch("");
      } else if (e.target.matches("[titlesback-link]")) {
        // back from onix edit
        this.CreatedTitlesSearch(this.fileid, "");
      }
    });
  }

  CreatedFilesSearch(keyword) {
    GetOnixFiles(keyword).then((createdfiles) => {
      this.createdfiles = JSON.parse(localStorage.getItem(`createdfiles`));
      // console.log(this.createdfiles);
      this.innerHTML = this.DisplayCreatedFiles(keyword);
      document.getElementById("bdsfilecreate").innerHTML = `<bds-file-create></bds-file-create>`;
    });
  }

  DisplayCreatedFiles(keyword) {
    let created = ``;
    created += `
    <div class="card"><div class="card-content">
      <div class="row">
        <a href="#bdsfilecreate" class="col s6 l9 modal-trigger"><span style="padding-top:1rem;"><i class="material-icons left">add</i> Create a New Onix File</span></a>
        <span class="col s6 l3 input-field right"><i class="material-icons prefix">search</i><input type="text" id="searchcreated"><label for="search">Search Created</label></span>
        <span class="col s12">Showing results for: "${keyword}"</span>
      </div>
      <ul class="collection z-depth-1" style="overflow:scroll;height:70vh;">
    `;
    this.createdfiles.forEach((item) => {
      created += `
        <li class="collection-item">
            <span style="font-size:1.25rem;font-weight:500">${item.filename}</span>
            <br />
            <span style="font-size:0.8rem;">File Type: (${item.filetype})</span>
            <a class="secondary-content modal-trigger" href="#bdsdownload">
              <i class="material-icons left" title="Download" id="download-${item.filename}" download-link>download</i>
            </a>
            <a href="#" class="secondary-content">
              <i class="material-icons left" title="Titles" id="${item.filename}" otitles-link>list</i>
            </a> 
            <br />
            <span style="font-size:0.8rem;">File Size: ${item.filesize || 0}</span>
            <br />
            <span style="font-size:0.8rem;">Created: ${new Date(item.timestamp).toLocaleString()}</span>
        </li>
      `;
    });
    created += "</ul></div></div>";
    return created;
  }

  CreatedTitlesSearch = (fileid, keyword) => {
    GetTitles(fileid, keyword, 10).then(() => {
      this.titles = JSON.parse(localStorage.getItem(`titles`));
      this.innerHTML = this.DisplayCreatedTitles(fileid, keyword);
    });
  };

  DisplayCreatedTitles = (fileid, keyword) => {
    let titlesHtml = ``;
    titlesHtml += `
    <div class="card"><div class="card-content">
      <div class="row">
        <a href="#" class="col s6 l5"><i class="material-icons left" created-link>arrow_back</i>Back to Created Files</a>
        <span class="col s6 l4" style="font-size:1.2rem;font-weight:500">${fileid}</span>
        <a href="#" class="col s4 l3"><i class="material-icons left" onew-link>add</i>Create New Title</a>        
        <span class="col l3 offset-l9 input-field"><i class="material-icons prefix">search</i><input type="text" id="searchcreatedtitles" data-fileid=${fileid}><label for="search">Search Titles</label></span>
        <span class="col s12">Showing results for: "${keyword}"</span>
        </div>
      <ul class="collection z-depth-1">
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
              <a href="#" title="View Content" data-filename="${title.Title}" data-fileid=${fileid}>
                <i class="material-icons left-align" title="Edit Onix" id=${title.RecordReference} style="font-size:2rem;font-weight:500" oedit-link>edit</i>
              </a>
            </div>
        </li>      
      `;
    });
    titlesHtml += `</ul></div></div>`;
    return titlesHtml;
  };
}
window.customElements.define("bds-created", BdsCreated);
