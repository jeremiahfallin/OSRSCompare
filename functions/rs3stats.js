const querystring = require("querystring");
import axios from "axios";

const API_ENDPOINT =
  "https://secure.runescape.com/m=hiscore/index_lite.ws?player=";

exports.handler = async function (event, context, callback) {
  try {
    const body = JSON.parse(event.body);

    const url = API_ENDPOINT + body.name;

    const response = await axios.get(url, {
      headers: { Accept: "application/json" },
    });
    const data = response.data;
    callback(null, {
      statusCode: 200,
      body: JSON.stringify({ name: body.name, skills: data }),
    });
  } catch (err) {
    console.log(err); // output to netlify function log
    callback(null, {
      statusCode: 500,
      body: JSON.stringify({ msg: err.message }), // Could be a custom message or object i.e. JSON.stringify(err)
    });
  }
};
