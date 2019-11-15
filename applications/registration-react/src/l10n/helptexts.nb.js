export default {
  Dataset_title: {
    abstract:
      'Tittelen skal være kortfattet, kunne stå alene og gi mening. Forkortelser skal skrives helt ut.',
    description: `Lov- eller forskriftshjemlede navn bør inkluderes. Eksempel: «Jegerregisteret».  
* Dersom datasettet har avgrensninger i populasjon bør dette gjenspeiles i tittelen. Eksempel: «Folketellingen av 1910», «Naturområder i Oslo og nærliggende områder».  
* Bruk offisielle navn og benevnelser fremfor interne.  
* Eier/virksomhet skal ikke tas med.  
* Alternative titler kan registreres i eget felt under søkeord.`
  },
  Dataset_description: {
    abstract:
      'Beskrivelsen skal være kortfattet. Det bør fremgå hvilke opplysninger som utgjør kjernen i datasettet.',
    description: `Tittel skal ikke gjentas. Dersom tittelen kan gi inntrykk av at datasettet omfatter mer enn det faktisk gjør bør du oppgi begrensninger. Bruk offisielle navn og benevnelser. Formål beskrives ikke her, men i eget felt.`
  },
  Dataset_objective: {
    abstract: 'Oppsummer formålet i én setning.',
    description: `Hvis datasettet inneholder personopplysninger må formålet med dette oppgis.`
  },
  Dataset_spatial: {
    abstract:
      'Dersom datasettet kun har innhold fra visse geografiske områder angis dette med lenke til Administrative enheter fra Kartverket eller GeoNames.',
    description: `Eksempler: Land, fylker, kommuner, byer, bydeler eller stedsnavn som innholdet i datasettet er begrenset til. `
  },
  Dataset_temporal: {
    abstract:
      'Tidsrommet datasettet dekker dersom det kun har innhold fra visse perioder. ',
    description: `Tidspunkt kan angis som dato eller årstall. Fradato oppgitt som årstall tolkes som fra og med 1. januar. Tildato oppgitt som årstall tolkes som til og med 31. desember.

Det kan angis flere tidsperioder per datasett.

Dersom datasettet er ett av flere i en tidsserie anbefales det at det lages et overordnet datasett for tidsserien som dette datasettet kan relateres til. `
  },
  Dataset_identifier: {
    abstract: 'Identifikatoren skal automatisk genereres',
    description: `For å kunne referere til et datasett entydig og kunne angi relasjoner mellom datasett, må alle datasett ha stabile, globale og unike identifikatorer. Identifikator er et obligatorisk felt.
* Identifikatoren bør automatisk genereres når du registrerer datasettet om du benytter en registreringsløsning.
* Identifikatoren skal være unik innenfor aktuell datakatalog
* Identifikatoren skal inngå i en globalt unik identifikator.
* Den globalt unike identifikatoren skal utformes som en URI
* Den globalt unike identifikatoren er representert ved feltet dct:identifier
Datasettets URI bør benytte en av de globalt unike identifikatorene i dct:identifier
* Man bør kunne registrere ytterligere identifikatorer.`
  },
  Dataset_theme: {
    abstract: 'Velg tema som beskriver innholdet i datasettet. ',
    description: `Listen kommer fra EU publication office og tematisering blir blant annet benyttet for innrapportering til EU.`
  },
  Dataset_content: {
    abstract: `Søk etter begrep fra Felles begrepskatalog og velg fra nedtrekksliste. 
Her legger du inn de begrepene som brukes i datasettet. Begrepene brukes til å si noe om hva informasjonen i datasettet betyr. `,
    description: `Ved å henvise til gjennomarbeidede definisjoner som virksomheten selv er ansvarlig for å vedlikeholde, sikrer vi at det er tydelig hvordan et begrep brukt i datasettet skal forstås og at denne forståelsen til en hver tid er riktig og oppdatert. `
  },
  Dataset_keyword: {
    abstract:
      'Sentralt innhold i datasettet som ennå ikke har begrepsdefinisjoner.',
    description: `I noen tilfeller mangler noen av begrepsdefinisjonene som er sentrale for å beskrive datasettet, eller man har et ord som ikke formelt forbindes med datasettet, men som man vet at mange likevel bruker. Da kan dette feltet brukes til å sørge for at disse søkeordene likevel gir treff i søkemotoren, som f. eks. ord og uttrykk som beskriver sentralt innhold i datasettet.
`
  },
  Dataset_language: {
    abstract: 'Hovedspråket innholdet i datasettet er skrevet på.',
    description: `Angis ikke dersom:
* Datasettet er uten språklige tekster
* Dersom det ikke er tydelig hva som er hovedspråket, for eksempel hvis datasettet har flere språk`
  },
  Dataset_issued: {
    abstract: 'Når innholdet i datasettet ble/blir tilgjengeliggjort.',
    description: ''
  },
  Dataset_modified: {
    abstract: 'Dato for når innholdet i datasettet sist er endret.',
    description: ''
  },
  Dataset_publisher: {
    abstract: 'Skal peke på en Enhet i Enhetsregisteret.',
    description: `Identifisering av den enheten som er ansvarlig for at datasettet er tilgjengelig, ikke den som faktisk gjør datasettet tilgjengelig. Eier er et obligatorisk felt.
* Skal peke på en Enhet (juridisk person, organisasjonsledd, underenhet)
* Det offisielle navnet på virksomheten vil hentes fra Enhetsregisteret, men kortform (f.eks. Difi) kan legges inn av brukeren
* Eieren av datasettet forvalter sammensetning av dataene, altså datasettet, og ikke nødvendigvis selve dataene.
`
  },
  Dataset_creator: {
    abstract:
      'Brukes unntaksvis der det er datasett som er satt sammen av data som andre er ansvarlige for',
    description: `Egenskapen angir produsent(er) av datasettet der dette er en annen enn dataeier
* Bruke unntaksvis der det er datasett som er satt sammen av data som andre er ansvarlige for
* Skaper vil ikke angis med organisasjonsnummer siden det typisk vil være en sammensatt gruppe.`
  },
  Dataset_contactPoint: {
    abstract:
      'Angi kontaktinformasjonen som kan brukes ved henvendelser om et datasett.',
    description: `Egenskapen kontaktpunkt angis for å komme i dialog med eieren av datasettet.
* Angi kontaktinformasjonen som kan brukes ved henvendelser om et datasett.
* Angi navn og kontaktinfo på avdeling, seksjon, kontor e.l.
* Hvis det finnes et web-basert kontaktskjema bør dette benyttes
* Kontaktinformasjon på person frarådes.
* Vcard https://www.w3.org/TR/vcard-rdf benyttes for å beskrive kontaktpunktet (se Kontaktpunkt)`
  },
  Dataset_documentation: {
    abstract:
      'Referanse til en side som beskriver utdypende dokumentasjon om datasettet.',
    description: `Utdypende dokumentasjon av datasettet angis ved å peke på en side der den finnes. Det anbefales at Landingsside brukes i stedet for dokumentasjon.`
  },
  Dataset_landingpage: {
    abstract:
      'Lenken kan referere til registerets hjemmeside, eller en samleside som beskriver innhold, struktur, tilgang, nedlasting, bruk og/eller søk. ',
    description: ''
  },
  Dataset_accessRights: {
    abstract:
      'Skal gjenspeile det mest begrensede feltet/opplysningen i datasettet.',
    description: `“Offentlig” betyr at datasettet ikke inneholder begrensede opplysninger og kan legges ut som åpne data, selv om det ikke er laget en løsning for tilgang. Se Difis veileder for åpne data.

“Begrenset offentlighet” betyr at tilgangen til opplysningene avhenger av hvilket formål opplysningene er innsamlet til, og hvilken lovhjemmel den som skal bruke dataene har. Begrensningen kan skyldes innhold som personopplysninger. Når noen ønsker å benytte datasettet må man foreta en konkret vurdering av tilgangen.

“Unntatt offentlighet” betyr at saksbehandler, med referanse til lov eller forskrift, har valgt at datasettet kan unndras fra offentlighet. Typiske eksempler er interne dokumenter, styringsdialog, ansettelser, gradert informasjon, forretningshemmeligheter eller data som andre eier.
`
  },
  Dataset_legalBasisForRestriction: {
    abstract:
      'Angi referanse til relevant lov eller forskrift. Helst til lovdata på paragrafnivå.',
    description: `Dersom datasettet har begrensninger på deling trenger vi å vite hva skjermingen gjelder. Det kan være hjemmel (kilde for påstand) i offentlighetsloven, sikkerhetsloven, beskyttelsesinstruksen eller annet lovverk som ligger til grunn for vurdering av tilgangsnivå.`
  },
  Dataset_legalBasisForProcessing: {
    abstract:
      'Angi referanse til relevant lov eller forskrift, samtykke eller nødvendighetsvurdering.',
    description: `Dersom et datasett inneholder personopplysninger skal det være et grunnlag for behandlingen.`
  },
  Dataset_legalBasisForAccess: {
    abstract:
      'Angi referanse til relevant lov eller forskrift. Helst til lovdata på paragrafnivå.',
    description: `Henvisning til regelverk som begrunner en offentlig virksomhet sin rett eller plikt til å utlevere opplysninger til andre private personer eller juridiske personer. Informasjon om utleveringshjemmel gjør det enklere for brukere av datasettet å se om det er nødvendig med egen hjemmel for innhenting.`
  },
  Dataset_provenance: {
    abstract: 'Hvor opplysningene er hentet fra.',
    description: `Vedtak betyr at innholdet i datasettet er vedtatt av en offentlig myndighet og anses som autoritative kilder.

Brukerinnsamlede data betyr data innhentet fra brukerne.

Innsamlet fra tredjepart betyr data innhentet fra f. eks. banker og forsikringsselskaper.`
  },
  Dataset_conformsTo: {
    abstract:
      'Oppgi om datasettet er i henhold til gitt(e) standard(er), spesifikasjon(er) eller implementasjonsregler.',
    description: ''
  },
  Dataset_informationModel: {
    abstract: 'Oppgi referanse til datasettets informasjonsmodell.',
    description: ''
  },
  Dataset_accruralPeriodicity: {
    abstract: 'Hvor ofte datasettet har nytt innhold.',
    description: `For eksempel:
* Enhetsregisteret oppdateres med nye enheter og sletting av enheter kontinuerlig
* Inntektsdata fra likningen (Skattemelding) er årlig
* Folketelling fra 1910 oppdateres aldri`
  },
  Dataset_hasQualityAnnotation_accuracy: {
    abstract:
      'Dersom datasettets innhold ikke er i samsvar med formålet, bør det oppgis her.',
    description: `Eksempel: Formålet med Kontakt- og reservasjonsregisteret er å kunne benytte det til varsling. Kan benyttes i forbindelse med saksbehandling og utføring av forvaltningsoppgaver for øvrig.
Eksempel på utfylling: "Brukere har selv oppgitt informasjon, sjekkes med SMS."
`
  },
  Dataset_hasQualityAnnotation_completeness: {
    abstract:
      'Dersom datasettet ikke innholder alle objekter som nevnt i formålet, bør det oppgis her.',
    description: `Eksempel: Formålet med Enhetsregisteret er effektiv utnyttelse og samordning av offentlige opplysninger om juridiske personer, enkeltpersonforetak og andre registreringsenheter. Eksempel på utfylling: "Enhetsregisteret inneholder ikke slettede selskaper før 1994." `
  },
  Dataset_hasQualityAnnotation_currentness: {
    abstract: 'Avvik eller tilleggsopplysninger om oppdateringsfrekvens ',
    description: `F. eks. dersom noen av opplysningene har annen oppdateringsfrekvens enn hovedinnholdet.`
  },
  Dataset_hasQualityAnnotation_availability: {
    abstract:
      'Dersom datasettets tilgangsnivå har avvik eller tilleggsopplysninger, bør det oppgis her.',
    description: ` Eksempel: “Regnskapsregisteret kan kun hentes ut på forespørsel.” `
  },
  Dataset_hasQualityAnnotation_relevance: {
    abstract:
      'Dersom det er bruksområder datasettet er spesielt egnet for eller ikke egnet for, bør det oppgis her.',
    description: ''
  },
  Dataset_distribution: {
    abstract:
      'For å angi hvor man kan få tilgang til datasettet skal det angis ulike distribusjoner.',
    description: `For å angi hvor man kan få tilgang til datasettet skal det angis ulike distribusjoner.
* Det angis i utgangspunktet en distribusjon per fil, feed eller API.
* Dersom det er ett API som leverer flere filformater angis det som en distribusjon.`
  },
  Dataset_example: {
    abstract: `Benyttes for å gi eksempeldata for et datasett, og hvordan en faktisk distribusjon ser ut.
`,
    description: `Benyttes for å gi eksempeldata for et datasett, og hvordan en faktisk distribusjon ser ut.
* Dersom datasettet inneholder personopplysninger vil det være nyttig for bruker å se en eksempedata som viser en anonymisert rad i datasettet.`
  },
  Dataset_type: {
    abstract: 'Refererer til EU publication office sine datasett-typer.',
    description: `Velg "Data" dersom datasettbeskrivelsen omhandler fysisk representasjon eller sammenstilling av opplysninger

Velg "Testdata" dersom datasettbeskrivelsen omhandler anonymiserte eller pseudonymiserte data for testformål

Velg "Kodelister" dersom datasettbeskrivelsen omhandler tabeller hvor koder beskrives ved hjelp av relevant informasjon

Velg "Taksonomi" dersom datasettbeskrivelsen omhandler en hierarkisk strukturering av begreper

Velg "Tesauri" dersom datasettbeskrivelsen omhandler en hierarkisk og  assosiativ strukturering av begreper`
  },
  Dataset_source: {
    abstract:
      'Peker til ressurs (datasett eller annet) som helt eller delvis er en kilde for det aktuelle datasettet.',
    description: `Peker til en ressurs som er kilde til datasettet
* Peker til ressurs (datasett eller annet) som helt eller delvis er en kilde for det aktuelle datasettet. F.eks. kan et datasett er opprettet basert på data som er hentet fra en nettside, uten at den er definert som et datasett.
* Dersom et åpent datasett er basert på et annet hvor personopplysninger er fjernet, kan relasjonen brukes.
* Et datasett som er avledet fra et annet skal ha en referanse til kilde for det aktuelle datasettet.
* Dersom det er et utvalg fra et annet datasett bør heller relasjonen del av brukes`
  },
  Dataeset_testdata: {
    abstract:
      'For å angi at et register eller datasett foreligger som testdata, typisk syntetiske eller anonymiserte, angis dette med relasjonen testdatasett til et annet datasett. ',
    description: `For å angi at et register eller datasett foreligger som testdata, typisk syntetiske eller anonymiserte, angis dette med relasjonen testdatasett til et annet datasett. 
* Peker til datasett som er består av testdata til det aktuelle datasettet`
  },
  Dataset_requires: {
    abstract:
      'Peker til en ressurs som må være tilstede for at datasettet skal kunne produseres.',
    description: `Peker til en ressurs som må være tilstede for at datasettet skal kunne produseres.
* Peker til ressurs (datasett eller annet) som aktuelt datasett er avhengig av`
  },
  Dataset_partOf: {
    abstract: 'Der registre oppdeles i mindre datasett skal relasjonen brukes.',
    description: `Peker til et datasett som det aktuelle datasettet er en delmengde av av, eller at det er brutt opp i mindre datasett. 
* Der registre oppdeles i mindre datasett skal relasjonen brukes. F.eks. er datasettet Underenheter er del av datasettet Enhetsregisteret.`
  },
  Dataset_versionOf: {
    abstract:
      'Referanse til et datasett som i prinsippet er det samme, men hvor innholdet er blitt oppdatert på bakgrunn av bedret datakvalitet e.l. ',
    description: `Peker til et datasett som det aktuelle datasettet er en versjon av.
* I prinsippet det samme datasettet, men hvor innholdet er blitt oppdatert på bakgrunn av bedret datakvalitet e.l.
* Peker til en versjon av det aktuelle datasettet kan avledes (har versjon).
* Det kan legges til en versjonskommentar til feltet`
  },
  Dataset_replacedBy: {
    abstract: 'Peker til et datasett som erstatter et aktuelt datasettet.',
    description: `Peker til et datasett som erstatter et aktuelt datasettet.
* F.eks. kan et kodeverk erstattet av en nyere utgave.`
  },
  Dataset_relation: {
    abstract: 'Oppgi relaterte datasett.',
    description: `lenke til veileder: <a href='https://doc.difi.no/data/veileder-for-beskrivelse-av-datasett/#_kilde_datasett_avledet_fra'>https://doc.difi.no/data/veileder-for-beskrivelse-av-datasett/#_kilde_datasett_avledet_fra</a>`
  },
  Agent_name: {
    abstract: 'Navnet på enheten benyttes i visninger',
    description: `Navnet på enheten benyttes i visninger`
  },
  Agent_identifier: {
    abstract: 'Enheter skal oppgis med organisasjonsnummer.',
    description: `Enheter skal oppgis med organisasjonsnummer.`
  },
  Agent_type: {
    abstract:
      'Enheter angis med organisasjonstype for å skille mellom offentlige og private datasetteiere.',
    description: `Enheter angis med organisasjonstype for å skille mellom offentlige og private datasetteiere.`
  },
  'ContactPoint_organizational-unit': {
    abstract:
      'Kontaktpunkt kan være navnet til en gruppe, avdeling, seksjon eller lignende i organisasjonen. Skal ikke være enkeltpersoner.',
    description: ''
  },
  ContactPoint_hasEmail: { abstract: ' ', description: '' },
  ContactPoint_hasTelephone: { abstract: ' ', description: '' },
  ContactPoint_hasURL: { abstract: ' ', description: '' },
  Traffic_Limits: {
    abstract: 'Begrensninger på antall kall til API e.l. per bruker.',
    description: ''
  },
  Performance: {
    abstract:
      'Oppgi responstiden til API-et. Typisk angitt i ms. Er det begrensinger på antall samtidige brukere?',
    description: ''
  },
  Availability: { abstract: 'Oppgi oppetiden til API-et.', description: '' },
  Cost: {
    abstract:
      'Kostnader forbundet med å bruke API-et. Transaksjonskostnader, abonnement e.l.',
    description: ''
  },
  Distribution_description: {
    abstract:
      'Ved flere enn én distribusjon bør forskjellene i innholdet beskrives.',
    description: ''
  },
  Distribution_type: {
    abstract: 'Velg distribusjonstype.',
    description: ` Velg Nedlastbar fil dersom distribusjonen kan lastes ned i maskinlesbart format. Velg API dersom distribusjonen hentes gjennom et programmeringsgrensesnitt.
Velg Feed dersom det er en distribusjon hvor endringer hentes gjennom f.eks. RSS, Atom eller andre meldingsformidlinger.`
  },
  Distribution_format: {
    abstract:
      'Velg format(er) fra IANAs liste over offisielle medietyper. Dersom formatet ikke finnes i listen kan du angi eget.',
    description: `Skriv inn format og avlsutt med TAB eller Enter. Vi anbefaler at du bruker de samme formatbeskrivelsene som du finner i lenken nedenfor. (Obs: Du må selv kopiere over formatet fra listen.) 
Lenke til IANAs liste over offisielle medietyper: <a href='http://www.iana.org/assignments/media-types/media-types.xhtml'>http://www.iana.org/assignments/media-types/media-types.xhtml</a>`
  },
  Distribution_accessURL: {
    abstract:
      'Lenke til selve distribusjonen eller til mer informasjon om hvordan man får tilgang.',
    description: ''
  },
  Distribution_downloadURL: {
    abstract: 'Direktelenke til en nedlastbar fil i et gitt format',
    description: `Direktelenke til en nedlastbar fil i et gitt format
* kan benyttes dersom alle data tilgjengelig via en tjeneste også er tilgjengelig for nedlasting som en fil.`
  },
  Distribution_landingpage: {
    abstract:
      'Refererer til en nettside som gir tilgang til datasettet, distribusjoner og annen informasjon. ',
    description: `Egenskap ved datasett som refererer til en nettside som gir tilgang til datasettet, distribusjoner og annen informasjon. Skal peke til en side hos den originale tilbyderen av data.
* kan benyttes for å peke til en samleside om et datasett og dets distribusjoner.
* bør peke til en side hos den originale tilbyderen av data.`
  },
  Distribution_conformsTo: { abstract: ' ', description: '' },
  Distribution_documentation: {
    abstract:
      'Lenke til informasjon som beskriver distribusjonens innhold og struktur.',
    description: ''
  },
  Distribution_issued: {
    abstract:
      'Dato/tid når distribusjonen (f.eks. api) først ble publisert i tilknytning til et datasett.',
    description: `Dato/tid når distribusjonen (f.eks. api) først ble publisert i tilknytning til et datasett. Når innholdet i datasettene ble gjort tilgjengelige. `
  },
  Distribution_modified: {
    abstract:
      'Dersom distribusjonen har åpne, offentlige data skal lisens oppgis.',
    description: ''
  },
  Distribution_api: {
    abstract: 'Søk etter og velg API-beskrivelse fra API-katalogen.',
    description: `Dersom det finnes API-distribusjoner, anbefaler vi at de først beskrives i API-katalogen og deretter knyttes til datasettbeskrivelsen.`
  },
  Catalog_title: {
    abstract:
      'Kortfattet om katalogen. Angi, uten å liste, hvilke datasett den omfatter.',
    description: `Kortfattet om katalogen
* Angi, uten å liste, hvilke datasett den omfatter,
* f.eks. datasettene til Brønnøysundregistrene.`
  },
  Catalog_description: {
    abstract:
      'En kort og presis beskrivelse av datasettet skal gjøre det lett for andre å se hva det inneholder. Beskrivelse er et obligatorisk felt.',
    description: `En kort og presis beskrivelse av datasettet skal gjøre det lett for andre å se hva det inneholder. Beskrivelse er et obligatorisk felt.`
  },
  Catalog_dataset: {
    abstract:
      'Beskriver datasettene i katalogen. Minst ett datasett er påkrevd.',
    description: `Beskriver datasettene i katalogen. Minst ett datasett er påkrevd.
* Lenke til alle datasettene`
  },
  Catalog_publisher: {
    abstract: 'Identifisering av den enheten som er ansvarlig for katalogen.',
    description: `Identifisering av den enheten som er ansvarlig for katalogen. Eier er et obligatorisk felt.
* Skal peke på en Enhet (juridisk person, organisasjonsledd, underenhet)
* Det offisielle navnet på virksomheten vil hentes fra Enhetsregisteret, men kortform (f.eks. Difi) kan legges inn av brukeren`
  },
  Catalog_issued: {
    abstract: 'Dato/tid katalogen først ble publisert.',
    description: `Dato/tid katalogen først ble publisert.`
  },
  Catalog_modified: {
    abstract:
      'Dato/tid sist katalogen ble endret,. Dette kan være endring av en datasettbeskrivelse, eller andre metadata i katalogen.',
    description: `Dato/tid sist katalogen ble endret,. Dette kan være endring av en datasettbeskrivelse, eller andre metadata i katalogen.`
  },
  Related_dataset: {
    abstract:
      'Legg til en eller flere datasettbeskrivelse(r) som er tilknyttet API-et.',
    description: ''
  },
  themesLos: {
    abstract: 'Velg tema(er) som beskriver innholdet i datasettet.',
    description:
      "Listen kommer fra Los. Los er en felles terminologi for å beskrive offentlige tjenester og ressurser. Formålet med Los er å gjøre det enklere å finne offentlige ressurser. Les mer <a href='https://www.difi.no/fagomrader-og-tjenester/digitalisering-og-samordning/nasjonal-arkitektur/arkitekturbegreper/los'>her</a>"
  }
};
