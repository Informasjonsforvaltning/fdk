const fs = require('fs');
const path = require('path');
const Json2csvParser = require('json2csv').Parser;


class AllResultsCsvReporter {
  constructor(globalConfig, options) {
    this._globalConfig = globalConfig;
    this._options = options;

    if (!this._options.outputDir) {
      this._options.outputDir = './reports';
    }

    if (!this._options.outputFile) {
      this._options.outputFile = 'arts-report.csv';
    }
  }

  onRunComplete(contexts, results) {

    const output = [];

    for (const testFile of results.testResults) {
      for (const testCase of testFile.testResults) {

        const ancestors = testCase.ancestorTitles || [];
        const artRefMatches = JSON.stringify(testCase).match(/ART:\S+/g) || [];
        const artRefs = artRefMatches.map(match => match.replace('ART:', ''));
        const artRefsUnique = Array.from(new Set(artRefs));
        if (artRefsUnique.length == 0) {
          continue;
        }

        const outputItem = {
          file: path.basename(testFile.testFilePath),
          art: artRefsUnique.join(','),
          suite: ancestors.filter(a => a.includes('SUITE:')).join(','),
          given: ancestors.filter(a => a.includes('GIVEN:')).join(','),
          when: ancestors.filter(a => a.includes('WHEN:')).join(','),
          title: testCase.title,
          status: testCase.status
        };

        output.push(outputItem);
      }
    }

    const parser = new Json2csvParser({ delimiter: ';' });
    const csv = parser.parse(output);
    fs.writeFile(path.join(this._options.outputDir, this._options.outputFile), csv, err => {
      if (err) {
        console.error(err);
      } else {
        console.log(`write all results to ${this._options.outputFile}`);
      }
    });
  }
}

module.exports = AllResultsCsvReporter;
