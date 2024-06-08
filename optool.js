const { argv, env } = require("node:process");

async function main(chemicalCode) {
  const name = await getChemicalName(chemicalCode);
  console.log(name);
}

async function getChemicalName(chemicalCode) {
  if (chemicalCode.length !== 9) {
    throw new Error("Code is not valid: must be 9 character chemical code");
  }

  const url = `https://openprescribing.net/api/1.0/bnf_code?format=json&exact=true&q=${chemicalCode}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`HTTP error: ${response.status}`);
  }

  const results = await response.json();

  const result = results[0];

  if (!result) {
    throw new Error("Code is not valid: not found");
  }

  return result["name"];
}

if (env?.NODE_ENV !== "test") {
  const chemicalCode = argv.slice(2)[0];
  main(chemicalCode);
}

module.exports = { getChemicalName };
