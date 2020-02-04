const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
require("dotenv").config();

var transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: "587",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD
  },
  secureConnection: "false",
  tls: {
    ciphers: "SSLv3",
    rejectUnauthorized: false
  }
});

const sendConfirmationMail = sID => {
  const token = jwt.sign({ sID }, process.env.SECRET_KEY, { expiresIn: "5d" }); // Generate Token
  const url = `${process.env.URL}/auth/token/${token}`;

  const mailOptions = {
    from: '"Hostel DAIICT No Reply" <noreply.hostel.daiict@gmail.com>',
    to: `${String(sID)}@daiict.ac.in`,
    subject: "Hostel Student Account Confirmation",
    html:
      `Hello, <strong>${sID}</strong> <br><br>` +
      `<p>Please click <a href="${url}">here</a> to verify your Hostel student acccount.</p><br>` +
      "Regards,<br>" +
      "Hostel Management Committee."
  };

  // Send mail with defined transport object
  transporter.sendMail(mailOptions, (err, info) => {
    if (err) console.log(err);
    else console.log("Message sent: %s", info.messageId);
  });
};

const sendComplaintMail = complaint => {
  const token = jwt.sign(
    { sID: complaint.sID, _id: complaint._id },
    process.env.SECRET_KEY,
    { expiresIn: "5d" }
  );

  const url = `${process.env.URL}/complaint/reopen/${token}`;

  const mailOptions = {
    from: '"Hostel DAIICT No Reply" <noreply.hostel.daiict@gmail.com>',
    to: `${String(complaint.sID)}@daiict.ac.in`,
    subject: "Regarding Complaint",
    html:
      `Hello, <strong>${complaint.name}</strong> <br><br>` +
      `ID:${complaint.sID}<br>` +
      `Room No.:${complaint.wing}-${complaint.room}<br>` +
      `Complaint type:${complaint.type}<br>` +
      `Complaint:${complaint.complaint}<br>` +
      `Date:${complaint.initialDate}<br><br>` +
      `Would you like to re-open it,<br>` +
      `<button style="margin:1rem;
      padding:1.5rem;
      background:transparent;
      color:blue;
      border:5px solid #ff9900;
      outline:none;
      font-size:2rem;
      font-weight:bold">
        <a href=${url}>Re-open it.</a>
      </button><br><br>` +
      "Regards,<br>" +
      "Hostel Management Committee."
  };

  // Send mail with defined transport object
  transporter.sendMail(mailOptions, (err, info) => {
    if (err) console.log(err);
    else console.log("Message sent: %s", info.messageId);
  });
};

const sendRemarkMail = complaint => {
  const mailOptions = {
    from: '"Hostel DAIICT No Reply" <noreply.hostel.daiict@gmail.com>',
    to: `${String(complaint.sID)}@daiict.ac.in`,
    subject: "Regarding Complaint(Remark)",
    html:
      `Hello, <strong>${complaint.name}</strong> <br><br>` +
      `ID:${complaint.sID}<br>` +
      `Room No.:${complaint.wing}-${complaint.room}<br>` +
      `Complaint type:${complaint.type}<br>` +
      `Complaint:${complaint.complaint}<br>` +
      `Date:${complaint.initialDate}<br><br>` +
      `<b>Remark:${complaint.remark}</b><br>` +
      `<b>Timing:${complaint.remarkDate}<b><br><br>` +
      `<b>Please Next time be on your room.<b> Your complaint is still open.<br><br>` +
      "Regards,<br>" +
      "Hostel Management Committee."
  };

  // Send mail with defined transport object
  transporter.sendMail(mailOptions, (err, info) => {
    if (err) console.log(err);
    else console.log("Message sent: %s", info.messageId);
  });
};

const sendPasswordResetMail = sID => {
  const token = jwt.sign({ sID }, process.env.SECRET_KEY, { expiresIn: "5d" }); // Generate Token
  const url = `http://localhost:3000/reset-password/${token}`;

  const mailOptions = {
    from: '"Hostel DAIICT No Reply" <noreply.hostel.daiict@gmail.com>',
    to: `${String(sID)}@daiict.ac.in`,
    subject: "Reset Password",
    html:
      `Hello, <strong>${sID}</strong> <br><br>` +
      `<p>Please click <a href="${url}">here</a> to change the password.</p><br>` +
      "Regards,<br>" +
      "Hostel Management Committee."
  };

  // Send mail with defined transport object
  transporter.sendMail(mailOptions, (err, info) => {
    if (err) console.log(err);
    else console.log("Message sent: %s", info.messageId);
  });
};

module.exports = {
  sendConfirmationMail,
  sendComplaintMail,
  sendPasswordResetMail,
  sendRemarkMail
};
