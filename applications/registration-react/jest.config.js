module.exports = {
  setupFiles: ['<rootDir>/test/jestsetup.ts'],
  snapshotSerializers: ['enzyme-to-json/serializer'],
  transform: {
    '^.+\\.[jt]sx?$': 'ts-jest'
  },
  moduleNameMapper: {
    '^.+\\.(svg|css|less|scss)$': 'identity-obj-proxy'
  }
};
