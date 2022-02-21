import {
  xml2json,
  json2xml,
  flatten,
  unflatten,
  formatXml
} from "../utils/bdsutil.js";
import { SaveUserFile, SaveTitleContents } from "../data/bdsfirebase.js";

export class BdsFileUpload extends HTMLElement {
  constructor() {
    super();
    this.innerHTML = `
      <span class="right" style="margin:1em;cursor:pointer;"><i class="material-icons" fileupload-close>close</i></span>
      <form action="#" class="container">
        <h5>Upload Onix/Excel files</h5>
        <div class="file-field input-field center">
          <div class="btn">
            <span>Browse</span>
            <input type="file" id="bdsfile">
          </div>
          <div class="file-path-wrapper">
            <input class="file-path validate" type="text" placeholder="Upload Onix or Excel file">
          </div>
        </div>
        <p id="fustatus"></p>
        <p id="foview"></p>
      </form> 
    `;
  }

  connectedCallback() {
    document.getElementById("fustatus").innerHTML = ``;
    this.addEventListener("click", (e) => {
      // e.preventDefault();
      if (e.target.matches("[fileupload-close]")) {
        M.Modal.getInstance(document.querySelector("#bdsfileupload")).close();
      }
    });

    this.addEventListener("change", (e) => {
      if (e.target.id === "bdsfile") {
        const bdsfile = document.getElementById("bdsfile");
        if (bdsfile.files && bdsfile.files[0]) {
          this.ProcessFile(bdsfile.files[0]);
        }
      }
    });
  }

  ProcessFile = (file) => {
    document.getElementById("fustatus").innerHTML = ` Loading...`;
    //<div class="progress"><div class="indeterminate"></div></div>`;
    const reader = new FileReader();
    reader.readAsBinaryString(file);

    reader.addEventListener("progress", (e) => {
      e.preventDefault();
      console.log(`${e.loaded} bytes transferred\n`);
    });

    reader.addEventListener("load", (e) => {
      e.preventDefault();

      if (file.type === "text/xml") {
        this.SaveOnixTitles(file, reader.result).then(() => {
          console.log(`${file.name} uploaded Successfully\n`);
          M.toast({
            html: `${file.name} (${file.type}) uploaded Successfully\n`
          });
        });
      } else {
        console.log("Started Processing...");
        document.getElementById("fustatus").innerHTML = `Loading...`;
        this.SaveExcelTitles(file, reader.result).then(() => {
          document.getElementById("fustatus").innerHTML = `Done...`;
          console.log("Done Processing...");
          M.toast({
            html: `${file.name} (${file.type}) uploaded Successfully\n`
          });
        });
      }
    });
  };

  SaveExcelTitles = async (file, xlsx) => {
    // return new Promise((resolve, reject) => {
    //Save Userfile
    await SaveUserFile({
      filename: file.name,
      filetype: "Excel",
      timestamp: Date.now(),
      fields: []
    });
    console.log("User file saved!");

    const wb = XLSX.read(xlsx, { type: "binary" });
    const rows = XLSX.utils.sheet_to_row_object_array(wb.Sheets["Onix30"]);
    rows.forEach(async (row) => {
      for (const elem in row) {
        const idx = row[elem].indexOf(" - ");
        if (idx !== -1 && idx < 5) {
          row[elem] = row[elem].slice(0, idx).trim();
        }
      }
      // console.log(row);
      const onix = `
          <ONIXMessage release="3.0" xmlns="http://ns.editeur.org/onix/3.0/reference">
            <Product>
            ${json2xml(unflatten(row))}
            </Product>
          </ONIXMessage>
        `;
      document.getElementById("foview").innerHTML = `${formatXml(onix)}`;

      await SaveTitleContents(
        file.name,
        {
          RecordReference: `${row["RecordReference_0"]}`,
          Title:
            row["DescriptiveDetail_0_TitleDetail_0_TitleElement_0_TitleText_0"],
          Author:
            row["DescriptiveDetail_0_Contributor_0_PersonName_0"] ||
            row["DescriptiveDetail_0_Contributor_0_NamesBeforeKey_0"] +
              " " +
              row["DescriptiveDetail_0_Contributor_0_KeyNames_0"]
        },
        {
          xml: `<Product>${json2xml(unflatten(row))}</Product>`,
          json: JSON.stringify(row)
        }
      );
    });
    // Save title count
    await SaveUserFile({
      filename: file.name,
      filesize: rows.length
    });
    // console.log(rows);
    // resolve();
    // });
  };

