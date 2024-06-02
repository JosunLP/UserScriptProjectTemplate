import * as fs from "fs";
import pkg from "../package.json";
import config from "../header.config.json";

const targetFile = "./dist/" + pkg.name + ".user.js";

/**
 * Appends header
 * @param header
 */
function appendHeader(header: string) {
  fs.readFile(targetFile, "utf8", (err: NodeJS.ErrnoException | null, data: string) => {
    if (err) {
      throw err;
    }
    fs.writeFile(targetFile, header + data, (err: NodeJS.ErrnoException | null) => {
      if (err) {
        throw err;
      }
    });
  });
}

/**
 * Builds base64 url from file
 * @param filePath
 * @returns base64 url
 */
async function buildBase64UrlFromFile(filePath: string): Promise<string> {
  const file = await fs.promises.readFile(filePath);
  return "data:image/png;base64," + file.toString("base64");
}

/**
 * Generates multiple entries
 * @param type
 * @param array
 * @returns multiple entries
 */
function generateMultipleEntries(type: string, array: string[]): string {
  let result: string = "";
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
  return string.replace(/\n\s*\n/g, "\n");
}

/**
 * Generates user script header
 */
async function generateUserScriptHeader() {
  const excludes = generateMultipleEntries("@exclude", config.excludes);
  const requires = generateMultipleEntries("@require", config.requires);
  const resources = generateMultipleEntries("@resource", config.resources);
  const connecters = generateMultipleEntries("@connect", config.connecters);
  const grants = generateMultipleEntries("@grant", config.grants);
  const matches = generateMultipleEntries("@match", config.matches);
  const includes = generateMultipleEntries("@match", config.includes);
  const antifeatures = generateMultipleEntries("@antifeature", config.antifeatures);
  const base64url = await buildBase64UrlFromFile(config.iconUrl);

  let noframes = "";
  let matchAllFrames = "";
  let updateUrl = "";
  let downloadUrl = "";
  let supportUrl = "";

  if (config.noframes) {
    noframes = `// @noframes\n`;
  }
  if (config.matchAllFrames) {
    matchAllFrames = `// @matchAllFrames\n`;
  }
  if (config.updateUrl !== "") {
    updateUrl = `// @updateURL ${config.updateUrl}\n`;
  }
  if (config.downloadUrl !== "") {
    downloadUrl = `// @downloadURL ${config.downloadUrl}\n`;
  }
  if (config.supportUrl !== "") {
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
  header += "\n";
  appendHeader(header);
}

generateUserScriptHeader();
