# OpenPrescribing API coding challenge: Take two!

## Introduction

I already completed this challenge previously as part of a tech test, however after completing it I wanted to have another try as there were a few things that, on reflection, I would have liked to have done differently (and without time pressure). See the "Design decisions" section for an explanation of these choices.

## Tool overview

This is a command line tool which takes the chemical code for a medicine and uses the OpenPrescribing API to retrieve the chemical name and the Integrated Care Boards (ICB) that have prescribed the chemical most frequently each month over the past 5 years.

### Code structure

1. Chemical code check: before any API calls are made, the structure of the input is validated
2. Chemical name and spending data retrieval: calls are made to separate endpoints of the OpenPrescribingAPI to fetch the chemical name and the spending data; this is done via two separate functions (getChemicalName() and getSpendingData()).
3. API response and data retrieval checks: validates API call responses and ensures a valid chemical code has been input by the user
4. Sorting and processing of the spending data: the spending data are sorted by date (ascending) and then by number of items (descending) within each date, before being filtered to obtain the ICBs with the highest number of items for each month.
5. The final data object containing the chemical name and spending data is returned and printed.

### Design decisions

1. As node:test had already been implemented for the original challenge, and I hadn't used it before, I kept using this to test my original coding solution (my thinking here was that I'd potentially save some time re-writing mocks and tests already provided, and also get to try something new!). However on reflection, I would have preferred to have used the Jest testing library - I've used it before, it provides a wider range of features vs node:test, has a large supporting community and has comprehensive docs. Thus, this second attempt at the challenge utilizes the Jest testing library.

2. Additionally, given the structure of the coding challenge and my earlier design decisions, when I came to refactoring my solution, a couple of things happened: all my previous tests were redundant AND I ended up with one big function doing everything. On reflection, I thought perhaps a better (or just different?) way to refactor, and maintain separation of concerns, would have been to have separate functions for the data retrieval (calls to different API endpoints), and the sorting and processing of the spending data, called by the main function. I thought this may also improve readability of the code, and would allow me to more thoroughly test outputs and logic at different stages of the tool.

## Get started

1. Install the dependancies 
   `npm i`
2. Run the tests:
   `npm run test`
3. Use the tool:
   `$ node optool.js <valid-9-letter-bnf-code>`

## Tool output

The output from the tool will print the chemical name, followed by a list of the ICBs that have prescribed the chemical most frequently each month over the past 5 years.

Below is an example output for 0407010AD (a subset of the full results is shown, omitted parts are denoted by `...`)

```
Paracetamol and ibuprofen
....
2020-08-01 NHS SOUTH WEST LONDON INTEGRATED CARE BOARD 4
2020-09-01 NHS HUMBER AND NORTH YORKSHIRE INTEGRATED CARE BOARD 2
2020-10-01 NHS HUMBER AND NORTH YORKSHIRE INTEGRATED CARE BOARD 3
2020-11-01 NHS HUMBER AND NORTH YORKSHIRE INTEGRATED CARE BOARD 4
2020-12-01 NHS NORTH WEST LONDON INTEGRATED CARE BOARD 4
2021-01-01 NHS HUMBER AND NORTH YORKSHIRE INTEGRATED CARE BOARD 4
2021-02-01 NHS HUMBER AND NORTH YORKSHIRE INTEGRATED CARE BOARD 4
...

```
