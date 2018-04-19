export default
  {
    "took": 7,
    "timed_out": false,
    "_shards": {"total": 5, "successful": 5, "failed": 0},
    "hits": {
      "total": 10,
      "max_score": 1,
      "hits": [{
        "_index": "scat",
        "_type": "subject",
        "_id": "https://data-david.github.io/Begrep/begrep/Enhet",
        "_score": 1,
        "_source": {
          "uri": "https://data-david.github.io/Begrep/begrep/Enhet",
          "identifier": "https://data-david.github.io/Begrep/begrep/Enhet",
          "prefLabel": {"no": "enhet"},
          "definition": {"no": "alt som er registrert med et organisasjonsnummer "},
          "note": {"no": "Alle hovedenheter, underenheter og organisasjonsledd som er identifisert med et organisasjonsnummer."},
          "source": "https://jira.brreg.no/browse/BEGREP-208",
          "creator": {
            "type": "no.dcat.datastore.domain.dcat.Publisher",
            "overordnetEnhet": "912660680",
            "organisasjonsform": "ORGL",
            "naeringskode": {
              "uri": "http://www.ssb.no/nace/sn2007/84.110",
              "code": "84.110",
              "prefLabel": {"no": "Generell offentlig administrasjon"}
            },
            "sektorkode": {"uri": "http://www.brreg.no/sektorkode/6100", "code": "6100", "prefLabel": {"no": "Statsforvaltningen"}},
            "valid": true,
            "uri": "http://data.brreg.no/enhetsregisteret/enhet/974760673",
            "id": "974760673",
            "name": "Brønnøysundregistrene",
            "orgPath": "/STAT/912660680/974760673"
          },
          "inScheme": ["http://data-david.github.io/vokabular/Befolkning"],
          "datasets": [{
            "id": "b3abe917-f2c6-4bda-8e17-8982f95ba11f",
            "uri": "http://data.brreg.no/datakatalog/dataset/974760673/2",
            "title": {"nb": "Enhetsregisteret", "en": "Central Coordinating Register for Legal Entities"},
            "description": {
              "nb": "Enhetsregisteret inneholder oversikt over alle registrerte enheter Norge innen næringsliv, offentlig og frivillig sektor. Enhetsregisteret tildeler organisasjonsnummer, og samordner opplysninger om næringsliv og offentlige etater som finnes i ulike offentlige registre.",
              "en": "Central Coordinating Register for Legal Entities is a register containing information on all legal entities in Norway - commercial enterprises and government agencies. Includes also businesses sole proprietorships, associations and other economic entities without registration duty, who have chosen to join the CCR on a voluntary basis."
            }
          }]
        }
      }, {
        "_index": "scat",
        "_type": "subject",
        "_id": "https://data-david.github.io/Begrep/begrep/Organisasjonsnummer",
        "_score": 1,
        "_source": {
          "uri": "https://data-david.github.io/Begrep/begrep/Organisasjonsnummer",
          "identifier": "https://data-david.github.io/Begrep/begrep/Organisasjonsnummer",
          "prefLabel": {"no": "organisasjonsnummer"},
          "altLabel": [{"no": "Orgid"}, {"no": "Orgnr"}],
          "definition": {"no": "Et nisifret nummer som tildeles av Enhetsregisteret for en organisasjon som skal operere som en offentlig aktør"},


          "datasets": [{
            "id": "631b8f86-530e-44f0-b0b6-cad948c6b9b6",
            "uri": "http://data.brreg.no/datakatalog/dataset/974760673/5",
            "title": {"nb": "Akvakulturregisteret", "en": "Aquaculture register"},
            "description": {"nb": "Akvakulturregisteret inneholder oversikt over akvakulturtillatelser og enkelte vesentlige vedtak knyttet til disse. I tillegg inneholder registeret en oversikt over overføringer, pantsettelser og andre rettigheter som er tinglyst på tillatelsene."}
          }, {
            "id": "6d71993e-4c9b-4d5b-9f57-c7f2cea1037b",
            "uri": "http://data.brreg.no/datakatalog/dataset/974760673/10",
            "title": {"nb": "Frivillighetsregisteret"},
            "description": {
              "nb": "Frivillighetsregisteret har oversikt over lag og foreninger i Norge, og har som formål å forenkle samhandlingen mellom frivillige organisasjoner og offentlig sektor. De som registrerer seg i Frivillighetsregisteret kan delta i grasrotandelen til Norsk Tipping, og motta/få momskompensasjon.",
              "en": "Register of clubs and associations. The purpose is to improve and simplify the interaction between NGOs and public authorities. The Registry will ensure systematic information that can strengthen the legitimacy and knowledge of the voluntary activity. Managed by Brønnøysund Registre"
            }
          }, {
            "id": "4abdf712-1c9d-49b9-b5f9-6c67a8983eda",
            "uri": "http://data.brreg.no/datakatalog/dataset/974760673/7",
            "title": {"nb": "Partiregisteret"},
            "description": {"nb": "Partiregisteret er et register over politiske parti i Norge. Hovedformålet med registeret er å gi part anledning til å skaffe seg enerett på partinavn."}
          }, {
            "id": "e063a919-d4ba-4b78-9fe3-0c114cbcef68",
            "uri": "http://data.brreg.no/datakatalog/dataset/974760673/16",
            "title": {"nb": "Registeret for utøvere av alternativ behandling"},
            "description": {"nb": "Registeret for utøvere av alternativ behandling inneholder opplysninger om registrerte utøvere og godkjente utøverorganisasjoner. Registeret skal bidra med å vareta pasientvernet og forbrukerrettighetene for den som oppsøker en registrert alternativ behandler. I tillegg skal registeret medvirke til seriøsitet og ordnede forretningsvilkår"}
          }, {
            "id": "97093ad6-661a-46f8-b4f6-681998661d03",
            "uri": "http://data.brreg.no/datakatalog/dataset/974760673/1",
            "title": {"nb": "Foretaksregisteret", "en": "Register of Business Enterprises"},
            "description": {
              "nb": "Foretaksregisteret registrerer alle norske og utenlandske foretak i Norge, og skal sikre rettsvern og økonomisk oversikt. Enkeltpersonforetak som ikke driver handel med innkjøpte varer eller har mindre enn 5 ansatte i full stilling har ikke registreringsplikt, men har registreringsrett. Foretaksregisteret skal sikre rettsvern og økonomisk oversikt, og er en viktig kilde til informasjon om norsk næringsliv.",
              "en": "The Register of Business Enterprises registers Norwegian and foreign businesses in Norway, ensuring legal protection and financial overview. All businesses – with confining as well as complete responsibility – are obliged to register in the Register of Business Enterprises. The same applies to sole proprietorships engaging in trade with purchased goods or having more than five fully employed personell. Other sole proprietorships may register on a voluntary basis."
            }
          }, {
            "id": "510ebd85-15f5-40b8-8bad-dfb92234ee2a",
            "uri": "http://data.brreg.no/datakatalog/dataset/974760673/3",
            "title": {"nb": "Løsøreregisteret", "en": "Register of Mortgaged Movable Property"},
            "description": {"nb": "Løsøreregisteret er et tinglysingsregister for rettigheter og pant i løsøre. En tinglyst rettighet eller pant, gir rettsvern overfor kreditorer. Løsøreregisteret omfatter ikke tinglysning i fast eiendom, skip og luftfartøyer."}
          }, {
            "id": "40000eb2-8bc8-4b63-a371-411c3270b7a0",
            "uri": "http://data.brreg.no/datakatalog/dataset/974760673/15",
            "title": {"nb": "Registeret for offentlig støtte"},
            "description": {"nb": "Registeret for offentlig støtte (ROFS) er et nasjonalt register for offentlige støttetildelinger som faller inn under EØS-avtalen. Registeret skal gjøre det enklere for offentlige myndigheter, som vurderer å gi offentlig støtte, å få informasjon om foretakene har fått annen offentlig støtte som må tas med i vurderingen."}
          }, {
            "id": "1a3eda0a-4710-4209-8e9f-eb9d709f1540",
            "uri": "http://data.brreg.no/datakatalog/dataset/974760673/4",
            "title": {"nb": "Regnskapsregisteret", "en": "Register of Company Accounts"},
            "description": {
              "nb": "Regnskapsregisteret mottar årlig ca 315 000 (pr år 2017) årsregnskap fra aksjeselskaper, sparebanker, forsikringsselskaper og andre regnskapspliktige foretak i Norge. Årsregnskapene inneholder regnskapstall i elektronisk form. I tillegg er det vedlagt styrets årsberetning, noter, kontantstrømanalyse og revisors beretning, hvor dette kreves.",
              "en": "The Register of Company Accounts receives yearly about 315 000 annual accounts from limited companies, saving banks, insurance companies and other accounting obligation companies in Norway. The yearly accounts contains accounting numbers in electronic formats. In addition attachments includes the annula report of the board, and notes, cash flow and auditors report where needed. All yearly accounts is availiable for everyone, and the most important datasource for everyone that wish to get understand the financial situation for Norwegian businesses."
            }
          }]
        }
      }]
    },
    "aggregations": {
      "creator": {
        "doc_count_error_upper_bound": 0,
        "sum_other_doc_count": 0,
        "buckets": [{"key": "ukjent", "doc_count": 9}, {"key": "Brønnøysundregistrene", "doc_count": 1}]
      },
      "orgPath": {
        "doc_count_error_upper_bound": 0,
        "sum_other_doc_count": 0,
        "buckets": [{"key": "ukjent", "doc_count": 9, "children": []}, {
          "key": "/STAT",
          "doc_count": 1,
          "children": [{
            "key": "/STAT/912660680",
            "doc_count": 1,
            "hasParent": true,
            "children": [{"key": "/STAT/912660680/974760673", "doc_count": 1, "hasParent": true, "children": []}]
          }]
        }, {
          "key": "/STAT/912660680",
          "doc_count": 1,
          "hasParent": true,
          "children": [{"key": "/STAT/912660680/974760673", "doc_count": 1, "hasParent": true, "children": []}]
        }, {"key": "/STAT/912660680/974760673", "doc_count": 1, "hasParent": true, "children": []}]
      }
    }
  }
