import { authObj } from "../data/bdsfirebase.js";

export class BDSWorkqueue {
  async getPage() {
    return `
      <h4>${authObj.bdsuser.split("@")[0].toLowerCase()}'s Workqueue</h4>
    `;
  }
}
