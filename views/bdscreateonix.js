import { BdsOnixCreate } from "../components/bdsonixcreate.js";

export class BDSCreateOnix {
  async getPage() {
    document.getElementById("bdsheader").innerHTML = ``; //`<h5 class="center">Create Onix</h5>`;
    document.getElementById("bdscontent").innerHTML = `
      <bds-onix-create></bds-onix-create>
    `;
  }
}
