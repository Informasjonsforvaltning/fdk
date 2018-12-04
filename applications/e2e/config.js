// default test environment is headless browser running on host, default values should be set accordingly

export const config = {
  browser: process.env.BROWSER || 'default',
  searchHost: process.env.HOST_SEARCH || 'http://localhost:8080',
  jestTimeout: process.env.TEST_TIMEOUT || 10000
};
