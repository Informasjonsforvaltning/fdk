export default {
  took: 10,
  timed_out: false,
  _shards: { total: 5, successful: 5, failed: 0 },
  hits: { total: 547, max_score: 0, hits: [] },
  aggregations: {
    distCount: { doc_count: 442 },
    missingFirstHarvested: { doc_count: 0 },
    distOnPublicAccessCount: { doc_count: 429 },
    publisherCount: {
      doc_count_error_upper_bound: 0,
      sum_other_doc_count: 0,
      buckets: [
        { key: 'Kartverket', doc_count: 91 },
        {
          key: 'NIBIO - NORSK INSTITUTT FOR BIOØKONOMI',
          doc_count: 75
        },
        { key: 'SKATTEETATEN', doc_count: 36 },
        {
          key: 'NORGES VASSDRAGS- OG ENERGIDIREKTORAT (NVE)',
          doc_count: 33
        },
        { key: 'Brønnøysundregistrene', doc_count: 27 },
        {
          key: 'MILJØDIREKTORATET',
          doc_count: 26
        },
        { key: 'NORGES GEOLOGISKE UNDERSØKELSE', doc_count: 26 },
        {
          key: 'NORSK POLARINSTITUTT',
          doc_count: 25
        },
        { key: 'OSLO KOMMUNE PLAN- OG BYGNINGSETATEN', doc_count: 22 },
        { key: 'LANDBRUKSDIREKTORATET', doc_count: 18 },
        {
          key: 'SSB',
          doc_count: 18
        },
        { key: 'OSLO KOMMUNE', doc_count: 17 },
        { key: 'OLJEDIREKTORATET', doc_count: 16 },
        {
          key: 'KYSTVERKET',
          doc_count: 13
        },
        { key: 'TROMSØ KOMMUNE', doc_count: 11 },
        { key: 'FISKERIDIREKTORATET', doc_count: 9 },
        {
          key: 'DIREKTORATET FOR E-HELSE',
          doc_count: 8
        },
        { key: 'OSLO KOMMUNE BYMILJØETATEN', doc_count: 8 },
        {
          key: 'RIKSANTIKVAREN',
          doc_count: 8
        },
        { key: 'STATENS LÅNEKASSE FOR UTDANNING', doc_count: 8 },
        {
          key: 'HAVFORSKNINGSINSTITUTTET',
          doc_count: 6
        },
        { key: 'METEOROLOGISK INSTITUTT', doc_count: 6 },
        {
          key: 'AVINOR AS',
          doc_count: 4
        },
        {
          key: 'DIREKTORATET FOR SAMFUNNSSIKKERHET OG BEREDSKAP (DSB)',
          doc_count: 4
        },
        {
          key: 'NAV',
          doc_count: 4
        },
        { key: 'STATENS VEGVESEN', doc_count: 4 },
        { key: 'FORSVARSBYGG', doc_count: 3 },
        {
          key: 'BANE NOR SF',
          doc_count: 2
        },
        { key: 'Fylkeskommunene', doc_count: 2 },
        { key: 'MATTILSYNET', doc_count: 2 },
        {
          key: 'OSLO KOMMUNE RENOVASJONSETATEN',
          doc_count: 2
        },
        { key: 'ARKIVVERKET', doc_count: 1 },
        {
          key: 'DIFI',
          doc_count: 1
        },
        {
          key:
            'DIREKTORATET FOR MINERALFORVALTNING MED BERGMESTEREN FOR SVALBARD',
          doc_count: 1
        },
        {
          key: 'FORSVARET',
          doc_count: 1
        },
        { key: 'HELSEDIREKTORATET', doc_count: 1 },
        {
          key: 'HITRA KOMMUNE',
          doc_count: 1
        },
        {
          key: 'NORGES TEKNISK-NATURVITENSKAPELIGE UNIVERSITET NTNU',
          doc_count: 1
        },
        {
          key: 'PATENTSTYRET',
          doc_count: 1
        },
        { key: 'RUTER AS', doc_count: 1 },
        { key: 'STATENS STRÅLEVERN', doc_count: 1 },
        {
          key: 'STATSKOG SF',
          doc_count: 1
        },
        { key: 'UNINETT NORID AS', doc_count: 1 },
        { key: 'UTDANNINGSDIREKTORATET', doc_count: 1 }
      ]
    },
    orgPath: {
      doc_count_error_upper_bound: 0,
      sum_other_doc_count: 0,
      buckets: [
        { key: '/STAT', doc_count: 478 },
        { key: '/STAT/972417874', doc_count: 95 },
        {
          key: '/STAT/972417858',
          doc_count: 92
        },
        { key: '/STAT/972417858/971040238', doc_count: 91 },
        {
          key: '/STAT/972417874/988983837',
          doc_count: 75
        },
        { key: '/STAT/912660680', doc_count: 70 },
        { key: '/KOMMUNE', doc_count: 61 },
        {
          key: '/STAT/972417882',
          doc_count: 59
        },
        { key: '/STAT/972417807', doc_count: 54 },
        { key: '/KOMMUNE/958935420', doc_count: 49 },
        {
          key: '/STAT/977161630',
          doc_count: 49
        },
        { key: '/STAT/972417807/974761076', doc_count: 36 },
        {
          key: '/STAT/977161630/970205039',
          doc_count: 33
        },
        { key: '/STAT/912660680/974760673', doc_count: 27 },
        {
          key: '/STAT/912660680/970188290',
          doc_count: 26
        },
        { key: '/STAT/972417882/999601391', doc_count: 26 },
        {
          key: '/STAT/972417882/971022264',
          doc_count: 25
        },
        { key: '/KOMMUNE/958935420/974770482', doc_count: 22 },
        {
          key: '/KOMMUNE/958935420/974770482/971040823',
          doc_count: 22
        },
        { key: '/STAT/972417807/971526920', doc_count: 18 },
        {
          key: '/STAT/972417874/981544315',
          doc_count: 18
        },
        { key: '/STAT/972417904', doc_count: 17 },
        { key: '/STAT/872417842', doc_count: 16 },
        {
          key: '/STAT/977161630/870917732',
          doc_count: 16
        },
        { key: '/STAT/972417904/874783242', doc_count: 13 },
        {
          key: '/KOMMUNE/940101808',
          doc_count: 11
        },
        { key: '/KOMMUNE/958935420/974770474', doc_count: 10 },
        {
          key: '/STAT/983887406',
          doc_count: 10
        },
        { key: '/STAT/912660680/971203420', doc_count: 9 },
        {
          key: '/KOMMUNE/958935420/974770474/996922766',
          doc_count: 8
        },
        { key: '/STAT/872417842/960885406', doc_count: 8 },
        {
          key: '/STAT/972417882/974760819',
          doc_count: 8
        },
        { key: '/STAT/983887406/915933149', doc_count: 8 },
        { key: '/PRIVAT', doc_count: 6 },
        {
          key: '/STAT/872417842/971274042',
          doc_count: 6
        },
        { key: '/STAT/912660680/971349077', doc_count: 6 },
        { key: '/PRIVAT/985198292', doc_count: 4 },
        {
          key: '/STAT/972417823',
          doc_count: 4
        },
        { key: '/STAT/972417831', doc_count: 4 },
        {
          key: '/STAT/972417831/974760983',
          doc_count: 4
        },
        { key: '/STAT/972417904/971032081', doc_count: 4 },
        {
          key: '/STAT/983887457',
          doc_count: 4
        },
        { key: '/STAT/983887457/889640782', doc_count: 4 },
        { key: '/STAT/972417823/975950662', doc_count: 3 },
        {
          key: '/ANNET',
          doc_count: 2
        },
        { key: '/ANNET/Fylkeskommunene', doc_count: 2 },
        {
          key: '/KOMMUNE/958935420/974770474/976820088',
          doc_count: 2
        },
        { key: '/STAT/917082308', doc_count: 2 },
        {
          key: '/STAT/972417874/985399077',
          doc_count: 2
        },
        { key: '/STAT/983887406/983544622', doc_count: 2 },
        { key: '/KOMMUNE/938772924', doc_count: 1 },
        {
          key: '/PRIVAT/985821585',
          doc_count: 1
        },
        { key: '/PRIVAT/991609407', doc_count: 1 },
        {
          key: '/STAT/872417842/970018131',
          doc_count: 1
        },
        { key: '/STAT/872417842/974767880', doc_count: 1 },
        {
          key: '/STAT/912660680/971526157',
          doc_count: 1
        },
        { key: '/STAT/912660680/974760282', doc_count: 1 },
        {
          key: '/STAT/966056258',
          doc_count: 1
        },
        { key: '/STAT/972417823/986105174', doc_count: 1 },
        {
          key: '/STAT/972417858/991825827',
          doc_count: 1
        },
        { key: '/STAT/972417866', doc_count: 1 },
        {
          key: '/STAT/972417866/961181399',
          doc_count: 1
        },
        { key: '/STAT/983887406/983544622/867668292', doc_count: 1 }
      ]
    },
    accessRightsCount: {
      doc_count_error_upper_bound: 0,
      sum_other_doc_count: 0,
      buckets: [
        { key: 'PUBLIC', doc_count: 463 },
        { key: 'RESTRICTED', doc_count: 52 },
        { key: 'Ukjent', doc_count: 32 }
      ]
    },
    theme_count: {
      doc_count_error_upper_bound: 0,
      sum_other_doc_count: 0,
      buckets: [
        { key: 'ENVI', doc_count: 178 },
        { key: 'GOVE', doc_count: 148 },
        { key: 'REGI', doc_count: 117 },
        {
          key: 'AGRI',
          doc_count: 114
        },
        { key: 'HEAL', doc_count: 31 },
        { key: 'SOCI', doc_count: 27 },
        { key: 'TRAN', doc_count: 27 },
        {
          key: 'ENER',
          doc_count: 24
        },
        { key: 'EDUC', doc_count: 18 },
        { key: 'JUST', doc_count: 18 },
        { key: 'ECON', doc_count: 8 },
        {
          key: 'Ukjent',
          doc_count: 7
        }
      ]
    },
    lastChanged: {
      buckets: {
        last7days: { doc_count: 547 },
        last30days: { doc_count: 547 },
        last365days: { doc_count: 547 }
      }
    },
    missingLastChanged: { doc_count: 0 },
    firstHarvested: {
      buckets: {
        last7days: { doc_count: 547 },
        last30days: { doc_count: 547 },
        last365days: { doc_count: 547 }
      }
    },
    subjectCount: { doc_count: 9 }
  }
};
