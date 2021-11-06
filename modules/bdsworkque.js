import { authObj, fbdb } from "../index.js";
import { xml2json, json2xml, flatten, unflatten, formatJson, formatXml } from "./bdsutil.js";
import {
  collection,
  collectionGroup,
  query,
  where,
  limit,
  doc,
  getDocs,
  setDoc,
  onSnapshot
} from "https://www.gstatic.com/firebasejs/9.0.2/firebase-firestore.js";
import { Onix30File01 } from "./bdsdata.js";

const bdsmain = document.getElementById("bdsmain");
const bdswq = document.querySelectorAll(".workqueue"); // class "workqueue" in main nav and side nav!

// Event Listener for Workqueue
bdswq.forEach((wq) => {
  wq.addEventListener("click", (e) => {
    console.log("Workqueue Clicked!");
    if (authObj.bdsuser) {
      DisplayWorkqueueItems();
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
    }
  });
});

const DisplayWorkqueueItems = () => {
  let bdslist = "";
  onSnapshot(query(collection(fbdb, authObj.bdsuser), limit(10)), (docs) => {
    bdslist = `<ul class="collapsible">`;
    docs.forEach((doc) => {
      bdslist += `
        <li>
          <div class="collapsible-header" id=${doc.id}>
            <div>
              <ul>
                <li>${doc.id} (${doc.data().filetype})</li>
                <li>Loaded: ${new Date(doc.data().timestamp).toISOString()}</li>  
              </ul>
            </div>
          </div>

          <div class="collapsible-body white" id="${doc.id}body"></div>
        </li>
      `;
    });
    bdslist += `</ul>`;
    //console.log(bdslist);
    bdsmain.innerHTML = bdslist;
    M.Collapsible.init(document.querySelectorAll(".collapsible"));
  });
};

//Event Listener for Bdsmain Children
bdsmain.addEventListener("click", (e) => {
  if (e.target.classList.contains("collapsible-header")) {
    DisplayTitles(e.target.id);
  }
});

const DisplayTitles = (fileid) => {
  console.log(`Displaying titles for ${fileid}`);
  const bod = document.getElementById(`${fileid}body`);
  let html = "";
  html = `
  <div class="row">
    <div class="col s5" style="border-right:1px solid lightgray">
      <div class="collection with-header z-depth-0">
        <div class="input-field"><input type="text" id="search"><label for="search">Search</label></div>`;
  onSnapshot(query(collection(fbdb, authObj.bdsuser, fileid, "Titles"), limit(10)), (docs) => {
    docs.forEach((doc) => {
      html += ` 
        <a href="#" class="collection-item" id="${doc.id}">${doc.data().Title}<br/>${doc.data().Author}<br/>${
        doc.data().RecordReference
      }</a>
      `;
    });
    html += `
      </div>
    </div>`;
    html += `
      <div class="col s7">
        <ul id="contenttab" class="tabs">
          <li class="tab col s3"><a href="#onix${fileid}" class="onix">Onix</a></li>
          <li class="tab col s3"><a href="#table${fileid}" class="table">Table</a></li>
        </ul>
      </div>
      <div id="onix${fileid}" class="col s6"></div>
      <div id="table${fileid}" class="col s6"></div>
    `;
    html += `
    </div>
    `;
    bod.innerHTML = html;
    M.Tabs.init(document.querySelectorAll(".tabs"));
  });
};

