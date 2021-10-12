import { authObj, fbdb } from '../index.js';
import { xml2json, json2xml, flatten, unflatten, formatJson, formatXml } from './bdsutil.js';
import { collection, query, where, doc, getDocs, setDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/9.0.2/firebase-firestore.js";
import { Onix30File01 } from './bdsdata.js';


const workqueue = document.querySelectorAll('.workqueue');
workqueue.forEach(item => {
  item.addEventListener('click', (e) => {
	e.preventDefault();
	const bdslist = document.querySelector(".collapsible");
	bdslist.innerHTML = "";
	const bdstabs = document.querySelector(".tabs");
	const q = query(collection(fbdb, "madhu@bds.com"));
	const unsb = onSnapshot(q, (qSnapshot) => {
		qSnapshot.forEach((doc) => {
			//console.log(doc.id, doc.data().filetype, new Date(doc.data().timestamp).toISOString(), doc.data().json.length>0 ? JSON.parse(doc.data().json[0]).Product_RecordReference : "");
			bdslist.innerHTML += `
				<li>
					<div class="collapsible-header" id="${doc.id}">${doc.id}<br/>File Type: ${doc.data().filetype}<br/>Updated: ${new Date(doc.data().timestamp).toISOString()}</div>
					<div class="collapsible-body">
						<a class="xml" href="#xml">Xml</a>
						<a class="tbl" href="#tbl">Table</a>
						<div class="divider"></div>
					</div>
				</li>
			`;			
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
		});
	});
	
			
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

  });
});

const collapsible = document.querySelectorAll(".collapsible");
collapsible.forEach(item => {
	item.addEventListener('click', (e) => {
		e.preventDefault();
		const hdr = document.getElementById(e.target.id);
		const bod = hdr.nextElementSibling;
		bod.appendChild(document.createElement("a"));
		console.log(bod);
		// const cb = document.querySelectorAll('.collapsible-body');
		// cb.forEach(b => {
		// 	b.appendChild(document.createElement("a"));
		// 	//console.log(b);
		// });
		
	});
});
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

const createworkque = document.querySelector('.createworkque');
createworkque.addEventListener('click', (e) => {
	e.preventDefault();

	const parser = new DOMParser();
	const dom = parser.parseFromString(Onix30File01, "application/xml");
	const Product = xml2json(dom, '\t').Product;
	const ProductFlat = flatten(Product, "Product");

	const bdsfiles = collection(fbdb, authObj.bdsuser.email);
	[{doc: 'File1.xml',  filetype: 'Onix30',  xml:[Onix30File01], json:[JSON.stringify(ProductFlat)]},
	 {doc: 'File2.xlsx', filetype: 'Excel30', xml:[Onix30File01], json:[JSON.stringify(ProductFlat)]},
	 {doc: 'File3.xml',  filetype: 'Onix21',  xml:[],             json:[]},
	 {doc: 'File4.xlsx', filetype: 'Excel21', xml:[],             json:[]}]
	.forEach((item) => {
		setDoc(doc(bdsfiles, item.doc), {
			filetype: item.filetype, 
			xml: item.xml, 
			json: item.json, 
			timestamp: Date.now()
		}, { merge: true }).then(() => {console.log(`${item.field} Uploaded Successfully`)});
	})


});