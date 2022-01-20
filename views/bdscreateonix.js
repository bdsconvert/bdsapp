import { BdsOnixCreate } from "../components/bdsonixcreate.js";
import { BdsText, BdsSelect, BdsButton, BdsModalButton, BdsSelect2 } from "../components/bdselements.js";

export class BDSCreateOnix {
  async getPage() {
    document.getElementById("bdscontent").innerHTML = `<bds-onix-create></bds-onix-create>`;
  }
}
