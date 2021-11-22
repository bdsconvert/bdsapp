export class BDSHome {
  async getPage() {
    return `
      <div>
        <h4>Welcome to BookDataSolutions</h4>
        <h5>Book Solutions Made Easy </h5>
        <p>
          Book data is widely exchanged between publishers, libraries, and book retailers in ONIX formatted files.
          ONIX is a book industry XML standard defined by <a href="https://www.editeur.org" target="_blank"><strong>EDItEUR</strong></a>.                    
        </p>
        <p>
          BookDataSolutions supports conversion of book data between tree structured ONIX 3.0/2.1 and flat Excel files.
          The service can be used to export incoming ONIX data to help upload to company databases and 
          can be used to create ONIX records from spreadsheets for delivery to customers.
          BookDataSolutions allows you to do conversions with predefined Excel layout for ONIX conversions.
          Download Excel template file along with sample titles to create book records for uploading and converting to ONIX records.                    
        </p>
      </div>    
    `;
  }
}
