import { authObj, fbdb } from "../index.js";
import { xml2json, json2xml, flatten, unflatten, formatJson, formatXml, union } from "./bdsutil.js";
import {
  collection,
  collectionGroup,
  query,
  where,
  limit,
  arrayUnion,
  doc,
  getDocs,
  setDoc,
  updateDoc,
  onSnapshot,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/9.0.2/firebase-firestore.js";
// import { Onix30File01 } from "./bdsdata.js";

const bdsmain = document.getElementById("bdsmain");
const uploadfile = document.getElementById("uploadfile");
const bdswq = document.querySelectorAll(".workqueue"); // class "workqueue" in main nav and side nav!
const exportfile = document.getElementById("exportfile");

const userfiles = [];
let userfile = {
  FileName: "",
  FileType: "",
  timestamp: 0,
  fields: [],
  templates: [],
  titles: []
};
let contents = {
  json: "",
  onix: ""
};
//let titles = []; // holds titles and contents for current file
////////////////////////////////////////////////////////////////////////////

// Event Listener for Workqueue
bdswq.forEach((wq) => {
  wq.addEventListener("click", async (e) => {
    e.preventDefault();
    if (authObj.bdsuser) {
      bdsmain.innerHTML = "";
      await GetWorqueueItems();
      DisplayWorkqueueItems();
    }
  });
});
////////////////////////////////////////////////////////////////////////////

//Event Listener for Workqueue Children
bdsmain.addEventListener("click", async (e) => {
  e.preventDefault();
  //e.stopPropagation();

  // Export click
  if (e.target.id === "export") {
    switch (userfile.FileType) {
      case "Onix30":
        // Modal to choose fields & export
        ExportToExcel();
        break;
      default:
        break;
    }
  }

  // File click
  if (e.target.classList.contains("collapsible-header")) {
    switch (document.getElementById(`${e.target.id}`).dataset.ftype) {
      case "Onix30":
        await GetTitles("Onix30", e.target.id);
        await GetContents(e.target.id, userfile.titles[0].RecordReference);
        DisplayTitles(e.target.id);
        DisplayContents(userfile.FileName);
        break;
      default:
        break;
    }
  }

  // Title click
  if (e.target.classList.contains("collection-item")) {
    console.log(e.target.id);
    await GetContents(userfile.FileName, e.target.id);
    DisplayContents(userfile.FileName);
  }
});
////////////////////////////////////////////////////////////////////////////

exportfile.addEventListener("click", (e) => {
  //e.preventDefault();
  const selectall = document.getElementById("selectall");
  const fields = document.querySelectorAll("p input[type='checkbox']");
  if (e.target.id === "selectall") {
    fields.forEach((field) => {
      field.checked = selectall.checked ? true : false;
    });
  }

  const fieldschecked = document.querySelectorAll("p label input[type=checkbox]:checked");
  if (fieldschecked.length > 0 && fieldschecked.length !== fields.length) {
    selectall.indeterminate = true;
  } else {
    selectall.indeterminate = false;
  }

  if (e.target.id === "createsavetemplate") {
    const flds = Array.from(fieldschecked).map((field) => field.value);
    SaveTemplate(flds, document.getElementById("template").value);
  }

  if (e.target.id === "download") {
    const flds = Array.from(fieldschecked).map((field) => field.value);
    ExportToCSV(flds);
  }
});

exportfile.addEventListener("change", (e) => {
  if (e.target.id === "template") {
    console.log(e.target.value);
    const chkd = userfile.templates[e.target.value];
    if (chkd && chkd.length > 0) {
      chkd.forEach((fld) => {
        document.querySelector(`input[value=${fld}]`).checked = true;
      });
    } else {
      userfile.fields.forEach((fld) => {
        document.querySelector(`input[value=${fld}]`).checked = false;
      });
    }
  }
});
////////////////////////////////////////////////////////////////////////////

const SaveTemplate = async (flds, template) => {
  console.log(flds);
  const et = {};
  et[template] = flds;
  await setDoc(
    doc(collection(fbdb, authObj.bdsuser), userfile.FileName),
    { templates: et },
    //{
    //Exporttemplates: arrayUnion({ name: template, fields: flds })
    //},
    { merge: true }
  );
};

////////////////////////////////////////////////////////////////////////////

const ExportToCSV = (flds) => {
  let recs = [];
  userfile.titles.forEach((title) => {
    recs.push(
      new Promise((resolve) => {
        onSnapshot(query(collection(fbdb, authObj.bdsuser, userfile.FileName, "Titles", title.RecordReference, "Contents")), (docs) => {
          docs.forEach((doc) => {
            if (doc.id === "json") {
              resolve(JSON.parse(doc.data().json));
            }
          }); // docs.forEach
        }); // onSnapshot
      }) // new Promise
    ); // recs.push
  }); // titles.forEach

  let csv = "";
  Promise.all(recs).then((recs) => {
    const hdr = flds.join(", ");
    recs.forEach((rec) => {
      csv += "\r\n";
      flds.forEach((fld) => {
        csv += '"' + (rec[fld] ? rec[fld] : "") + '",';
      });
    });

    //Download
    const blob = new Blob([hdr + csv], { type: "data:text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    if (link !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.style = "visibility:hidden";
      link.download = userfile.FileName + ".csv";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }); // Promise.all
};
////////////////////////////////////////////////////////////////////////////

const GetWorqueueItems = () => {
  return new Promise((resolve) => {
    onSnapshot(query(collection(fbdb, authObj.bdsuser), limit(10)), (docs) => {
      docs.forEach((doc) => {
        userfiles.push({
          filename: doc.id,
          filetype: doc.data().filetype,
          timestamp: doc.data().timestamp,
          fields: doc.data().fields,
          templates: doc.data().templates
        });
      });
      resolve();
    });
  });
};
/////////////////////////////////////////////////////////////////////////

const GetTitles = (filetype, fileid) => {
  console.log(`Getting titles for ${fileid}`);
  return new Promise((resolve) => {
    onSnapshot(query(collection(fbdb, authObj.bdsuser, fileid, "Titles"), limit(10)), (docs) => {
      userfile.FileName = fileid;
      userfile.FileType = filetype;
      userfile.fields = userfiles.find((item) => {
        return item.filename === fileid;
      }).fields;
      userfile.templates = [];
      userfile.templates = userfiles.find((item) => {
        return item.filename === fileid;
      }).templates;
      userfile.titles = [];
      docs.forEach((doc) => {
        userfile.titles.push(doc.data());
      });
      resolve();
    });
  });
};
/////////////////////////////////////////////////////////////////////////

const GetContents = (fileid, titleid) => {
  console.log(fileid, titleid);
  contents = {};
  return new Promise((resolve) => {
    onSnapshot(query(collection(fbdb, authObj.bdsuser, fileid, "Titles", titleid, "Contents"), limit(2)), (docs) => {
      docs.forEach((doc) => {
        if (doc.id === "json") contents.json = doc.data().json;
        if (doc.id === "xml") contents.onix = doc.data().xml;
      });
      resolve();
    });
  });
};
////////////////////////////////////////////////////////////////////////////

const DisplayWorkqueueItems = () => {
  const user = authObj.bdsuser.split("@")[0].toLowerCase();
  let bdslist = `
    <div class="row z-depth-4" style="margin-top:1em;">
      <span class="col s4 input-field"><input type="text" id="search"><label for="search">Search Workqueue</label></span>  
      <span class="col s8"><h5>${user.charAt(0).toUpperCase()}${user.substr(1)}'s Workqueue</h5></span>
    </div>
  `;
  bdslist += `
    <ul class="collapsible" style="margin-top:-1em;">
  `;

  userfiles.forEach((item) => {
    bdslist += `
      <li>
        <div class="collapsible-header hoverable z-depth-5" id=${item.filename} data-ftype=${item.filetype}>
            <ul>
              <li><span style="font-size:1.25rem;font-weight:500">${item.filename}</span>
                  <span style="font-weight:500">(${item.filetype})</span></li>
              <li>Loaded: ${new Date(item.timestamp).toISOString()}</li>  
            </ul>
        </div>
        <div class="collapsible-body white" id="${item.filename}body"></div>
      </li>
    `;
  });
  bdslist += `
    </ul>
  `;
  bdsmain.innerHTML = bdslist;
  M.Collapsible.init(document.querySelectorAll(".collapsible"));
};
/////////////////////////////////////////////////////////////////////////

const DisplayTitles = (fileid) => {
  const bod = document.getElementById(`${fileid}body`);
  let html = ``;
  html += `
  <div class="row z-depth-1"> 
    <div class="col s4" style="border-right:1px solid lightgray;">
      <div class="collection">
      <div class="input-field"><input type="text" id="search"><label for="search">Search Titles</label></div>
        <div style="overflow:auto; height:40vh;">`;
  for (let i = 0; i < userfile.titles.length; i++) {
    const title = userfile.titles[i];
    html += ` 
          <a href="#" class="collection-item" id="${title.RecordReference}">${title.Title}<br/>${title.Author}<br/>${title.RecordReference}</a>
      `;
  }
  html += `
        </div>
      </div>
    </div>`;
  html += `
      <div class="col s8 z-depth-1">
        <ul id="contenttab" class="tabs">
          <li class="tab col s4"><a href="#onix${fileid}" class="onix">Onix</a></li>
          <li class="tab col s4"><a href="#table${fileid}" class="table">Table</a></li>
      </div>
      
      <div id="onix${fileid}" class="col s7" style="overflow:scroll;height:40vh;margin:1em;"></div>
      <div id="table${fileid}" class="col s7" style="overflow:scroll;height:40vh;margin:1em;"></div>
    `;
  html += `
    </div>
    <div class="right-align"><h6>
      <a href="#" id="export" class="modal-trigger" data-target="exportfile">
        Export to${userfile.FileType.includes("Onix") ? " Excel" : " Onix"}
      </a></h6>
    </div>
    `;
  bod.innerHTML = html;
  M.Tabs.init(document.querySelectorAll(".tabs")); //, { swipeable: true }
  //M.Modal.init(document.querySelectorAll(".modal"));
};
////////////////////////////////////////////////////////////////////////////

const DisplayContents = (fileid) => {
  document.getElementById(`onix${fileid}`).innerHTML = formatXml(contents.onix);
  document.getElementById(`table${fileid}`).innerHTML = formatJson(contents.json);
};
////////////////////////////////////////////////////////////////////////////

const ExportToExcel = () => {
  const ofilename = `${userfile.FileName}`; //${userfile.FileType.includes("Onix") ? ".csv" : ".xml"}`;
  let flds = "";
  userfile.fields.forEach((item) => {
    flds += `
      <p>
        <label><input type="checkbox" value=${item} /><span>${item}</span></label>
      </p>
    `;
  });

  let tmplts = "";
  console.log(userfile.templates);
  for (let key in userfile.templates) {
    tmplts += `<option value=${key}></options>`;
  }

  const exportfile = document.getElementById("exportfile");
  const exp = `
    <div style="margin:2em;">
      <div><h5>Export ${ofilename}</h5></div>
      <div class="divider"></div>
      <br/>
        <div class="row">
          <div class="col s4">
            <input list="templates" name="template" id="template" placeholder="Select/Create Template" />
            <datalist id="templates">
              ${tmplts}
            </datalist>
          </div>
          <div class="col s8 right-align">
            <a class="waves-effect waves-light btn" id="createsavetemplate"><i class="material-icons left">save</i>Create/Save Template</a>
            <a class="waves-effect waves-light btn" id="download"><i class="material-icons left">download</i>Export</a>
          </div>
        </div>
        <div class="row">
          <form action="#">
            <label><input type="checkbox" id="selectall" /><span>Select All</span></label>
          <div class="divider"></div>
          ${flds}
          </form>
        </div>
    </div>
  `;
  exportfile.innerHTML = exp;
};

////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
uploadfile.addEventListener("change", (e) => {
  e.preventDefault();
  if (e.target.id === "bdsfile") {
    const bdsfile = document.getElementById("bdsfile");
    if (bdsfile.files && bdsfile.files[0]) {
      ProcessFile(bdsfile.files[0]);
    }
  }
});
/////////////////////////////////////////////////////////////////////////

const ProcessFile = (file) => {
  const reader = new FileReader();
  reader.readAsBinaryString(file);

  reader.addEventListener("progress", (e) => {
    e.preventDefault();
    console.log(`${e.loaded} bytes transferred\n`);
  });

  reader.addEventListener("load", (e) => {
    e.preventDefault();
    if (file.type === "text/xml") {
      ExtractOnixTitles(file, reader.result);
      SaveFile();
      console.log(`${file.name} uploaded Successfully\n`);
      M.Modal.getInstance(document.querySelector("#uploadfile")).close();
    }
  });
};
/////////////////////////////////////////////////////////////////////////

const SaveFile = async () => {
  const bdsfiles = collection(fbdb, authObj.bdsuser);
  // Set Userfile collection
  await setDoc(doc(bdsfiles, userfile.FileName), {
    filetype: userfile.FileType,
    timestamp: Date.now(),
    fields: userfile.fields
  });
  // Set titles and contents
  userfile.titles.forEach(async (title) => {
    // Set titles
    await setDoc(
      doc(bdsfiles, userfile.FileName, "Titles", title.RecordReference),
      {
        RecordReference: title.RecordReference,
        Title: title.Title,
        Author: title.Author
      },
      { merge: true }
    );
    // Set json content
    await setDoc(
      doc(bdsfiles, userfile.FileName, "Titles", title.RecordReference, "Contents", "json"),
      {
        json: title.json
      },
      { merge: true }
    );
    // Set xml content
    await setDoc(
      doc(bdsfiles, userfile.FileName, "Titles", title.RecordReference, "Contents", "xml"),
      {
        xml: title.onix
      },
      { merge: true }
    );
  }); // End forEach
};
/////////////////////////////////////////////////////////////////////////

const ExtractOnixTitles = (file, onix) => {
  userfile.titles = [];
  const parser = new DOMParser();
  const dom = parser.parseFromString(onix, "application/xml");
  console.log(dom.documentElement.nodeName === "parsererror" ? "error while parsing" : dom.documentElement.length);

  userfile.FileName = file.name;
  userfile.FileType = `Onix${dom.getElementsByTagName("ONIXMessage")[0].getAttribute("release").replace(".", "")}`;

  let ref = new Set();
  let ntf = new Set();
  let pid = new Set();
  let ddg = new Set();
  let ddm = new Set();
  let ddc = new Set();
  let ddt = new Set();
  let dda = new Set();
  let ddl = new Set();
  let dds = new Set();
  let ddu = new Set();
  let cdg = new Set();
  let pdg = new Set();
  let rmg = new Set();
  let psg = new Set();
  const nodes = dom.querySelectorAll("Product"); //dom.documentElement.childNodes; child.nodeName === "Product"
  for (const child of nodes) {
    //console.log(child);
    const Product = xml2json(child, "\t");
    //console.log(Product);
    let ProductFlat = flatten(Product, "Product");
    // Make all nodes array!
    const Productarray = JSON.stringify(ProductFlat)
      .replace(/([a-zA-Z])_([a-zA-Z])/g, "$1_0_$2")
      .replace(/([a-zA-Z])\":/g, '$1_0":');
    ProductFlat = JSON.parse(Productarray);
    const objkeys = Object.keys(ProductFlat);
    // Extract distinct fields for excel export
    ref.add("Product_0_RecordReference_0");
    ntf.add("Product_0_NotificationType_0");
    for (let elem of new Set(objkeys.filter((key) => key.startsWith("Product_0_ProductIdentifier")))) {
      pid.add(elem);
    }
    for (let elem of new Set(objkeys.filter((key) => key.startsWith("Product_0_DescriptiveDetail_0_Product")))) {
      ddg.add(elem);
    }
    for (let elem of new Set(objkeys.filter((key) => key.startsWith("Product_0_DescriptiveDetail_0_Measure")))) {
      ddm.add(elem);
    }
    for (let elem of new Set(objkeys.filter((key) => key.startsWith("Product_0_DescriptiveDetail_0_Collection")))) {
      ddc.add(elem);
    }
    for (let elem of new Set(objkeys.filter((key) => key.startsWith("Product_0_DescriptiveDetail_0_TitleDetail")))) {
      ddt.add(elem);
    }
    for (let elem of new Set(objkeys.filter((key) => key.startsWith("Product_0_DescriptiveDetail_0_Contributor")))) {
      dda.add(elem);
    }
    for (let elem of new Set(objkeys.filter((key) => key.startsWith("Product_0_DescriptiveDetail_0_Language")))) {
      ddl.add(elem);
    }
    for (let elem of new Set(objkeys.filter((key) => key.startsWith("Product_0_DescriptiveDetail_0_Subject")))) {
      dds.add(elem);
    }
    for (let elem of new Set(objkeys.filter((key) => key.startsWith("Product_0_DescriptiveDetail_0_Audience")))) {
      ddu.add(elem);
    }
    for (let elem of new Set(objkeys.filter((key) => key.startsWith("Product_0_CollateralDetail")))) {
      cdg.add(elem);
    }
    for (let elem of new Set(objkeys.filter((key) => key.startsWith("Product_0_PublishingDetail")))) {
      pdg.add(elem);
    }
    for (let elem of new Set(objkeys.filter((key) => key.startsWith("Product_0_RelatedMaterial")))) {
      rmg.add(elem);
    }
    for (let elem of new Set(objkeys.filter((key) => key.startsWith("Product_0_ProductSupply")))) {
      psg.add(elem);
    }

    const RecordReference = ProductFlat.Product_0_RecordReference_0;
    const Title = ProductFlat.Product_0_DescriptiveDetail_0_TitleDetail_0_TitleElement_0_TitleText_0;
    const Author = ProductFlat.Product_0_DescriptiveDetail_0_Contributor_0_PersonName_0;
    userfile.titles.push({
      RecordReference: RecordReference,
      Title: Title,
      Author: Author,
      json: Productarray,
      onix: child.outerHTML
    });

    // 	let ProductFlat = flatten(Product, "Product");
    // 	let ProductUnflat = unflatten(ProductFlat);
    // 	let ProductXml =  json2xml(ProductUnflat, '\t');
  }
  console.log(userfile);
  //console.log([...pid, ...ddg, ...ddm, ...ddc, ...ddt, ...dda, ...ddl, ...dds, ...ddu, ...cdg, ...pdg, ...rmg, ...psg]);
  userfile.fields = [
    ...ref,
    ...ntf,
    ...pid,
    ...ddg,
    ...ddm,
    ...ddc,
    ...ddt,
    ...dda,
    ...ddl,
    ...dds,
    ...ddu,
    ...cdg,
    ...pdg,
    ...rmg,
    ...psg
  ];
};
////////////////////////////////////////////////////////////////

// const createworkque = document.querySelector(".createworkque");
// createworkque.addEventListener("click", (e) => {
//   e.preventDefault();

//   const parser = new DOMParser();
//   const dom = parser.parseFromString(Onix30File01, "application/xml");
//   const Product = xml2json(dom, "\t").Product;
//   const ProductFlat = flatten(Product, "Product");

//   const bdsfiles = collection(fbdb, authObj.bdsuser.email);
//   [
//     {
//       doc: "File1.xml",
//       filetype: "Onix30",
//       xml: [Onix30File01, Onix30File01],
//       json: [JSON.stringify(ProductFlat), JSON.stringify(ProductFlat)]
//     },
//     {
//       doc: "File2.xlsx",
//       filetype: "Excel30",
//       xml: [Onix30File01],
//       json: [JSON.stringify(ProductFlat)]
//     },
//     { doc: "File3.xml", filetype: "Onix21", xml: [], json: [] },
//     { doc: "File4.xlsx", filetype: "Excel21", xml: [], json: [] }
//   ].forEach((item) => {
//     setDoc(
//       doc(bdsfiles, item.doc),
//       {
//         filetype: item.filetype,
//         xml: item.xml,
//         json: item.json,
//         timestamp: Date.now()
//       },
//       { merge: true }
//     ).then(() => {
//       console.log(`${item.doc} Uploaded Successfully`);
//     });
//   });
// });

// const bdslist = document.createElement("ul");
// bdslist.setAttribute("class", "collapsible");
// onSnapshot(
//   query(collection(fbdb, authObj.bdsuser), limit(5)),
//   (qSnapshot) => {
//     qSnapshot.forEach((doc) => {
//       const li = document.createElement("li");
//       bdslist.appendChild(li);
//       const hdr = document.createElement("div");
//       hdr.setAttribute("class", "collapsible-header");
//       hdr.setAttribute("id", `${doc.id}`);
//       hdr.innerHTML = `
//       <div id="${doc.id}">
//         <ul>
//           <li>${doc.id} (${doc.data().filetype})</li>
//           <li>Loaded: ${new Date(doc.data().timestamp).toISOString()}</li>
//         </ul>
//       </div>`;
//       li.appendChild(hdr);
//       const bod = document.createElement("div");
//       bod.setAttribute("class", "collapsible-body");
//       li.appendChild(bod);
//     });
//   }
// );
// M.Collapsible.init(bdslist);
// bdsmain.innerHTML = "";
// bdsmain.appendChild(bdslist);
