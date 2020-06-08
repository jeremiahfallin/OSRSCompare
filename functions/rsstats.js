const querystring = require("querystring");
import axios from "axios";

const API_ENDPOINT =
  "https://secure.runescape.com/m=hiscore_oldschool/index_lite.ws?player=";

const RS3_API_ENDPOINT =
  "https://secure.runescape.com/m=hiscore/index_lite.ws?player=";

exports.handler = async function (event, context, callback) {
  try {
    const body = JSON.parse(event.body);
    const url = API_ENDPOINT + body.name;
    const rs3url = RS3_API_ENDPOINT + body.rs3name;

    const response = await axios.get(url, {
      headers: { Accept: "application/json" },
    });
    const rs3response = await axios.get(rs3url, {
      headers: { Accept: "application/json" },
    });

    const data = response.data;
    const rs3data = rs3response.data;

    callback(null, {
      statusCode: 200,
      body: JSON.stringify({
        name: body.name,
        skills: data,
        rs3skills: rs3data,
      }),
    });
  } catch (err) {
    console.log(err); // output to netlify function log
    callback(null, {
      statusCode: 500,
      body: JSON.stringify({ msg: err.message }),
    });
  }
};
