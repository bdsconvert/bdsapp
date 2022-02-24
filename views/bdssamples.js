import { BdsSamples } from "../components/bdssamples.js";

export class BDSSamples {
  async getPage() {
    document.getElementById("bdscontent").innerHTML = ` 
      <div class="card"><div class="card-content">
        <ul class="collapsible">
          <li class="active">
            <div class="collapsible-header grey lighten-5" id=""><span style="width:100%;"><h5>ONIX From Excel</h5></span><i class="material-icons right">expand_more</i></div>
            <div class="collapsible-body">
              <a href="https://bdsconvert.github.io/bdsapp/assets/BDSSampleExcel.zip" target="_self" class="right"><i class="material-icons left" title="Download" download-link>download</i>Download Excel Input and Onix Ouput Files</a>
              <div class="card-tabs">
                <ul id="eotabs" class="tabs">
                    <li class="tab col s3 active"><a href="#eoefile" class="active">Excel</a></li>          
                    <li class="tab col s3"><a href="#eoofile">Onix</a></li>
                </ul>                  
              </div>
              <div>
                <div id="eoefile" class="col s12"><bds-samples sampletype="eoExcel"></bds-samples></div>    
                <div id="eoofile" class="col s12"><bds-samples sampletype="eoOnix"></bds-samples></div>               
              </div>
            </div>        
          </li>
          <li>
            <div class="collapsible-header grey lighten-5" id=""><span style="width:100%;"><h5>Excel From ONIX</h5></span><i class="material-icons right">expand_more</i></div>
            <div class="collapsible-body">
              <a href="https://bdsconvert.github.io/bdsapp/assets/BDSSampleOnix.zip" target="_self" class="right"><i class="material-icons left" title="Download" download-link>download</i>Download Onix Input and Excel Ouput Files</a>
              <div class="card-tabs">
                  <ul id="eotabs" class="tabs">
                    <li class="tab col s3"><a href="#oeofile" class="active">Onix</a></li>
                    <li class="tab col s3 active"><a href="#oeefile">Excel</a></li>          
                  </ul>                  
              </div>
              <div>
                <div id="oeofile" class="col s12"><bds-samples sampletype="oeOnix"></bds-samples></div>               
                <div id="oeefile" class="col s12"><bds-samples sampletype="oeExcel"></bds-samples></div>    
              </div>
            </div>        
          </li>
        </ul>
      </div></div>
    `;
    M.Collapsible.init(document.querySelectorAll(".collapsible"), { accordion: false });
    M.Tabs.init(document.querySelectorAll(".tabs", { swipeable: true }));

    // <bds-samples></bds-samples>
  }
} // Class End
