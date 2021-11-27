import { authObj } from "../data/bdsfirebase.js";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.0.2/firebase-auth.js";

export class BDSSignon {
  async getPage() {
    return `
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
    `;
  }

  async signOn(id) {
    const signonForm = document.getElementById(id);
    const email = signonForm["signon-email"].value;
    const password = signonForm["signon-password"].value;

    signInWithEmailAndPassword(authObj.auth, email, password)
      .then((cred) => {
        signonForm.reset();
        document.querySelector(".home").click();
      })
      .catch((err) => {
        alert(err.message);
      });
  }
}

// document.body.addEventListener("submit", (e) => {
//   console.log("form submitted");
//   e.preventDefault();
//   if (e.target.id === "signon-form") {
//     const signonForm = document.getElementById(e.target.id);
//     const email = signonForm["signon-email"].value;
//     const password = signonForm["signon-password"].value;

//     signInWithEmailAndPassword(authObj.auth, email, password)
//       .then((cred) => {
//         signonForm.reset();
//         console.log(`${email} Logged In Successfully`);
//       })
//       .catch((err) => {
//         alert(err.message);
//       });
//   }
// });
