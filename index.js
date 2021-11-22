import { BDSHome } from "./views/bdshome.js";
import { BDSSignup } from "./views/bdssignup.js";
import { BDSSignon } from "./views/bdssignon.js";

const router = async () => {
  const routes = [
    { path: "/", view: BDSHome },
    { path: "/contact", view: () => console.log("Contact Page!") },
    { path: "/terms", view: () => console.log("Terms Page!") },
    { path: "/signup", view: BDSSignup },
    { path: "/signon", view: BDSSignon },
    { path: "/signout", view: () => console.log("SignOut Page!") },
    { path: "/profile", view: () => console.log("Profile Page!") },
    { path: "/workqueue", view: () => console.log("Workqueue Page!") },
    { path: "/uploadfile", view: () => console.log("UploadFile Page!") }
  ];

  let match = routes.find((route) => location.pathname === route.path);
  match = match ? match : { path: routes[0].path, view: routes[0].view };
  const view = new match.view();
  document.getElementById("main").innerHTML = await view.getPage();
};

const navigateTo = (url) => {
  history.pushState(null, null, url);
  router();
};

window.addEventListener("popstate", router());

document.addEventListener("DOMContentLoaded", (e) => {
  M.Sidenav.init(document.querySelectorAll(".sidenav"), {});

  document.body.addEventListener("click", (e) => {
    if (e.target.matches("[data-link]")) {
      e.preventDefault();
      navigateTo(e.target.href);
    }
  });
  // router();
});
