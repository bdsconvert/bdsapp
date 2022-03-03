import { authObj, SaveUserFile } from "../data/bdsfirebase.js";
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.0.2/firebase-auth.js";

export class BDSSignup {
  async getPage() {
    document.getElementById("bdscontent").innerHTML = `
      <div id="signup" class="card"> <div class="card-content">
        <span class="card-title">Register with your Email</span>
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
      </div> </div>
    `;
  }

  async signUp(id) {
    const signupForm = document.getElementById(id);
    const email = signupForm["signup-email"].value;
    const password = signupForm["signup-password"].value;

    createUserWithEmailAndPassword(authObj.auth, email, password)
      .then(async (cred) => {
        await SaveUserFile({
          filename: "profile.prf",
          filetype: "prf",
          timestamp: Date.now(),
          Subscriptions: [{ id: 1, Subscribed: Date.now(), Maxtitles: 10 }]
        });
        M.toast({ html: `User "${email}" Registered Successfully` });
        // Send success email
        emailjs.send("service_o2qcu12", "template_hi8z58o", { name: email, email: email }).then(
          function (response) {
            console.log("SUCCESS!", response.status, response.text);
            M.toast({ html: `Successful registration email sent!` });
          },
          function (error) {
            console.log("FAILED...", error);
          }
        );
        signupForm.reset();
      })
      .catch((err) => {
        alert(err.message);
      });
  }
}
