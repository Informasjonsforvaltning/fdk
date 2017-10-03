import * as React from 'react';

export default class DetailsPage extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <div className="designsystemNumber">3.1</div>
            <div className="designsystemH1">Detaljsiden</div>
          </div>

          <div className="col-md-8">
            <h1 className="fdk-margin-bottom">Markagrensen Oslo Kommune og nærliggende kommuner</h1>
            <div className="fdk-margin-bottom">
              Eies av <a>Kartverket</a>
              <a><div className="fdk-label">Forvaltning og offentlig sektor</div></a>
              <a><div className="fdk-label">Miljø</div></a>
            </div>

            <p className="fdk-ingress">
              Datasettet avgrenser område for virkeområdet til lov 6. juni 2009 nr. 35 om naturområder i Oslo og nærliggende kommuner (markaloven) som trådte i kraft 1. september 2009.
              Markalovens virkeområde er fastsatt i forskrift 4. september 2015 nr. 1032 om justering av markagrensen fastlegger markalovens geografiske virkeområde med tilhørende kart.
            </p>
            <p className="fdk-ingress">
              Datasettes formål er nullam quis risus eget urna mollis ornare vel eu leo. Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Cras mattis consectetur purus
              sit amet fermentum. Vestibulum id ligula porta felis euismod semper.
            </p>
          </div>

          <div className="col-md-8">
            <div className="fdk-container-detail fdk-container-detail-header fdk-margin-top-double">
              <i className="fa fa-unlock fdk-fa-left fdk-color-green"></i>Datasettet er offentlig
            </div>
            <div className="fdk-container-detail fdk-container-detail-offentlig">
              <h4 className="fdk-margin-bottom">Distribusjon</h4>
              <p className="fdk-ingress">
                Dette er beskrivelsen av distribusjonen. Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor. Vestibulum id ligula porta felis euismod semper con desbit arum. Se dokumentasjon for denne distribusjonen.
              </p>
              <h5 className="fdk-space-above">Tilgjengelige format</h5>
              <div className="fdk-label-distribution fdk-bg-green2"><i className="fa fa-cogs fdk-fa-left"></i><strong className="fdk-distribution-format">API</strong>application/rdf+xml</div>
              <div className="fdk-label-distribution fdk-bg-green2"><i className="fa fa-cogs fdk-fa-left"></i><strong className="fdk-distribution-format">API</strong>text/json</div>

              <h5 className="fdk-margin-top-double">TilgangsURL</h5>
              <a>http://www.detteerenlenke.no/til-nedlasting<i className="fa fa-external-link fdk-fa-right"></i></a>

              <div className="fdk-container-detail-text">
                <h5 className="fdk-margin-top-double">Utgivelsesdato</h5>
                <p className="fdk-ingress fdk-ingress-detail">Dette er innholdet i denne boksen.</p>
              </div>
            </div>
            <div className="fdk-container-detail fdk-container-detail-offentlig">
              <h4>Distribusjon</h4>
              <h5 className="fdk-margin-top">Tilgjengelige format</h5>
              <div className="fdk-label-distribution fdk-bg-green2"><i className="fa fa-download fdk-fa-left"></i><strong className="fdk-distribution-format">Nedlastbar fil</strong>application/rdf+xml</div>

              <h5 className="fdk-margin-top-double">TilgangsURL</h5>
              <a>http://www.detteerenlenke.no/til-nedlasting<i className="fa fa-external-link fdk-fa-right"></i></a>
            </div>

            <div className="row fdk-row fdk-margin-top-triple">
              <div className="col-md-6 fdk-padding-no">
                <div className="fdk-container-detail">
                  <div className="fdk-detail-icon">
                    <i className="fa fa-upload fdk-fa-detail"></i>
                  </div>
                  <div className="fdk-detail-text">
                    <h5>Utgivelsesdato</h5>
                    <p className="fdk-ingress fdk-margin-bottom-no">01.01.2015</p>
                  </div>
                </div>
              </div>
              <div className="col-md-6 fdk-padding-no">
                <div className="fdk-container-detail">
                  <div className="fdk-detail-icon">
                    <i className="fa fa-upload fdk-fa-detail"></i>
                  </div>
                  <div className="fdk-detail-text">
                    <h5>Opphav</h5>
                    <p className="fdk-ingress fdk-margin-bottom-no">Tredjepart</p>
                  </div>
                </div>
              </div>
              <div className="col-md-4 fdk-padding-no">
                <div className="fdk-container-detail">
                  <div className="fdk-detail-icon">
                    <i className="fa fa-upload fdk-fa-detail"></i>
                  </div>
                  <div className="fdk-detail-text">
                    <h5>Utgivelsesdato</h5>
                    <p className="fdk-ingress fdk-margin-bottom-no">01.01.2015</p>
                  </div>
                </div>
              </div>
              <div className="col-md-4 fdk-padding-no">
                <div className="fdk-container-detail">
                  <div className="fdk-detail-icon">
                    <i className="fa fa-upload fdk-fa-detail"></i>
                  </div>
                  <div className="fdk-detail-text">
                    <h5>Opphav</h5>
                    <p className="fdk-ingress fdk-margin-bottom-no">Tredjepart</p>
                  </div>
                </div>
              </div>
              <div className="col-md-4 fdk-padding-no">
                <div className="fdk-container-detail">
                  <div className="fdk-detail-icon">
                    <i className="fa fa-upload fdk-fa-detail"></i>
                  </div>
                  <div className="fdk-detail-text">
                    <h5>Opphav</h5>
                    <p className="fdk-ingress fdk-margin-bottom-no">Tredjepart</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="fdk-container-detail fdk-container-detail-header">
              <i className="fa fa-star fdk-fa-left fdk-color-cta"></i>Kvalitet på innhold
            </div>
            <div className="fdk-container-detail">
              <h5>Relevans</h5>
              <p className="fdk-ingress fdk-margin-bottom-double">Denne teksten sier noe om relevansen. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras mattis consectetur purus sit amet fermentum. Cum sociis natoque penatibus et magnis dis parturient montes.</p>
              <h5>Kompletthet</h5>
              <p className="fdk-ingress fdk-margin-bottom-double">Denne teksten sier noe om komplettheten. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras mattis consectetur purus sit amet fermentum.</p>
              <h5>Nøyaktighet</h5>
              <p className="fdk-ingress fdk-margin-bottom-double fdk-margin-bottom-no">Denne teksten sier noe om nøyaktigheten. Cras mattis consectetur purus sit.</p>
              <h5>Tilgjengelighet</h5>
              <p className="fdk-ingress fdk-margin-bottom-no">Denne teksten sier noe om tilgjengeligheten. Vestibulum id ligula porta felis euismod semper. Duis mollis, est non commodo luctus, nisi erat porttitor ligula, eget lacinia odio sem nec elit. Cras mattis consectetur purus sit amet fermentum.</p>
            </div>

            <div className="fdk-container-detail fdk-container-detail-header">
              <i className="fa fa-book fdk-fa-left fdk-color-cta"></i>Begrep
            </div>
            <div className="fdk-container-detail fdk-container-detail-begrep">
              <p className="fdk-ingress fdk-margin-bottom-no"><strong>Jordsmonn:</strong> Dette er Kartverket sin korte og presise definisjon av begrepet jo… <i className="fa fa-chevron-down fdk-fa-right fdk-float-right"></i></p>
            </div>
            <div className="fdk-container-detail fdk-container-detail-begrep">
              <p className="fdk-ingress fdk-margin-bottom-no"><strong>Jordsmonn:</strong> Dette er Kartverket sin korte og presise definisjon av begrepet jo… <i className="fa fa-chevron-down fdk-fa-right fdk-float-right"></i></p>
            </div>
            <div className="fdk-container-detail fdk-container-detail-begrep">
              <p className="fdk-ingress fdk-margin-bottom-no"><strong>Jordsmonn:</strong> Dette er Kartverket sin korte og presise definisjon av begrepet jo… <i className="fa fa-chevron-down fdk-fa-right fdk-float-right"></i></p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
