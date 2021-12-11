import { authObj, fbdb } from "../data/bdsfirebase.js";
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

export class BDSWorkqueue {
  userfiles = [];

  async getPage() {
    this.userfiles = JSON.parse(localStorage.getItem(`userfiles`));
    if (!this.userfiles || this.userfiles.length === 0) {
      await this.GetWorqueueItems("");
    }
    const keyword = this.userfiles.length > 0 ? this.userfiles[0].keyword : "";
    document.getElementById("bdsheader").innerHTML = this.DisplayWorqueueHeader(keyword);
    document.getElementById("bdscontent").innerHTML = this.DisplayWorkqueueList(keyword);
  }
  ////////////////////////////////////////////////////////////////////////////

  GetWorqueueItems = (keyword) => {
    console.log("Refreshing Userfiles...");
    keyword = keyword.trim().length > 0 ? keyword : "";
    return new Promise((resolve) => {
      onSnapshot(
        query(collection(fbdb, authObj.bdsuser), where("filename", ">=", keyword), where("filename", "<=", keyword + "\uf8ff"), limit(10)),
        (docs) => {
          this.userfiles = [];
          docs.forEach((doc) => {
            this.userfiles.push({
              filename: doc.id,
              filetype: doc.data().filetype,
              timestamp: doc.data().timestamp ? doc.data().timestamp : Date.now(),
              fields: doc.data().fields ? doc.data().fields : [],
              templates: doc.data().templates ? doc.data().templates : {},
              keyword: keyword
            });
          });
          localStorage.clear();
          localStorage.setItem(`userfiles`, JSON.stringify(this.userfiles));
          resolve();
        }
      );
    });
  };
  /////////////////////////////////////////////////////////////////////////

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
          </br/><br/><br/>
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
              <i class="material-icons left" title="Titles" id=${item.filename} file-link>list</i>
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
    await this.GetWorqueueItems(keyword);
    document.getElementById("bdsheader").innerHTML = this.DisplayWorqueueHeader(keyword);
    document.getElementById("bdscontent").innerHTML = this.DisplayWorkqueueList(keyword);
  };
  /////////////////////////////////////////////////////////////////////////
} // Class End
