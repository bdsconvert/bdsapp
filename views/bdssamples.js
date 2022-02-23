import { BdsSamples } from "../components/bdssamples.js";

export class BDSSamples {
  async getPage() {
    document.getElementById("bdscontent").innerHTML = ` 
      <div class="card"><div class="card-content">
        <ul class="collapsible">
          <li class="active">
            <div class="collapsible-header grey lighten-5" id=""><span style="width:100%;">ONIX From Excel</span><i class="material-icons right">expand_more</i></div>
            <div class="collapsible-body">
              <div class="card-tabs">
                  <ul id="eotabs" class="tabs">
                    <li class="tab col s3 active"><a href="#eoefile" class="active">Excel</a></li>          
                    <li class="tab col s3"><a href="#eoofile">Onix</a></li>
                  </ul>                  
              </div>
              <div>
                <div id="eoefile" class="col s12"><bds-samples sampletype="Excel"></bds-samples></div>    
                <div id="eoofile" class="col s12"><bds-samples sampletype="Onix"></bds-samples></div>               
              </div>
            </div>        
          </li>
          <li>
            <div class="collapsible-header grey lighten-5" id=""><span style="width:100%;">Excel From ONIX</span><i class="material-icons right">expand_more</i></div>
            <div class="collapsible-body"></div>        
          </li>
        </ul>
      </div></div>
    `;
    M.Collapsible.init(document.querySelectorAll(".collapsible"), { accordion: true });
    M.Tabs.init(document.querySelectorAll(".tabs", { swipeable: true }));

    // <bds-samples></bds-samples>
  }
} // Class End