/*
//Event Listener for Bdsmain Children
let currentfileid = "";
bdsmain.addEventListener("click", (e) => {
  let onix = "";

  if (e.target.classList.contains("collapsible-header")) {
    console.log(e.target.id);
    currentfileid = e.target.id;

    const q = query(
      collection(
        fbdb,
        "madhu@bds.com",
        `${currentfileid}`,
        "Titles",
        "9789012097666",
        "Contents"
      ),
      //where("RecordReference", "==", "9789012097666"),
      limit(10)
    );
    onSnapshot(q, (qSnapshot) => {
      qSnapshot.forEach((doc) => {
        console.log(doc.id, doc.data());
      });
    });

    
    onSnapshot(doc(fbdb, "madhu@bds.com", `${currentfileid}`), (doc) => {
      //console.log(doc.data());
      const hdr = document.getElementById(currentfileid);
      const bod = hdr.nextElementSibling;
      bod.innerHTML = "";
      let tl = "";
      doc.data().json.forEach((doc) => {
        const titleobj = JSON.parse(doc);
        tl += `
                <div class="collection left-align z-depth-0">
                  <div class="collection-item" id="${titleobj.Product_RecordReference}">
                    ${titleobj.Product_DescriptiveDetail_TitleDetail_TitleElement_TitleText}
                    <br/>
                    ${titleobj.Product_RecordReference}
                  </div>
                </div>
                <div class="divider"></div>
              `;
      });

      bod.innerHTML += `
        <div class="row">

          <div class="col s5">
            ${tl}
          </div>

          <div class="col s7">
            <ul id="contenttab" class="tabs">
              <li class="tab col s3"><a href="#onix${currentfileid}" class="onix">Onix</a></li>
              <li class="tab col s3"><a href="#table${currentfileid}" class="table">Table</a></li>
            </ul>
          </div>
          <div id="onix${currentfileid}" class="col s6"></div>
          <div id="table${currentfileid}" class="col s6"></div>

        </div> 
      `;
      M.Tabs.init(document.querySelectorAll(".tabs"));

      // const sn = document.createElement("a");
      // sn.setAttribute("data-target", "tl");
      // sn.setAttribute("href", "#");
      // sn.setAttribute("class", "sidenav-trigger");

      // //const m = document.createElement("i");
      // //m.setAttribute("class", "material-icons");
      // //m.innerText = "menu";
      // // sn.appendChild(m);

      // bod.appendChild(sn);

      // const titleslist = document.createElement("ul");
      // titleslist.setAttribute("class", "sidenav sidenav-fixed");
      // titleslist.setAttribute("id", "tl");
      // titleslist.setAttribute(
      //   "style",
      //   "position: relative; top:0; left:0; width:40vh; height:40vh; padding-left:1vw;"
      // );

      // let li = document.createElement("li");
      // li.setAttribute("href", "#");
      // li.innerText = JSON.parse(doc.data().json[0]).Product_RecordReference;
      // titleslist.appendChild(li);
      // li = document.createElement("li");
      // // li.setAttribute("href", "#");
      // li.innerHTML = JSON.parse(
      //   doc.data().json[0]
      // ).Product_DescriptiveDetail_TitleDetail_TitleElement_TitleText;
      // titleslist.appendChild(li);
      // bod.appendChild(titleslist);

      // M.Sidenav.init(titleslist);
      // console.log(bod);

      // bod.innerHTML += `<div class="collection">
      // 									<a href="#" class="collection-item">${
      //                     JSON.parse(doc.data().json[0]).Product_RecordReference
      //                   }</a>
      // 									<a href="#" class="collection-item">${
      //                     JSON.parse(doc.data().json[0])
      //                       .Product_DescriptiveDetail_TitleDetail_TitleElement_TitleText
      //                   }</a>
      // 								 </div>
      // 								`;
      // bod.innerHTML += `<div>${formatJson(doc.data().json[0]).replace(
      //   /Product_/g,
      //   ""
      // )}</div>`;
    });
  }

  if (e.target.classList.contains("collection-item")) {
    const tabo = document.getElementById(`onix${currentfileid}`);
    const tabt = document.getElementById(`table${currentfileid}`);
    tabo.setAttribute("data-isbn", e.target.id);
    tabt.setAttribute("data-isbn", e.target.id);

    tabo.innerHTML = `${e.target.id} Onix Content`;
  }

  if (e.target.classList.contains("onix")) {
    const tab = document.getElementById(`onix${currentfileid}`);
    tab.innerHTML = tab.dataset.isbn + ` Onix Content`;
  }

  if (e.target.classList.contains("table")) {
    const tab = document.getElementById(`table${currentfileid}`);
    tab.innerHTML = tab.dataset.isbn + ` Table Content`;
  }
});
*/

//const workqueue = document.querySelectorAll('.workqueue');
//workqueue.forEach(item => {
// item.addEventListener('click', (e) => {
//	e.preventDefault();
//	const bdslist = document.querySelector(".collapsible");
//	bdslist.innerHTML = "";
//	const q = query(collection(fbdb, "madhu@bds.com"));
//	const unsb = onSnapshot(q, (qSnapshot) => {
//		qSnapshot.forEach((doc) => {
//console.log(doc.id, doc.data().filetype, new Date(doc.data().timestamp).toISOString(), doc.data().json.length>0 ? JSON.parse(doc.data().json[0]).Product_RecordReference : "");
//			bdslist.innerHTML += `
//				<li>
//					<div class="collapsible-header" id="${doc.id}">${doc.id}<br/>File Type: ${doc.data().filetype}<br/>Updated: ${new Date(doc.data().timestamp).toISOString()}</div>
//					<div class="collapsible-body">
//						<a class="xml" href="#xml">Xml</a>
//						<a class="tbl" href="#tbl">Table</a>
//						<div class="divider"></div>
//					</div>
//				</li>
//			`;
//<a class="titles">${doc.data().json.length>0 ? JSON.parse(doc.data().json[0]).Product_RecordReference : ""}</a>

// <ul class="tabs" id=${doc.id}>
// 	<li class="tab"><a href="#xml">Xml</a></li>
// 	<li class="tab"><a href="#table">Table</a></li>
// </ul>
// <div id="xml" class="col s12">XML</div>
// <div id="table" class="col s12">TABLE</div>
//<span>${doc.data().xml.length > 0 ? formatXml(doc.data().xml[0]) : ""}</span>

