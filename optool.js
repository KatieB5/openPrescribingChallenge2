const { argv, env } = require('process');

async function main(chemicalCode) {
  const data = await getHighestPrescribingICBs(chemicalCode);
  console.log(data.name);
  data.spendingData.forEach((datum) => {
    console.log(datum);
  });
}

async function getHighestPrescribingICBs(chemicalCode) {
  if (typeof chemicalCode !== "string") {
    throw new Error("Code is not valid: input must be of data type 'string'");
  } else if (chemicalCode.length !== 9) {
    throw new Error("Code is not valid: must be 9 character chemical code");
  }

  const baseUrl = `https://openprescribing.net/api/1.0/`;

  const chemicalNameResult = await getChemicalName(
    `${baseUrl}bnf_code?format=json&exact=true&q=${chemicalCode}`
  );

  const spendingDataResult = await getSpendingData(
    `${baseUrl}spending_by_org/?org_type=icb&code=${chemicalCode}&format=json`
  );

  if (!chemicalNameResult || spendingDataResult.length === 0) {
    throw new Error("Code is not valid: not found");
  }

  const sortedSpendData = sortAndProcessSpendData(spendingDataResult)

  return { name: chemicalNameResult["name"], spendingData: sortedSpendData };
}

async function getChemicalName(url) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`HTTP error: ${response.status}`);
  }

  const results = await response.json();

  const result = results[0];

  return result;
}

async function getSpendingData(url) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`HTTP error: ${response.status}`);
  }

  const results = await response.json();

  return results;
}

function sortAndProcessSpendData(spendingDataResult) {
  spendingDataResult.sort((a, b) => {
    if (a.date < b.date) {
      return -1;
    }
    if (a.date > b.date) {
      return 1;
    }
    return b.items - a.items;
  });

  const uniqueDates = new Set();
  const highestItemsbyDate = spendingDataResult.filter((resultObj) => {
    if (!uniqueDates.has(resultObj.date)) {
      uniqueDates.add(resultObj.date);
      return true;
    }
  });

  const dateIcbItems = highestItemsbyDate.map((resultObj) => {
    return `${resultObj["date"]} ${resultObj["row_name"]} ${resultObj["items"]}`;
  });

  return dateIcbItems;
}

if (env?.NODE_ENV !== "test") {
  const chemicalCode = argv.slice(2)[0];
  main(chemicalCode);
}

module.exports = {
  getHighestPrescribingICBs,
  getChemicalName,
  getSpendingData,
  sortAndProcessSpendData,
};
