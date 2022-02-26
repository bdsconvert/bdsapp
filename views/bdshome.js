export class BDSHome {
  async getPage() {
    // document.getElementById("bdsheader").innerHTML = `<h4>Welcome to BookDataSolutions</h4>`;
    document.getElementById("bdscontent").innerHTML = `
    <style>
      img {
        width:100%;
      }
    </style>
    <div class="card card-gradient">
      <div class="card-content container">
          <h4 class="center">Welcome to BookDataSolutions</h4>
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
          </p>
        
          <div class="row valign-wrapper">
            <div class="col s12 m12 l6">
              <p><h5>Convert Data Between Excel and ONIX 3.0/2.1 Files:</h5></p>
              <p>
                  BookDataSolutions.com allows you to Upload Excel and ONIX input files from "Workqueue" page.
                  You will need to register and login to use this feature.
                  The application will determine the type of input file based on the file extention.
                  Excel input file should have an extention ".xlsx" and Onix files must be saved with extention ".xml".
              </p>
              <br/>
              <p>        
                <a href="/samples" page-link>View and Download Sample Onix and Excel Files</a>
              </p>
            </div>
            <div class="col s12 m12 l6"><img class="right" src="https://bdsconvert.github.io/bdsapp/assets/BDS1.png"></div>
          </div>
          <div class="row valign-wrapper">
            <div class="col s12 l6"><img src="https://bdsconvert.github.io/bdsapp/assets/BDS2.png"></div>
            <div class="col s12 l6">
              <p>
                Download Excel template file along with sample titles to create book records for uploading and converting them to ONIX records.                    
                Prepare the spreadsheet with book records using a custom layout.   
                (<a href="https://bdsconvert.github.io/bdsapp/assets/BDSSampleExcel.zip" target="_self"><strong>You can download Excel custom layout with sample data for ONIX 3.0 here</strong><i class="material-icons" title="Download" download-link>download</i></a>).  
                Add remove fields as neccessary by following the field header convention.
                Use ONIX standard code list values/descriptions for ONIX code data columns.              
              </p>
            </div>
          </div>
          <div class="row valign-wrapper">
            <div class="col s12 m12 l6">
              <p>
                Upload the spreadsheet/Onix from "Workqueue" page.
                The application will determine the type of input file based on the file extention.
                Excel input file should have an extention ".xlsx" and Onix files must be saved with extention ".xml".
                BookDataSolutions will process the records and ONIX/Excel file will be generated in the background.
              </p>
              <p>
                To output ONIX 3.0/2.1 records to Excel spreadsheets,
                upload valid ONIX file from "Workqueue/Upload Files" page.  
                You should choose the fields you want to see in the Excel file by selecting unique fields from the list.
              </p>
            </div>
            <div class="col s12 m12 l6"><img class="right" src="https://bdsconvert.github.io/bdsapp/assets/BDS3.png"></div>
          </div>
          <div class="row valign-wrapper">
            <div class="col s12 m12 l6"><img src="https://bdsconvert.github.io/bdsapp/assets/BDS4.png"></div>
            <div class="col s12 m12 l6">
              <p>The generated Output records can be viewed on the web page and are available for downloading.</p>
            </div>
          </div>  
            <!--
            <div class="col s6 m12 l6 push-l1 slider">
              <ul class="slides">
                <li><a href="#one!"><img src="https://bdsconvert.github.io/bdsapp/assets/BDS1.png"></a></li>
                <li><a href="#two!"><img src="https://bdsconvert.github.io/bdsapp/assets/BDS2.png"></a></li>
                <li><a href="#three!"><img src="https://bdsconvert.github.io/bdsapp/assets/BDS3.png"></a></li>
                <li><a href="#four!"><img src="https://bdsconvert.github.io/bdsapp/assets/BDS4.png"></a></li>
              <ul>          
            </div>
            -->          
      </div>    
    </div>
    `;
    // M.Slider.init(document.querySelectorAll(".slider"), {});
  }
}