//bdslist.insertAdjacentHTML('afterbegin', `<li><div class="collapsible-header">${doc.id}</div><div class="collapsible-body"></div></li>`);
//bdstabs.insertAdjacentHTML('afterbegin', `<li class="tab"><a href="#xml">Xml</a></li><li class="tab"><a href="#table">Table</a></li>`);
//		});
//	});

// const unsub = onSnapshot(doc(fbdb, "bdsfiles", "File1.xml"), (doc) => {
// // 	console.log("Current data: ", doc.data());
// // 	//bdsmain.insertAdjacentHTML('afterend', `<p>${doc.data().Company}<br/>${doc.data().Email}</p>`)
// // 	bdsmain.innerHTML = '<h4>Workqueue</h4>';
// // 	bdsmain.innerHTML += '<div>Upload File...</div>';
// // 	bdsmain.innerHTML += `<p>${doc.data().Company}<br/>${doc.data().Email}</p>`;

// 	//const xmlStr = '<t><a id="a"><b id="b">hey!</b></a><a id="a"><b id="b">hello</b></a></t>';
// 	//const parser = new DOMParser();
// 	//const dom = parser.parseFromString(xmlStr, "application/xml");
// 	// print the name of the root element or error message
// 	//console.log(dom.documentElement.nodeName == "parsererror" ? "error while parsing" : dom.documentElement.childNodes);

// 	//const serializer = new XMLSerializer();
// 	//console.log(serializer.serializeToString(dom));

// 	const parser = new DOMParser();
// 	const dom = parser.parseFromString(Onix30File01, "application/xml");
// 	//console.log(dom.documentElement.nodeName == "parsererror" ? "error while parsing" : dom.documentElement.childNodes);
// 	let Product = xml2json(dom, '\t').Product;
// 	let ProductFlat = flatten(Product, "Product");
// 	let ProductUnflat = unflatten(ProductFlat);
// 	let ProductXml =  json2xml(ProductUnflat, '\t');
// 	bdsmain.innerHTML += formatJson(JSON.stringify(ProductFlat));
// 	bdsmain.innerHTML += formatXml(ProductXml);
// });

//  });
//});

// const collapsible = document.querySelectorAll(".collapsible-header");
// collapsible.forEach((item) => {
//   console.log("collapsible-header clicked");
//   item.addEventListener("click", (e) => {
//     e.preventDefault();
//     const hdr = document.getElementById(e.target.id);
//     const bod = hdr.nextElementSibling;
//     bod.appendChild(document.createElement("a"));
//     console.log(bod);
//     // const cb = document.querySelectorAll('.collapsible-body');
//     // cb.forEach(b => {
//     // 	b.appendChild(document.createElement("a"));
//     // 	//console.log(b);
//     // });
//   });
// });
//collapsible.forEach(item =>{
// collapsible.addEventListener('DOMNodeInserted', (e) => {
// 	  //if (e.target.tagName === 'LI' && e.target.childNodes[3].childNodes[1].className === "tabs") {
// 		  //console.log(document.querySelector('.tabs').length);
// 		if(document.querySelectorAll('.tabs').length == 4){
// 			document.querySelectorAll('.tabs').forEach(item => {
// 			console.log(item.className);
// 			M.Tabs.init(document.querySelector('.tabs'));
// 		});
// 		//console.log(document.querySelectorAll('.tabs'));
// 	  	}

// });
//});

const createworkque = document.querySelector(".createworkque");
createworkque.addEventListener("click", (e) => {
  e.preventDefault();

  const parser = new DOMParser();
  const dom = parser.parseFromString(Onix30File01, "application/xml");
  const Product = xml2json(dom, "\t").Product;
  const ProductFlat = flatten(Product, "Product");

  const bdsfiles = collection(fbdb, authObj.bdsuser.email);
  [
    {
      doc: "File1.xml",
      filetype: "Onix30",
      xml: [Onix30File01, Onix30File01],
      json: [JSON.stringify(ProductFlat), JSON.stringify(ProductFlat)]
    },
    {
      doc: "File2.xlsx",
      filetype: "Excel30",
      xml: [Onix30File01],
      json: [JSON.stringify(ProductFlat)]
    },
    { doc: "File3.xml", filetype: "Onix21", xml: [], json: [] },
    { doc: "File4.xlsx", filetype: "Excel21", xml: [], json: [] }
  ].forEach((item) => {
    setDoc(
      doc(bdsfiles, item.doc),
      {
        filetype: item.filetype,
        xml: item.xml,
        json: item.json,
        timestamp: Date.now()
      },
      { merge: true }
    ).then(() => {
      console.log(`${item.doc} Uploaded Successfully`);
    });
  });
});
