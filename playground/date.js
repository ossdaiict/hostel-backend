const moment = require("moment");

console.log(moment(new Date()).format("DD-MM-YYYY"));

const date = moment("28-12-2019", "DD-MM-YYYY").date();

console.log(date);
