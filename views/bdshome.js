export class BDSHome {
  async getPage() {
    // document.getElementById("bdsheader").innerHTML = `<h4>Welcome to BookDataSolutions</h4>`;
    document.getElementById("bdscontent").innerHTML = `
    <div class="card">
      <div class="card-content container">
        <h4>Welcome to BookDataSolutions</h4>
                  
          <div class="row">
            <div class="col s6">
              <h5>Book Solutions Made Easy </h5>
              <p>
                Book data is widely exchanged between publishers, libraries, and book retailers in ONIX formatted files.
                ONIX is a book industry XML standard defined by <a href="https://www.editeur.org" target="_blank"><strong>EDItEUR</strong></a>.                    
              </p>
              <br/>
              <p>        
                BookDataSolutions supports conversion of book data between tree structured ONIX 3.0/2.1 and flat Excel files.
                The service can be used to export incoming ONIX data to help upload to company databases and 
                can be used to create ONIX records from spreadsheets for delivery to customers.
                BookDataSolutions allows you to do conversions with predefined Excel layout for ONIX conversions.
                Download Excel template file along with sample titles to create book records for uploading and converting to ONIX records.                    
              </p>
            </div>
            <div class="col s6">
              <div class="slider">
                <ul class="slides">
                  <li><a href="#one!"><img src="../assets/BDS1.png"></a></li>
                  <li><a href="#two!"><img src="../assets/BDS2.png"></a></li>
                  <li><a href="#three!"><img src="../assets/BDS3.png"></a></li>
                  <li><a href="#four!"><img src="../assets/BDS4.png"></a></li>
                <ul>          
              </div>
            </div>
          </div>
          <p><h5>Convert Data Between Excel and ONIX 3.0/2.1 Files:</h5></p>
          <p>
              BookDataSolutions.com allows you to Upload Excel and ONIX input files from "Workqueue" page.
              You will need to register and login to use this feature.
              The application will determine the type of input file based on the file extention.
              Excel input file should have an extention ".xlsx" and Onix files must be saved with extention ".xml".
          </p>
          <p>
              Create ONIX 3.0/2.1 records in few steps by preparing book data in an Excel spreadsheet.  
              Prepare the spreadsheet with book records using a custom layout.   
              (<a href="https://bookdatasolutions.com/bdsapp/files/ExcelSamples.zip" target="_self"><strong>You can download Excel custom layouts with sample data for ONIX 3.0/2.1 here</strong></a>).  
              Add remove fields as neccessary by following the field header convention.
              Use ONIX standard code list values/descriptions for ONIX code data columns.
              Upload the spreadsheet from "Work Queue/Upload New File" page.
              Generate Output ONIX 3.0 from "Work Queue" page.
              BookDataSolutions will process the records and ONIX file will be generated behind the scenes.
              The generated Output records can be viewed on the web page and are available for downloading.
          </p>
          <p>
              To output ONIX 3.0/2.1 records to Excel spreadsheets,
              upload valid ONIX file from "Workqueue/Upload Files" page.  
              You should choose the fields you want to see in the Excel file by selecting unique fields from the list.
              Excel output records can also be viewed and are available to download.
          </p>
        
          
      </div>    
    </div>
    `;
    M.Slider.init(document.querySelectorAll(".slider"), {});
  }
}
