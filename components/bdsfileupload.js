export class BdsFileUpload extends HTMLElement {
  constructor() {
    super();
    this.innerHTML = `
      <span class="right" style="margin:1em;cursor:pointer;"><i class="material-icons" content-close>close</i></span>
      <form action="#" class="container">
        <h5>Upload Onix/Excel files</h5>
        <div class="file-field input-field center">
          <div class="btn">
            <span>Browse</span>
            <input type="file" id="bdsfile">
          </div>
          <div class="file-path-wrapper">
            <input class="file-path validate" type="text" placeholder="Upload Onix or Excel file">
          </div>
        </div>
      </form> 
    `;
  }
} // Class End
window.customElements.define("bds-file-upload", BdsFileUpload);
