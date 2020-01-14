const moment = require("moment");
const scheduler = require("node-schedule");

const Complaint = require("../models/complaint");
const { sendComplaintMail } = require("../utils/mailSender");

// 0 30 11 * * *

// function for sending the mails
function worker() {
  let a = scheduler.scheduleJob("0 */1 * * * *", function() {
    let complaintDate;
    //write a function for Delete the mail after one month

    //auto close complaints with in 3 days
    Complaint.find({ isValid: true })
      .select("-__v")
      .then(complaints => {
        complaints.map(complaint => {
          if (complaint.isReOpen) {
            complaintDate = moment(complaint.reOpenDate, "DD-MM-YYYY")
              .add(3, "d")
              .format("DD-MM-YYYY");
          } else {
            complaintDate = moment(complaint.initialDate, "DD-MM-YYYY")
              .add(3, "d")
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
