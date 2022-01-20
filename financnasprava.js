const axios = require("axios");
const pjson = require("./package.json");

const API_URL = "https://iz.opendata.financnasprava.sk/api";
const DATA_BY_IC_DPH_PATH = "data/ds_dph_iban";

let API_KEY = "";

async function getDataByIcDph(ic_dph) {
  const options = {
    url: `${API_URL}/${DATA_BY_IC_DPH_PATH}/search?page=1&column=ic_dph&search=${ic_dph}`,
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json;charset=UTF-8",
      "User-Agent": `${pjson.name} v${pjson.version}; ${pjson.repository.url}`,
      key: API_KEY,
    },
  };

  try {
    const { data } = await axios(options);
    if (data) {
      return data.data;
    }
  } catch (error) {
    //console.log(error);
  }

  return null;
}

function setApiKey(key) {
  API_KEY = key;
}

const regexSkIcoDph = new RegExp("^SK[0-9]{10}$");

function isSkIcoDph(ic_dph) {
  return (
    ic_dph &&
    typeof ic_dph === "string" &&
    ic_dph.length == 12 &&
    ic_dph.startsWith("SK") &&
    regexSkIcoDph.test(ic_dph)
  );
}

module.exports = {
  getDataByIcDph,
  setApiKey,
  isSkIcoDph,
};
