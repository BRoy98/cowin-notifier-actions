const axios = require("axios");
const { format } = require("date-fns");

const DIST_URL =
  "https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByDistrict?district_id={{DISTRICT_ID}}&date={{DATE}}";
const PIN_URL =
  "https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByPin?pincode={{PINCODE}}&date={{DATE}}";

checkAvailability();

function checkAvailability() {
  let isAvailable = false;
  let availableCenters = [];
  let today = format(new Date(), "dd-MM-yyyy");

  let URL = PIN_URL.replace("{{PINCODE}}", "700124").replace("{{DATE}}", today);

  axios
    .get(URL, { headers: { "User-Agent": "PostmanRuntime/7.26.10" } })
    .then((res) => {
      const { centers } = res.data;

      if (centers.length > 0) {
        centers.forEach((center) => {
          center.sessions.forEach((session) => {
            if (session.available_capacity > 0) {
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
    })
    .catch((e) => {
      console.log(e);
    });
}
