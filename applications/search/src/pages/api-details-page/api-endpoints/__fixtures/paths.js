export const paths = {
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
  }
};
