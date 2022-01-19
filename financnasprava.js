const axios = require("axios");

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

module.exports = {
  getDataByIcDph,
  setApiKey,
};
