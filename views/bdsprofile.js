import { authObj } from "../data/bdsfirebase.js";

export class BDSProfile {
  async getPage() {
    return `
      <h4>${authObj.bdsuser.split("@")[0].toLowerCase()}'s Profile</h4>
    `;
  }
}
