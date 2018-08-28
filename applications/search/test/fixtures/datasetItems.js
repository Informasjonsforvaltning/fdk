export default [
  {
    took: 24,
    timed_out: false,
    _shards: {
      total: 5,
      successful: 5,
      failed: 0
    },
    hits: {
      total: 131,
      max_score: null,
      hits: [
        {
          _index: 'dcat',
          _type: 'dataset',
          _id: 'b12e9e8d-3833-49e2-9f62-0f8fd877be05',
          _score: null,
          _source: {
            id: 'b12e9e8d-3833-49e2-9f62-0f8fd877be05',
            uri:
              'http://brreg.no/catalogs/910244132/datasets/633a0af6-5c88-4027-9f58-79f487a80642',
            source: 'A',
            harvest: {
              firstHarvested: '2018-04-12T17:18:30+0200',
              lastHarvested: '2018-04-13T08:26:27+0200',
              lastChanged: '2018-04-13T08:26:27+0200',
              changed: ['2018-04-13T08:26:27+0200']
            },
            title: {
              nb: 'test ois'
            },
            description: {
              nb: 'test'
            },
            descriptionFormatted: {
              nb: 'test'
            },
            contactPoint: [],
            publisher: {
              type: 'no.dcat.datastore.domain.dcat.Publisher',
              valid: false,
              uri: 'http://data.brreg.no/enhetsregisteret/enhet/910244132',
              id: '910244132',
              name: 'RAMSUND OG ROGNAN REVISJON',
              orgPath: '/ANNET/910244132'
            },
            landingPage: [],
            theme: [
              {
                id:
                  'http://publications.europa.eu/resource/authority/data-theme/EDUC',
                code: 'EDUC',
                startUse: '2015-10-01',
                title: {
                  sv: 'Utbildning, kultur och sport',
                  sk: 'Vzdelávanie, kultúra a šport',
                  pt: 'Educação, cultura e desporto',
                  en: 'Education, culture and sport',
                  fr: 'Éducation, culture et sport',
                  hr: 'Obrazovanje, kultura i sport',
                  sl: 'Izobraževanje, kultura in šport',
                  mt: 'Edukazzjoni, kultura u sport',
                  de: 'Bildung, Kultur und Sport',
                  cs: 'Vzdělávání, kultura a sport',
                  it: 'Istruzione, cultura e sport',
                  es: 'Educación, cultura y deportes',
                  nb: 'Utdanning, kultur og sport',
                  da: 'Uddannelse, kultur og sport',
                  nl: 'Onderwijs, cultuur en sport',
                  bg: 'Образование, култура и спорт',
                  ro: 'Educaţie, cultură şi sport',
                  fi: 'Koulutus, kulttuuri ja urheilu',
                  lt: 'Švietimas, kultūra ir sportas',
                  hu: 'Oktatás, kultúra és sport',
                  lv: 'Izglītība, kultūra un sports',
                  el: 'Παιδεία, πολιτιστικά θέματα και αθλητισμός',
                  ga: 'Oideachas, cultúr agus spórt',
                  pl: 'Edukacja, kultura i sport',
                  et: 'Haridus, kultuur ja sport'
                },
                conceptSchema: {
                  id:
                    'http://publications.europa.eu/resource/authority/data-theme',
                  title: {
                    en: 'Dataset types Named Authority List'
                  },
                  versioninfo: '20160921-0',
                  versionnumber: '20160921-0'
                }
              }
            ],
            accessRights: {
              uri:
                'http://publications.europa.eu/resource/authority/access-right/PUBLIC',
              code: 'PUBLIC',
              prefLabel: {
                en: 'Public',
                nb: 'Offentlig',
                nn: 'Offentlig'
              }
            },
            provenance: {
              uri: 'http://data.brreg.no/datakatalog/provinens/nasjonal',
              code: 'NASJONAL',
              prefLabel: {
                en: 'National Building Block',
                nb: 'Nasjonal felleskomponent',
                nn: 'Nasjonal felleskomponent'
              }
            },
            catalog: {
              id: '910244132',
              uri: 'http://brreg.no/catalogs/910244132',
              title: {
                nb: 'Datakatalog for RAMSUND OG ROGNAN REVISJON'
              },
              publisher: {
                type: 'no.dcat.datastore.domain.dcat.Publisher',
                valid: false,
                uri: 'http://data.brreg.no/enhetsregisteret/enhet/910244132',
                id: '910244132',
                name: 'RAMSUND OG ROGNAN REVISJON',
                orgPath: '/ANNET/910244132'
              }
            }
          },
          sort: ['nasjonal', 'a', 1523600787000]
        }
      ]
    },
    aggregations: {
      missingFirstHarvested: {
        count: 0
      },
      subjectsCount: {
        doc_count_error_upper_bound: 0,
        sum_other_doc_count: 0,
        buckets: [
          {
            key: 'Ukjent',
            count: 1
          }
        ]
      },
      publisherCount: {
        doc_count_error_upper_bound: 0,
        sum_other_doc_count: 0,
        buckets: [
          {
            key: 'RAMSUND OG ROGNAN REVISJON',
            count: 1
          }
        ]
      },
      orgPath: {
        doc_count_error_upper_bound: 0,
        sum_other_doc_count: 0,
        buckets: [
          {
            key: '/ANNET',
            count: 1,
            children: [
              {
                key: '/ANNET/910244132',
                count: 1,
                hasParent: true,
                children: []
              }
            ]
          },
          {
            key: '/ANNET/910244132',
            count: 1,
            hasParent: true,
            children: []
          }
        ]
      },
      accessRightsCount: {
        doc_count_error_upper_bound: 0,
        sum_other_doc_count: 0,
        buckets: [
          {
            key: 'PUBLIC',
            count: 1
          }
        ]
      },
      theme_count: {
        doc_count_error_upper_bound: 0,
        sum_other_doc_count: 0,
        buckets: [
          {
            key: 'AGRI',
            count: 1
          },
          {
            key: 'ECON',
            count: 1
          },
          {
            key: 'EDUC',
            count: 1
          },
          {
            key: 'ENER',
            count: 1
          },
          {
            key: 'ENVI',
            count: 1
          },
          {
            key: 'GOVE',
            count: 1
          },
          {
            key: 'HEAL',
            count: 1
          },
          {
            key: 'INTR',
            count: 1
          },
          {
            key: 'JUST',
            count: 1
          },
          {
            key: 'REGI',
            count: 1
          }
        ]
      },
      lastChanged: {
        buckets: {
          last7days: {
            count: 1
          },
          last30days: {
            count: 1
          },
          last365days: {
            count: 1
          }
        }
      },
      missingLastChanged: {
        count: 0
      },
      firstHarvested: {
        buckets: {
          last7days: {
            count: 1
          },
          last30days: {
            count: 1
          },
          last365days: {
            count: 1
          }
        }
      },
      spatial: {
        doc_count_error_upper_bound: 0,
        sum_other_doc_count: 0,
        buckets: [
          {
            key: 'Ukjent',
            count: 1
          }
        ]
      },
      provenanceCount: {
        doc_count_error_upper_bound: 0,
        sum_other_doc_count: 0,
        buckets: [
          {
            key: 'VEDTAK',
            count: 1
          }
        ]
      }
    }
  }
];
