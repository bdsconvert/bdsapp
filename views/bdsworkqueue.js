import { authObj, fbdb, GetWorqueueFiles } from "../data/bdsfirebase.js";
import { BdsModalButton } from "../components/bdselements.js";
import { BdsOnixCreate } from "../components/bdsonixcreate.js";
import { BdsFileCreate } from "../components/bdsfilecreate.js";

export class BDSWorkqueue {
  userfiles = [];

  async getPage() {
    this.userfiles = JSON.parse(localStorage.getItem(`userfiles`));
    if (!this.userfiles || this.userfiles.length === 0) {
      await GetWorqueueFiles("");
      this.userfiles = JSON.parse(localStorage.getItem(`userfiles`));
    }
    const keyword = this.userfiles && this.userfiles.length > 0 ? this.userfiles[0].keyword : "";
    document.getElementById("bdsheader").innerHTML = `
    <br/>
    <div class="row z-depth-0" style="padding:1rem;border:1px solid lightgrey;margin:0rem;">
      <ul id="wktabs" class="tabs col s8">
        <li class="tab"><a href="#cofiles">Created Onix Files</a></li>
        <li class="tab"><a href="#bufiles" class="active">Uploaded Onix/Excel Files</a></li>          
      </ul>
      <a href="#bdsfilecreate" class="col s4 modal-trigger"><span class="right" style="padding-top:1rem;"><i class="material-icons left">create</i> Create a New Onix File</span></a>
    </div>
    `; //this.DisplayWorqueueHeader(keyword);
    document.getElementById("bdsfilecreate").innerHTML = `<bds-file-create></bds-file-create>`;
    document.getElementById("bdscontent").innerHTML = `
      <div id="bufiles" style="overflow:scroll;height:75vh;margin:0rem 0.25rem 0.25rem 0.25rem;">${this.DisplayWorkqueueList(keyword)}</div>
      <div id="cofiles" style="overflow:scroll;height:75vh;margin:0rem 0.25rem 0.25rem 0.25rem;"><bds-onix-create></bds-onix-create></div>    
    `;
    M.Tabs.init(document.querySelectorAll(".tabs", { swipeable: true }));
  }
  ////////////////////////////////////////////////////////////////////////////

  DisplayWorqueueHeader = (keyword) => {
    const user = authObj.bdsuser.split("@")[0].toLowerCase();
    return `<span class="center"><h5>${user.charAt(0).toUpperCase()}${user.substr(1)}'s Workqueue</h5></span>`;
  };
  /////////////////////////////////////////////////////////////////////////

  DisplayWorkqueueList = (keyword) => {
    let wklist = `<ul class="collection">`;
    wklist += `
      <li class="collection-item row">
          <span class="secondary-content input-field"><i class="material-icons prefix">search</i><input type="text" id="searchworkqueue"><label for="search">Search Workqueue</label></span>
          </br/>
          <a href="/uploadfile" class="waves-effect uploadfile" upload-link><i class="material-icons left" page-link id="fileupload">file_upload</i>Upload Onix/Excel File</a>
          <br/><br/>
          <span>Showing results for: "${keyword}"</span>
      </li>
    `;
    this.userfiles.forEach((item) => {
      wklist += `
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
    wklist += "</ul>";
    return wklist;
  };

  WorkqueueSearch = async (keyword) => {
    await GetWorqueueFiles(keyword);
    this.userfiles = JSON.parse(localStorage.getItem(`userfiles`));
    document.getElementById("bdscontent").innerHTML = `
      <div id="bufiles" style="overflow:scroll;height:75vh;margin:1em;">${this.DisplayWorkqueueList(keyword)}</div>
      <div id="cofiles" style="overflow:scroll;height:75vh;margin:1em;"><bds-onix-create></bds-onix-create></div>    
    `;
    M.Tabs.init(document.querySelectorAll(".tabs"));
  };
  /////////////////////////////////////////////////////////////////////////
} // Class End
