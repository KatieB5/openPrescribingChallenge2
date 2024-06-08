import { argv, env } from "node:process";

async function main(chemicalCode) {
  const name = await getChemicalName(chemicalCode);
  console.log(name);
}

async function getChemicalName(chemicalCode) {
  const url = `https://openprescribing.net/api/1.0/bnf_code?format=json&exact=true&q=${chemicalCode}`;

  // Calls to `fetch()` are asynchronous and so require the use of `async`/`await` here and in
  // functions that call this code. If you're not familiar with `async`/`await` then there is an
  // introduction here: https://blog.postman.com/understanding-async-await-in-node-js/.
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP error: ${response.status}`);
  }
  const results = await response.json();

  // Exact matches return just one result if the code is found or none if it is not
  const result = results[0];

  return result["name"];
}

if (env?.NODE_ENV !== "test") {
  const chemicalCode = argv.slice(2)[0];
  main(chemicalCode);
}

export { getChemicalName };
