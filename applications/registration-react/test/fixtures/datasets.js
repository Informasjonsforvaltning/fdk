export default {
  isFetchingDatasets: false,
    datasetItems: {
    _embedded: {
      datasets: [
        {
          id: '084f747f-04a9-460e-b07e-ee74c60a2086',
          uri: 'http://brreg.no/catalogs/910244132/datasets/084f747f-04a9-460e-b07e-ee74c60a2086',
          title: {
            nb: 'test ois'
          },
          description: {
            nb: 'tester'
          },
          objective: {
            nb: ''
          },
          publisher: {
            uri: 'http://data.brreg.no/enhetsregisteret/enhet/910244132',
            name: 'RAMSUND OG ROGNAN REVISJON'
          },
          landingPage: [
            ''
          ],
          theme: [
            {
              uri: '',
              title: {
                nb: ''
              }
            },
            {
              uri: 'http://publications.europa.eu/resource/authority/data-theme/AGRI',
              title: {
                nb: 'Jordbruk, fiskeri, skogbruk og mat'
              }
            }
          ],
          accessRights: {
            uri: "http://publications.europa.eu/resource/authority/access-right/NON_PUBLIC",
            prefLabel: {}
          },
          legalBasisForRestriction: [{
            uri: "http://google.no",
            prefLabel: {
              nb: "skjerming"
            },
            extraType: null
          }],
          legalBasisForProcessing: [{
            uri: "http://google.no",
            prefLabel: {
              nb: "behandling"
            },
            extraType: null
          }],
          legalBasisForAccess: [{
            uri: "http://google.no",
            prefLabel: {
              nb: "utlevering"
            },
            extraType: null
          }],
          catalogId: '910244132',
          _lastModified: '2018-05-07T10:36:20.388+0000',
          registrationStatus: 'PUBLISH'
        }
      ]
    },
    _links: {
      self: {
        href: 'http://registration-api:8080/catalogs/910244132/datasets?page=0&size=1000'
      }
    },
    page: {
      size: 1000,
        totalElements: 1,
        totalPages: 1,
        number: 0
    }
  }
}
