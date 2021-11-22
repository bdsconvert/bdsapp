export class BDSSignup {
  async getPage() {
    return `
      <div id="signup">
          <h4>Sign Up</h4>
          <form id="signup-form">
            <div class="row">
              <div class="input-field col s12">
                <input id="signup-email" type="email" class="validate" />
                <label for="signup-email">Email</label>
              </div>
            </div>
            <div class="row">
              <div class="input-field col s12">
                <input id="signup-password" type="password" class="validate" />
                <label for="signup-password">Password</label>
              </div>
            </div>
            <button class="btn yellow darken-2 z-depth-0">Sign Up</button>
          </form>
      </div>    
    `;
  }
}
