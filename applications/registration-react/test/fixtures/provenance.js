export default {
  isFetchingProvenance: false,
  provenanceItems: {
    undefined: {
      uri: 'http://data.brreg.no/datakatalog/provinens',
      prefLabel: {
        no: 'Opphav',
        en: 'Provinens'
      }
    },
    BRUKER: {
      uri: 'http://data.brreg.no/datakatalog/provinens/bruker',
      code: 'BRUKER',
      prefLabel: {
        nb: 'Brukerinnsamlede data',
        nn: 'Brukerinnsamlede data',
        en: 'User collection'
      }
    },
    NASJONAL: {
      uri: 'http://data.brreg.no/datakatalog/provinens/nasjonal',
      code: 'NASJONAL',
      prefLabel: {
        en: 'Authoritativ source',
        nb: 'Autoritativ kilde',
        nn: 'Autoritativ kilde'
      }
    },
    TREDJEPART: {
      uri: 'http://data.brreg.no/datakatalog/provinens/tredjepart',
      code: 'TREDJEPART',
      prefLabel: {
        en: 'Third party',
        nb: 'Tredjepart',
        nn: 'Tredjepart'
      }
    },
    VEDTAK: {
      uri: 'http://data.brreg.no/datakatalog/provinens/vedtak',
      code: 'VEDTAK',
      prefLabel: {
        nb: 'Vedtak',
        nn: 'Vedtak',
        en: 'Governmental decisions'
      }
    }
  }
};
