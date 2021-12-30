import { BdsOnixCreate } from "../components/bdsonixcreate.js";

export class BDSCreateOnix {
  async getPage() {
    document.getElementById("bdsheader").innerHTML = `<h4>Create Onix</h4>`;
    document.getElementById("bdscontent").innerHTML = `
      <bds-onix-create></bds-onix-create>
      <p id="bdsoe"></p>
    `;
  }
}
