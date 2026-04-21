/// <reference types="node" />

import * as fs from 'fs';
import config from '../header.config.json';
import pkg from '../package.json';

type BuildEnvironment = 'production' | 'development';

// Check which file exists to determine the environment
const prodFile = `./dist/${pkg.name}.user.js`;
const devFile = `./dist/${pkg.name}.dev.user.js`;

const requestedEnvironment = process.argv[2];

function isBuildEnvironment(value: string | undefined): value is BuildEnvironment {
  return value === 'production' || value === 'development';
}

function resolveBuildTarget(environment?: BuildEnvironment): {
  environment: BuildEnvironment;
  targetFile: string;
} {
  if (environment === 'production') {
    if (!fs.existsSync(prodFile)) {
      console.error(`❌ Expected production bundle at ${prodFile}, but it does not exist.`);
      process.exit(1);
    }

    return {
      environment,
      targetFile: prodFile,
    };
  }

  if (environment === 'development') {
    if (!fs.existsSync(devFile)) {
      console.error(`❌ Expected development bundle at ${devFile}, but it does not exist.`);
      process.exit(1);
    }

    return {
      environment,
      targetFile: devFile,
    };
  }

  if (fs.existsSync(prodFile)) {
    return {
      environment: 'production',
      targetFile: prodFile,
    };
  }

  if (fs.existsSync(devFile)) {
    return {
      environment: 'development',
      targetFile: devFile,
    };
  }

  console.error('❌ No UserScript file found in dist/');
  console.error(`Expected either: ${prodFile} or ${devFile}`);
  process.exit(1);
}

const buildTarget = resolveBuildTarget(
  isBuildEnvironment(requestedEnvironment) ? requestedEnvironment : undefined
);
const { environment, targetFile } = buildTarget;

console.log(`🔧 Building UserScript header for ${environment} (${targetFile})`);

/**
 * Appends header
 * @param header
 */
async function appendHeader(header: string): Promise<void> {
  const data = await fs.promises.readFile(targetFile, 'utf8');
  await fs.promises.writeFile(targetFile, header + data);
}

/**
 * Builds base64 url from file
 * @param filePath
 * @returns base64 url
 */
async function buildBase64UrlFromFile(filePath: string): Promise<string> {
  const file = await fs.promises.readFile(filePath);
  return 'data:image/png;base64,' + file.toString('base64');
}

/**
 * Generates multiple entries
 * @param type
 * @param array
 * @returns multiple entries
 */
function generateMultipleEntries(type: string, array: string[]): string {
  let result: string = '';
  if (array) {
    array.forEach((item: string) => {
      result += `// ${type}     ${item}\n`;
    });
  }
  return result;
}

/**
 * Removes empty lines from string
 * @param string
 * @returns string without empty lines
 */
function removeEmptyLinesFromString(string: string): string {
  return string.replace(/\n\s*\n/g, '\n');
}

/**
 * Generates user script header
 */
async function generateUserScriptHeader() {
  // Get environment-specific config or fallback to empty arrays
  const envConfig = config.environments?.[environment] || {
    includes: [],
    excludes: [],
    grants: [],
  };

  const excludes = generateMultipleEntries('@exclude', envConfig.excludes);
  const requires = generateMultipleEntries('@require', config.requires);
  const resources = generateMultipleEntries('@resource', config.resources);
  const connecters = generateMultipleEntries('@connect', config.connecters);
  const grants = generateMultipleEntries('@grant', envConfig.grants);

  // Use environment-specific includes as matches, fallback to root matches if available
  const allMatches = envConfig.includes.length > 0 ? envConfig.includes : config.matches;
  const matches = generateMultipleEntries('@match', allMatches);

  // No includes needed as we use matches
  const includes = '';
  const antifeatures = generateMultipleEntries('@antifeature', config.antifeatures);
  const base64url = await buildBase64UrlFromFile(config.iconUrl);

  let noframes = '';
  let matchAllFrames = '';
  let updateUrl = '';
  let downloadUrl = '';
  let supportUrl = '';

  if (config.noframes) {
    noframes = `// @noframes\n`;
  }
  if (config.matchAllFrames) {
    matchAllFrames = `// @matchAllFrames\n`;
  }
  if (config.updateUrl !== '') {
    updateUrl = `// @updateURL ${config.updateUrl}\n`;
  }
  if (config.downloadUrl !== '') {
    downloadUrl = `// @downloadURL ${config.downloadUrl}\n`;
  }
  if (config.supportUrl !== '') {
    supportUrl = `// @supportURL ${config.supportUrl}\n`;
  }

  let header = `// ==UserScript==
// @name         ${pkg.name}
// @namespace    ${pkg.homepage}
// @version      ${pkg.version}
// @description  ${pkg.description}
// @author       ${pkg.author}
// @homepage     ${pkg.homepage}
// @icon64       ${base64url}
// @run-at       ${config.runAt}
${updateUrl}
${downloadUrl}
${supportUrl}
${excludes}
${requires}
${resources}
${connecters}
${grants}
${matches}
${antifeatures}
${noframes}
${matchAllFrames}
// ==/UserScript==
`;

  header = removeEmptyLinesFromString(header);
  header += '\n';
  await appendHeader(header);
}

generateUserScriptHeader();
