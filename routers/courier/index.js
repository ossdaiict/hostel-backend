const express = require("express");

const Courier = require("../../models/courier");
const { sendCourierMail } = require("../../utils/mailSender");

const getCouriers = (req, res) => {
  Courier.find({})
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
        return res.status(201).json({ message: "New snail added." });
      }
    }
  );
};

const removeCourier = (req, res) => {
  const courierID = req.params.courierID;
  Courier.findOneAndUpdate(
    { cID: courierID, sID },
    { $set: { isCourierCollected: true } }
  ).then(courier => {
    if (courier) {
      return res.status(201).json({ message: "Removed Courier Successfully." });
    } else {
      return res.status(500).json({ message: "Failed to remove courier!.." });
    }
  });
};

const router = express.Router();

router.get("/", getCouriers);
router.post("/add", addCourier);
router.delete("/delete/:courierID", removeCourier);

module.exports = router;
