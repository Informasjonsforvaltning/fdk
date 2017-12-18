import React from 'react';
import DocumentMeta from 'react-document-meta';

import localization from '../../components/localization';

const Article = () => {
  const meta = {
    title: 'Hvordan komme i gang med registrering av datasett'
  };
  return (
    <div className="container">
      <DocumentMeta {...meta} />
      <div className="row">
        <div className="col-md-8 col-md-offset-2">
          <h1 className="fdk-margin-bottom">
            {localization.registration.title}
          </h1>
          <div className="fdk-margin-bottom" />
          <div className="fdk-textregular">

            <h2 id="h.62ye86pzso3y">
              <span>Tilgang til registreringsl&oslash;sningen</span>
            </h2>
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
    </div>
  );
}

export default Article;
