import { codelist } from "../data/bdscodelist.js";
import { bdsoe } from "../data/bdsmodel.js";
import { BdsSelect, BdsText, BdsAddDelButtons } from "./bdselements.js";

export class BdsPrice extends HTMLElement {
  constructor() {
    super();
    this.order = parseInt(this.getAttribute("order"), 10);
    this.index = parseInt(this.getAttribute("index"), 10);
    this.numsup = 1;
    this.prcuit = { name: "UnpricedItemType", id: "", data: "" };
    this.prcptc = { name: "PriceType", id: "", data: "" };
    this.prcpqf = { name: "PriceQualifier", id: "", data: "" };
    this.prcdct = { name: "DiscountCodeType", id: "", data: "" };
    this.prcdtn = { name: "DiscountCodeTypeName", id: "", data: "" };
    this.prcdis = { name: "DiscountCode", id: "", data: "" };
    this.prcdit = { name: "DiscountType", id: "", data: "" };
    this.prcdip = { name: "DiscountPercent", id: "", data: "" };
    this.prcdia = { name: "DiscountAmount", id: "", data: "" };
    this.prcsts = { name: "PriceStatus", id: "", data: "" };
    this.prcamt = { name: "PriceAmount", id: "", data: "" };
    this.prccuc = { name: "CurrencyCode", id: "", data: "" };
    this.prccui = { name: "CountriesIncluded", id: "", data: "" };
    this.prcrei = { name: "RegionsIncluded", id: "", data: "" };
    this.prccue = { name: "CountriesExcluded", id: "", data: "" };
    this.prcree = { name: "RegionsExcluded", id: "", data: "" };
  }

  connectedCallback() {
    console.log("ConnectedCallback called!");
    document.getElementById(`prc${this.index}`).addEventListener("click", (e) => {
      if (this.innerHTML === "") {
        this.addPRC();
      }
    });

    this.addEventListener("change", (e) => {
      bdsoe[e.target.id] = e.target.value;
    });

    this.addEventListener("click", (e) => {
      if (e.target.id === "addPRC") {
        this.numprc++;
        this.addPRC();
      } else if (e.target.id === "delPRC") {
        delete bdsoe[this.prcuit.id];
        delete bdsoe[this.prcptc.id];
        delete bdsoe[this.prcpqf.id];
        delete bdsoe[this.prcdct.id];
        delete bdsoe[this.prcdtn.id];
        delete bdsoe[this.prcdis.id];
        delete bdsoe[this.prcdit.id];
        delete bdsoe[this.prcdip.id];
        delete bdsoe[this.prcdia.id];
        delete bdsoe[this.prcsts.id];
        delete bdsoe[this.prcamt.id];
        delete bdsoe[this.prccuc.id];
        delete bdsoe[this.prccui.id];
        delete bdsoe[this.prcrei.id];
        delete bdsoe[this.prccue.id];
        delete bdsoe[this.prcree.id];
        this.numprc--;
        this.addPRC();
      }
    });
  }

