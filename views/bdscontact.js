export class BDSContact {
  async getPage() {
    return `
        <h4>Contact BDS</h4>
        <form id="contact-form">
          <div class="row">
            <div class="input-field col s12">
              <input id="contact-name" type="text" class="validate" />
              <label for="contact-name">Name</label>
            </div>
          </div>
          <div class="row">
            <div class="input-field col s12">
              <input id="contact-company" type="text" class="validate" />
              <label for="contact-company">Company Name</label>
            </div>
          </div>
          <div class="row">
            <div class="input-field col s12">
              <input id="contact-email" type="email" class="validate" />
              <label for="contact-email">Email</label>
            </div>
          </div>
          <div class="row">
            <div class="input-field col s12">
              <textarea id="contact-msg" class="materialize-textarea validate"></textarea>
              <label for="contact-msg">Message</label>
            </div>
          </div>
          <button class="btn yellow darken-2 z-depth-0">Submit</button>
        </form>  
    `;
  }
}
