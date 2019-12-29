const moment = require("moment");
const scheduler = require("node-schedule");

const MailingDetails = require("../models/mailingDetail");
const { sendCourierMail } = require("../utils/mailSender");

// 0 30 11 * * *

// function for sending the mails
function worker() {
  let a = scheduler.scheduleJob("0 30 11 * * *", function() {
    let date;
    MailingDetails.find()
      .select("-__v -_id")
      .then(details => {
        details
          .filter(mail => {
            return mail.mailCount < 4 ? mail : null;
          })
          .map(mail => {
            date = moment(mail.initialDate, "DD-MM-YYYY")
              .add((mail.mailCount + 1) * 2, "d")
              .format("DD-MM-YYYY");
            if (date === moment(new Date()).format("DD-MM-YYYY")) {
              sendCourierMail(mail.sID);
              MailingDetails.findOneAndUpdate(
                { cID: mail.cID, sID: mail.sID },
                { $inc: { mailCount: 1 } }
              )
                .select("-__v -_id")
                .then(mail => {})
                .catch(err => console.log(err));
            }
          });
      });
  });
}

module.exports = worker;
