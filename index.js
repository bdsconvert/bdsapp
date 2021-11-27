import { BDSHome } from "./views/bdshome.js";
import { BDSSignup } from "./views/bdssignup.js";
import { BDSSignon } from "./views/bdssignon.js";
import { BDSSignout } from "./views/bdssignout.js";
import { BDSTerms } from "./views/bdsterms.js";
import { BDSContact } from "./views/bdscontact.js";
import { BDSProfile } from "./views/bdsprofile.js";
import { BDSWorkqueue } from "./views/bdsworkqueue.js";
import { BDSUploadfile } from "./views/bdsuploadfile.js";

export const router = async () => {
  const routes = [
    { path: "/", view: BDSHome },
    { path: "/contact", view: BDSContact },
    { path: "/terms", view: BDSTerms },
    { path: "/signup", view: BDSSignup },
    { path: "/signon", view: BDSSignon },
    { path: "/signout", view: BDSSignout },
    { path: "/profile", view: BDSProfile },
    { path: "/workqueue", view: BDSWorkqueue },
    { path: "/uploadfile", view: BDSUploadfile }
  ];

  let match = routes.find((route) => window.location.pathname === route.path);
  //match = match ? match : { path: routes[0].path, view: routes[0].view };
  const view = new match.view();
  document.getElementById("main").innerHTML = await view.getPage();
};

export const navigateTo = (url) => {
  window.history.pushState(null, null, url);
  router();
};

// Event Listeners
//////////////////////////////////////////////////////////////////
//window.addEventListener("popstate", router());
//////////////////////////////////////////////////////////////////

document.addEventListener("DOMContentLoaded", (e) => {
  M.Sidenav.init(document.querySelectorAll(".sidenav"), {});
  //router();
  navigateTo("/");
});
//////////////////////////////////////////////////////////////////

document.body.addEventListener("click", async (e) => {
  //e.preventDefault();
  // Navigate to routes
  if (e.target.matches("[page-link]")) {
    e.preventDefault();
    let href = e.target.href;
    if (!href) {
      const icon = document.getElementById(e.target.id);
      href = icon.parentElement.href;
    }
    console.log(href);
    navigateTo(href);
  }
  if (e.target.matches(".signout")) {
    const bdssignout = new BDSSignout();
    await bdssignout.signOut();
  }
});
// //////////////////////////////////////////////////////////////////

document.body.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (e.target.id === "signon-form") {
    const bdssignon = new BDSSignon();
    await bdssignon.signOn(e.target.id);
  }
  if (e.target.id === "signup-form") {
    const bdssignup = new BDSSignup();
    await bdssignup.signUp(e.target.id);
  }
});
//////////////////////////////////////////////////////////////////
