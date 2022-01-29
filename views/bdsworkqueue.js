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
    <div class="row">
      <div class="col s12">
      <ul id="wktabs" class="tabs">
        <li class="tab col s3"><a href="#ufiles" class="active">Uploaded Files</a></li>          
        <li class="tab col s3"><a href="#cofiles">Created Files</a></li>
      </ul>
     </div>
      <div id="cofiles" class="col s12" style="overflow:scroll;height:75vh;margin:0rem 0.25rem 0.25rem 0.25rem;"><bds-created></bds-created></div>    
      <div id="ufiles" class="col s12" style="overflow:scroll;height:75vh;margin:0rem 0.25rem 0.25rem 0.25rem;"><bds-uploaded></bds-uploaded></div>    
    </div>
    `;
    // document.getElementById("bdscontent").innerHTML = `
    //   <div id="cofiles" style="overflow:scroll;height:75vh;margin:0rem 0.25rem 0.25rem 0.25rem;"><bds-created></bds-created></div>
    //   <div id="ufiles" style="overflow:scroll;height:75vh;margin:0rem 0.25rem 0.25rem 0.25rem;"><bds-uploaded></bds-uploaded></div>
    // `;
    M.Tabs.init(document.querySelectorAll(".tabs", { swipeable: true }));
  }
} // Class End
