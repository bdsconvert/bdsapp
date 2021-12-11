import { authObj } from "../data/bdsfirebase.js";

export class BDSProfile {
  async getPage() {
    document.getElementById("bdsheader").innerHTML = `<h4>${authObj.bdsuser.split("@")[0].toLowerCase()}'s Profile</h4>`;
    document.getElementById("bdscontent").innerHTML = ``;
  }
}
