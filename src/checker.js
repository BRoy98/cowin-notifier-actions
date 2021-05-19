const axios = require("axios");
const { format } = require("date-fns");
const { postAvailability, postError } = require("./mail");

const DIST_URL =
  "https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByDistrict?district_id={{DISTRICT_ID}}&date={{DATE}}";
const PIN_URL =
  "https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByPin?pincode={{PINCODE}}&date={{DATE}}";

/**
 * Checks for slot availability from API Setu Server
 */
var checkAvailability = async () => {
  const pinCode = process.env.CHECK_PINCODE;
  const district = process.env.CHECK_DISTRICT;
  const age = process.env.CHECK_AGE || 45;
  let isAvailable = false;
  let availableCenters = [];

  let res = await axios.get(getUrl(pinCode, district), {
    headers: { "User-Agent": "PostmanRuntime/7.26.10" },
  });

  if (!res) throw new Error(`CoWIN API request failed: \n\n${res}`);

  const { centers } = res.data;

  if (centers.length > 0) {
    centers.forEach((center) => {
      center.sessions.forEach((session) => {
        if (
          session.available_capacity > 0 &&
          session.min_age_limit <= checkAge
        ) {
          isAvailable = true;
          availableCenters.push({
            center_id: center.center_id,
            name: center.name,
            address: center.address,
            block_name: center.block_name,
            from: center.from,
            to: center.to,
            date: session.date,
          });
        }
      });
    });
    console.log(availableCenters);
  }
};

var getUrl = (pinCode, district) => {
  let today = format(new Date(), "dd-MM-yyyy");

  // Set request URL depending on pin code or district
  if (pinCode)
    return PIN_URL.replace("{{PINCODE}}", "700124").replace("{{DATE}}", today);
  else if (district)
    return PIN_URL.replace("{{PINCODE}}", "700124").replace("{{DATE}}", today);
  else {
    throw new Error(
      "You must set either the pincode or the district Id on secrets."
    );
  }
};

module.exports = checkAvailability;
