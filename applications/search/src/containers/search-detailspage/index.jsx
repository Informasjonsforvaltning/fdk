import * as React from "react";

export class DetailsPage extends React.Component {
  constructor(props) {

  }
  render {
    return (

      <div class="container">
        <div class="row">
            <div class="col-md-12">
                <div class="designsystemNumber">3.1</div>
                <div class="designsystemH1">Detaljsiden</div>
            </div>

            <div class="col-md-8">
                <h1 class="fdk-margin-bottom">Markagrensen Oslo Kommune og nærliggende kommuner</h1>
                <div class="fdk-margin-bottom">
                    Eies av <a>Kartverket</a>
                    <a><div class="fdk-label">Forvaltning og offentlig sektor</div></a>
                    <a><div class="fdk-label">Miljø</div></a>
                </div>

                <p class="fdk-ingress">
                    Datasettet avgrenser område for virkeområdet til lov 6. juni 2009 nr. 35 om naturområder i Oslo og nærliggende kommuner (markaloven) som trådte i kraft 1. september 2009.
                    Markalovens virkeområde er fastsatt i forskrift 4. september 2015 nr. 1032 om justering av markagrensen fastlegger markalovens geografiske virkeområde med tilhørende kart.
                </p>
                <p class="fdk-ingress">
                    Datasettes formål er nullam quis risus eget urna mollis ornare vel eu leo. Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Cras mattis consectetur purus
                    sit amet fermentum. Vestibulum id ligula porta felis euismod semper.
                </p>
            </div>

            <div class="col-md-8">
                <div class="fdk-container-detail fdk-container-detail-header fdk-margin-top-double">
                    <i class="fa fa-unlock fdk-fa-left fdk-color-green"></i>Datasettet er offentlig
                </div>
                <div class="fdk-container-detail fdk-container-detail-offentlig">
                    <h4 class="fdk-margin-bottom">Distribusjon</h4>
                    <p class="fdk-ingress">
                        Dette er beskrivelsen av distribusjonen. Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor. Vestibulum id ligula porta felis euismod semper con desbit arum. Se dokumentasjon for denne distribusjonen.
                    </p>
                    <h5 class="fdk-space-above">Tilgjengelige format</h5>
                    <div class="fdk-label-distribution fdk-bg-green2"><i class="fa fa-cogs fdk-fa-left"></i><strong class="fdk-distribution-format">API</strong>application/rdf+xml</div>
                    <div class="fdk-label-distribution fdk-bg-green2"><i class="fa fa-cogs fdk-fa-left"></i><strong class="fdk-distribution-format">API</strong>text/json</div>

                    <h5 class="fdk-margin-top-double">TilgangsURL</h5>
                    <a>http://www.detteerenlenke.no/til-nedlasting<i class="fa fa-external-link fdk-fa-right"></i></a>

                    <div class="fdk-container-detail-text">
                        <h5 class="fdk-margin-top-double">Utgivelsesdato</h5>
                        <p class="fdk-ingress fdk-ingress-detail">Dette er innholdet i denne boksen.</p>
                    </div>
                </div>
                <div class="fdk-container-detail fdk-container-detail-offentlig">
                    <h4>Distribusjon</h4>
                    <h5 class="fdk-margin-top">Tilgjengelige format</h5>
                    <div class="fdk-label-distribution fdk-bg-green2"><i class="fa fa-download fdk-fa-left"></i><strong class="fdk-distribution-format">Nedlastbar fil</strong>application/rdf+xml</div>

                    <h5 class="fdk-margin-top-double">TilgangsURL</h5>
                    <a>http://www.detteerenlenke.no/til-nedlasting<i class="fa fa-external-link fdk-fa-right"></i></a>
                </div>

                <div class="row fdk-row fdk-margin-top-triple">
                    <div class="col-md-6 fdk-padding-no">
                        <div class="fdk-container-detail">
                            <div class="fdk-detail-icon">
                                <i class="fa fa-upload fdk-fa-detail"></i>
                            </div>
                            <div class="fdk-detail-text">
                                <h5>Utgivelsesdato</h5>
                                <p class="fdk-ingress fdk-margin-bottom-no">01.01.2015</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-6 fdk-padding-no">
                        <div class="fdk-container-detail">
                            <div class="fdk-detail-icon">
                                <i class="fa fa-upload fdk-fa-detail"></i>
                            </div>
                            <div class="fdk-detail-text">
                                <h5>Opphav</h5>
                                <p class="fdk-ingress fdk-margin-bottom-no">Tredjepart</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-4 fdk-padding-no">
                        <div class="fdk-container-detail">
                            <div class="fdk-detail-icon">
                                <i class="fa fa-upload fdk-fa-detail"></i>
                            </div>
                            <div class="fdk-detail-text">
                                <h5>Utgivelsesdato</h5>
                                <p class="fdk-ingress fdk-margin-bottom-no">01.01.2015</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-4 fdk-padding-no">
                        <div class="fdk-container-detail">
                            <div class="fdk-detail-icon">
                                <i class="fa fa-upload fdk-fa-detail"></i>
                            </div>
                            <div class="fdk-detail-text">
                                <h5>Opphav</h5>
                                <p class="fdk-ingress fdk-margin-bottom-no">Tredjepart</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-4 fdk-padding-no">
                        <div class="fdk-container-detail">
                            <div class="fdk-detail-icon">
                                <i class="fa fa-upload fdk-fa-detail"></i>
                            </div>
                            <div class="fdk-detail-text">
                                <h5>Opphav</h5>
                                <p class="fdk-ingress fdk-margin-bottom-no">Tredjepart</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="fdk-container-detail fdk-container-detail-header">
                    <i class="fa fa-star fdk-fa-left fdk-color-cta"></i>Kvalitet på innhold
                </div>
                <div class="fdk-container-detail">
                    <h5>Relevans</h5>
                    <p class="fdk-ingress fdk-margin-bottom-double">Denne teksten sier noe om relevansen. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras mattis consectetur purus sit amet fermentum. Cum sociis natoque penatibus et magnis dis parturient montes.</p>
                    <h5>Kompletthet</h5>
                    <p class="fdk-ingress fdk-margin-bottom-double">Denne teksten sier noe om komplettheten. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras mattis consectetur purus sit amet fermentum.</p>
                    <h5>Nøyaktighet</h5>
                    <p class="fdk-ingress fdk-margin-bottom-double fdk-margin-bottom-no">Denne teksten sier noe om nøyaktigheten. Cras mattis consectetur purus sit.</p>
                    <h5>Tilgjengelighet</h5>
                    <p class="fdk-ingress fdk-margin-bottom-no">Denne teksten sier noe om tilgjengeligheten. Vestibulum id ligula porta felis euismod semper. Duis mollis, est non commodo luctus, nisi erat porttitor ligula, eget lacinia odio sem nec elit. Cras mattis consectetur purus sit amet fermentum.</p>
                </div>

                <div class="fdk-container-detail fdk-container-detail-header">
                    <i class="fa fa-book fdk-fa-left fdk-color-cta"></i>Begrep
                </div>
                <div class="fdk-container-detail fdk-container-detail-begrep">
                    <p class="fdk-ingress fdk-margin-bottom-no"><strong>Jordsmonn:</strong> Dette er Kartverket sin korte og presise definisjon av begrepet jo… <i class="fa fa-chevron-down fdk-fa-right fdk-float-right"></i></p>
                </div>
                <div class="fdk-container-detail fdk-container-detail-begrep">
                    <p class="fdk-ingress fdk-margin-bottom-no"><strong>Jordsmonn:</strong> Dette er Kartverket sin korte og presise definisjon av begrepet jo… <i class="fa fa-chevron-down fdk-fa-right fdk-float-right"></i></p>
                </div>
                <div class="fdk-container-detail fdk-container-detail-begrep">
                    <p class="fdk-ingress fdk-margin-bottom-no"><strong>Jordsmonn:</strong> Dette er Kartverket sin korte og presise definisjon av begrepet jo… <i class="fa fa-chevron-down fdk-fa-right fdk-float-right"></i></p>
                </div>
            </div>
        </div>
    </div>

    )
  }
}
