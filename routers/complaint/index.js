const express = require("express");
const moment = require("moment");
const jwt = require("jsonwebtoken");

const Complaint = require("../../models/complaint");
const checkAuth = require("../../middleware/checkAuth");
const { sendComplaintMail, sendRemarkMail } = require("../../utils/mailSender");

const getComplaint = (req, res) => {
  const { query } = req.body;
  // console.log(query, "Hello");
  Complaint.find(query)
    .select("-__v")
    .sort({ initialDate: -1, reOpenDate: -1 })
    .then(result => {
      res.status(201).json(result);
    })
    .catch(err => {
      res.status(500).json({ message: "Failed to query the database!" });
    });
};

const postComplaint = (req, res) => {
  const { sID, name, room, wing, type, complaint, createdByHMC } = req.body;
  Complaint.create(
    {
      sID,
      name,
      room,
      wing,
      type,
      complaint,
      createdByHMC,
      initialDate: moment(new Date()).format("DD-MM-YYYY")
    },
    err => {
      if (err) {
        return res
          .status(500)
          .json({ message: "Failed to register complaint!.." });
      }
      //send mail to student
      res
        .status(201)
        .json({ message: "Thank you for complaint registration." });
    }
  );
};

const resolveComplaint = (req, res) => {
  const { _id, sID } = req.body;
  Complaint.findOneAndUpdate(
    { _id, sID },
    {
      $set: {
        isResolve: true,
        isValid: false
      }
    },
    { new: true }
  )
    .then(result => {
      sendComplaintMail(result);
      // console.log(result);
      res
        .status(201)
        .json({ message: "Your complaint is resolved. Thank you!." });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: "Failed to resolve complaint!..." });
    });
};

const reOpenComplaint = (req, res) => {
  const user = jwt.verify(req.params.token, process.env.SECRET_KEY);
  const { sID, _id } = user;
  Complaint.update(
    { sID, _id },
    {
      isValid: true,
      isReOpen: true,
      isResolve: false,
      reOpenDate: moment(new Date()).format("DD-MM-YYYY")
    },
    err => {
      if (err) {
        console.log(err);
        return res
          .status(500)
          .json({ message: "Failed to query the database!..." });
      } else res.redirect(process.env.LOGIN_PAGE);
    }
  );
};

const setRemarks = (req, res) => {
  const { remark, workerID, sID, complaintID } = req.body;
  Complaint.findByIdAndUpdate(
    { sID, _id: complaintID },
    {
      $set: {
        remark,
        remarkDate: moment(new Date()).format("DD-MM-YYYY,HH:mm:ss"),
        workerID
      }
    },
    { new: true }
  )
    .then(result => {
      sendRemarkMail(result);
      res.status(200).json({ message: "Send Remark mail!..." });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: "Failed to resolve complaint!..." });
    });
};

const router = express.Router();

router.post("/", getComplaint);
router.post("/add", checkAuth, postComplaint);
router.post("/resolve", checkAuth, resolveComplaint);
router.post("/remark", checkAuth, setRemarks);
router.get("/reopen/:token", reOpenComplaint);

module.exports = router;
