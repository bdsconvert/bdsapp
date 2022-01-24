import { BdsOnixCreate } from "../components/bdsonixcreate.js";

export class BDSCreateOnix {
  async getPage() {
    document.getElementById("bdscontent").innerHTML = `<bds-onix-create></bds-onix-create>`;
  }
}