  addPRC = () => {
    this.innerHTML = "";
    this.prcuit.id = `Q${this.order + 1}-ProductSupply_${this.index - 1}_SupplyDetail_0_UnpricedItemType_0`;
    this.prcuit.data = bdsoe[this.prcuit.id];
    for (let idx = 0; idx < this.numprc; idx++) {
      // this.lbl = `Supply${idx + 1}`;
      this.prcptc.id = `Q${this.order + idx * 16 + 2}-ProductSupply_${this.index - 1}_SupplyDetail_0_Price_${idx}_PriceType_0`;
      this.prcptc.data = bdsoe[this.prcptc.id];
      this.prcpqf.id = `Q${this.order + idx * 16 + 3}-ProductSupply_${this.index - 1}_SupplyDetail_0_Price_${idx}_PriceQualifier_0`;
      this.prcpqf.data = bdsoe[this.prcpqf.id];
      this.prcdct.id = `Q${this.order + idx * 16 + 4}-ProductSupply_${this.index - 1}_SupplyDetail_0_Price_${idx}_DiscountCoded_0_DiscountCodeType_0`;
      this.prcdct.data = bdsoe[this.prcdct.id];
      this.prcdtn.id = `Q${this.order + idx * 16 + 5}-ProductSupply_${this.index - 1}_SupplyDetail_0_Price_${idx}_DiscountCoded_0_DiscountCodeTypeName_0`;
      this.prcdtn.data = bdsoe[this.prcdtn.id];
      this.prcdis.id = `Q${this.order + idx * 16 + 6}-ProductSupply_${this.index - 1}_SupplyDetail_0_Price_${idx}_DiscountCoded_0_DiscountCode_0`;
      this.prcdis.data = bdsoe[this.prcdis.id];
      this.prcdit.id = `Q${this.order + idx * 16 + 7}-ProductSupply_${this.index - 1}_SupplyDetail_0_Price_${idx}_Discount_0_DiscountType_0`;
      this.prcdit.data = bdsoe[this.prcdit.id];
      this.prcdip.id = `Q${this.order + idx * 16 + 8}-ProductSupply_${this.index - 1}_SupplyDetail_0_Price_${idx}_Discount_0_DiscountPercent_0`;
      this.prcdip.data = bdsoe[this.prcdip.id];
      this.prcdia.id = `Q${this.order + idx * 16 + 9}-ProductSupply_${this.index - 1}_SupplyDetail_0_Price_${idx}_Discount_0_DiscountAmount_0`;
      this.prcdia.data = bdsoe[this.prcdia.id];
      this.prcsts.id = `Q${this.order + idx * 16 + 10}-ProductSupply_${this.index - 1}_SupplyDetail_0_Price_${idx}_PriceStatus_0`;
      this.prcsts.data = bdsoe[this.prcsts.id];
      this.prcamt.id = `Q${this.order + idx * 16 + 11}-ProductSupply_${this.index - 1}_SupplyDetail_0_Price_${idx}_PriceAmount_0`;
      this.prcamt.data = bdsoe[this.prcamt.id];
      this.prccuc.id = `Q${this.order + idx * 16 + 12}-ProductSupply_${this.index - 1}_SupplyDetail_0_Price_${idx}_CurrencyCode_0`;
      this.prccuc.data = bdsoe[this.prccuc.id];
      this.prccui.id = `Q${this.order + idx * 16 + 13}-ProductSupply_${this.index - 1}_SupplyDetail_0_Price_${idx}_Territory_0_CountriesIncluded_0`;
      this.prccui.data = bdsoe[this.prccui.id];
      this.prcrei.id = `Q${this.order + idx * 16 + 14}-ProductSupply_${this.index - 1}_SupplyDetail_0_Price_${idx}_Territory_0_RegionsIncluded_0`;
      this.prcrei.data = bdsoe[this.prcrei.id];
      this.prccue.id = `Q${this.order + idx * 16 + 15}-ProductSupply_${this.index - 1}_SupplyDetail_0_Price_${idx}_Territory_0_CountriesExcluded_0`;
      this.prccue.data = bdsoe[this.prccue.id];
      this.prcree.id = `Q${this.order + idx * 16 + 16}-ProductSupply_${this.index - 1}_SupplyDetail_0_Price_${idx}_Territory_0_RegionsExcluded_0`;
      this.prcree.data = bdsoe[this.prcree.id];
      this.innerHTML += `
        ${BdsSelect(this.prcuit, codelist.cl057)}
        ${BdsSelect(this.prcptc, codelist.cl058)}
        ${BdsSelect(this.prcpqf, codelist.cl059)}
        ${BdsSelect(this.prcdct, codelist.cl100)}
        ${BdsText(this.prcdtn)}
        ${BdsText(this.prcdis)}
        ${BdsSelect(this.prcdit, codelist.cl170)}
        ${BdsText(this.prcdip)}
        ${BdsText(this.prcdia)}
        ${BdsSelect(this.prcsts, codelist.cl061)}
        ${BdsText(this.prcamt)}
        ${BdsSelect(this.prccuc, codelist.cl096)}
        ${BdsSelect(this.prccui, codelist.cl091)}
        ${BdsSelect(this.prcreis, codelist.cl049)}
        ${BdsSelect(this.prccue, codelist.cl091)}
        ${BdsSelect(this.prcree, codelist.cl049)}
      `;
    }
    this.innerHTML += `${BdsAddDelButtons("PRC", "PRC")}`;
    M.FormSelect.init(document.querySelectorAll("select"));
  };
}

window.customElements.define("bds-price", BdsPrice);
