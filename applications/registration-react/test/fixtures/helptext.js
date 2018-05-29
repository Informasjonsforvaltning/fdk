export default {
  isFetchingHelptext: false,
  helptextItems: {
    Agent_identifier: {
      id: 'Agent_identifier',
      shortdesc: {
        nb: 'Enheter skal oppgis med organisasjonsnummer. '
      },
      description: {
        nb: 'Enheter skal oppgis med organisasjonsnummer. '
      },
      uri: 'http://brreg.no/fdk/fields#Agent_identifier'
    },
    Agent_name: {
      id: 'Agent_name',
      shortdesc: {
        nb: 'Navnet på enheten benyttes i visninger'
      },
      description: {
        nb: 'Navnet på enheten benyttes i visninger'
      },
      uri: 'http://brreg.no/fdk/fields#Agent_name'
    },
    Agent_type: {
      id: 'Agent_type',
      shortdesc: {
        nb:
          'Enheter angis med organisasjonstype for å skille mellom offentlige og private datasetteiere.'
      },
      description: {
        nb:
          'Enheter angis med organisasjonstype for å skille mellom offentlige og private datasetteiere.'
      },
      uri: 'http://brreg.no/fdk/fields#Agent_type'
    },
    Catalog_dataset: {
      id: 'Catalog_dataset',
      shortdesc: {
        nb: 'Beskriver datasettene i katalogen. Minst ett datasett er påkrevd.'
      },
      description: {
        nb:
          'Beskriver datasettene i katalogen. Minst ett datasett er påkrevd.\n* Lenke til alle datasettene'
      },
      uri: 'http://brreg.no/fdk/fields#Catalog_dataset'
    },
    Catalog_description: {
      id: 'Catalog_description',
      shortdesc: {
        nb:
          'En kort og presis beskrivelse av datasettet skal gjøre det lett for andre å se hva det inneholder. Beskrivelse er et obligatorisk felt.'
      },
      description: {
        nb:
          'En kort og presis beskrivelse av datasettet skal gjøre det lett for andre å se hva det inneholder. Beskrivelse er et obligatorisk felt.'
      },
      uri: 'http://brreg.no/fdk/fields#Catalog_description'
    },
    Catalog_issued: {
      id: 'Catalog_issued',
      shortdesc: {
        nb: 'Dato/tid katalogen først ble publisert.'
      },
      description: {
        nb: 'Dato/tid katalogen først ble publisert.'
      },
      uri: 'http://brreg.no/fdk/fields#Catalog_issued'
    },
    Catalog_modified: {
      id: 'Catalog_modified',
      shortdesc: {
        nb:
          'Dato/tid sist katalogen ble endret,. Dette kan være endring av en datasettbeskrivelse, eller andre metadata i katalogen.'
      },
      description: {
        nb:
          'Dato/tid sist katalogen ble endret,. Dette kan være endring av en datasettbeskrivelse, eller andre metadata i katalogen.'
      },
      uri: 'http://brreg.no/fdk/fields#Catalog_modified'
    },
    Catalog_publisher: {
      id: 'Catalog_publisher',
      shortdesc: {
        nb: 'Identifisering av den enheten som er ansvarlig for katalogen.'
      },
      description: {
        nb:
          'Identifisering av den enheten som er ansvarlig for katalogen. Eier er et obligatorisk felt.\n* Skal peke på en Enhet (juridisk person, organisasjonsledd, underenhet)\n* Det offisielle navnet på virksomheten vil hentes fra Enhetsregisteret, men kortform (f.eks. Difi) kan legges inn av brukeren'
      },
      uri: 'http://brreg.no/fdk/fields#Catalog_publisher'
    },
    Catalog_title: {
      id: 'Catalog_title',
      shortdesc: {
        nb:
          'Kortfattet om katalogen. Angi, uten å liste, hvilke datasett den omfatter.'
      },
      description: {
        nb:
          'Kortfattet om katalogen\n* Angi, uten å liste, hvilke datasett den omfatter, \n* f.eks. datasettene til Brønnøysundregistrene.'
      },
      uri: 'http://brreg.no/fdk/fields#Catalog_title'
    },
    ContactPoint_hasEmail: {
      id: 'ContactPoint_hasEmail',
      shortdesc: {
        nb:
          'Angi e-postadresse for kontaktpunktet dersom dette er en ønsket kontaktform'
      },
      description: {
        nb:
          'Angi e-postadresse for kontaktpunktet dersom dette er en ønsket kontaktform'
      },
      uri: 'http://brreg.no/fdk/fields#ContactPoint_hasEmail'
    },
    ContactPoint_hasTelephone: {
      id: 'ContactPoint_hasTelephone',
      shortdesc: {
        nb:
          'Angi telefonnummer for kontaktpunktet dersom dette er en ønsket kontaktform'
      },
      description: {
        nb:
          'Angi telefonnummer for kontaktpunktet dersom dette er en ønsket kontaktform'
      },
      uri: 'http://brreg.no/fdk/fields#ContactPoint_hasTelephone'
    },
    ContactPoint_hasURL: {
      id: 'ContactPoint_hasURL',
      shortdesc: {
        nb:
          'Angi referanse til kontaktskjema på web dersom dette er en ønsket kontaktform'
      },
      description: {
        nb:
          'Angi referanse til kontaktskjema på web dersom dette er en ønsket kontaktform'
      },
      uri: 'http://brreg.no/fdk/fields#ContactPoint_hasURL'
    },
    'ContactPoint_organizational-unit': {
      id: 'ContactPoint_organizational-unit',
      shortdesc: {
        nb:
          'Kontaktpunkt angis med organisasjonsenhet\nDette kan være navnet til en gruppe, avdeling, seksjon eller liknende i organisasjonen.'
      },
      description: {
        nb:
          'Kontaktpunkt angis med organisasjonsenhet\nDette kan være navnet til en gruppe, avdeling, seksjon eller liknende i organisasjonen. '
      },
      uri: 'http://brreg.no/fdk/fields#ContactPoint_organizational-unit'
    },
    Dataeset_testdata: {
      id: 'Dataeset_testdata',
      shortdesc: {
        nb:
          'For å angi at et register eller datasett foreligger som testdata, typisk syntetiske eller anonymiserte, angis dette med relasjonen testdatasett til et annet datasett. '
      },
      description: {
        nb:
          'For å angi at et register eller datasett foreligger som testdata, typisk syntetiske eller anonymiserte, angis dette med relasjonen testdatasett til et annet datasett. \n* Peker til datasett som er består av testdata til det aktuelle datasettet'
      },
      uri: 'http://brreg.no/fdk/fields#Dataeset_testdata'
    },
    Dataset_accessRights: {
      id: 'Dataset_accessRights',
      shortdesc: {
        nb:
          'Angi om datasettet offentlig åpne data, eller er helt eller delvis skjermet for innsyn'
      },
      description: {
        nb:
          'Det er behov for å angi i hvilken grad datasettet kan bli gjort tilgjengelig for allmennheten, uten hensyn til om det er publisert eller ikke\n* Angi om datasettet er helt eller delvis skjermet for innsyn. Offentlig, begrenset offentlighet og unntatt offentlighet. \n* Skal gjenspeile det mest begrensede feltet/opplysningen i datasettet\n“Offentlig” betyr at datasettet ikke inneholder begrensede opplysninger og kan legges ut som åpne data, selv om det ikke er laget en løsning for tilgang. Se Difis veileder for åpne data. \n* “Begrenset offentlighet” betyr at tilgangen til opplysningene avhenger av hvilket formål opplysningene er innsamlet til, og hvilket lovhjemmel den som skal bruke dataene har. Begrensningen kan skyldes innhold som personopplysninger. Når noen ønsker å benytte datasettet må man foreta en konkret vurdering av tilgangen. \n* “Unntatt offentlighet” betyr saksbehandler har med referanse til lov eller forskrift valgt at  datasett (dokumenter eller saksopplysninger) kan unndras fra offentlighet. Typiske eksempler er interne dokumenter, styringsdialog, ansettelser, gradert informasjon, forretningshemmeligheter eller data som andre eier. \n* Varianter av datasettet kan være offentlig ved at det utelater de felt som gjør at det opprinnelige datasettet er begrenset teller unntatt offentlighet. (se relasjoner mellom datasett)\n* Ved bruk av verdiene "begrenset offentlighet" og "unntatt offentlighet" er egenskapen skjermingshjemmel anbefalt\n'
      },
      uri: 'http://brreg.no/fdk/fields#Dataset_accessRights'
    },
    Dataset_accruralPeriodicity: {
      id: 'Dataset_accruralPeriodicity',
      shortdesc: {
        nb: 'Beskriv hvor ofte datasettet har nytt innhold.'
      },
      description: {
        nb:
          'En angivelse hvor ofte datasettet blir oppdatert. \n* Beskriv hvor ofte datasettet har nytt innhold. For eksempel oppdateres Enhetsregisteret med nye enheter og sletting av enheter kontinuerlig, mens Inntektsdata fra likningen (Skattemelding) er årlig og Folketelling fra 1910 oppdateres aldri.'
      },
      uri: 'http://brreg.no/fdk/fields#Dataset_accruralPeriodicity'
    },
    Dataset_conformsTo: {
      id: 'Dataset_conformsTo',
      shortdesc: {
        nb:
          'Angi at et datasett er i samsvar med en standard, spesifikasjon eller implementasjonsregel.'
      },
      description: {
        nb:
          'Det er behov for å vite om et datasett er i henhold til gitt(e) standard(er).\n* Benyttes til å angi at et datasett er i samsvar med en standard, spesifikasjon eller implementasjonsregel. Eksempel: Et datasett er i samsvar med SOSI 4.5 som  innholdsstandard. \n* For referanser til maskinlesbare informasjonsmodeller, skal egenskapen “innholdsspesifikasjon benyttes”'
      },
      uri: 'http://brreg.no/fdk/fields#Dataset_conformsTo'
    },
    Dataset_contactPoint: {
      id: 'Dataset_contactPoint',
      shortdesc: {
        nb:
          'Angi kontaktinformasjonen som kan brukes ved henvendelser om et datasett.'
      },
      description: {
        nb:
          'Egenskapen kontaktpunkt angis for å komme i dialog med eieren av datasettet.\n* Angi kontaktinformasjonen som kan brukes ved henvendelser om et datasett.\n* Angi navn og kontaktinfo på avdeling, seksjon, kontor e.l.\n* Hvis det finnes et web-basert kontaktskjema bør dette benyttes\n* Kontaktinformasjon på person frarådes.\n* Vcard https://www.w3.org/TR/vcard-rdf benyttes for å beskrive kontaktpunktet (se Kontaktpunkt)'
      },
      uri: 'http://brreg.no/fdk/fields#Dataset_contactPoint'
    },
    Dataset_content: {
      id: 'Dataset_content',
      shortdesc: {
        nb:
          'innholdstyper i datasettet beskrives med referanse til begreper i begrepskatalog'
      },
      description: {
        nb:
          'For å beskrive viktigste typer innhold i datasettet refereres det til begreper i begrepskataloger som også gir mulighet til å utnytte synonymer\n* innholdstyper i datasettet beskrives med referanse til begreper i begrepskatalog \n* dersom det ikke kan benyttes en begrepskatalog brukes emneord. \nEt datasett skal lenke til de aktuelle og sentrale begrepene i en begrepskatalog. Ved å henvise til gjennomarbeidede definisjoner som virksomheten selv er ansvarlig for å vedlikeholde, sikrer vi at det er tydelig hvordan et begrep brukt i datasettet skal forstås og at denne forståelsen til en hver tid er riktig og oppdatert. Vi ønsker at alle datasettene skal ha lenker til de aktuelle begrepene i virksomhetens katalog, slik at det er tydelig definert hva begrepene innebærer'
      },
      uri: 'http://brreg.no/fdk/fields#Dataset_content'
    },
    Dataset_creator: {
      id: 'Dataset_creator',
      shortdesc: {
        nb:
          'Brukes unntaksvis der det er datasett som er satt sammen av data som andre er ansvarlige for'
      },
      description: {
        nb:
          'Egenskapen angir produsent(er) av datasettet der dette er en annen enn dataeier\n* Bruke unntaksvis der det er datasett som er satt sammen av data som andre er ansvarlige for\n* Skaper vil ikke angis med organisasjonsnummer siden det typisk vil være en sammensatt gruppe.'
      },
      uri: 'http://brreg.no/fdk/fields#Dataset_creator'
    },
    Dataset_description: {
      id: 'Dataset_description',
      shortdesc: {
        nb:
          'Beskrivelsen skal være kortfattet. Hensikten med datasettet bør komme fram. Hvilke opplysninger som utgjør kjernen i datasettet bør angis. Bruk folkelige ord. Beskriv avgrensninger, hva dataettet ikke inneholder. Begrens lenker og markup.'
      },
      description: {
        nb:
          'En kort og presis beskrivelse av datasettet skal gjøre det lett for andre å se hva det inneholder. Beskrivelse er et obligatorisk felt.\n* Beskrivelsen skal være kortfattet slik at lister over datasett forståes ved å lese de første linjene.\n* Hensikten med datasettet bør komme fram (f.eks. “Løsøreregisteret inneholder tinglyste flyttbare eiendeler”). For datasett som er omfattet av Personopplysningsloven, skal behandlingsformålet beskrives.\n* Beskriv hva datasettet inneholder. Hvilke opplysninger som utgjør kjernen i datasettet bør angis.\n* Feltinnhold skal ikke listes, men listes i emneord eller begreper.\n* Beskrivelsen er ikke en gjentakelse av tittel\n* Bruk folkelige ord (f.eks.”Løsøre” må forklares. F.eks. “flyttbare eiendeler (Løsøre)”, ev. bare folkelige uttrykk mens faguttrykket tas med som stikkord slik at det gir treff i søk)\n* Beskriv avgrensninger, hva datasettet ikke inneholder, dersom dette kan misforstås ut fra tittelen.\n* Begrens lenker og markup (formatering) i teksten. Skal man angi språk må teksten formelt sett være fri for lenker og formatering (HTML).\n* Der målform er kjent skal "nb" eller "nn" brukes, "no" brukes ellers.'
      },
      uri: 'http://brreg.no/fdk/fields#Dataset_description'
    },
    Dataset_distribution: {
      id: 'Dataset_distribution',
      shortdesc: {
        nb:
          'For å angi hvor man kan få tilgang til datasettet skal det angis ulike distribusjoner.'
      },
      description: {
        nb:
          'For å angi hvor man kan få tilgang til datasettet skal det angis ulike distribusjoner.\n* Det angis i utgangspunktet en distribusjon per fil, feed eller API\n* Dersom det er ett API som leverer flere filformater angis det som en distribusjon'
      },
      uri: 'http://brreg.no/fdk/fields#Dataset_distribution'
    },
    Dataset_documentation: {
      id: 'Dataset_documentation',
      shortdesc: {
        nb:
          'Referanse til en side som beskriver utdypende dokumentasjon om datasettet.'
      },
      description: {
        nb:
          'Utdypende dokumentasjon av datasettet angis ved å peke på en side der den finnes. Det anbefales at Landingsside brukes i stedet for dokumentasjon.'
      },
      uri: 'http://brreg.no/fdk/fields#Dataset_documentation'
    },
    Dataset_example: {
      id: 'Dataset_example',
      shortdesc: {
        nb:
          'Benyttes for å gi eksempeldata for et datasett, og hvordan en faktisk distribusjon ser ut.\n'
      },
      description: {
        nb:
          'Benyttes for å gi eksempeldata for et datasett, og hvordan en faktisk distribusjon ser ut.\n * Dersom datasettet inneholder personopplysninger vil det være nyttig for bruker å se en eksempedata som viser en anonymisert rad i datasettet.'
      },
      uri: 'http://brreg.no/fdk/fields#Dataset_example'
    },
    Dataset_hasQualityAnnotation_accuracy: {
      id: 'Dataset_hasQualityAnnotation_accuracy',
      shortdesc: {
        nb: 'I hvilken grad er innholdet i samsvar med formålet.'
      },
      description: {
        nb:
          'I hvilken grad datasettet korrekt representerer intensjonen som er angitt av dataeier i formålet\nNøyaktighet skal tolkes i forhold til formålet. \n'
      },
      uri: 'http://brreg.no/fdk/fields#Dataset_hasQualityAnnotation_accuracy'
    },
    Dataset_hasQualityAnnotation_availability: {
      id: 'Dataset_hasQualityAnnotation_availability',
      shortdesc: {
        nb:
          'Avvik eller tilleggsopplysninger knyttet til datasettes tilgjengelighet.'
      },
      description: {
        nb:
          'Avvik eller tilleggsopplysninger knyttet til datasettets tilgjengelighet\n* Tilgjengelighet tolkes i forhold til tilgangsnivå og ev. begrensninger utover det som er angitt i behandlingsgrunnlag, skjermings- og utleveringshjemmel.\n* Dersom datasettet er åpent men mangler distribusjoner bør årsaken angis her.\n'
      },
      uri:
        'http://brreg.no/fdk/fields#Dataset_hasQualityAnnotation_availability'
    },
    Dataset_hasQualityAnnotation_completeness: {
      id: 'Dataset_hasQualityAnnotation_completeness',
      shortdesc: {
        nb:
          'I hvilken grad inneholder datasettet alle objekter som nevnt i formålet'
      },
      description: {
        nb:
          'I hvilken grad inneholder datasettet forventede opplysninger\n* Kompletthet tolkes i forhold til formålet (utvalget)\n* Inneholder datasettet de objekter som nevnt i formålet? '
      },
      uri:
        'http://brreg.no/fdk/fields#Dataset_hasQualityAnnotation_completeness'
    },
    Dataset_hasQualityAnnotation_currentness: {
      id: 'Dataset_hasQualityAnnotation_currentness',
      shortdesc: {
        nb:
          'Avvik eller tilleggsopplysninger om “oppdateringsfrekvens” og “sist oppdatert”'
      },
      description: {
        nb:
          'Avvik eller tilleggsopplysninger om “oppdateringsfrekvens” og “sist oppdatert” \nEr opplysninger om “oppdateringsfrekvens” og “sist oppdatert” alltid gyldig? Er det opplysninger i datasettet som har annen oppdateringsfrekvens?'
      },
      uri: 'http://brreg.no/fdk/fields#Dataset_hasQualityAnnotation_currentness'
    },
    Dataset_hasQualityAnnotation_relevance: {
      id: 'Dataset_hasQualityAnnotation_relevance',
      shortdesc: {
        nb:
          'Avvik eller tilleggsopplysninger knyttet til datasettes relevans i ulike brukskontekster\n'
      },
      description: {
        nb:
          'Avvik eller tilleggsopplysninger knyttet til datasettes relevans i ulike brukskontekster\n* En vurdering om det er bruksområder datasettet er spesielt velegnet eller ikke bør brukes.'
      },
      uri: 'http://brreg.no/fdk/fields#Dataset_hasQualityAnnotation_relevance'
    },
    Dataset_identifier: {
      id: 'Dataset_identifier',
      shortdesc: {
        nb: 'Identifikatoren skal automatisk genereres'
      },
      description: {
        nb:
          'For å kunne referere til et datasett entydig og kunne angi relasjoner mellom datasett, må alle datasett ha stabile, globale og unike identifikatorer. Identifikator er et obligatorisk felt.\n* Identifikatoren bør automatisk genereres når du registrerer datasettet om du benytter en registreringsløsning. \n* Identifikatoren skal være unik innenfor aktuell datakatalog\n* Identifikatoren skal inngå i en globalt unik identifikator.\n* Den globalt unike identifikatoren skal utformes som en URI\n* Den globalt unike identifikatoren er representert ved feltet dct:identifier\nDatasettets URI bør benytte en av de globalt unike identifikatorene i dct:identifier \n* Man bør kunne registrere ytterligere identifikatorer.'
      },
      uri: 'http://brreg.no/fdk/fields#Dataset_identifier'
    },
    Dataset_informationModel: {
      id: 'Dataset_informationModel',
      shortdesc: {
        nb: 'Refereranse til datasettets informasjonsmodell'
      },
      description: {
        nb:
          'En eksplisitt referanse til informasjonsmodell\n* Benyttes til å angi en maskinlesbar referanse til informasjonsmodell.'
      },
      uri: 'http://brreg.no/fdk/fields#Dataset_informationModel'
    },
    Dataset_issued: {
      id: 'Dataset_issued',
      shortdesc: {
        nb: 'Tidspunktet angir når innholdet i datasettet gjøres tilgjengelig.'
      },
      description: {
        nb:
          'For å forstå når datasettet er operativt og tilgjengelig angis tidspunkt for utgivelse. \n* Angis som tidspunkt (dato alene tolkes som kl. 00:00)\n* Tidspunktet angir når innholdet i datasettet gjøres tilgjengelig. Dette er ikke alltid  samsvarende med når den enkelte distribusjonen er tilgjengelig.  * Og heller ikke når beskrivelsen om datasettet utgis (katalogpostens utgivelse).\nTidspunkt angis med xsd:dateTime. Dette inkluderer utvidelser av kapittel 5.4 i ISO 8601 med tidssoner) [-]CCYY-MM-DDThh:mm:ss[Z|(+|-)hh:mm]'
      },
      uri: 'http://brreg.no/fdk/fields#Dataset_issued'
    },
    Dataset_keyword: {
      id: 'Dataset_keyword',
      shortdesc: {
        nb:
          'Angi synonymer og andre ord som kan hjelpe i søk. Sentralt innhold i datasettet som ikke ennå har begrepsdefinisjoner.'
      },
      description: {
        nb:
          'Ord og uttrykk som hjelper brukeren til å finne datasettet inkluderes (der det ikke er eksplisitt angitt referanser til begreper)  \n* Angi synonymer til hjelp i søk \n* Angi sentralt innhold i datasettet som ikke finnes begrepsdefinisjoner for enda \nI noen tilfeller mangler noen av begrepsdefinisjonene som er sentrale for å beskrive datasettet, eller man har et ord som ikke formelt forbindes med datasettet men som man vet at mange likevel bruker. Da kan vi bruke dette feltet for å sørge for at disse søkeordene likevel gir treff i søkemotoren.\n'
      },
      uri: 'http://brreg.no/fdk/fields#Dataset_keyword'
    },
    Dataset_landingpage: {
      id: 'Dataset_landingpage',
      shortdesc: {
        nb:
          'Referanse til en side som beskriver datasettets innhold, struktur og tilgang.'
      },
      description: {
        nb:
          'Dokumentasjon om datasettet på en landingsside hos datasetteieren som kan beskrive registeret, innhold og struktur, og tilgang.\n* kan referere til registerets hjemmeside\n* kan referere til en samleside som beskriver innhold og struktur \n* kan referere til en samleside om nedlasting/bruk/søk (tjenestene)\n* det kan refereres til flere sider'
      },
      uri: 'http://brreg.no/fdk/fields#Dataset_landingpage'
    },
    Dataset_language: {
      id: 'Dataset_language',
      shortdesc: {
        nb: 'Hovedspråket benyttet i datasettets innhold angis'
      },
      description: {
        nb:
          'For å forstå hvilket språk innholdet til datasettet har angis dette\n* Det er hovedspråket benyttet i datasettets innhold som skal angis \n* Er datasettet uten språklige tekster angis ikke språk\n* Inneholder datasett tekster på flere språk, og det ikke er tydelig hva som er hovedspråket, angis ikke språk\n* Språk angis fra en liste av gyldige språk fra EUs autoritetsliste.\n'
      },
      uri: 'http://brreg.no/fdk/fields#Dataset_language'
    },
    Dataset_legalBasisForAccess: {
      id: 'Dataset_legalBasisForAccess',
      shortdesc: {
        nb:
          'Henvisning til regelverk som begrunner en offentlig virksomhet sin rett eller plikt til å utlevere opplysninger til andre private personer eller juridiske personer.'
      },
      description: {
        nb:
          'Informasjon om utleveringshjemmel gjør det enklere for brukere av datasettet å se om det er nødvendig med egen hjemmel for innhenting eller om de kan få tillatelse til å bruke opplysninger etter søknad til dataeier.\n* Henvisning til regelverk som begrunner en offentlig virksomhet sin rett eller plikt til å utlevere opplysninger til andre private personer eller juridiske personer.\n* Henvisningen gjøres til lovdata på paragraf-nivå.'
      },
      uri: 'http://brreg.no/fdk/fields#Dataset_legalBasisForAccess'
    },
    Dataset_legalBasisForProcessing: {
      id: 'Dataset_legalBasisForProcessing',
      shortdesc: {
        nb:
          'Behandlingsgrunnlag knyttes enten til angitt lovhjemmel, samtykke eller nødvendighetsvurdering.'
      },
      description: {
        nb:
          'Etter personopplysningsloven § 8 og 9 skal det foreligge et grunnlag for behandling av personopplysninger. \nDersom et datasett inneholder personopplysninger skal det være et grunnlag for behandlingen.\n* Behandlingsgrunnlag knyttes enten til lovhjemmel, samtykke eller nødvendighetsvurdering. Angi dette i tekst.\n* Dersom behandlingsgrunnlaget er knyttet til lovhjemmel angis en referanse til dette.'
      },
      uri: 'http://brreg.no/fdk/fields#Dataset_legalBasisForProcessing'
    },
    Dataset_legalBasisForRestriction: {
      id: 'Dataset_legalBasisForRestriction',
      shortdesc: {
        nb: 'Angi referanse til relevant lov eller forskrift.'
      },
      description: {
        nb:
          'Dersom datasettet har begrensninger på deling trenger vi å vite hva skjermingen gjelder. Det kan være hjemmel (kilde for påstand) i offentlighetsloven, sikkerhetsloven, beskyttelsesinstruksen eller annet lovverk som ligger til grunn for vurdering av tilgangsnivå.\n* Angi referanse til relevant lov eller forskrift. Helst til lovdata på paragrafnivå. \n* Egenskapen er anbefalt dersom «tilgangsnivå» har verdiene «begrenset» eller «ikke-offentlig»'
      },
      uri: 'http://brreg.no/fdk/fields#Dataset_legalBasisForRestriction'
    },
    Dataset_modified: {
      id: 'Dataset_modified',
      shortdesc: {
        nb: 'Tidspunktet angir når innholdet i datasettet sist er endret.'
      },
      description: {
        nb:
          'For å forstå når datasettet sist ble oppdatert angis tidspunkt for siste endring\n* Angis som tidspunkt (dato alene tolkes som kl. 00:00:00 norsk tid)\n* Tidspunktet angir når innholdet i datasettet sist er endret.\n* Tidspunkt angis med xsd:dateTime etter kapittel 5.4 i ISO 8601 utvidet med tidssoner [-]CCYY-MM-DDThh:mm:ss[Z|(+|-)hh:mm]\n'
      },
      uri: 'http://brreg.no/fdk/fields#Dataset_modified'
    },
    Dataset_objective: {
      id: 'Dataset_objective',
      shortdesc: {
        nb:
          'Beskrivelsen skal være kortfattet og ikke gjentas i Beskrivelsesfeltet.'
      },
      description: {
        nb:
          'En setnings-beskrivelse av formålet til datasettet.\n* Beskrivelsen skal være kortfattet og ikke gjentas i Beskrivelsesfeltet. \n* Dersom datasettet inneholder personopplysninger skal behandlingsformålet for personopplysninger etter Personopplysningsloven beskrives her.'
      },
      uri: 'http://brreg.no/fdk/fields#Dataset_objective'
    },
    Dataset_partOf: {
      id: 'Dataset_partOf',
      shortdesc: {
        nb: 'Der registre oppdeles i mindre datasett skal relasjonen brukes.'
      },
      description: {
        nb:
          'Peker til et datasett som det aktuelle datasettet er en delmengde av av, eller at det er brutt opp i mindre datasett. \n* Der registre oppdeles i mindre datasett skal relasjonen brukes. F.eks. er datasettet Underenheter er del av datasettet Enhetsregisteret.'
      },
      uri: 'http://brreg.no/fdk/fields#Dataset_partOf'
    },
    Dataset_provenance: {
      id: 'Dataset_provenance',
      shortdesc: {
        nb:
          'Angi om opplysningene i datasettet er resultat av vedtak eller innsamlet fra bruker eller tredjepart'
      },
      description: {
        nb:
          'Det er behov for en sortering om innholdet er basert på avgjørelse truffet under utøvelse av offentlig myndighet (vedtak) eller er kommer fra andre kilder (bruker eller tredjepart). Vedtak anses å være autoritative kilder for hele forvaltningen. \n* Angi om opplysningene i datasettet er resultat av vedtak eller innsamlet fra bruker eller tredjepart\n* Det skal velges en verdi fra et kontrollert vokabular med verdiene :Vedtak, :Bruker, :Tredjepart'
      },
      uri: 'http://brreg.no/fdk/fields#Dataset_provenance'
    },
    Dataset_publisher: {
      id: 'Dataset_publisher',
      shortdesc: {
        nb: 'Skal peke på en Enhet i Enhetsregisteret.'
      },
      description: {
        nb:
          'Identifisering av den enheten som er ansvarlig for at datasettet er tilgjengelig, ikke den som faktisk gjør datasettet tilgjengelig. Eier er et obligatorisk felt.\n* Skal peke på en Enhet (juridisk person, organisasjonsledd, underenhet)\n* Det offisielle navnet på virksomheten vil hentes fra Enhetsregisteret, men kortform (f.eks. Difi) kan legges inn av brukeren\n* Eieren av datasettet forvalter sammensetning av dataene, altså datasettet, og ikke nødvendigvis selve dataene. \n'
      },
      uri: 'http://brreg.no/fdk/fields#Dataset_publisher'
    },
    Dataset_relation: {
      id: 'Dataset_relation',
      shortdesc: {
        nb:
          'Referanse til andre datasett som gir supplerende informasjon om innholdet, f.eks. et kodeverk.'
      },
      description: {
        nb:
          'En generell relasjon som peker til ressurser som er relatert til datasettet.\n\nAngi referanser til andre datasett som gir supplerende informasjon om innholdet. Kan f.eks. være å relatere til et kodeverk.'
      },
      uri: 'http://brreg.no/fdk/fields#Dataset_relation'
    },
    Dataset_replacedBy: {
      id: 'Dataset_replacedBy',
      shortdesc: {
        nb: 'Peker til et datasett som erstatter et aktuelt datasettet.'
      },
      description: {
        nb:
          'Peker til et datasett som erstatter et aktuelt datasettet.\n* F.eks. kan et kodeverk erstattet av en nyere utgave.'
      },
      uri: 'http://brreg.no/fdk/fields#Dataset_replacedBy'
    },
    Dataset_requires: {
      id: 'Dataset_requires',
      shortdesc: {
        nb:
          'Peker til en ressurs som må være tilstede for at datasettet skal kunne produseres.'
      },
      description: {
        nb:
          'Peker til en ressurs som må være tilstede for at datasettet skal kunne produseres.\n* Peker til ressurs (datasett eller annet) som aktuelt datasett er avhengig av'
      },
      uri: 'http://brreg.no/fdk/fields#Dataset_requires'
    },
    Dataset_source: {
      id: 'Dataset_source',
      shortdesc: {
        nb:
          'Peker til ressurs (datasett eller annet) som helt eller delvis er en kilde for det aktuelle datasettet.'
      },
      description: {
        nb:
          'Peker til en ressurs som er kilde til datasettet\n* Peker til ressurs (datasett eller annet) som helt eller delvis er en kilde for det aktuelle datasettet. F.eks. kan et datasett er opprettet basert på data som er hentet fra en nettside, uten at den er definert som et datasett.\n* Dersom et åpent datasett er basert på et annet hvor personopplysninger er fjernet, kan relasjonen brukes.\n* Et datasett som er avledet fra et annet skal ha en referanse til kilde for det aktuelle datasettet. \n* Dersom det er et utvalg fra et annet datasett bør heller relasjonen del av brukes'
      },
      uri: 'http://brreg.no/fdk/fields#Dataset_source'
    },
    Dataset_spatial: {
      id: 'Dataset_spatial',
      shortdesc: {
        nb:
          'Angi geografisk avgrensning dersom datasett kun har innhold fra visse områder. Referer til geografiske områder angitt med URI fra GeoNames'
      },
      description: {
        nb:
          'Det er ønskelig å synliggjøre om datasettets utvalg er begrenset til bestemte geografiske områder.\n* Angi geografisk avgrensning dersom datasett kun har innhold fra visse områder. “Observert hekking av grågås i Oppdal” er datasettets geografiske omfang begrenset til kommunen Oppdal. \n* Benytt eksisterende avgrensninger som kommuner, fylker m.v. \n* Bør referere til geografiske områder angitt med URI-er (f.eks. Sentralt Stedsnavnsregister eller Administrative grenser fra Kartverket) \n* Flere områder kan angis om relevant\n* Dersom det finnes en tilsvarende landsdekkende oversikt, bør dette beskrives som et separat datasett, og disse relateres. (se også “relasjoner mellom datasett”).  f.eks. Observert hekking av grågås i Norge'
      },
      uri: 'http://brreg.no/fdk/fields#Dataset_spatial'
    },
    Dataset_temporal: {
      id: 'Dataset_temporal',
      shortdesc: {
        nb:
          'Angi tidsmessig  avgrensning dersom datasett kun har innhold fra visse perioder. Dersom det finnes en tilsvarende komplett oversikt, bør også dette beskrives som et eget datasett'
      },
      description: {
        nb:
          'En tidsromangivelse er nødvendig for datasett hvor innholdet dekker et avgrenset tidsrom. \n* Angi tidsmessig  avgrensning dersom datasett kun har innhold fra visse perioder. For mange datasett knyttet til registerfunksjoner vil tidsrom være direkte koblet mot oppdateringsfrekvens. For andre datasett vil tidsrom være vesentlig i forhold til forståelse av bruk av dataene, f.eks folketellinger.\n* Dersom det er angitt en periode med årstall, tolkes dette som fra og med 1. januar første år til og med 31. desember siste år. \n* Ved ett årstall på begynnelse, men ikke angitt slutt, tolkes det at datasettet har data også i en ubestemt fremtid og tilsvarende om startdatoen mangler antas det at det er ikke angitt om datasettet har en start. \n* Dersom det finnes en tilsvarende komplett oversikt, bør også dette beskrives som et eget datasett, og disse relateres.  (se også “4.25 Relasjoner mellom datasett”)\n* Dersom datasettet er en av flere i en tidsserie anbefales det at det lages et overordnet datasett for tidsserien uten distribusjoner som peker på hver datasett.\n* Det benyttes tidsstempel for registreringen av første og siste dataelement i datasettet. \n* Det kan angis flere tidsperioder per datasett, men det anbefales at periodene ikke er overlappende.\n* Relativ avgrensning i tid fra tidspunkt for uttrekk (eksempelvis fra og med dato for forrige påbegynte semester og til og med avslutning av påfølgende semester)'
      },
      uri: 'http://brreg.no/fdk/fields#Dataset_temporal'
    },
    Dataset_theme: {
      id: 'Dataset_theme',
      shortdesc: {
        nb:
          'Ett eller flere temaer velges fra den kontrollerte listen av EU-temaer'
      },
      description: {
        nb:
          'For å kunne sortere datasettet inn under gitte kategorier er det behov for tema\n* Ett eller flere temaer velges fra den kontrollerte listen av EU-temaer.'
      },
      uri: 'http://brreg.no/fdk/fields#Dataset_theme'
    },
    Dataset_title: {
      id: 'Dataset_title',
      shortdesc: {
        nb:
          'Tittelen skal være kortfattet, kunne stå alene og gi mening. Organisasjonens navn trenger ikke å være med. Tittelen skal gjenspeile avgrensninger dersom datasettet er avgrenset i populasjonen. Forkortelser skal skrives helt ut.'
      },
      description: {
        nb:
          'Datasettet har en tittel slik at det bl.a. kan vises i lister. Tittel er et obligatorisk felt.\n* Tittelen skal være kortfattet, kunne stå alene og gi mening.\n* Organisasjonens navn trenger ikke å være med, med mindre det er spesielt relevant for datasettets innholdsmessige utvalg.\n* Tittelen skal gjenspeile avgrensninger dersom datasettet er avgrenset i populasjonen - populasjonen er avgrenset av geografi eller formål, f.eks. “... med støtte i Lånekassen”, “... i Oslo”, “ Folketellingen av 1910”\n* Der populasjonen ikke er avgrenset angis IKKE dette (f.eks. valgkrets)\n* Forkortelser skal skrives helt ut (DTM10 erstattes av “Digital Terrengmodell 10m oppløsning (DTM10)”. Bruk eventuelt feltet for emneord til forkortelser. Målgruppen er personer som ønsker å finne relevante datasett raskt, unngå derfor interne navn eller forkortelser i tittel. I det offentlige opererer man ofte med flere titler eller navn på ting. Et datasett kan ha et offisielt navn, et kortnavn og en forkortelse. For eksempel: Datasettet “Administrative enheter i Norge” har ABAS som forkortelse. Det er sjelden man bruker den fulle tittelen, så for å gjøre et datasett mest mulig søkbart er det behov for at man kan registrere kortnavn, forkortelser og/eller alternative titler.\n* Lov- eller forskriftshjemlede navn bør brukes i tittel (f.eks. Jegerregisteret)'
      },
      uri: 'http://brreg.no/fdk/fields#Dataset_title'
    },
    Dataset_type: {
      id: 'Dataset_type',
      shortdesc: {
        nb:
          'Referanse til en klassifisering av datasettets type innhold. Refererer til EU publication office sine datasett-typer'
      },
      description: {
        nb:
          'Referanse til en klassifisering av datasettets type innhold. Refererer til EU publication office sine datasett-typer.\n* Datasett som anses som å inneholde data angis med “Data”\n* Datasett som anses som metadata (f.eks. Kodelister, Taksonomier og Tesauri) skal angis tilsvarende\n* Datasett som anses som testdata angis som “Testdata”'
      },
      uri: 'http://brreg.no/fdk/fields#Dataset_type'
    },
    Dataset_versionOf: {
      id: 'Dataset_versionOf',
      shortdesc: {
        nb:
          'Referanse til et datasett som i prinsippet er det samme, men hvor innholdet er blitt oppdatert på bakgrunn av bedret datakvalitet e.l. '
      },
      description: {
        nb:
          'Peker til et datasett som det aktuelle datasettet er en versjon av.\n* I prinsippet det samme datasettet, men hvor innholdet er blitt oppdatert på bakgrunn av bedret datakvalitet e.l. \n* Peker til en versjon av det aktuelle datasettet kan avledes (har versjon).\n* Det kan legges til en versjonskommentar til feltet'
      },
      uri: 'http://brreg.no/fdk/fields#Dataset_versionOf'
    },
    Distribution_accessURL: {
      id: 'Distribution_accessURL',
      shortdesc: {
        nb:
          'Lenke til utfyllende informasjon om hvordan en kan få tilgang til i datasettet.'
      },
      description: {
        nb:
          'Lenke til informasjon om hvordan en kan få tilgang til i datasettet. TilgangsURL er et obligatorisk felt.\n* bør i så stor grad som mulig peke direkte til en distribusjon av data. \n* skal benyttes for tjenesteendepunkter eller lenke til filnedlasting.\n* kan peke til en nettside med informasjon om hvordan man får tilgang til distribusjonen.'
      },
      uri: 'http://brreg.no/fdk/fields#Distribution_accessURL'
    },
    Distribution_conformsTo: {
      id: 'Distribution_conformsTo',
      shortdesc: {
        nb:
          'Benyttes for å angi et etablert skjema som distribusjonen er i samsvar med, for eksempel et XSD-dokument.'
      },
      description: {
        nb:
          'Benyttes for å angi et etablert skjema som distribusjonen er i samsvar med, for eksempel et XSD-dokument.'
      },
      uri: 'http://brreg.no/fdk/fields#Distribution_conformsTo'
    },
    Distribution_description: {
      id: 'Distribution_description',
      shortdesc: {
        nb: ''
      },
      description: {
        nb:
          'Beskrivelse skal uttrykke de ulike distribusjonene\n* Er det kun en distribusjon kan beskrivelsen utelates\n* Ved flere distribusjoner bør beskrivelsen benyttes for å skille dem\n* Dersom det er et utsnitt spesifikt for distribusjonen/formål til distribusjonen benyttes beskrivelse\n'
      },
      uri: 'http://brreg.no/fdk/fields#Distribution_description'
    },
    Distribution_documentation: {
      id: 'Distribution_documentation',
      shortdesc: {
        nb:
          'Referanse til en side eller et dokument som beskriver og dokumenterer innhold og struktur spesifikk for distribusjonen.'
      },
      description: {
        nb:
          'Referanse til en side eller et dokument som beskriver og dokumenterer innhold og struktur spesifikk for distribusjonen.'
      },
      uri: 'http://brreg.no/fdk/fields#Distribution_documentation'
    },
    Distribution_downloadURL: {
      id: 'Distribution_downloadURL',
      shortdesc: {
        nb: 'Direktelenke til en nedlastbar fil i et gitt format'
      },
      description: {
        nb:
          'Direktelenke til en nedlastbar fil i et gitt format\n* kan benyttes dersom alle data tilgjengelig via en tjeneste også er tilgjengelig for nedlasting som en fil.'
      },
      uri: 'http://brreg.no/fdk/fields#Distribution_downloadURL'
    },
    Distribution_format: {
      id: 'Distribution_format',
      shortdesc: {
        nb:
          'Hver distribusjon har format for utveksling. Format er et obligatorisk felt for en distribusjon.'
      },
      description: {
        nb:
          'Hver distribusjon har format for utveksling. Format er et obligatorisk felt for en distribusjon.\n* Det skal angis mediatype (e.g. application/json) fra (https://www.iana.org/assignments/media-types/media-types.xhtml)\n* Det kan angis mediatyper utover denne listen, f.eks. “application/x.sosi” \n* Flere formater skal kun brukes når et og samme API eller sluttbrukerapplikasjoner som tilbyr flere formater'
      },
      uri: 'http://brreg.no/fdk/fields#Distribution_format'
    },
    Distribution_issued: {
      id: 'Distribution_issued',
      shortdesc: {
        nb:
          'Dato/tid når distribusjonen (f.eks. api) først ble publisert i tilknytning til et datasett.'
      },
      description: {
        nb:
          'Dato/tid når distribusjonen (f.eks. api) først ble publisert i tilknytning til et datasett. Når innholdet i datasettene ble gjort tilgjengelige. '
      },
      uri: 'http://brreg.no/fdk/fields#Distribution_issued'
    },
    Distribution_landingpage: {
      id: 'Distribution_landingpage',
      shortdesc: {
        nb:
          'Refererer til en nettside som gir tilgang til datasettet, distribusjoner og annen informasjon. '
      },
      description: {
        nb:
          'Egenskap ved datasett som refererer til en nettside som gir tilgang til datasettet, distribusjoner og annen informasjon. Skal peke til en side hos den originale tilbyderen av data.\n* kan benyttes for å peke til en samleside om et datasett og dets distribusjoner.\n* bør peke til en side hos den originale tilbyderen av data.'
      },
      uri: 'http://brreg.no/fdk/fields#Distribution_landingpage'
    },
    Distribution_modified: {
      id: 'Distribution_modified',
      shortdesc: {
        nb:
          'DDato/tid sist distribusjonen (API-et, filen eller feeden) sist ble endret.'
      },
      description: {
        nb:
          'Dato/tid sist distribusjonen (API-et, filen eller feeden) sist ble endret.'
      },
      uri: 'http://brreg.no/fdk/fields#Distribution_modified'
    },
    Distribution_type: {
      id: 'Distribution_type',
      shortdesc: {
        nb:
          'En distribusjon kan bli levert på ulike vis\n* Angi distribusjonens type (Nedlastbar fil, API, Feed)'
      },
      description: {
        nb:
          'En distribusjon kan bli levert på ulike vis\n\nDet skal angis distribusjonens type \n* Bruk Nedlastbar fil dersom hele distribusjonen kan hentes ned\n* Bruk API dersom deler av datasettet lastes ned gjennom et programmeringsgrensesnitt, typisk REST-API\n* Bruk Feed dersom det i prinsippet er endringer som hentes gjennom f.eks. RSS, Atom eller medlingsformidling \n* Se EU publication office (http://publications.europa.eu/mdr/resource/authority/distribution-type/html/distribution-types-eng.html)'
      },
      uri: 'http://brreg.no/fdk/fields#Distribution_type'
    }
  }
};
