import { authObj } from "../data/bdsfirebase.js";
import { navigateTo } from "../index.js";
import { signOut } from "https://www.gstatic.com/firebasejs/9.0.2/firebase-auth.js";

export class BDSSignout {
  async getPage() {
    this.signOut();
    document.getElementById("bdscontent").innerHTML = `<h4>${authObj.bdsuser} Logged Out!</h4>`;
  }

  signOut() {
    const user = authObj.bdsuser;
    console.log(`Signing Out ${user}`);
    signOut(authObj.auth)
      .then(() => {
        navigateTo("/");
      })
      .catch((err) => alert(err.message));
  }
}