  SaveOnixTitles = async (file, onix) => {
    const parser = new DOMParser();
    const dom = parser.parseFromString(onix, "application/xml");
    console.log(
      dom.documentElement.nodeName === "parsererror"
        ? "error while parsing"
        : dom.documentElement.length
    );
    const FileType = `Onix${dom
      .getElementsByTagName("ONIXMessage")[0]
      .getAttribute("release")
      .replace(".", "")}`;
    console.log(FileType);

    //Save Userfile without fields
    await SaveUserFile({
      filename: file.name,
      filetype: FileType,
      timestamp: Date.now(),
      fields: []
    });
    console.log("User file saved W/O Fields!");

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
      for (let elem of new Set(
        objkeys.filter((key) => key.startsWith("Product_0_ProductIdentifier"))
      )) {
        pid.add(elem);
      }
      for (let elem of new Set(
        objkeys.filter((key) =>
          key.startsWith("Product_0_DescriptiveDetail_0_Product")
        )
      )) {
        ddg.add(elem);
      }
      for (let elem of new Set(
        objkeys.filter((key) =>
          key.startsWith("Product_0_DescriptiveDetail_0_Measure")
        )
      )) {
        ddm.add(elem);
      }
      for (let elem of new Set(
        objkeys.filter((key) =>
          key.startsWith("Product_0_DescriptiveDetail_0_Collection")
        )
      )) {
        ddc.add(elem);
      }
      for (let elem of new Set(
        objkeys.filter((key) =>
          key.startsWith("Product_0_DescriptiveDetail_0_TitleDetail")
        )
      )) {
        ddt.add(elem);
      }
      for (let elem of new Set(
        objkeys.filter((key) =>
          key.startsWith("Product_0_DescriptiveDetail_0_Contributor")
        )
      )) {
        dda.add(elem);
      }
      for (let elem of new Set(
        objkeys.filter((key) =>
          key.startsWith("Product_0_DescriptiveDetail_0_Language")
        )
      )) {
        ddl.add(elem);
      }
      for (let elem of new Set(
        objkeys.filter((key) =>
          key.startsWith("Product_0_DescriptiveDetail_0_Subject")
        )
      )) {
        dds.add(elem);
      }
      for (let elem of new Set(
        objkeys.filter((key) =>
          key.startsWith("Product_0_DescriptiveDetail_0_Audience")
        )
      )) {
        ddu.add(elem);
      }
      for (let elem of new Set(
        objkeys.filter((key) => key.startsWith("Product_0_CollateralDetail"))
      )) {
        cdg.add(elem);
      }
      for (let elem of new Set(
        objkeys.filter((key) => key.startsWith("Product_0_PublishingDetail"))
      )) {
        pdg.add(elem);
      }
      for (let elem of new Set(
        objkeys.filter((key) => key.startsWith("Product_0_RelatedMaterial"))
      )) {
        rmg.add(elem);
      }
      for (let elem of new Set(
        objkeys.filter((key) => key.startsWith("Product_0_ProductSupply"))
      )) {
        psg.add(elem);
      }

      // Save Titles and Contents
      const RecordReference = ProductFlat.Product_0_RecordReference_0;
      const Title =
        ProductFlat.Product_0_DescriptiveDetail_0_TitleDetail_0_TitleElement_0_TitleText_0;
      const Author =
        ProductFlat.Product_0_DescriptiveDetail_0_Contributor_0_PersonName_0 ||
        ProductFlat.Product_0_DescriptiveDetail_0_Contributor_0_NamesBeforeKey_0 +
          " " +
          ProductFlat.Product_0_DescriptiveDetail_0_Contributor_0_KeyNames_0;
      // console.log(RecordReference, Title, Author, Productarray, child.outerHTML);
      await SaveTitleContents(
        file.name,
        {
          RecordReference: RecordReference,
          Title: Title,
          Author: Author
        },
        {
          xml: child.outerHTML,
          json: Productarray
        }
      );
      console.log(
        `Title/Contents saved for File: ${file.name}, RecordReference: ${RecordReference}`
      );
    }
    const fields = [
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

    //Save Userfile with fields and title count
    await SaveUserFile({
      filename: file.name,
      filetype: FileType,
      timestamp: Date.now(),
      fields: fields,
      filesize: nodes.length
    });
    console.log("User file saved With Fields!");
  };
  ////////////////////////////////////////////////////////////////////////////////////

  // SaveExcelTitles = async (file) => {
  //   const flat = {};
  //   readXlsxFile(file).then(function (rows) {
  //     const hdr = rows[0];
  //     //Save Userfile
  //     // await SaveUserFile({
  //     //   filename: file.name,
  //     //   filetype: "Excel",
  //     //   timestamp: Date.now(),
  //     //   fields: hdr
  //     // });
  //     // console.log("User file saved!");
  //     rows.slice(1).forEach((row) => {
  //       for (let i = 0; i < hdr.length; i++) {
  //         if (row[i]) {
  //           const idx = row[i].indexOf(" - ");
  //           flat[hdr[i]] = idx !== -1 && idx < 5 ? row[i].slice(0, idx).trim() : row[i];
  //         }
  //       }
  //       console.log(`Processing ${flat["RecordReference_0"]}...`);
  //       // document.getElementById("fustatus").innerHTML = `Processing ${flat["RecordReference_0"]}...`;
  //       // const onix = `
  //       //   <ONIXMessage release="3.0" xmlns="http://ns.editeur.org/onix/3.0/reference">
  //       //     <Product>
  //       //     ${json2xml(unflatten(flat))}
  //       //     </Product>
  //       //   </ONIXMessage>
  //       // `;
  //       // document.getElementById("foview").innerHTML = `${formatXml(onix)}`;
  //       // await SaveTitleContents(
  //       //   file.name,
  //       //   {
  //       //     RecordReference: `${flat["Product_0_RecordReference_0"]}`,
  //       //     Title: flat["Product_0_DescriptiveDetail_0_TitleDetail_0_TitleElement_0_TitleText_0"],
  //       //     Author: flat["Product_0_DescriptiveDetail_0_Contributor_0_PersonName_0"]
  //       //   },
  //       //   {
  //       //     xml: json2xml(unflatten(flat)),
  //       //     json: JSON.stringify(flat)
  //       //   }
  //       // );
  //       // console.log(`Title/Contents saved for File: ${file.name}, RecordReference: ${flat["RecordReference_0"]}`);
  //     });
  //     M.toast({ html: `${file.name} (${file.type}) uploaded Successfully\n` });
  //   });
  // };
} // Class End
window.customElements.define("bds-file-upload", BdsFileUpload);
