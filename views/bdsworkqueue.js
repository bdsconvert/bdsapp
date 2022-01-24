// import { authObj, fbdb, GetWorqueueFiles } from "../data/bdsfirebase.js";
// import { BdsModalButton } from "../components/bdselements.js";
import { BdsOnixCreate } from "../components/bdsonixcreate.js";
import { BdsFileCreate } from "../components/bdsfilecreate.js";
import { BdsUploaded } from "../components/bdsuploaded.js";

export class BDSWorkqueue {
  userfiles = [];

  async getPage() {
    document.getElementById("bdsheader").innerHTML = `
    <br/>
    <div class="row grey lighten-5" style="padding:1rem;border:1px solid lightgrey;margin:0rem;">
      <ul id="wktabs" class="tabs col s8 grey lighten-5">
        <li class="tab"><a href="#cofiles">Created Files</a></li>
        <li class="tab"><a href="#ufiles" class="active">Uploaded Files</a></li>          
      </ul>
      <a href="#bdsfilecreate" class="col s4 modal-trigger"><span class="right" style="padding-top:1rem;"><i class="material-icons left">create</i> Create a New Onix File</span></a>
    </div>
    `;
    document.getElementById("bdsfilecreate").innerHTML = `<bds-file-create></bds-file-create>`;
    document.getElementById("bdscontent").innerHTML = `
      <div id="cofiles" style="overflow:scroll;height:75vh;margin:0rem 0.25rem 0.25rem 0.25rem;"><bds-onix-create></bds-onix-create></div>    
      <div id="ufiles" style="overflow:scroll;height:75vh;margin:0rem 0.25rem 0.25rem 0.25rem;"><bds-uploaded></bds-uploaded></div>    
    `;
    M.Tabs.init(document.querySelectorAll(".tabs", { swipeable: true }));
  }
} // Class End
