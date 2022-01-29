import { authObj } from "../data/bdsfirebase.js";
import { navigateTo } from "../index.js";
import { signOut } from "https://www.gstatic.com/firebasejs/9.0.2/firebase-auth.js";

export class BDSSignout {
  async getPage() {
    this.signOut();
  }

  signOut() {
    const user = authObj.bdsuser;
    console.log(`Signing Out ${user}`);
    signOut(authObj.auth)
      .then(() => {
        navigateTo("/");
        M.toast({ html: `${user} Logged Out!` });
      })
      .catch((err) => alert(err.message));
  }
}
