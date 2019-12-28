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
  const url = `http://localhost:5000/auth/${token}`;

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

module.exports = sendConfirmationMail;
