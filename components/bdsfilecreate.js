import { SaveUserFile } from "../data/bdsfirebase.js";
import { BdsText, BdsButton } from "./bdselements.js";

export class BdsFileCreate extends HTMLElement {
  constructor() {
    super();

    this.innerHTML = `
      <span class="right" style="margin:1rem;cursor:pointer;"><i class="material-icons modal-close">close</i></span>
      <br/>
      <h5 class="center" style="margin:1rem;border-bottom:1px solid lightgrey;">Create Onix File</h5>
      <br/>
      <div class="container row">
        <div class="col s6 push-s2">${BdsText({ id: "newfile", name: "New Onix File Name", data: "" })}</div>
        <div class="col s6"><br/>${BdsButton("createonixfile", "Create")}</div>
      </div>
    `;
  }

  connectedCallback() {
    this.addEventListener("click", async (e) => {
      if (e.target.id === "createonixfile") {
        const newfile = document.getElementById("newfile").value;
        await SaveUserFile({
          filename: newfile,
          filetype: "Dat",
          timestamp: Date.now()
        });
        M.toast({ html: `${newfile} Created Successfully\n` });
      }
    });
  }
}

window.customElements.define("bds-file-create", BdsFileCreate);
