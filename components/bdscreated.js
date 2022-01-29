import { GetOnixFiles, GetTitles, GetContents } from "../data/bdsfirebase.js";

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
      } else if (e.target.matches("[oedit-link]")) {
        this.innerHTML = `<bds-onix-create fileid="${this.fileid}" recid="${e.target.id}"></bds-onix-create>`;
      } else if (e.target.matches("[onew-link]")) {
        this.innerHTML = `<bds-onix-create fileid="${this.fileid}" recid=""></bds-onix-create>`;
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
    let created = `<ul class="collection z-depth-1">`;
    created += `
      <li class="collection-item row grey lighten-5">
      <span class="input-field right"><i class="material-icons prefix">search</i><input type="text" id="searchcreated"><label for="search">Search Created</label></span>
      <div class="grey lighten-5"><br/><a href="#bdsfilecreate" class="modal-trigger"><span style="padding-top:1rem;"><i class="material-icons left">add</i> Create a New Onix File</span></a>
        <br/><br/>
            <span>Showing results for: "${keyword}"</span>
      </li>
    `;
    this.createdfiles.forEach((item) => {
      created += `
        <li class="collection-item">
            <span style="font-size:1.25rem;font-weight:500">${item.filename}</span>
            <br />
            <span style="font-size:0.8rem;">File Type: (${item.filetype})</span>
            <a href="#" class="secondary-content">
              <i class="material-icons left" title="Download" id="Export-${item.filename}" download-link>download</i>
            </a>
            <a href="#" class="secondary-content">
              <i class="material-icons left" title="Titles" id="${item.filename}" otitles-link>list</i>
            </a> 
            <br />
            <span style="font-size:0.8rem;">Loaded: ${new Date(item.timestamp).toISOString()}</span>
        </li>
      `;
    });
    created += "</ul>";
    return created;
  }

  CreatedTitlesSearch = (fileid, keyword) => {
    GetTitles(fileid, keyword, 10).then(() => {
      this.titles = JSON.parse(localStorage.getItem(`titles`));
      console.log(this.titles);
      this.innerHTML = this.DisplayCreatedTitles(fileid, keyword);
    });
  };

  DisplayCreatedTitles = (fileid, keyword) => {
    let titlesHtml = `<ul class="collection z-depth-1">`;
    titlesHtml += `
      <li class="collection-item row">
        <a href="#" class="col s5"><strong><i class="material-icons left" created-link>arrow_back</i>Back to Created Files</strong></a>
        <span class="col s4" style="font-size:1.2rem;font-weight:500">${fileid}</span>
        <a href="#" class="col s3"><strong><i class="material-icons left" onew-link>add</i>Create New Title</strong></a>
        <span class="secondary-content input-field" style="margin:1em 2em 0 0;"><i class="material-icons prefix">search</i><input type="text" id="searchcreatedtitles" data-fileid=${fileid}><label for="search">Search Titles</label></span>
        <br/><br/><br/>Showing results for: "${keyword}"
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
              <a href="#" title="View Content" data-filename="${title.Title}" data-fileid=${fileid}>
                <i class="material-icons left-align" title="Edit Onix" id=${title.RecordReference} style="font-size:2rem;font-weight:500" oedit-link>edit</i>
              </a>
            </div>
        </li>      
      `;
    });
    titlesHtml += `</ul>`;
    return titlesHtml;
  };
}
window.customElements.define("bds-created", BdsCreated);
