require("dotenv").config({ path: __dirname + "/.env" });

const { getDataByIcDph, setApiKey } = require("./financnasprava");
const { readExcel, writeExcel } = require("./excel");

setApiKey(process.env.API_KEY);

module.exports = async () => {
  let clArgs = process.argv.slice(2);
  let verbose = false;
  let useExcel = null;

  if (clArgs.length > 0 && clArgs[0] === "-v") {
    verbose = true;
    clArgs = clArgs.slice(1);
  }

  if (clArgs.length > 0 && clArgs[0] === "-h") {
    help();
    process.exit(1);
  }

  if (clArgs.length == 0) {
    help("Nesprávne parametre CLI!");
    process.exit(1);
  }

  if (clArgs.length > 0 && clArgs[0].endsWith(".xlsx")) {
    useExcel = { inputFile: clArgs[0] };
  }

  if (clArgs.length > 1 && clArgs[1].endsWith(".xlsx")) {
    useExcel.outputFile = clArgs[1];
  }

  let inputData = null;

  if (useExcel) {
    inputData = readExcel(useExcel.inputFile);
  } else {
    inputData = clArgs.map((ic_dph) => {
      return { ic_dph };
    });
  }

  let allOutputData = [];

  for (const line of inputData) {
    try {
      let data = await getDataByIcDph(line.ic_dph);

      // Error log, wrong IC DPH
      if (!data) {
        console.error(`\n${line.ic_dph}: Chyba! IČ DPH nebolo nájdené.`);
        console.error(line);
        console.error();

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
      allOutputData.push(data[0]);

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

  if (useExcel && useExcel.outputFile) {
    writeExcel(useExcel.outputFile, allOutputData);
  } else {
    console.log(allOutputData);
  }
};

function help(errorMessage = undefined) {
  console.log(
    "icdph-iban: Konverzia IČ DPH na IBAN. \
Používa opendata.financnasprava.sk API. \
Autor: Miro Bartánus, Dynatech s.r.o., 19.1.2022."
  );

  if (errorMessage) {
    console.log(`\n\tChyba: ${errorMessage}`);
  }

  console.log("\nPoužitie:");
  console.log("\ticdph-iban -h");
  console.log("\ticdph-iban [-v] IC_DPH1 IC_DPH2 IC_DPH3 ...");
  console.log("\ticdph-iban [-v] in.xlsx");
  console.log("\ticdph-iban [-v] in.xlsx out.xlsx");

  console.log("\nPríklady:");
  console.log("\ticdph-iban SK2020269922");
  console.log("\ticdph-iban icdph.xlsx");
  console.log("\ticdph-iban -v icdph.xlsx iban.xlsx");
}
