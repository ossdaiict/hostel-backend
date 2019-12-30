const express = require("express");

const Courier = require("../../models/courier");
const MailingDetails = require("../../models/mailingDetail");
const { sendCourierMail } = require("../../utils/mailSender");
const checkSupervisor = require("../../middleware/checkSupervisor");

const getCouriers = (req, res) => {
  Courier.find({ isCourierCollected: false })
    .select("-__v -_id")
    .then(couriers => {
      res.status(201).json(couriers);
    })
    .catch(err =>
      res.status(500).json({ message: "Failed to query database!.." })
    );
};

const getPrevCouriers = (req, res) => {
  Courier.find({ isCourierCollected: true })
    .select("-__v -_id")
    .then(couriers => {
      res.status(201).json(couriers);
    })
    .catch(err =>
      res.status(500).json({ message: "Failed to query database!.." })
    );
};

const addCourier = (req, res) => {
  const { cID, name, room, service, cdate, type, givenBy, sID } = req.body;
  Courier.create(
    { sID, cID, cdate, service, type, givenBy, name, room },
    err => {
      if (err) {
        return res.status(500).json({ message: "Failed to add new snail!.." });
      } else {
        sendCourierMail(sID);
        MailingDetails.create({ sID, initialDate: cdate, cID }, error => {
          if (error) {
            return res
              .status(500)
              .json({ message: "Failed to add new snail!.." });
          }
        });
        return res.status(201).json({ message: "New snail added." });
      }
    }
  );
};

const removeCourier = (req, res) => {
  const { cID, sID } = req.body;
  MailingDetails.deleteOne({ cID, sID })
    .then(info => {
      Courier.findOneAndUpdate(
        { cID, sID },
        { $set: { isCourierCollected: true } },
        { new: true }
      ).then(courier => {
        if (courier) {
          return res.status(201).json(courier);
          // .json({ message: "Removed Courier Successfully." });
        } else {
          return res
            .status(500)
            .json({ message: "Failed to remove node courier!.." });
        }
      });
    })
    .catch(error => {
      return res.status(500).json({ message: "Failed to remove courier!.." });
    });
};

const router = express.Router();

router.get("/", getCouriers);
router.get("/previous", getPrevCouriers);
router.post("/add", checkSupervisor, addCourier);
router.post("/delete", checkSupervisor, removeCourier);

module.exports = router;
