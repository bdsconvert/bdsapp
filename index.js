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
import { BDSCreateOnix } from "./views/bdscreateonix.js";

export const router = async () => {
  const routes = [
    { path: "/", title: "BookDataSolutions", view: BDSHome },
    { path: "/contact", title: "Contact BDS", view: BDSContact },
    { path: "/terms", title: "Terms", view: BDSTerms },
    { path: "/signup", title: "Signup", view: BDSSignup },
    { path: "/signon", title: "Signin", view: BDSSignon },
    { path: "/signout", title: "Signout", view: BDSSignout },
    { path: "/profile", title: "Profile", view: BDSProfile },
    { path: "/workqueue", title: "Workqueue", view: BDSWorkqueue },
    { path: "/createonix", title: "Create Onix", view: BDSCreateOnix },
    { path: "/uploadfile", title: "Upload File", view: BDSUploadfile }
  ];

  let match = routes.find((route) => window.location.pathname === route.path);
  match = match ? match : { path: routes[0].path, title: "BookDataSolutions", view: routes[0].view }; // Go home if no match
  const view = new match.view();
  await view.getPage();
  document.getElementById("hdrlbl").innerText = `${match.title}`;
  //M.getInstance(document.querySelector(".sidenav")).close();
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
  //M.getInstance(document.querySelector(".sidenav")).open();
  navigateTo("/"); // Go Home
  //localStorage.clear();
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
    //console.log(href);
    navigateTo(href);
  }

  // Workqueue link (Export / Titles page)
  else if (e.target.matches("[wk-link]")) {
    navigateTo("/workqueue");
  }

  // File Click
  else if (e.target.matches("[file-link]")) {
    const bdstitles = new BDSTitles(e.target.id, "");
  }

  // Title Click
  else if (e.target.matches("[rec-link]")) {
    //console.log(e.target.parentElement.id);
    BDSTitles.DisplayContents(e.target.parentElement.id);
  }

  // Content modal close click
  else if (e.target.matches("[content-close]")) {
    M.Modal.getInstance(document.querySelector(".modal")).close();
  }

  // Export click
  else if (e.target.matches("[export-link]")) {
    const bdsexport = new BDSExport(e.target.id); //, exp.dataset.fields, exp.dataset.templates);
  }

  // Export Select All click
  else if (e.target.id === "selectall") {
    //console.log("Select All Clicked");
    BDSExport.SelectAllExportFields();
  }

  // Export Checkbox click
  else if (e.target.matches("p label input[type=checkbox]")) {
    //console.log("Checkbox Clicked");
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
  //console.log("form submitted");

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
    //console.log(`Keyword => ${e.target.value}`);
    const bdsworkqueue = new BDSWorkqueue();
    bdsworkqueue.WorkqueueSearch(e.target.value);
  } else if (e.target.id === "searchtitles") {
    const bdstitles = new BDSTitles(e.target.dataset.fileid, e.target.value);
  } else if (e.target.id === "template") {
    BDSExport.SelectTemplateFields(e.target.value);
  } else if (e.target.id === "bdsfile") {
    const bdsfile = document.getElementById("bdsfile");
    if (bdsfile.files && bdsfile.files[0]) {
      BDSUploadfile.ProcessFile(bdsfile.files[0]);
    }
  }
});
////////////////////////////////////////////////////////////////////////////
