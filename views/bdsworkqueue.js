// import { authObj, fbdb, GetWorqueueFiles } from "../data/bdsfirebase.js";
// import { BdsModalButton } from "../components/bdselements.js";
import { BdsOnixCreate } from "../components/bdsonixcreate.js";
import { BdsFileCreate } from "../components/bdsfilecreate.js";
import { BdsUploaded } from "../components/bdsuploaded.js";
import { BdsCreated } from "../components/bdscreated.js";

export class BDSWorkqueue {
  userfiles = [];

  async getPage() {
    document.getElementById("bdscontent").innerHTML = ` 
    <style>
      .card-content-bk {
        background-image: linear-gradient(to right, rgba(0, 0, 60, 0.5), rgba(0, 100, 200, 0.5));
      }
    </style>
    <div class="card">
      <div class="container">
        <div class="card-tabs">
          <ul id="wktabs" class="tabs tabs-fixed-width">
            <li class="tab col s3"><a href="#ufiles" class="active">Uploaded Files</a></li>          
            <li class="tab col s3"><a href="#cofiles">Created Files</a></li>
          </ul>
        </div>
      </div>
      <div class="card-content grey lighten-4">
        <div id="cofiles" class="col s12"><bds-created></bds-created></div>    
        <div id="ufiles" class="col s12"><bds-uploaded></bds-uploaded></div>    
      </div>
    </div>
    `;
    // style="overflow:scroll;height:75vh;margin:0rem 0.25rem 0.25rem 0.25rem;"
    M.Tabs.init(document.querySelectorAll(".tabs", { swipeable: true }));
  }
} // Class End
