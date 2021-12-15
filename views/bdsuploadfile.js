import { formatXml, json2xml, unflatten } from "../modules/bdsutil.js";
import { SaveUserFile, SaveTitleContents } from "../data/bdsfirebase.js";

export class BDSUploadfile {
  async getPage() {
    document.getElementById("bdsheader").innerHTML = `<h4>Upload Onix/Excel files</h4>`;
    document.getElementById("bdscontent").innerHTML = `
          <form action="#" class="z-depth-0">
            <div class="file-field input-field center">
              <div class="btn">
                <span>Browse</span>
                <input type="file" id="bdsfile">
              </div>
              <div class="file-path-wrapper">
                <input class="file-path validate" type="text" placeholder="Upload Onix or Excel file">
              </div>
            </div>
          </form> 
    `;
  }

  static ProcessFile = (file) => {
    const reader = new FileReader();
    reader.readAsBinaryString(file);

    reader.addEventListener("progress", (e) => {
      e.preventDefault();
      console.log(`${e.loaded} bytes transferred\n`);
    });

    reader.addEventListener("load", (e) => {
      e.preventDefault();
      console.log(file.name);

      if (file.type === "text/xml") {
        //ExtractOnixTitles(file, reader.result);
        //SaveFile();
        console.log(`${file.name} uploaded Successfully\n`);
      } else {
        let onix = "";
        let flat = {};
        readXlsxFile(file).then(async function (rows) {
          const hdr = rows[0];
          //Save Userfile
          await SaveUserFile({
            filename: file.name,
            filetype: "Excel",
            timestamp: Date.now(),
            fields: hdr
          });
          console.log("User file saved!");
          rows.slice(1).forEach(async (row) => {
            for (let i = 0; i < hdr.length; i++) {
              if (row[i]) flat[hdr[i]] = row[i];
            }
            await SaveTitleContents(
              file.name,
              {
                RecordReference: `${flat["Product_0_RecordReference_0"]}`,
                Title: flat["Product_0_DescriptiveDetail_0_TitleDetail_0_TitleElement_0_TitleText_0"],
                Author: flat["Product_0_DescriptiveDetail_0_Contributor_0_PersonName_0"]
              },
              {
                xml: json2xml(unflatten(flat)),
                json: JSON.stringify(flat)
              }
            );
            console.log(`Title/Contents saved for File: ${file.name}, RecordReference: ${flat["Product_0_RecordReference_0"]}`);
          });
          // //console.log(json2xml(unflatten(flat)));
          // document.getElementById("bdscontent").innerHTML = formatXml(json2xml(unflatten(flat)));
        });
      }
    });
  };
}
