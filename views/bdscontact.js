export class BDSContact {
  async getPage() {
    document.getElementById("bdscontent").innerHTML = `
      <div class="container">
        <p>
          Thank You For Your Interest in BookDataSolutions.com! We also specialize in Consulting in All Areas Related to Book Data Including Customized ONIX Processing And Feeds.
          <br/>
          <br/>
          Please Fill Out the Form With a Brief Description of Areas Needing Help With. We Will Respond Back to the email provided!
          <br/>
          <br/>
          You can get in touch with us at: <strong>support@bookdatasolutions.com</strong>  
        </p>
        <form id="contact-form" class="container">
          <div class="row">
            <div class="input-field col s12">
              <input id="contact-name" type="text" class="validate" required/>
              <label for="contact-name">Name</label>
            </div>
          </div>
          <div class="row">
            <div class="input-field col s12">
              <input id="contact-company" type="text" class="validate" required/>
              <label for="contact-company">Company Name</label>
            </div>
          </div>
          <div class="row">
            <div class="input-field col s12">
              <input id="contact-email" type="email" class="validate" required/>
              <label for="contact-email">Email</label>
            </div>
          </div>
          <div class="row">
            <div class="input-field col s12">
              <textarea id="contact-msg" class="materialize-textarea validate" required></textarea>
              <label for="contact-msg">Message</label>
            </div>
          </div>
          <div class="center"><button class="btn yellow darken-2">Submit</button></div>
          <br/>
        </form>  
      </div>
    `;
  }

  async processContact(id) {
    const contactForm = document.getElementById("contact-form");
    const name = contactForm["contact-name"].value;
    const company = contactForm["contact-company"].value;
    const email = contactForm["contact-email"].value;
    const msg = contactForm["contact-msg"].value;
    console.log(`${name}\n${company}\n${email}\n${msg}`);

    Email.send({
      SecureToken: "8ef9664a-5f6e-4104-8c1a-96d5bcc709b8",
      To: "bookdatasolutions@gmail.com",
      From: "support@bookdatasolutions.com",
      Subject: `${name} Sent an Email!`,
      Body: `Name: ${name}<br/>Company: ${company}<br/>Email: ${email}<br/>Message:${msg}`
    }).then((message) => {
      alert("Thanks for Contacting Bookdatasolutions.com!\nWe will contact you as soon as possible.");
    });
  }
}
