require("dotenv").config({ path: __dirname + "/.env" });
const pjson = require("./package.json");

const { getDataByIcDph, setApiKey, isSkIcoDph } = require("./financnasprava");
const { readExcel, writeExcel } = require("./excel");

setApiKey(process.env.API_KEY);

module.exports = async () => {
  let clArgs = process.argv.slice(2);
  let verbose = false;
  let outputAll = false; // output all entries, not only successfull one (the default)
  let useExcel = {};

  if (clArgs.indexOf("-h") >= 0) {
    help();
    process.exit(1);
  }

  {
    let index = clArgs.indexOf("-v");
    if (index >= 0) {
      verbose = true;
      clArgs.splice(index, 1);
    }
  }

  {
    let index = clArgs.indexOf("-a");
    if (index >= 0) {
      outputAll = true;
      clArgs.splice(index, 1);
    }
  }

  // The first cmd arg is *.xlsx -> input file
  if (clArgs.length > 0 && clArgs[0].endsWith(".xlsx")) {
    useExcel.inputFile = clArgs[0];

    // strip it from cmd line
    clArgs = clArgs.slice(1);
  }

  // The last cmd arg is *.xlsx -> output file
  if (clArgs.length > 0 && clArgs[clArgs.length - 1].endsWith(".xlsx")) {
    useExcel.outputFile = clArgs[clArgs.length - 1];

    clArgs = clArgs.slice(0, -1);
  }

  if (!useExcel.inputFile && clArgs.length == 0) {
    help("Nesprávne parametre CLI!");
    process.exit(1);
  }

  let inputData = null;

  if (useExcel.inputFile) {
    inputData = readExcel(useExcel.inputFile);
  }

  if (clArgs.length > 0) {
    inputData = inputData || [];

    inputData = inputData.concat(
      clArgs.map((ic_dph) => {
        return { ic_dph };
      })
    );
  }

  let allOutputData = [];

  for (const line of inputData) {
    try {
      let data = null;
      let ic_dph_upper = line.ic_dph && line.ic_dph.toUpperCase();

      if (isSkIcoDph(ic_dph_upper)) {
        data = await getDataByIcDph(ic_dph_upper);
      }

      // Error log, wrong IC DPH
      if (!data) {
        console.error(`\n${ic_dph_upper}: Chyba! IČ DPH nebolo nájdené.`);
        console.error(line);
        console.error();

        outputAll &&
          allOutputData.push({
            ...line,
            error: "IČ DPH nebolo nájdené",
          });

        continue;
      }

      // Reorder columns on output
      data = data.map((item) => {
        return {
          nazov_subjektu: item.nazov_subjektu,
          ic_dph: item.ic_dph,
          iban: item.iban,
          ico: item.ico,

          ...item,
        };
      });

      // The first one (and usually the only one)
      allOutputData.push({
        ...data[0],
        error: "",
        ...line,
      });

      // Others
      const others = data.slice(1);

      // Only IBAN column will appear
      if (others) {
        allOutputData = allOutputData.concat(
          others.map(({ iban }) => {
            return { iban };
          })
        );
      }

      verbose &&
        console.log(
          `${data[0].ic_dph} ${(" " + data.length).slice(-2)}x IBAN ${
            data[0].nazov_subjektu
          }`
        );
    } catch (e) {
      console.log(e);
    }
  }

  if (useExcel.outputFile) {
    const excelProps = {
      Title: "Konverzia IČ DPH na IBAN",
      Author: "Miro Bartánus",
      Company: "Dynatech s.r.o.",
      Comments: "Využíva opendata.financnasprava.sk API",
      CreatedDate: new Date(),
    };

    writeExcel(useExcel.outputFile, allOutputData, excelProps);
  } else {
    console.log(allOutputData);
  }
};

function help(errorMessage = undefined) {
  console.log(
    `${pjson.name} v${pjson.version}: ${pjson.description} \
Autor: ${pjson.author} @ Dynatech s.r.o., Repository: ${pjson.repository.url}`
  );

  if (errorMessage) {
    console.log(`\n\tChyba: ${errorMessage}`);
  }

  console.log("\nPoužitie:");
  console.log("\ticdph-iban -h");
  console.log("\ticdph-iban [-v] [-a] IC_DPH1 IC_DPH2 IC_DPH3...");
  console.log("\ticdph-iban [-v] [-a] in.xlsx");
  console.log("\ticdph-iban [-v] [-a] in.xlsx out.xlsx");
  console.log("\ticdph-iban [-v] [-a] in.xlsx IC_DPH1... out.xlsx");
  console.log("\ticdph-iban [-v] [-a] in.xlsx IC_DPH1 IC_DPH2...");
  console.log("\ticdph-iban [-v] [-a] IC_DPH1 IC_DPH2 IC_DPH3... out.xlsx");

  console.log("\nPrepínače:");
  console.log("\t-h        ... help");
  console.log("\t-v        ... verbose");
  console.log("\t-a        ... výstup aj chybných záznamov, nielen úspešných");
  console.log("\tin.xlsx   ... názov vstupného excel súboru");
  console.log("\tout.xlsx  ... názov výstupného excel súboru");

  console.log("\nPríklady:");
  console.log("\ticdph-iban SK2020269922");
  console.log("\ticdph-iban icdph.xlsx");
  console.log("\ticdph-iban -v icdph.xlsx iban.xlsx");
  console.log("\ticdph-iban SK2020269922 dynatech.xlsx");
}
