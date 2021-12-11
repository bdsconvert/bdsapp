import { authObj, fbdb } from "../data/bdsfirebase.js";
import { xml2json, json2xml, flatten, unflatten, formatJson, formatXml, union } from "../modules/bdsutil.js";
import {
  collection,
  //collectionGroup,
  query,
  where,
  limit,
  //arrayUnion,
  //doc,
  //getDocs,
  //setDoc,
  //updateDoc,
  onSnapshot
  //serverTimestamp
} from "https://www.gstatic.com/firebasejs/9.0.2/firebase-firestore.js";

export class BDSTitles {
  fileid = "";
  titles = [];
  constructor(fileid, keyword) {
    console.log(fileid, keyword);
    // Check if titles for the file already loaded else reset
    this.titles = JSON.parse(localStorage.getItem(`titles`));
    if (this.titles && this.titles.length > 0 && (fileid !== this.titles[0].fileid || keyword !== this.titles[0].keyword)) {
      localStorage.removeItem(`titles`);
      this.titles = [];
    }
    document.getElementById("bdsheader").innerHTML = `<span class="center"><h5>${fileid} Titles</h5></span>`;
    if (!this.titles || this.titles.length === 0) {
      this.GetTitles(fileid, keyword).then(() => {
        document.getElementById("bdscontent").innerHTML = this.DisplayTitles(fileid, keyword);
      });
    } else {
      document.getElementById("bdscontent").innerHTML = this.DisplayTitles(fileid, keyword);
    }
  }

  DisplayTitles = (fileid, keyword) => {
    let titlesHtml = `<ul class="collection">`;
    titlesHtml += `
      <li class="collection-item row">
          <span class="secondary-content input-field"><i class="material-icons prefix">search</i><input type="text" id="searchtitles" data-fileid=${fileid}><label for="search">Search Titles</label></span>
          </br/><br/><br/>
          <span>Showing results for: "${keyword}"</span>
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

  GetTitles = (fileid, keyword) => {
    console.log(`Getting titles for ${fileid}`);
    this.titles = [];
    keyword = keyword.trim().length > 0 ? keyword : "";
    return new Promise((resolve) => {
      onSnapshot(
        query(
          collection(fbdb, authObj.bdsuser, fileid, "Titles"),
          where("Title", ">=", keyword),
          where("Title", "<=", keyword + "\uf8ff"),
          limit(10)
        ),
        (docs) => {
          docs.forEach((doc) => {
            const title = doc.data();
            title.fileid = fileid;
            title.keyword = keyword;
            this.titles.push(title);
          });
          localStorage.setItem(`titles`, JSON.stringify(this.titles));
          resolve();
        }
      );
    });
  };

  static DisplayContents = (recid) => {
    const rec = document.getElementById(`${recid}`);
    const fileid = rec.dataset.fileid;
    const content = document.querySelector(".modal");
    content.innerHTML = `<h5 class="center">${rec.dataset.filename}</h5>`;
    content.innerHTML += `
        <ul id="contenttab" class="tabs">
          <li class="tab"><a href="#onix${fileid}" class="onix">Onix</a></li>
          <li class="tab"><a href="#table${fileid}" class="table">Table</a></li>
        </ul>
      <div id="onix${fileid}" style="overflow:scroll;height:50vh;margin:1em;"></div>
      <div id="table${fileid}" style="overflow:scroll;height:50vh;margin:1em;"></div>    
    `;
    M.Tabs.init(document.querySelectorAll(".tabs"));

    onSnapshot(query(collection(fbdb, authObj.bdsuser, fileid, "Titles", recid, "Contents"), limit(2)), (docs) => {
      docs.forEach((doc) => {
        if (doc.id === "xml") document.getElementById(`onix${fileid}`).innerHTML = formatXml(doc.data().xml);
        if (doc.id === "json") document.getElementById(`table${fileid}`).innerHTML = formatJson(doc.data().json);
      });
    });
  };
} // Class End
