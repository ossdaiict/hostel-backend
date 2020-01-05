const moment = require("moment");
const scheduler = require("node-schedule");

const MailingDetails = require("../models/mailingDetail");
const Complaint = require("../models/complaint");
const { sendCourierMail, sendComplaintMail } = require("../utils/mailSender");

// 0 30 11 * * *

// function for sending the mails
function worker() {
  let a = scheduler.scheduleJob("0 */1 * * * *", function() {
    let date;
    let complaintDate;
    //sending mails on every second day
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
                .then(res => {})
                .catch(err => console.log(err));
            }
          });
      });

    //auto close complaints with in two days
    Complaint.find({ isValid: true })
      .select("-__v")
      .then(complaints => {
        complaints.map(complaint => {
          if (complaint.isReOpen) {
            complaintDate = moment(complaint.reOpenDate, "DD-MM-YYYY")
              .add(2, "d")
              .format("DD-MM-YYYY");
          } else {
            complaintDate = moment(complaint.initialDate, "DD-MM-YYYY")
              .add(2, "d")
              .format("DD-MM-YYYY");
          }
          if (complaintDate === moment(new Date()).format("DD-MM-YYYY")) {
            sendComplaintMail(complaint);
            Complaint.findOneAndUpdate(
              { _id: complaint._id, sID: complaint.sID },
              {
                $set: {
                  isValid: false
                }
              }
            )
              .then(res => {
                console.log("done");
              })
              .catch(err => {
                console.log(err);
              });
          }
        });
      });
  });
}

module.exports = worker;
