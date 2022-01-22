import { authObj } from "../data/bdsfirebase.js";
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.0.2/firebase-auth.js";

export class BDSSignup {
  async getPage() {
    document.getElementById("bdscontent").innerHTML = `
      <div id="signup">
          <form id="signup-form">
            <div class="row">
              <div class="input-field col s12">
                <input id="signup-email" type="email" class="validate" required/>
                <label for="signup-email">Email</label>
              </div>
            </div>
            <div class="row">
              <div class="input-field col s12">
                <input id="signup-password" type="password" class="validate" required/>
                <label for="signup-password">Password</label>
              </div>
            </div>
            <button class="btn yellow darken-2 z-depth-0">Sign Up</button>
          </form>
      </div>    
    `;
  }

  async signUp(id) {
    const signupForm = document.getElementById(id);
    const email = signupForm["signup-email"].value;
    const password = signupForm["signup-password"].value;

    createUserWithEmailAndPassword(authObj.auth, email, password)
      .then((cred) => {
        signupForm.reset();
        alert(`User "${email}" Registered Successfully`);
      })
      .catch((err) => {
        alert(err.message);
      });
  }
}
