import { GetTitles, GetContents } from "../data/bdsfirebase.js";
import { formatJson, formatXml } from "../utils/bdsutil.js";

export class BDSTitles {
  fileid = "";
  titles = [];
  constructor(fileid, keyword) {
    console.log(fileid, keyword);
    GetTitles(fileid, keyword, 10).then(() => {
      this.titles = JSON.parse(localStorage.getItem(`titles`));
      // document.getElementById("bdsheader").innerHTML = `<span class="center"><h5>${fileid} Titles</h5></span>`;
      document.getElementById("bdsheader").innerHTML = ``;
      document.getElementById("bdscontent").innerHTML = this.DisplayTitles(fileid, keyword);
    });
  }

  DisplayTitles = (fileid, keyword) => {
    let titlesHtml = `<ul class="collection">`;
    titlesHtml += `
      <li class="collection-item row">
          <!--<span style="color:blue;cursor:pointer"><strong wk-link>Workqueue</strong></span> / ${fileid}-->
          <!--<span class="secondary-content input-field"><i class="material-icons prefix">search</i><input type="text" id="searchtitles" data-fileid=${fileid}><label for="search">Search Titles</label></span>-->
          <!--<br/><br/><br/>-->
          <!--<span>Showing results for: "${keyword}"</span>-->
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

  static DisplayContents = (recid) => {
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
