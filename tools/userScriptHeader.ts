const fs = require("fs");
const pkg = require("../package.json");
const config = require("../header.config.json");
const targetFile = "./dist/" + pkg.name + ".user.js";

/**
 * Appends header
 * @param header
 */
function appendHeader(header: string) {
  fs.readFile(targetFile, "utf8", (err: any, data: string) => {
    if (err) {
      throw err;
    }
    fs.writeFile(targetFile, header + data, (err: any) => {
      if (err) {
        throw err;
      }
    });
  });
}

/**
 * Builds base64 url from file
 * @param filePath 
 * @returns  
 */
async function buildBase64UrlFromFile(filePath: string): Promise<string> {
  const file = await fs.promises.readFile(filePath);
  return "data:image/png;base64," + file.toString("base64");
}

/**
 * Generates multible entrys
 * @param type
 * @param array
 * @returns multible entrys
 */
function generateMultibleEntrys(type: string, array: string[]): string {
  let result: string = "";
  debugger;
  if (array) {
    array.forEach((item: string) => {
      result += `// ${type}     ${item}`;
      if (array.length > 1) {
        result += "\n";
      }
    });
  }
  return result;
}

/**
 * Removes empty lines from string
 * @param string
 * @returns empty lines from string
 */
function removeEmptyLinesFromString(string: string): string {
  return string.replace(/\n\s*\n/g, "\n");
}

/**
 * Generates user script header
 */
async function generateUserScriptHeader() {
  const excludes = generateMultibleEntrys("@exclude", config.excludes);
  const requires = generateMultibleEntrys("@require", config.requires);
  const resources = generateMultibleEntrys("@resource", config.resources);
  const connecters = generateMultibleEntrys("@connect", config.connecters);
  const grants = generateMultibleEntrys("@grant", config.grants);
  const matches = generateMultibleEntrys("@match", config.matches);
  const includes = generateMultibleEntrys("@match", config.includes);
  const antifeatures = generateMultibleEntrys(
    "@antifeature",
    config.antifeatures
  );
  const base64url = await buildBase64UrlFromFile(config.iconUrl);
  let noframes = "";
  let matchAllFrames = "";
  let updateUrl = "";
  let downloadUrl = "";
  let supportUrl = "";

  if (config.noframes) {
    noframes = `// @noframes
    `;
  }
  if (config.matchAllFrames) {
    matchAllFrames = `// @matchAllFrames
    `;
  }
  if (config.updateUrl !== "") {
    updateUrl = `// @updateURL ${config.updateUrl}
    `;
  }
  if (config.downloadUrl !== "") {
    downloadUrl = `// @downloadURL ${config.downloadUrl}
    `;
  }
  if (config.supportUrl !== "") {
    supportUrl = `// @supportURL ${config.supportUrl}
    `;
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
