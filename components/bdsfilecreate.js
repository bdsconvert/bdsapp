import { SaveUserFile } from "../data/bdsfirebase.js";
import { BdsText, BdsButton } from "./bdselements.js";

export class BdsFileCreate extends HTMLElement {
  constructor() {
    super();

    this.innerHTML = `
      <div class="row">
        <span class="right" style="margin:1em;cursor:pointer;"><i class="material-icons" content-close>close</i></span>
      </div>
      <div class="container row">
        <div class="col s6 push-s2">${BdsText({ id: "newfile", name: "New Onix File Name", data: "" })}</div>
        <div class="col s6"><br/>${BdsButton("createonixfile", "Create")}</div>
      </div>
    `;
  }

  connectedCallback() {
    this.addEventListener("click", async (e) => {
      if (e.target.id === "createonixfile") {
        console.log("create onix clicked");
        const newfile = document.getElementById("newfile").value;
        await SaveUserFile({
          filename: newfile,
          filetype: "Dat",
          timestamp: Date.now()
        });
      }
    });
  }
}

window.customElements.define("bds-file-create", BdsFileCreate);
