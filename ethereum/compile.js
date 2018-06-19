const path = require('path');
const solc = require('solc');
const fs = require('fs-extra');

// reset - delete /build folder 
const buildPath = path.resolve(__dirname, 'build');
fs.removeSync(buildPath);

// read sol file 
const campaignPath = path.resolve(__dirname, 'contracts', 'Campaign.sol');
const source = fs.readFileSync(campaignPath, 'utf8');

// compile contracts 
const output = solc.compile(source, 1).contracts;

// create /build folder 
fs.ensureDirSync(buildPath);

// iterate over output 
for (let contract in output) {
  // create filename 
  const filename = contract.replace(':', '') + '.json';
  // create file for each contract 
  fs.outputJsonSync(
    path.resolve(buildPath, filename),
    output[contract]    
  );
}