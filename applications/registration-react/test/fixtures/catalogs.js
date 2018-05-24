export default {
  isFetchingCatalogs: false,
  catalogItems: {
    _embedded: {
      catalogs: [
        {
          id: '910244132',
          uri: 'http://brreg.no/catalogs/910244132',
          title: {
            nb: 'Datakatalog for RAMSUND OG ROGNAN REVISJON'
          },
          description: {},
          publisher: {
            uri: 'http://data.brreg.no/enhetsregisteret/enhet/910244132',
            name: 'RAMSUND OG ROGNAN REVISJON'
          }
        }
      ]
    },
    _links: {
      self: {
        href: 'http://registration-api:8080/catalogs?page=0&size=20'
      }
    },
    page: {
      size: 20,
      totalElements: 1,
      totalPages: 1,
      number: 0
    }
  }
};
