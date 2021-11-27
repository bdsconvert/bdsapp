import { authObj } from "../data/bdsfirebase.js";
import { signOut } from "https://www.gstatic.com/firebasejs/9.0.2/firebase-auth.js";

export class BDSSignout {
  async getPage() {
    return "<h4>Signing Out...</h4>";
  }

  async signOut() {
    const user = authObj.bdsuser;
    console.log(`Signing Out ${user}`);
    signOut(authObj.auth)
      .then(() => {
        alert(`${user} Signed Out!`);
        document.querySelector(".home").click();
      })
      .catch((err) => alert(err.message));
  }
}
