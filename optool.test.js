import assert from "node:assert";
import { mock, test } from "node:test";
import { getChemicalName } from "./optool.js";

/**
 * Define fake responses for HTTP requests
 *
 * @param url - the URL to be requested
 * @param response - the JSON to return as a response
 */
function mockFetch(url, response) {
  fetch = mock.fn((input) => {
    return {
      ok: true,
      json: () => (input == url ? response : {}),
    };
  });
}

test("should get the chemical name", async () => {
  mockFetch(
    "https://openprescribing.net/api/1.0/bnf_code?format=json&exact=true&q=0407010AD",
    [
      {
        type: "chemical",
        id: "0407010AD",
        name: "Paracetamol and ibuprofen",
        section: "4.7: Analgesics",
      },
    ]
  );

  const chemicalName = await getChemicalName("0407010AD");
  assert.strictEqual(chemicalName, "Paracetamol and ibuprofen");
});

test(
  "should not allow full BNF code",
  { skip: true, todo: "not implemented" }, // remove this line to enable the test
  async () => {
    await assert.rejects(async () => await getChemicalName("0407010ADAAABAB"), {
      name: "Error",
      message: "Code is not valid: must be 9 character chemical code",
    });
  }
);

test(
  "should check for a valid BNF code",
  { skip: true, todo: "not implemented" }, // remove this line to enable the test
  async () => {
    mockFetch(
      "https://openprescribing.net/api/1.0/bnf_code?format=json&exact=true&q=0000000AA",
      []
    );

    await assert.rejects(async () => await getChemicalName("0000000AA"), {
      name: "Error",
      message: "Code is not valid: not found",
    });
  }
);
