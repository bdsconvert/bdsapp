import { authObj } from "../data/bdsfirebase.js";

export class BDSProfile {
  async getPage() {
    document.getElementById("bdscontent").innerHTML = `
    <div class="card">
    <div class="card-content container">
      <ul>
        <li class="row">
          <span class="col s3 right-align">User:</span>
          <span class="col s9 left-align"><strong>${authObj.displayname}</strong></span>
        </li>
        <li class="row ">
          <span class="col s3 right-align">Login Id:</span>
          <span class="col s9 left-align"><strong>${authObj.bdsuser}</strong></span>
        </li>
        <li class="row ">
          <span class="col s3 right-align">Created:</span>
          <span class="col s9 left-align"><strong>${authObj.user.metadata.creationTime}</strong></span>
        </li>      
        <li class="row ">
          <span class="col s3 right-align">Last SignIn:</span>
          <span class="col s9 left-align"><strong>${authObj.user.metadata.lastSignInTime}</strong></span>
        </li>      
      </ul>
    </div>
    </div>
    `;

    //`<h4>${authObj.bdsuser.split("@")[0].toLowerCase()}'s Profile</h4>`;
  }
}
