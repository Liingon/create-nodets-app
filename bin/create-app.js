#! /usr/bin/env node

'use strict';

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

if (process.argv.length < 3) {
  console.log('You have to provide a name for your app.');
  console.log('For example:');
  console.log('    npx liingon/create-nodets-app my-app-name');
  process.exit(1);
}

const projectName = process.argv[2];
const currentPath = process.cwd();
const projectPath = path.join(currentPath, projectName);
const git_repo = '';

try {
  fs.mkdirSync(projectPath);
} catch (err) {
  if (err.code === 'EEXIST') {
    console.log(`The directory ${projectName} already exists in the current directory, please give it another name.`);
  } else {
    console.log(error);
  }
  process.exit(1);
}

async function setup() {
  try {
    console.log('Downloading boilerplate...');
    execSync(`git clone --depth 1 ${git_repo} ${projectPath}`);

    process.chdir(projectPath);

    console.log('Updating package.json...');
    let packageJson = fs.readFileSync(path.join(projectPath, 'package.json'));
    packageJson = JSON.parse(packageJson);
    packageJson.name = projectName;
    packageJson.version = '0.1.0';
    delete packageJson.bin;
    fs.writeFileSync(path.join(projectPath, 'package.json'), JSON.stringify(packageJson, null, 2))

    console.log('Installing dependencies...');
    execSync('npm install');

    console.log('Cleaning up...');
    fs.rmSync(path.join(projectPath, 'README.md'));
    fs.copyFileSync(path.join(projectPath, '/bin/app_readme.md'), path.join(projectPath, 'README.md'))
    fs.rmdirSync(path.join(projectPath, '.git'), { recursive: true });
    fs.rmdirSync(path.join(projectPath, 'bin'), { recursive: true });

    console.log('To start developing:');
    console.log(`    cd ${projectName}`);
    console.log('    npm start');
    console.log();

  } catch (error) {
    console.log(error);
  }
}

setup();
