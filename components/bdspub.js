import { codelist } from "../data/bdscodelist.js";
import { bdsoe } from "../data/bdsmodel.js";
import { BdsSelect, BdsText, BdsAddDelButtons } from "./bdselements.js";

export class BdsPublisher extends HTMLElement {
  constructor() {
    super();
    this.order = parseInt(this.getAttribute("order"), 10);
    this.numpub = 1;
    this.pubrol = { name: "PublishingRole", id: "", data: "" };
    this.pubtyp = { name: "PublisherIDType", id: "", data: "" };
    this.pubitn = { name: "IDTypeName", id: "", data: "" };
    this.pubval = { name: "IDValue", id: "", data: "" };
    this.pubnam = { name: "PublisherName", id: "", data: "" };
    this.pubwsr = { name: "WebsiteRole", id: "", data: "" };
    this.pubwsl = { name: "WebsiteLink", id: "", data: "" };
  }

  connectedCallback() {
    document.getElementById("pub").addEventListener("click", (e) => {
      if (this.innerHTML === "") {
        this.addPUB();
      }
    });

    this.addEventListener("change", (e) => {
      bdsoe[e.target.id] = e.target.value;
    });

    this.addEventListener("click", (e) => {
      if (e.target.id === "addPUB") {
        this.numpub++;
        this.addPUB();
      } else if (e.target.id === "delPUB") {
        delete bdsoe[this.pubrol.id];
        delete bdsoe[this.pubtyp.id];
        delete bdsoe[this.pubitn.id];
        delete bdsoe[this.pubval.id];
        delete bdsoe[this.pubnam.id];
        delete bdsoe[this.pubwsr.id];
        delete bdsoe[this.pubwsl.id];
        this.numpub--;
        this.addPUB();
      }
    });
  }

  addPUB = () => {
    this.innerHTML = "";
    for (let idx = 0; idx < this.numpub; idx++) {
      this.lbl = `Publisher${idx + 1}`;
      this.pubrol.id = `L${this.order + idx * 7 + 1}-PublishingDetail_0_Publisher_${idx}_PublisherIdentifier_0_PublishingRole_0`;
      this.pubrol.data = bdsoe[this.pubrol.id];
      this.pubtyp.id = `L${this.order + idx * 7 + 2}-PublishingDetail_0_Publisher_${idx}_PublisherIdentifier_0_PublisherIDType_0`;
      this.pubtyp.data = bdsoe[this.pubtyp.id];
      this.pubitn.id = `L${this.order + idx * 7 + 3}-PublishingDetail_0_Publisher_${idx}_PublisherIdentifier_0_IDTypeName_0`;
      this.pubitn.data = bdsoe[this.pubitn.id];
      this.pubval.id = `L${this.order + idx * 7 + 4}-PublishingDetail_0_Publisher_${idx}_PublisherIdentifier_0_IDValue_0`;
      this.pubval.data = bdsoe[this.pubval.id];
      this.pubnam.id = `L${this.order + idx * 7 + 5}-PublishingDetail_0_Publisher_${idx}_PublisherName_0`;
      this.pubnam.data = bdsoe[this.pubnam.id];
      this.pubwsr.id = `L${this.order + idx * 7 + 6}-PublishingDetail_0_Publisher_${idx}_Website_0_WebsiteRole_0`;
      this.pubwsr.data = bdsoe[this.pubwsr.id];
      this.pubwsl.id = `L${this.order + idx * 7 + 7}-PublishingDetail_0_Publisher_${idx}_Website_0_WebsiteLink_0`;
      this.pubwsl.data = bdsoe[this.pubwsl.id];
      this.innerHTML += `
        <h6 class="center">${this.lbl}</h6>
        ${BdsSelect(this.pubrol, codelist.cl045)}
        ${BdsSelect(this.pubtyp, codelist.cl044)}
        ${BdsText(this.pubitn)}
        ${BdsText(this.pubval)}
        ${BdsText(this.pubnam)}
        ${BdsSelect(this.pubwsr, codelist.cl073)}
        ${BdsText(this.pubwsl)}
      `;
    }
    console.log(this.pubrol.id);
    this.innerHTML += `${BdsAddDelButtons("PUB", "PUB")}`;
    M.FormSelect.init(document.querySelectorAll("select"));
  };
}

window.customElements.define("bds-publisher", BdsPublisher);
