import { authObj } from "../data/bdsfirebase.js";

export class BDSProfile {
  async getPage() {
    let subs = "";
    authObj.subscriptions.forEach((sub) => {
      subs += `
        <tr>
          <td>${sub.id}</td> 
          <td>${new Date(sub.Subscribed).toLocaleString()}</td> 
          <td>${sub.Maxtitles}</td> 
        </tr>
      `;
    });
    document.getElementById("bdscontent").innerHTML = `
    <div class="card">
      <div class="card-content">
        <ul>
          <li class="row">
            <span class="col s4 right-align">User:</span>
            <span class="col s8 left-align"><strong>${authObj.displayname}</strong></span>
          </li>
          <li class="row">
            <span class="col s4 right-align">Login Id:</span>
            <span class="col s8 left-align"><strong>${authObj.bdsuser}</strong></span>
          </li>
          <li class="row ">
            <span class="col s4 right-align">Created:</span>
            <span class="col s8 left-align"><strong>${authObj.user.metadata.creationTime}</strong></span>
          </li>      
          <li class="row ">
            <span class="col s4 right-align">Last SignIn:</span>
            <span class="col s8 left-align"><strong>${authObj.user.metadata.lastSignInTime}</strong></span>
          </li>      
          <li class="row valign-wrapper">
            <span class="col s4 l4 right-align">Subscriptions:</span>
            <table class="col s8 l8 striped highlight centered">
              <thead>
                <tr>
                  <th>Id</th> <th>Subscribtion Date</th> <th>Max Titles</th>
                </tr>
              </thead>
              <tbody>
                ${subs}
              </tbody>
            </table>
          </li>
        </ul>
      </div>
    </div>
  `;

    //`<h4>${authObj.bdsuser.split("@")[0].toLowerCase()}'s Profile</h4>`;
  }
}
