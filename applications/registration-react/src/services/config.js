import axios from 'axios';

const createConfig = env => {
  const searchHost = env.SEARCH_HOST || 'https://fellesdatakatalog.brreg.no';
  const searchApi = {
    host: env.SEARCH_API_HOST || searchHost,
    // in ut1 and st1, search api requires basic authentication
    authorization: env.SEARCH_API_AUTHORIZATION || undefined
  };
  const defaultToSearchApi = host => (host ? { host } : searchApi);

  return {
    store: { useLogger: env.REDUX_LOG === 'true' },
    registrationLanguage: env.REGISTRATION_LANGUAGE || 'nb',
    keycloak: {
      realm: 'fdk',
      url: `${env.SSO_HOST}/auth`,
      clientId: 'fdk-registration-public'
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
      env.RECORDS_OF_PROCESSING_ACTIVITIES_HOST ||
      'https://registrering-protokoll.fellesdatakatalog.brreg.no'
  };
};

const config = createConfig({});

export const getConfig = () => config;

export const initConfig = async () => {
  const response = await axios.get('/env.json');
  const env = response.data;

  // The below method of configuration override is useful when using webpack devserver.

  // override all env variables to ut1 (inspired by https://registrering.ut1.fellesdatakatalog.brreg.no/env.json)
  // Object.assign(env, {
  //   SEARCH_HOST: 'https://www.ut1.fellesdatakatalog.brreg.no',
  //   SEARCH_API_AUTHORIZATION: 'Basic ZmRrOkJSUkVH',
  //   REGISTRATION_API_HOST:
  //     'https://registrering.ut1.fellesdatakatalog.brreg.no',
  //   CONCEPT_REGISTRATION_API_HOST:
  //     'https://registrering-begrep-api.ut1.fellesdatakatalog.brreg.no',
  //   CONCEPT_REGISTRATION_HOST:
  //     'https://registrering-begrep.ut1.fellesdatakatalog.brreg.no',
  //   SSO_HOST: 'https://sso.ut1.fellesdatakatalog.brreg.no',
  //   ORGANIZATION_API_HOST:
  //     'https://organization-catalogue.ut1.fellesdatakatalog.brreg.no',
  //   USE_DEMO_LOGO: true,
  //   RECORDS_OF_PROCESSING_ACTIVITIES_HOST:
  //     'https://registrering-protokoll.ut1.fellesdatakatalog.brreg.no'
  // });

  // override all env variables to local docker
  // Object.assign(env, {
  //   SEARCH_HOST: 'http://localhost:8080',
  //   REGISTRATION_API_HOST: 'http://localhost:8098',
  //   CONCEPT_REGISTRATION_API_HOST: 'http://localhost:8200',
  //   CONCEPT_REGISTRATION_HOST: 'http://localhost:8202',
  //   SSO_HOST: 'http://localhost:8084',
  //   ORGANIZATION_API_HOST:
  //     'https://organization-catalogue.ut1.fellesdatakatalog.brreg.no',
  //   USE_DEMO_LOGO: true,
  //   RECORDS_OF_PROCESSING_ACTIVITIES_HOST:
  //     'https://registrering-protokoll.ut1.fellesdatakatalog.brreg.no'
  // });

  Object.assign(config, createConfig(env));
};
