const env = (window as any).env || {
  SEARCH_HOST: 'http://localhost:8080',
  REGISTRATION_API_HOST: 'http://localhost:8098',
  CONCEPT_REGISTRATION_API_HOST: 'http://localhost:8200',
  CONCEPT_REGISTRATION_HOST: 'http://localhost:8202',
  ORGANIZATION_API_HOST: 'http://localhost:8140',
  USE_DEMO_LOGO: false,
  SSO_HOST: 'http://localhost:8084',
  // todo given that the it uses the same port as the organization-api, no-one has ever tried to run these services together. Update when this need arises
  RECORDS_OF_PROCESSING_ACTIVITIES_GUI_BASE_URI: 'http://localhost:8140',
  RECORDS_OF_PROCESSING_ACTIVITIES_API_BASE_URI: 'http://localhost:8141'
};

// override all env variables to ut1 (inspired by https://registrering.ut1.fellesdatakatalog.brreg.no/config.js)
// env.SEARCH_HOST = 'https://www.ut1.fellesdatakatalog.brreg.no';
// env.SEARCH_API_AUTHORIZATION = 'Basic ZmRrOkJSUkVH';
// env.REGISTRATION_API_HOST = 'https://registrering.ut1.fellesdatakatalog.brreg.no';
// env.CONCEPT_REGISTRATION_API_HOST = 'https://registrering-begrep-api.ut1.fellesdatakatalog.brreg.no';
// env.CONCEPT_REGISTRATION_HOST = 'https://registrering-begrep.ut1.fellesdatakatalog.brreg.no';
// env.SSO_HOST = 'https://sso.ut1.fellesdatakatalog.brreg.no';
// env.ORGANIZATION_API_HOST = 'https://organization-catalogue.ut1.fellesdatakatalog.brreg.no';
// env.USE_DEMO_LOGO = true;
// env.RECORDS_OF_PROCESSING_ACTIVITIES_GUI_BASE_URI = 'https://registrering-protokoll.ut1.fellesdatakatalog.brreg.no';
// env.RECORDS_OF_PROCESSING_ACTIVITIES_API_BASE_URI = 'https://registrering-protokoll-api.ut1.fellesdatakatalog.brreg.no';

const searchHost = env.SEARCH_HOST || 'https://fellesdatakatalog.brreg.no';
const searchApi = {
  host: env.SEARCH_API_HOST || searchHost,
  // in ut1 and st1, search api requires basic authentication
  authorization: env.SEARCH_API_AUTHORIZATION || undefined
};

const defaultToSearchApi = host => (host ? { host } : searchApi);

const config = {
  store: { useLogger: env.REDUX_LOG === 'true' },
  registrationLanguage: env.REGISTRATION_LANGUAGE || 'nb',
  auth: {
    oidcIssuer: `${env.SSO_HOST}/auth/realms/fdk`,
    oidcClientId: 'fdk-registration-public'
  },

  // frontend hosts
  searchHost,
  conceptRegistrationHost:
    env.CONCEPT_REGISTRATION_HOST ||
    'https://registrering-begrep.fellesdatakatalog.brreg.no',

  // api modules
  referenceDataApi: defaultToSearchApi(env.REFERENCE_DATA_HOST),
  apiApi: defaultToSearchApi(env.API_API_HOST),
  datasetApi: defaultToSearchApi(env.DATASET_API_HOST),
  conceptApi: defaultToSearchApi(env.CONCEPT_API_HOST),
  // default configuration runs in cluster through proxy, assuming frontend comes from the same origin
  registrationApi: { host: env.REGISTRATION_API_HOST || '' },
  conceptRegistrationApi: {
    host:
      env.CONCEPT_REGISTRATION_API_HOST ||
      'https://registrering-begrep-api.fellesdatakatalog.brreg.no'
  },
  organizationApi: {
    host:
      env.ORGANIZATION_API_HOST ||
      'https://organization-catalogue.fellesdatakatalog.brreg.no'
  },
  useDemoLogo: env.USE_DEMO_LOGO || false,
  recordsOfProcessingActivitiesHost:
    env.RECORDS_OF_PROCESSING_ACTIVITIES_GUI_BASE_URI ||
    'https://registrering-protokoll.fellesdatakatalog.brreg.no',
  recordsOfProcessingActivitiesApi:
    env.RECORDS_OF_PROCESSING_ACTIVITIES_API_BASE_URI ||
    'https://registrering-protokoll-api.fellesdatakatalog.brreg.no'
};

export const getConfig = () => config;
