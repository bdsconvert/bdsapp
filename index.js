import { BDSHome } from "./views/bdshome.js";
import { BDSSignup } from "./views/bdssignup.js";
import { BDSSignon } from "./views/bdssignon.js";
import { BDSSignout } from "./views/bdssignout.js";
import { BDSTerms } from "./views/bdsterms.js";
import { BDSContact } from "./views/bdscontact.js";
import { BDSProfile } from "./views/bdsprofile.js";
import { BDSWorkqueue } from "./views/bdsworkqueue.js";
import { BDSSamples } from "./views/bdssamples.js";

export const router = async () => {
  const routes = [
    { path: "/", title: "BDS", view: BDSHome },
    { path: "/contact", title: "Contact BDS", view: BDSContact },
    { path: "/terms", title: "Terms", view: BDSTerms },
    { path: "/signup", title: "SignUp", view: BDSSignup },
    { path: "/signon", title: "SignOn", view: BDSSignon },
    { path: "/signout", title: "SignOut", view: BDSSignout },
    { path: "/profile", title: "Profile", view: BDSProfile },
    { path: "/workqueue", title: "Workqueue", view: BDSWorkqueue },
    { path: "/samples", title: "BdsSamples", view: BDSSamples }
  ];
  let match = routes.find((route) => window.location.pathname === route.path);
  match = match
    ? match
    : {
        path: routes[0].path,
        title: "BookDataSolutions",
        view: routes[0].view
      }; // Go home if no match
  const view = new match.view();
  // document.getElementById("bdsheader").innerHTML = ``;
  await view.getPage();
  document.getElementById("hdrlbl").innerHTML = `${match.title}`;
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
  emailjs.init("8OLiCZvohFJPEq_TW");
  navigateTo("/");
});

document.addEventListener(
  "contextmenu",
  (e) => {
    e.preventDefault();
  },
  false
);

// (function () {
//   (function a() {
//     try {
//       (function b(i) {
//         if (("" + i / i).length !== 1 || i % 20 === 0) {
//           (function () {}.constructor("debugger")());
//         } else {
//           debugger;
//         }
//         b(++i);
//       })(0);
//     } catch (e) {
//       setTimeout(a, 5000);
//     }
//   })();
// })();
//////////////////////////////////////////////////////////////////

document.body.addEventListener("click", async (e) => {
  //e.preventDefault();
  // Navigate to routes
  if (e.target.matches("[page-link]")) {
    e.preventDefault();
    let href = e.target.href;
    if (!href) {
      href = e.target.parentElement.href;
    }
    navigateTo(href);
  }

  if (e.target.matches("[sidenav_toggle]")) {
    console.log("Open/Close Sidenav clicked");
    // document.getElementById("sidemenu").style.width = "200px";
    // document.querySelector("header").style.paddingLeft = "200px";
    // document.querySelector("main").style.paddingLeft = "200px";
    // const sm = document.querySelectorAll("#sidemenu > a");
    // sm.forEach((a) => {
    //   console.log(a.innerHTML);
    // });
  }
  // Workqueue link (Export / Titles page)
  // else if (e.target.matches("[wk-link]")) {
  //   navigateTo("/workqueue");
  // }

  // File Click
  // else if (e.target.matches("[file-link]")) {
  //   const bdstitles = new BDSTitles(e.target.id, "");
  // }

  // Title Click
  // else if (e.target.matches("[rec-link]")) {
  //   BDSTitles.DisplayContents(e.target.parentElement.id);
  // }

  // Content modal close click
  // else if (e.target.matches("[content-close]")) {
  //   // console.log("From Index.js");
  //   // console.log(e.target);
  //   M.Modal.getInstance(document.querySelector(".modal")).close();
  // }

  // Export click
  // else if (e.target.matches("[export-link]")) {
  //   const bdsexport = new BDSExport(e.target.id); //, exp.dataset.fields, exp.dataset.templates);
  // }

  // Export Select All click
  // else if (e.target.id === "selectall") {
  //   BDSExport.SelectAllExportFields();
  // }

  // // Export Checkbox click
  // else if (e.target.matches("p label input[type=checkbox]")) {
  //   BDSExport.SelectExportFields();
  // }

  // Save Template Click
  // else if (e.target.id === "createsavetemplate") {
  //   BDSExport.SaveTemplate(e.target.id);
  // }

  // // Export Download Click
  // else if (e.target.id === "download") {
  //   BDSExport.DownloadTemplate(e.target.id);
  // }

  // Create Onix File Click - refresh WOrkqueue
  // else if (e.target.id === "createonixfile") {
  //   navigateTo("/workqueue");
  // }

  // File Upload Link
  // else if (e.target.matches("[upload-link]")) {
  //   console.log("File Upload!");
  // }
});
// //////////////////////////////////////////////////////////////////

document.body.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (e.target.id === "signon-form") {
    const bdssignon = new BDSSignon();
    await bdssignon.signOn(e.target.id);
    localStorage.clear();
  } else if (e.target.id === "signup-form") {
    const bdssignup = new BDSSignup();
    await bdssignup.signUp(e.target.id);
  } else if (e.target.id === "contact-form") {
    const bdscontact = new BDSContact();
    await bdscontact.processContact(e.target.id);
  }
});
//////////////////////////////////////////////////////////////////

// document.body.addEventListener("change", async (e) => {
// e.preventDefault();
// Search Workqueue
// if (e.target.id === "searchworkqueue") {
//   const bdsworkqueue = new BDSWorkqueue();
//   bdsworkqueue.WorkqueueSearch(e.target.value);
// }
// else if (e.target.id === "searchuploaded") {
//   const bdsuploaded = new BdsUploaded();
//   bdsuploaded.UploadedFilesSearch(e.target.value);
// }
// if (e.target.id === "searchtitles") {
//   const bdstitles = new BDSTitles(e.target.dataset.fileid, e.target.value);
// }
// if (e.target.id === "template") {
//   BDSExport.SelectTemplateFields(e.target.value);
// }
// console.log(e.target.value);

// if (e.target.id === "bdsfile") {
//   const bdsfile = document.getElementById("bdsfile");
//   if (bdsfile.files && bdsfile.files[0]) {
//     BDSUploadfile.ProcessFile(bdsfile.files[0]);
//   }
// }
// });
////////////////////////////////////////////////////////////////////////////
