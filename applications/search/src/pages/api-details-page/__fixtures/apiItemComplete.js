export const apiItemComplete = {
  id: 'c541c305-4e4f-43ed-be3e-5434740ec1b5',
  uri: 'jar:file:/app.jar!/BOOT-INF/classes!/datakatalog-api.json',
  title: {
    no: 'National Data Directory Search API'
  },
  description: {
    no:
      'Provides a basic search api against the National Data Directory of Norway'
  },
  contactPoint: [
    {
      uri: 'https://fellesdatakatalog.brreg.no',
      email: 'fellesdatakatalog@brreg.no',
      organizationName: 'Brønnøysundregistrene'
    }
  ],
  openApi: {
    openapi: null,
    info: {
      description:
        'Provides a basic search api against the National Data Directory of Norway',
      version: '1.0',
      title: 'National Data Directory Search API',
      termsOfService: 'https://fellesdatakatalog.brreg.no/about',
      contact: {
        name: 'Brønnøysundregistrene',
        url: 'https://fellesdatakatalog.brreg.no',
        email: 'fellesdatakatalog@brreg.no'
      },
      license: {
        name: 'License of API',
        url: 'http://data.norge.no/nlod/no/2.0'
      }
    },
    servers: null,
    paths: {
      '/catalogs': {
        get: {
          description:
            'The three formats are: text/turtle, application/ld+json and application/rdf+xml',
          responses: {
            '200': {
              description: 'OK'
            },
            '401': {
              description: 'Unauthorized'
            },
            '403': {
              description: 'Forbidden'
            },
            '404': {
              description: 'Not Found'
            }
          }
        }
      },
      '/harvest/catalog': {
        get: {
          responses: {
            '200': {
              description: 'OK'
            },
            '401': {
              description: 'Unauthorized'
            },
            '403': {
              description: 'Forbidden'
            },
            '404': {
              description: 'Not Found'
            }
          }
        }
      },
      '/catalogs/datasets': {
        get: {
          description:
            'The three formats are: text/turtle, application/ld+json and application/rdf+xml',
          responses: {
            '200': {
              description: 'OK'
            },
            '401': {
              description: 'Unauthorized'
            },
            '403': {
              description: 'Forbidden'
            },
            '404': {
              description: 'Not Found'
            }
          }
        }
      },
      '/publisher/hierarchy': {
        get: {
          responses: {
            '200': {
              description: 'OK'
            },
            '401': {
              description: 'Unauthorized'
            },
            '403': {
              description: 'Forbidden'
            },
            '404': {
              description: 'Not Found'
            }
          }
        }
      },
      '/datasets': {
        get: {
          description:
            'Returns a list of matching datasets wrapped in a elasticsearch response. Max number returned by a single query is 100. Size parameters greater than 100 will not return more than 100 datasets. In order to access all datasets, use multiple queries and increment from parameter.',
          responses: {
            '200': {
              description: 'OK'
            },
            '401': {
              description: 'Unauthorized'
            },
            '403': {
              description: 'Forbidden'
            },
            '404': {
              description: 'Not Found'
            }
          }
        }
      },
      '/datasets/**': {
        get: {
          description: "You must specify the dataset's identifier",
          responses: {
            '200': {
              description: 'OK'
            },
            '401': {
              description: 'Unauthorized'
            },
            '403': {
              description: 'Forbidden'
            },
            '404': {
              description: 'Not Found'
            }
          }
        }
      },
      '/publisher': {
        get: {
          description:
            'Returns the elasticsearch response with matching publishers',
          responses: {
            '200': {
              description: 'OK'
            },
            '401': {
              description: 'Unauthorized'
            },
            '403': {
              description: 'Forbidden'
            },
            '404': {
              description: 'Not Found'
            }
          }
        }
      },
      '/aggregateDataset': {
        get: {
          responses: {
            '200': {
              description: 'OK'
            },
            '401': {
              description: 'Unauthorized'
            },
            '403': {
              description: 'Forbidden'
            },
            '404': {
              description: 'Not Found'
            }
          }
        }
      },
      '/terms': {
        get: {
          description:
            'Returns the elasticsearch response with matching terms (dct:subject)',
          responses: {
            '200': {
              description: 'OK'
            },
            '401': {
              description: 'Unauthorized'
            },
            '403': {
              description: 'Forbidden'
            },
            '404': {
              description: 'Not Found'
            }
          }
        }
      }
    }
  }
};
