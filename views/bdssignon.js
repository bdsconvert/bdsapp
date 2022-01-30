import { authObj } from "../data/bdsfirebase.js";
import { navigateTo } from "../index.js";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.0.2/firebase-auth.js";

export class BDSSignon {
  async getPage() {
    document.getElementById("bdscontent").innerHTML = `
        <!--<h4>Sign On</h4>-->
        <form id="signon-form">
          <div class="row">
            <div class="input-field col s12">
              <input id="signon-email" type="email" class="validate" required/>
              <label for="signon-email">Email</label>
            </div>
          </div>
          <div class="row">
            <div class="input-field col s12">
              <input id="signon-password" type="password" class="validate" required/>
              <label for="signon-password">Password</label>
            </div>
          </div>
          <button class="btn yellow darken-2 z-depth-0">Sign On</button>
        </form>  
    `;
  }

  async signOn(id) {
    const signonForm = document.getElementById(id);
    const email = signonForm["signon-email"].value;
    const password = signonForm["signon-password"].value;

    signInWithEmailAndPassword(authObj.auth, email, password)
      .then((cred) => {
        navigateTo("/");
        M.toast({ html: `${email} Signed In!` });
      })
      .catch((err) => {
        alert(err.message);
      });
  }
}
