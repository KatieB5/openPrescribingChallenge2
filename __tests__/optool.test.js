const {
  getHighestPrescribingICBs,
  getChemicalName,
  getSpendingData,
  sortAndProcessSpendData,
} = require("../optool.js");

describe("getHighestPrescribingICBs", () => {
  test("should not allow non-string data types as input", async () => {
    await expect(getHighestPrescribingICBs(["0407010AD"])).rejects.toThrowError(
      "Code is not valid: input must be of data type 'string'"
    );
  });

  test("should not allow full BNF code", async () => {
    await expect(
      getHighestPrescribingICBs("0407010ADAAABAB")
    ).rejects.toThrowError(
      "Code is not valid: must be 9 character chemical code"
    );
  });

  test("should check for a valid BNF code", async () => {
    await expect(getHighestPrescribingICBs("0000000AA")).rejects.toThrowError(
      "Code is not valid: not found"
    );
  });
});

describe("getChemicalName", () => {
  test("should return an object with a 'name' key that holds the value of the chemical name", async () => {
    const chemicalName = await getChemicalName(
      "https://openprescribing.net/api/1.0/bnf_code?format=json&exact=true&q=0407010AD"
    );
    expect(chemicalName).toMatchObject({
      type: expect.any(String),
      id: expect.any(String),
      name: expect.any(String),
      section: expect.any(String),
    });
    expect(chemicalName.name).toBe("Paracetamol and ibuprofen");
  });
});

describe("getSpendingData", () => {
  test("should return an array of objects", async () => {
    const spendingData = await getSpendingData(
      "https://openprescribing.net/api/1.0/spending_by_org/?org_type=icb&code=0407010AD&format=json"
    );

    expect(Array.isArray(spendingData)).toBe(true);
    expect(spendingData.length).not.toBe(0);
    spendingData.forEach((spendingDataObj) => {
      expect(spendingDataObj).toMatchObject({
        items: expect.any(Number),
        quantity: expect.any(Number),
        actual_cost: expect.any(Number),
        date: expect.any(String),
        row_id: expect.any(String),
        row_name: expect.any(String),
      });
    });
  });
});

describe("sortAndProcessSpendData", () => {
  test("should return an array or strings", async () => {
    const spendingData = await getSpendingData(
      "https://openprescribing.net/api/1.0/spending_by_org/?org_type=icb&code=0407010AD&format=json"
    );

    const sortedData = sortAndProcessSpendData(spendingData);

    expect(Array.isArray(sortedData)).toBe(true);
    sortedData.forEach((datum) => {
      expect(typeof datum).toBe("string");
    });
  });

  test("should return spending data for the ICB that prescribed the chemical most frequently on each date", async () => {
    const spendingData = await getSpendingData(
      "https://openprescribing.net/api/1.0/spending_by_org/?org_type=icb&code=0407010AD&format=json"
    );

    const sortedData = sortAndProcessSpendData(spendingData);

    expect(sortedData[0]).toBe(
      "2019-04-01 NHS HUMBER AND NORTH YORKSHIRE INTEGRATED CARE BOARD 3"
    );
  });
});
