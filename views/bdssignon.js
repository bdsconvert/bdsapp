export class BDSSignon {
  async getPage() {
    return `
      <div id="signon">
        <h4>Sign On</h4>
        <form id="signon-form">
          <div class="row">
            <div class="input-field col s12">
              <input id="signon-email" type="email" class="validate" />
              <label for="signon-email">Email</label>
            </div>
          </div>
          <div class="row">
            <div class="input-field col s12">
              <input id="signon-password" type="password" class="validate" />
              <label for="signon-password">Password</label>
            </div>
          </div>
          <button class="btn yellow darken-2 z-depth-0">Sign On</button>
        </form>
      </div>    
    `;
  }
}
