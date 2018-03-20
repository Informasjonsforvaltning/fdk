import React from 'react';
import DocumentMeta from 'react-document-meta';

import localization from '../../components/localization';
import './index.scss';

const Article = () => {
  const meta = {
    title: 'Hvordan komme i gang med registrering av datasett'
  };
  return (
    <div className="container">
      <DocumentMeta {...meta} />
      <div className="fdk-container-path" />
      <div className="row">
        <div className="col-sm-12 col-md-10 col-md-offset-1">
          <h1 className="fdk-margin-bottom">
            {localization.registration.title}
          </h1>
          <div className="fdk-margin-bottom" />


            <div className="fdk-subtitle">
              <span>Jeg &oslash;nsker tilgang til registreringsl&oslash;sningen for min virksomhet</span>
            </div>

            <div className="fdk-box fdk-box--white">
              <p>
                Din leder må gi deg tilgang til tjenesten "Registrering i datakatalog" og tildele deg rollen Tilgangsstyring.<br />
                Kontakt datasettansvarlig i din virksomhet
              </p>
              <p>
                Når du har fått tilgang, vil din virksomhets datakatalog være tilgjengelig etter innlogging.<br />
                <a
                  title="Lenke til registreringsløsning"
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://registrering-fdk.ppe.brreg.no/"
                >
                  Logg inn i registreringsløsningen
                </a>
              </p>
            </div>

            <div className="fdk-subtitle">
              Hvordan gjøre en ansatt til datasettansvarlig
              <span className="label label-default ml-1">Anbefalt</span>
            </div>

            <div className="fdk-box fdk-box--yellow fdk-box--flex fdk-box--noMargin">

              <i className="fdk-box__icon fa fa-exclamation-circle fa-3x" />

              <div>
                Du må ha rollen <strong>Tilgangsstyring</strong> for din virksomhet for å tildele roller og rettigheter til andre.<br />
                Du trenger <strong>fødselsnummer</strong> (11 siffer) og <strong>etternavnet</strong> til den du ønsker å tildele rettigheter til.
              </div>
            </div>

            <div className="fdk-box fdk-box--white fdk-box--border">

              <p>
                En <strong>datasettansvarlig</strong> vil ha ansvaret for å gi ansatte tilgang til å registrere datasett på vegne av virksomheten. Det er anbefalt at dere har en person med dette ansvaret, da det forenkler fremtidige tilganger.
              </p>
              <p>
                <strong>Slik går du frem:</strong>
              </p>

              <div className="fdk-box__rowItem fdk-box--flex">
                <div className="fdk-box__rowItem__number">1</div>
                <div className="fdk-box__rowItem__text">
                  Logg inn i Altinn.no<br />
                  Velg <strong>"Profil, roller og rettigheter</strong>
                </div>
                <div className="fdk-box__rowItem--big">
                  <img alt="" src="/static/img/image11.png" title="" />
                </div>
              </div>

              <div className="fdk-box__rowItem fdk-box--flex">
                <div className="fdk-box__rowItem__number">2</div>
                <div className="fdk-box__rowItem__text">
                  I nedtrekksmenyen velger du <strong>virksomheten</strong> som du representrerer. Altså den virksomheten som forvalter datakatalogen du oppretter en datasettansvarlig for.
                </div>
                <div className="fdk-box__rowItem--big">
                  <img alt="" src="/static/img/image5.png" title="" />
                </div>
              </div>

              <div className="fdk-box__rowItem fdk-box--flex">
                <div className="fdk-box__rowItem__number">3</div>
                <div className="fdk-box__rowItem__text">
                  <p>
                  Under "Andre med rettigheter til virksomheten" kan du legge til en <strong>ny person.</strong>
                  </p>
                  <div className="fdk-box fdk-box--yellow fdk-box--italic">
                    Husk at du trenger fødselsnummer og etternavnet til den du ønsker å legge til.
                  </div>
                </div>
                <div className="fdk-box__rowItem--big">
                  <img alt="" src="/static/img/image3.png" title="" />
                </div>
              </div>

              <div className="fdk-box__rowItem fdk-box--flex">
                <div className="fdk-box__rowItem__number">4</div>
                <div className="fdk-box__rowItem__text">
                  <p>
                    Her tildeler du <strong>rolle</strong> til den ansatte. <br />
                    Søk etter roller <strong>Tilgangsstyring</strong>.
                  </p>
                  <p>
                    Tilgangsstyring gir datasettansvarlig muligheten til å gi andre ansatte tilgang til registreringsløsningen i fremtiden.
                  </p>
                </div>
                <div className="fdk-box__rowItem--big">
                  <img alt="" src="/static/img/image2.png" title="" />
                </div>
              </div>

              <div className="fdk-box__rowItem fdk-box--flex">
                <div className="fdk-box__rowItem__number">5</div>
                <div className="fdk-box__rowItem__text">
                  <p>
                    Tildel <strong>rettighetene</strong> den ansatte skal ha.
                  </p>
                  <p>
                    Søk etter <strong>"Registrering i datakatalog"</strong> og gi følgende rettigheter: <br />
                    - Lese
                    - Fylle ut
                    - Signere
                    - Les arkiv
                    <br />
                    Deretter trykker du "Ferdig".
                  </p>
                </div>
                <div className="fdk-box__rowItem--big">
                  <img alt="" src="/static/img/image13.png" title="" />
                </div>
              </div>

              <div className="text-center">
                <span>
                  Gratulerer! Nå har du opprettet en <strong>datasettansvarlig</strong> for din virksomhet.
                </span>
              </div>

            </div>

            <div className="fdk-subtitle">
              <span>Jeg &oslash;nsker å tildele rettigheter til enkeltpersoner manuelt</span>
            </div>

            <div className="fdk-box fdk-box--white">
              <p>
                Vi anbefaler at dere bruker en datasettansvarlig som administrerer registreringsrettigheter for virksomheten. Dette er forklart over.
              </p>
              <p>
                Dersom du allikevel ønsker å tildele rettigheter enkeltvis, følger du stegene som beskrevet over, <strong>unntatt steg 4</strong>, hvor du tildeler roller "Tilgangsstyring".
              </p>
            </div>

            <div className="fdk-subtitle">
              <span>Jeg vil importere datasett til registreringsløsningen fra egne kilder</span>
            </div>

            <div className="fdk-box fdk-box--white">
              <p>
                Registreringsløsningen har en importfunksjon, slik at datasettbeskrivelser registrert i andre løsningner kan hentes inn. Vi anbefaler deg å gå over datasettene og sørge for at all relevant informasjon er oppdatert.
              </p>
            </div>

        </div>
      </div>
      <div className="row">
        <div className="col-sm-12">

            <div className="fdk-box fdk-box--flex fdk-box__feedback">
              <div className="fdk-box fdk-box__feedback__left">
                <div>Dette er et samarbeidsprosjekt mellom Brønnøysundregistrene, Difi og øvrige SKATE-etater.</div>
                <div>
                  <a
                    href="https://www.brreg.no/personvernerklaering/"
                    target="_blank"
                  >
                    Informasjonskapsler og personvern
                  </a>
                </div>
              </div>

              <div className="fdk-box fdk-box--white fdk-box__feedback__right">
                <div className="fdk-subtitle">
                  <strong>Fortell oss hva du synes</strong>
                </div>
                <div className="fdk-box__rowItem fdk-box--mt1 fdk-box--flex">
                  <div className="fdk-box__rowItem__number">
                    <i className="fdk-box__icon fa fa-envelope fa-3x" />
                  </div>
                  <div className="fdk-box__rowItem--big">
                    <p>
                      Vi jobber hele tiden med løsningen og setter derfor stor pris på gode innspill fra publikum!
                    </p>
                    <p>
                      Send oss gjerne en e-post med ris, ros eller om morsomme bugs som har klart å gjemme seg fra testerne våre.
                    </p>
                  </div>
                </div>
              </div>
            </div>

        </div>
      </div>
      <div className="row">
        <div className="col-sm-12">

            <p><span>Den som skal registrere datasett m&aring; f&aring; tilgang til &aring; registrere datasett p&aring; vegne av sin virksomhet. Denne tilgangen tildeles i Altinn av virksomhetsleder eller annen person i virksomheten som innehar vi rollen tilgangsstyring. Det er to m&aring;ter det kan gj&oslash;res p&aring;:</span></p>
            <p><span>1) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Virksomhetsleder m&aring; gi en person tilgang til tjenesten &laquo;Registrering i datakatalog&raquo; og rollen tilgangsstyring. Da kan denne personen delegere rettighet til tjenesten videre til de som skal ha det.</span></p>
            <p><span>2) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Virksomhetsleder m&aring; gi alle som skal ha tilgang til tjenesten &laquo;Registrering i datakatalog&raquo; enkeltvis.</span></p>
            <p><span>Vi anbefaler alternativ 1, hvor en datasettansvarlig f&aring;r delegeringsmyndighet. Det vil forenkle framtidige tilganger.</span></p>

            <h2><span>Delegering av roller og rettigheter i Altinn</span></h2>
            <p>
              <span>Du m&aring; ha rollen</span> <span>Tilgangsstyring</span><span>&nbsp;for en virksomhet for &aring; f&aring; lov til &aring; gi videre roller og rettigheter.</span> <span>For &aring; delegere roller og rettigheter, m&aring; man logge inn i Altinn og velge &laquo;Profil, roller og rettigheter&raquo;. Her velger man hvem man skal representere og deretter g&aring; inn p&aring; &laquo;Andre med rettigheter til virksomheten. Herfra har man mulighet til &aring; delegere rettigheter til andre.</span>
            </p>
            <p>
              <span>Lenke til Altinns hjelpsider for roller og rettigheter:</span>
              <span><a href="https://www.altinn.no/no/Portalhjelp/Administrere-rettigheter-og-prosessteg/Gi-roller-og-rettigheter/>&nbsp;">https://www.altinn.no/no/Portalhjelp/Administrere-rettigheter-og-prosessteg/Gi-roller-og-rettigheter</a></span>
            </p>

            <h2 id="h.qmwbt4q0fcot"><span>Alternativ 1: Virksomhetsleder m&aring; gi en person tilgang til tjenesten &laquo;Registrering i datakatalog&raquo; og rollen tilgangsstyring.</span></h2>
            <p><span /></p>
            <ol start="1">
              <li><span>Logg inn. Velg &ldquo;Profil, roller og rettigheter&rdquo;.</span></li>
            </ol>
            <p><span><img alt="" src="/static/img/image11.png" title="" /></span></p>
            <p><span /></p>

            <ol start="2">
              <li><span>Velg virksomheten du representerer</span></li>
            </ol>
            <p><span>NB! Viktig at du velger virksomheten du representerer og ikke (per default) deg selv.</span></p>
            <p><span><img alt="" src="/static/img/image5.png" title="" /></span></p>
            <p><span /></p>
            <p><span /></p>
            <ol start="3">
              <li><span>Velg &ldquo;Andre med rettigheter til virksomheten&rdquo; og velg &ldquo;Legg til ny person&rdquo;</span></li>
            </ol>
            <p><span><img alt="" src="/static/img/image3.png" title="" /></span></p>
            <p><span /></p>
            <p><span /></p>
            <ol start="4">
              <li><span>Fyll ut f&oslash;dselsnummer og etternavn til personen som skal ha rolle</span><span>n</span></li>
            </ol>
            <p><span><img alt="" src="/static/img/image8.png" title="" /></span></p>
            <p><span /></p>
            <p><span /></p>
            <p><span /></p>
            <p><span /></p>
            <p><span /></p>
            <p><span /></p>
            <p><span /></p>
            <p><span /></p>
            <p><span /></p>
            <p><span /></p>

            <ol start="5">
              <li><span>Velg &ldquo;Har disse rollene&rdquo; og velg &ldquo;Legg til ny rolle&rdquo;</span></li>
            </ol>
            <p><span><img alt="" src="/static/img/image2.png" title="" /></span></p>
            <p><span /></p>
            <p><span /></p>
            <p><span /></p>
            <p><span /></p>
            <p><span /></p>
            <p><span /></p>
            <p><span /></p>
            <p><span /></p>
            <p><span /></p>
            <p><span /></p>
            <p><span /></p>
            <p><span /></p>
            <p><span /></p>
            <p><span /></p>
            <p><span /></p>
            <p><span /></p>
            <p><span /></p>

            <ol start="6">
              <li><span>Velg rollen &ldquo;Tilgangsstyring&rdquo; (plusstegnet skal bli borte)</span></li>
            </ol>
            <p><span><img alt="" src="/static/img/image1.png" title="" /></span></p>
            <p><span /></p>
            <p><span /></p>
            <ol start="7">
              <li><span>Scroll nederst i rolleoversikten og velg &ldquo;Ferdig&rdquo;.</span></li>
            </ol>
            <p><span><img alt="" src="/static/img/image12.png" title="" /></span></p>
            <p><span /></p>
            <ol start="8">
              <li><span>Velg &ldquo;Gi flere rettigheter&rdquo;</span></li>
            </ol>
            <p><span><img alt="" src="/static/img/image13.png" title="" /></span></p>
            <p><span /></p>
            <p><span /></p>
            <ol start="9">
              <li><span>S&oslash;k fram og velg tjenesten &ldquo;Registrering i datakatalog&rdquo; under &ldquo;Gi nye rettigheter&rdquo;</span></li>
            </ol>
            <p><span><img alt="" src="/static/img/image7.png" title="" /></span></p>
            <ol start="10">
              <li><span>Gi f&oslash;lgende rettigheter til tjenesten (Lese, Fylle ut, Signere, Les arkiv) og velg &ldquo;Gi rettigheter&rdquo;</span></li>
            </ol>
            <p><span><img alt="" src="/static/img/image10.png" title="" /></span></p>
            <p><span /></p>
            <ol start="11">
              <li><span>Velg &ldquo;Ferdig&rdquo;. N&aring; er rettighet til skjema (Registrering i datakatalog) gitt og person som har f&aring;tt tildelt rettigheten kan logge inn i Altinn for &aring; delegere rettigheten videre.</span></li>
            </ol>

            <p><span><img alt="" src="/static/img/image9.png" title="" /></span></p>
            <p><span /></p>
            <p><span /></p>
            <h2 id="h.hn2kvosu8ql1"><span /></h2>
            <p><span /></p>
            <p><span /></p>
            <p><span /></p>
            <h2 id="h.59xts8l8ajcy"><span>Alternativ 2: Virksomhetsleder m&aring; gi alle som skal ha tilgang til tjenesten &laquo;Registrering i datakatalog&raquo; enkeltvis.</span></h2>

            <p><span /></p>
            <ol start="1">
              <li><span>Logg inn. Velg &ldquo;Profil, roller og rettigheter&rdquo;. for</span></li>
            </ol>
            <p><span><img alt="" src="/static/img/image11.png" title="" /></span></p>
            <p><span /></p>
            <p><span /></p>
            <ol start="2">
              <li><span>Velg virksomheten du representerer</span></li>
            </ol>
            <p><span><img alt="" src="/static/img/image5.png" title="" /></span></p>
            <p><span /></p>
            <p><span /></p>
            <ol start="3">
              <li><span>Velg &ldquo;Andre med rettigheter til virksomheten&rdquo; og velg &ldquo;Legg til ny person&rdquo;</span></li>
            </ol>
            <p><span><img alt="" src="/static/img/image3.png" title="" /></span></p>
            <p><span /></p>
            <p><span /></p>
            <ol start="4">
              <li><span>Fyll ut f&oslash;dselsnummer og etternavn til personen som skal ha rollen</span></li>
            </ol>
            <p><span><img alt="" src="/static/img/image8.png" title="" /></span></p>
            <p><span /></p>
            <p><span /></p>
            <p><span /></p>
            <p><span /></p>
            <p><span /></p>
            <p><span /></p>
            <p><span /></p>
            <p><span /></p>
            <p><span /></p>
            <p><span /></p>

            <ol start="5">
              <li><span>S&oslash;k fram og velg tjenesten &ldquo;Registrering i datakatalog&rdquo; under &ldquo;Gi nye rettigheter&rdquo;</span></li>
            </ol>
            <p><span /></p>
            <p><span /></p>
            <p><span><img alt="" title="" /></span></p>
            <p><span /></p>
            <p><span /></p>
            <p><span /></p>
            <p><span /></p>
            <p><span /></p>
            <p><span /></p>
            <p><span /></p>
            <p><span /></p>
            <p><span /></p>
            <p><span /></p>
            <p><span /></p>
            <p><span /></p>
            <p><span /></p>
            <p><span /></p>
            <p><span /></p>
            <p><span /></p>
            <p><span /></p>
            <ol start="6">
              <li><span>Gi f&oslash;lgende rettigheter til tjenesten (Lese, Fylle ut, Signere, Les arkiv) og velg &ldquo;Gi rettigheter&rdquo;</span></li>
            </ol>
            <p><span><img alt="" src="/static/img/image4.png" title="" /></span></p>
            <p><span /></p>
            <p><span /></p>
            <ol start="7">
              <li><span>Velg &ldquo;Ferdig&rdquo;. N&aring; er rettighet til skjema (Registrering i datakatalog) gitt. Gjenta for neste person som skal ha tilgang.</span></li>
            </ol>
            <p><span><img alt="" src="/static/img/image4.png" title="" /></span></p>
            <p><span /></p>
            <p><span /></p>
            <p><span /></p>
            <h2 id="h.veoj1s8wzb8t"><span>Innlogging p&aring; registreringsl&oslash;sningen</span></h2>
            <p>
              <span>N&aring;r du har f&aring;tt tilgang, kan du logge inn p&aring; registreringsl&oslash;sningen:&nbsp;</span>
              <span>
                <a href="https://registrering-fdk.ppe.brreg.no/">https://registrering-fdk.ppe.brreg.no/</a>
              </span>
              <span>, og din virksomhets datakatalog vil v&aelig;re tilgjengelig (Om du logger inn i dag, kan det hende at du f&aring;r se flere virksomheter (private, frivillige&hellip;) enn forventet. Vi jobber med &aring; filtrere bort alt som ikke er offentlige virksomheter.)</span>
            </p>
            <p><span>&nbsp;</span></p>
            <h2 id="h.8h10tautkfoh"><span>Import av datasettbeskrivelser</span></h2>
            <p><span>Vi har laget en importfunksjon, slik at datasettbeskrivelsene som ligger i Felles datakatalog (eller andre steder) kan hentes inn. Dere slipper &aring; registrere p&aring; nytt, det dere har allerede gjort i google docs. Dette vil vi demonstrere p&aring; innf&oslash;ringsm&oslash;te om en uke.</span></p>
            <p><span /></p>
        </div>
      </div>
    </div>
  );
}

export default Article;
