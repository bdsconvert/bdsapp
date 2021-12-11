import { BDSHome } from "./views/bdshome.js";
import { BDSSignup } from "./views/bdssignup.js";
import { BDSSignon } from "./views/bdssignon.js";
import { BDSSignout } from "./views/bdssignout.js";
import { BDSTerms } from "./views/bdsterms.js";
import { BDSContact } from "./views/bdscontact.js";
import { BDSProfile } from "./views/bdsprofile.js";
import { BDSWorkqueue } from "./views/bdsworkqueue.js";
import { BDSTitles } from "./views/bdstitles.js";
import { BDSExport } from "./views/bdsexport.js";
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
  match = match ? match : { path: routes[0].path, view: routes[0].view }; // Go home if no match
  const view = new match.view();
  await view.getPage();
  //document.getElementById("bdsheader").innerHTML = "";
  //document.getElementById("bdscontent").innerHTML = await view.getPage();
  //initialize materialize components
  // if (match.path === "/workqueue") {
  //   M.Collapsible.init(document.querySelectorAll(".collapsible"));
  // }
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
  M.Modal.init(document.querySelectorAll(".modal"), {});
  M.Sidenav.init(document.querySelectorAll(".sidenav"), {});
  navigateTo("/"); // Go Home
  localStorage.clear();
});
//////////////////////////////////////////////////////////////////

document.body.addEventListener("click", async (e) => {
  //e.preventDefault();
  // Navigate to routes
  if (e.target.matches("[page-link]")) {
    e.preventDefault();
    let href = e.target.href;
    if (!href) {
      //const icon = document.getElementById(e.target.id);
      //href = icon.parentElement.href;
      href = e.target.parentElement.href;
    }
    console.log(href);
    navigateTo(href);
  }

  // File Click
  else if (e.target.matches("[file-link]")) {
    const bdstitles = new BDSTitles(e.target.id, "");
  }

  // Title Click
  else if (e.target.matches("[rec-link]")) {
    console.log(e.target.parentElement.id);
    BDSTitles.DisplayContents(e.target.parentElement.id);
  }

  // Export click
  else if (e.target.matches("[export-link]")) {
    const bdsexport = new BDSExport(e.target.id); //, exp.dataset.fields, exp.dataset.templates);
  }

  // Export Select All click
  else if (e.target.id === "selectall") {
    console.log("Select All Clicked");
    BDSExport.SelectAllExportFields();
  }

  // Export Checkbox click
  else if (e.target.matches("p label input[type=checkbox]")) {
    console.log("Checkbox Clicked");
    BDSExport.SelectExportFields();
  }

  // Save Template Click
  else if (e.target.id === "createsavetemplate") {
    BDSExport.SaveTemplate(e.target.id);
  }

  // Export Download Click
  else if (e.target.id === "download") {
    BDSExport.DownloadTemplate(e.target.id);
  }
});
// //////////////////////////////////////////////////////////////////

document.body.addEventListener("submit", async (e) => {
  e.preventDefault();
  console.log("form submitted");

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

document.body.addEventListener("change", async (e) => {
  // Search Workqueue
  if (e.target.id === "searchworkqueue") {
    console.log(`Keyword => ${e.target.value}`);
    const bdsworkqueue = new BDSWorkqueue();
    bdsworkqueue.WorkqueueSearch(e.target.value);
  } else if (e.target.id === "searchtitles") {
    const bdstitles = new BDSTitles(e.target.dataset.fileid, e.target.value);
  } else if (e.target.id === "template") {
    BDSExport.SelectTemplateFields(e.target.value);
  }
});
////////////////////////////////////////////////////////////////////////////
